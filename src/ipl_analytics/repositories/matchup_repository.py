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
        # Build WHERE clause
        where_clauses = ["batter = %s", "bowler = %s"]
        params = [batter_name, bowler_name]
        
        if season:
            where_clauses.append("season = %s")
            params.append(season)
        
        if venue:
            where_clauses.append("venue = %s")
            params.append(venue)
        
        where_sql = " AND ".join(where_clauses)
        
        # Overall stats
        overall_query = f"""
            SELECT
                COUNT(*) FILTER (WHERE is_legal_ball) AS balls_faced,
                SUM(runs_batter) AS runs,
                COUNT(*) FILTER (
                    WHERE is_wicket = true AND dismissed_batter = %s
                ) AS outs
            FROM deliveries
            WHERE {where_sql}
        """
        params_overall = params + [batter_name]
        
        result = self.execute_query(overall_query, tuple(params_overall), fetch_one=True)
        
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
                        WHERE is_wicket = true AND dismissed_batter = %s
                    ) AS outs
                FROM deliveries
                WHERE {where_sql}
                GROUP BY phase
                HAVING COUNT(*) FILTER (WHERE is_legal_ball) >= 8
            """
            phase_params = params + [batter_name]
            phase_results = self.execute_query(phase_query, tuple(phase_params))
            
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
                    "dismissals": phase_outs,
                    "strike_rate": phase_sr,
                    "average": phase_avg
                }
        
        # Recent encounters (last 5 matches)
        recent_query = f"""
            SELECT DISTINCT match_id
            FROM deliveries
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
                        WHERE is_wicket = true AND dismissed_batter = %s
                    ) > 0 as dismissed
                FROM deliveries
                WHERE batter = %s
                  AND bowler = %s
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
