"""
Repository for matchup analytics data access
"""
from typing import Optional, List, Dict, Any
from ipl_analytics.repositories.base import BaseRepository


class MatchupRepository(BaseRepository):
    """Handles all matchup-related database queries"""
    
    def get_batter_bowler_matchup(
        self,
        batter_name: str,
        bowler_name: str,
        season: Optional[str] = None,
        venue: Optional[str] = None,
        include_phases: bool = True
    ) -> Optional[Dict[str, Any]]:
        """
        Get batter vs bowler matchup statistics
        
        Args:
            batter_name: Name of the batter
            bowler_name: Name of the bowler
            season: Optional season filter
            venue: Optional venue filter
            include_phases: Whether to include phase breakdown
            
        Returns:
            Dictionary with matchup data or None
        """
        # Build WHERE clause (ILIKE for consistency with batter profile and to match stored names regardless of case)
        where_clauses = ["batter ILIKE %s", "bowler ILIKE %s"]
        params = [batter_name, bowler_name]
        
        if season:
            where_clauses.append("season = %s")
            params.append(season)
        
        if venue:
            where_clauses.append("venue = %s")
            params.append(venue)
        
        where_sql = " AND ".join(where_clauses)
        # #region agent log
        import json, os
        _log_paths = ["/Users/himankverma/Developer/projects/.cursor/debug.log", os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", "debug.log"))]
        _diag = self.execute_query("SELECT current_database(), (SELECT COUNT(*) FROM public.deliveries), (SELECT COUNT(*) FROM public.deliveries WHERE batter ILIKE %s AND bowler ILIKE %s), (SELECT COUNT(*) FILTER (WHERE is_legal_ball) FROM public.deliveries WHERE batter ILIKE %s AND bowler ILIKE %s)", (batter_name, bowler_name, batter_name, bowler_name), fetch_one=True)
        _line = json.dumps({"location": "matchup_repository.py:get_batter_bowler_matchup", "message": "query params + connection diagnostic", "data": {"batter_name": batter_name, "bowler_name": bowler_name, "current_db": _diag[0] if _diag else None, "total_deliveries_in_public": _diag[1] if _diag else None, "matchup_rows_public": _diag[2] if _diag else None, "matchup_legal_balls_public": _diag[3] if _diag else None}, "timestamp": __import__("time").time() * 1000, "sessionId": "debug-session", "hypothesisId": "H3-H5"}) + "\n"
        for _p in _log_paths:
            try:
                open(_p, "a").write(_line)
            except Exception:
                pass
        # #endregion
        # Overall stats
        overall_query = f"""
            SELECT
                COUNT(*) FILTER (WHERE is_legal_ball) AS balls_faced,
                SUM(runs_batter) AS runs,
                COUNT(*) FILTER (
                    WHERE is_wicket = true AND dismissed_batter ILIKE %s
                ) AS outs
            FROM public.deliveries
            WHERE {where_sql}
        """
        # Order in query: dismissed_batter, batter, bowler [, season] [, venue]
        params_overall = (batter_name, batter_name) + tuple(params[1:])
        
        result = self.execute_query(overall_query, params_overall, fetch_one=True)
        # #region agent log
        _line2 = json.dumps({"location": "matchup_repository.py:get_batter_bowler_matchup", "message": "overall query result", "data": {"result_is_none": result is None, "balls": result[0] if result else None, "runs": result[1] if result else None, "outs": result[2] if result else None}, "timestamp": __import__("time").time() * 1000, "sessionId": "debug-session", "hypothesisId": "H3-H5"}) + "\n"
        for _p in _log_paths:
            try:
                open(_p, "a").write(_line2)
            except Exception:
                pass
        # #endregion
        if not result or (result[0] or 0) < 1:
            return None
        
        balls = result[0] or 0
        runs = result[1] or 0
        outs = result[2] or 0
        
        strike_rate = round((runs / balls * 100), 2) if balls > 0 else 0.0
        average = round(runs / outs, 2) if outs > 0 else None
        
        # Calculate confidence score (based on sample size)
        confidence_score = min(100, int((balls / 50) * 100)) if balls > 0 else 0
        
        matchup_data = {
            "batter": batter_name,
            "bowler": bowler_name,
            "overall": {
                "runs": runs,
                "balls": balls,
                "dismissals": outs,
                "strike_rate": strike_rate,
                "average": average,
                "confidence_score": confidence_score
            },
            "phase_breakdown": {},
            "recent_encounters": []
        }
        
        # Phase breakdown
        if include_phases:
            phase_query = f"""
                SELECT
                    phase,
                    COUNT(*) FILTER (WHERE is_legal_ball) AS balls,
                    SUM(runs_batter) AS runs,
                    COUNT(*) FILTER (
                        WHERE is_wicket = true AND dismissed_batter ILIKE %s
                    ) AS outs
                FROM public.deliveries
                WHERE {where_sql}
                GROUP BY phase
                HAVING COUNT(*) FILTER (WHERE is_legal_ball) >= 8
            """
            phase_params = (batter_name, batter_name) + tuple(params[1:])
            phase_results = self.execute_query(phase_query, phase_params)
            
            for row in phase_results or []:
                phase = row[0]
                phase_balls = row[1] or 0
                phase_runs = row[2] or 0
                phase_outs = row[3] or 0
                phase_sr = round((phase_runs / phase_balls * 100), 2) if phase_balls > 0 else 0.0
                phase_avg = round(phase_runs / phase_outs, 2) if phase_outs > 0 else None
                
                matchup_data["phase_breakdown"][phase] = {
                    "runs": phase_runs,
                    "balls": phase_balls,
                    "outs": phase_outs,
                    "strike_rate": phase_sr,
                    "average": phase_avg
                }
        
        # Recent encounters (last 5 matches)
        recent_query = f"""
            SELECT DISTINCT match_id
            FROM public.deliveries
            WHERE {where_sql}
            ORDER BY match_id DESC
            LIMIT 5
        """
        recent_match_ids = self.execute_query(recent_query, tuple(params))
        
        if recent_match_ids:
            match_id_list = [row[0] for row in recent_match_ids]
            placeholders = ",".join(["%s"] * len(match_id_list))
            
            encounter_query = f"""
                SELECT
                    match_id,
                    season,
                    SUM(runs_batter) as runs,
                    COUNT(*) FILTER (WHERE is_legal_ball) as balls,
                    COUNT(*) FILTER (
                        WHERE is_wicket = true AND dismissed_batter ILIKE %s
                    ) > 0 as dismissed
                FROM public.deliveries
                WHERE batter ILIKE %s
                  AND bowler ILIKE %s
                  AND match_id IN ({placeholders})
                GROUP BY match_id, season
                ORDER BY match_id DESC
            """
            encounter_params = tuple([
                batter_name, batter_name, bowler_name
            ] + match_id_list)
            
            encounters = self.execute_query(encounter_query, encounter_params)
            
            for row in encounters or []:
                encounter_runs = row[2] or 0
                encounter_balls = row[3] or 0
                
                matchup_data["recent_encounters"].append({
                    "match_id": row[0],
                    "season": row[1],
                    "runs": encounter_runs,
                    "balls": encounter_balls,
                    "dismissed": bool(row[4])
                })
        
        return matchup_data
