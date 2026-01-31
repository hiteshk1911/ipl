"""
Repository for batter analytics data access
"""
from typing import Optional, List, Dict, Any
from ipl_analytics.repositories.base import BaseRepository


class BatterRepository(BaseRepository):
    """Handles all batter-related database queries"""
    
    def get_batter_profile(self, batter_name: str) -> Optional[Dict[str, Any]]:
        """
        Get complete batter profile from analytics view (with fallback to direct query)
        
        Args:
            batter_name: Name of the batter
            
        Returns:
            Dictionary with batter profile data or None
        """
        # Try analytics view first, fallback to direct query if view doesn't exist or query raises
        query = """
            SELECT 
                batter,
                matches,
                runs,
                balls,
                outs,
                strike_rate,
                average,
                pp_runs,
                pp_balls,
                mid_runs,
                mid_balls,
                death_runs,
                death_balls,
                caught_outs,
                bowled_outs,
                lbw_outs,
                stumped_outs
            FROM analytics.batter_profile
            WHERE batter ILIKE %s
        """
        try:
            result = self.execute_query(query, (batter_name,), fetch_one=True)
        except Exception:
            result = None
        if not result:
            result = self._get_batter_profile_direct(batter_name)
        
        if not result:
            return None
        
        if not result:
            return None
        
        return {
            "batter": result[0],
            "matches": result[1],
            "runs": result[2],
            "balls": result[3],
            "outs": result[4],
            "strike_rate": float(result[5]) if result[5] else 0.0,
            "average": float(result[6]) if result[6] else None,
            "pp_runs": result[7] or 0,
            "pp_balls": result[8] or 0,
            "mid_runs": result[9] or 0,
            "mid_balls": result[10] or 0,
            "death_runs": result[11] or 0,
            "death_balls": result[12] or 0,
            "caught_outs": result[13] or 0,
            "bowled_outs": result[14] or 0,
            "lbw_outs": result[15] or 0,
            "stumped_outs": result[16] or 0,
        }
    
    def _get_batter_profile_direct(self, batter_name: str) -> Optional[tuple]:
        """
        Fallback method to get batter profile directly from deliveries table
        (used when analytics view doesn't exist)
        """
        query = """
            WITH base AS (
                SELECT
                    %s as batter,
                    COUNT(DISTINCT match_id) as matches,
                    COUNT(*) FILTER (WHERE is_legal_ball) as balls,
                    SUM(runs_batter) as runs,
                    COUNT(*) FILTER (
                        WHERE is_wicket = true AND dismissed_batter ILIKE %s
                    ) as outs
                FROM deliveries
                WHERE batter ILIKE %s
            ),
            phase_stats AS (
                SELECT
                    SUM(runs_batter) FILTER (WHERE phase = 'powerplay') AS pp_runs,
                    COUNT(*) FILTER (WHERE phase = 'powerplay' AND is_legal_ball) AS pp_balls,
                    SUM(runs_batter) FILTER (WHERE phase = 'middle') AS mid_runs,
                    COUNT(*) FILTER (WHERE phase = 'middle' AND is_legal_ball) AS mid_balls,
                    SUM(runs_batter) FILTER (WHERE phase = 'death') AS death_runs,
                    COUNT(*) FILTER (WHERE phase = 'death' AND is_legal_ball) AS death_balls
                FROM deliveries
                WHERE batter ILIKE %s
            ),
            dismissals AS (
                SELECT
                    COUNT(*) FILTER (WHERE wicket_type = 'caught') AS caught_outs,
                    COUNT(*) FILTER (WHERE wicket_type = 'bowled') AS bowled_outs,
                    COUNT(*) FILTER (WHERE wicket_type = 'lbw') AS lbw_outs,
                    COUNT(*) FILTER (WHERE wicket_type = 'stumped') AS stumped_outs
                FROM deliveries
                WHERE is_wicket = true AND dismissed_batter ILIKE %s
            )
            SELECT
                b.batter,
                b.matches,
                b.runs,
                b.balls,
                b.outs,
                ROUND(b.runs::numeric / NULLIF(b.balls, 0) * 100, 2) AS strike_rate,
                ROUND(b.runs::numeric / NULLIF(b.outs, 0), 2) AS average,
                p.pp_runs,
                p.pp_balls,
                p.mid_runs,
                p.mid_balls,
                p.death_runs,
                p.death_balls,
                d.caught_outs,
                d.bowled_outs,
                d.lbw_outs,
                d.stumped_outs
            FROM base b
            CROSS JOIN phase_stats p
            CROSS JOIN dismissals d
        """
        return self.execute_query(
            query,
            (batter_name, batter_name, batter_name, batter_name, batter_name),
            fetch_one=True
        )
    
    def get_recent_form(
        self,
        batter_name: str,
        num_matches: int = 5,
        season: Optional[str] = None
    ) -> tuple[List[Dict[str, Any]], Dict[str, Any]]:
        """
        Get recent form (last N matches) for a batter
        
        Args:
            batter_name: Name of the batter
            num_matches: Number of recent matches to return
            season: Optional season filter
            
        Returns:
            Tuple of (recent_matches list, summary dict)
        """
        # Get recent match IDs
        match_query = """
            WITH recent_matches AS (
                SELECT match_id
                FROM (
                    SELECT
                        match_id,
                        ROW_NUMBER() OVER (ORDER BY match_id DESC) AS rn
                    FROM (
                        SELECT DISTINCT match_id
                        FROM deliveries
                        WHERE batter ILIKE %s
                        {season_filter}
                    ) m
                ) ranked
                WHERE rn <= %s
            )
            SELECT match_id FROM recent_matches
        """
        
        if season:
            match_query = match_query.format(season_filter="AND season = %s")
            match_params = (batter_name, season, num_matches)
        else:
            match_query = match_query.format(season_filter="")
            match_params = (batter_name, num_matches)
        
        match_ids = self.execute_query(match_query, match_params)
        match_id_list = [row[0] for row in match_ids] if match_ids else []
        
        if not match_id_list:
            return [], {
                "matches": 0,
                "runs": 0,
                "balls": 0,
                "outs": 0,
                "average": None,
                "strike_rate": 0.0
            }
        
        # Get match-level stats
        placeholders = ",".join(["%s"] * len(match_id_list))
        match_stats_query = f"""
            SELECT
                match_id,
                season,
                venue,
                SUM(runs_batter) as runs,
                COUNT(*) FILTER (WHERE is_legal_ball) as balls,
                COUNT(*) FILTER (
                    WHERE is_wicket = true AND dismissed_batter ILIKE %s
                ) as dismissed
            FROM deliveries
            WHERE batter ILIKE %s
              AND match_id IN ({placeholders})
            GROUP BY match_id, season, venue
            ORDER BY match_id DESC
        """
        params = tuple([batter_name, batter_name] + match_id_list)
        match_stats = self.execute_query(match_stats_query, params)
        
        # Format recent matches
        recent_matches = []
        for row in match_stats or []:
            runs = row[3] or 0
            balls = row[4] or 0
            strike_rate = (runs / balls * 100) if balls > 0 else 0.0
            
            recent_matches.append({
                "match_id": row[0],
                "season": row[1],
                "venue": row[2],
                "runs": runs,
                "balls": balls,
                "dismissed": bool(row[5]),
                "strike_rate": round(strike_rate, 2)
            })
        
        # Calculate summary
        total_runs = sum(m["runs"] for m in recent_matches)
        total_balls = sum(m["balls"] for m in recent_matches)
        total_outs = sum(1 for m in recent_matches if m["dismissed"])
        
        summary = {
            "matches": len(recent_matches),
            "runs": total_runs,
            "balls": total_balls,
            "outs": total_outs,
            "average": round(total_runs / total_outs, 2) if total_outs > 0 else None,
            "strike_rate": round(total_runs / total_balls * 100, 2) if total_balls > 0 else 0.0
        }
        
        return recent_matches, summary
    
    def get_highest_score(self, batter_name: str) -> Optional[int]:
        """Get highest score for a batter"""
        query = """
            SELECT MAX(runs_batter) as highest_score
            FROM (
                SELECT
                    match_id,
                    SUM(runs_batter) as runs_batter
                FROM deliveries
                WHERE batter ILIKE %s
                GROUP BY match_id
            ) match_totals
        """
        result = self.execute_query(query, (batter_name,), fetch_one=True)
        return result[0] if result and result[0] else None
    
    def get_batter_profile_by_season(
        self,
        batter_name: str,
        season: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """
        Get batter profile broken down by season
        
        Args:
            batter_name: Name of the batter
            season: Optional season filter (if None, returns all seasons)
            
        Returns:
            List of dictionaries with season-wise profile data
        """
        if season:
            query = """
                SELECT 
                    batter,
                    season,
                    matches,
                    runs,
                    balls,
                    outs,
                    strike_rate,
                    average,
                    pp_runs,
                    pp_balls,
                    mid_runs,
                    mid_balls,
                    death_runs,
                    death_balls,
                    caught_outs,
                    bowled_outs,
                    lbw_outs,
                    stumped_outs
                FROM analytics.batter_profile_season
                WHERE batter ILIKE %s AND season = %s
                ORDER BY season
            """
            params = (batter_name, season)
        else:
            query = """
                SELECT 
                    batter,
                    season,
                    matches,
                    runs,
                    balls,
                    outs,
                    strike_rate,
                    average,
                    pp_runs,
                    pp_balls,
                    mid_runs,
                    mid_balls,
                    death_runs,
                    death_balls,
                    caught_outs,
                    bowled_outs,
                    lbw_outs,
                    stumped_outs
                FROM analytics.batter_profile_season
                WHERE batter ILIKE %s
                ORDER BY season
            """
            params = (batter_name,)
        try:
            results = self.execute_query(query, params)
        except Exception:
            results = None
        if not results:
            # Fallback to direct query if view doesn't exist
            return self._get_batter_profile_by_season_direct(batter_name, season)
        
        return [
            {
                "batter": row[0],
                "season": row[1],
                "matches": row[2] or 0,
                "runs": row[3] or 0,
                "balls": row[4] or 0,
                "outs": row[5] or 0,
                "strike_rate": float(row[6]) if row[6] else 0.0,
                "average": float(row[7]) if row[7] else None,
                "pp_runs": row[8] or 0,
                "pp_balls": row[9] or 0,
                "mid_runs": row[10] or 0,
                "mid_balls": row[11] or 0,
                "death_runs": row[12] or 0,
                "death_balls": row[13] or 0,
                "caught_outs": row[14] or 0,
                "bowled_outs": row[15] or 0,
                "lbw_outs": row[16] or 0,
                "stumped_outs": row[17] or 0,
            }
            for row in results
        ]
    
    def _get_batter_profile_by_season_direct(
        self,
        batter_name: str,
        season: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """
        Fallback method to get season-wise profile directly from deliveries table
        (used when analytics view doesn't exist)
        """
        if season:
            query = """
                WITH base AS (
                    SELECT
                        batter,
                        season,
                        COUNT(DISTINCT match_id) AS matches,
                        COUNT(*) FILTER (WHERE is_legal_ball) AS balls,
                        SUM(runs_batter) AS runs,
                        COUNT(*) FILTER (
                            WHERE is_wicket = true AND dismissed_batter = batter
                        ) AS outs
                    FROM deliveries
                    WHERE batter ILIKE %s AND season = %s
                    GROUP BY batter, season
                ),
                phase_stats AS (
                    SELECT
                        batter,
                        season,
                        SUM(runs_batter) FILTER (WHERE phase = 'powerplay') AS pp_runs,
                        COUNT(*) FILTER (WHERE phase = 'powerplay' AND is_legal_ball) AS pp_balls,
                        SUM(runs_batter) FILTER (WHERE phase = 'middle') AS mid_runs,
                        COUNT(*) FILTER (WHERE phase = 'middle' AND is_legal_ball) AS mid_balls,
                        SUM(runs_batter) FILTER (WHERE phase = 'death') AS death_runs,
                        COUNT(*) FILTER (WHERE phase = 'death' AND is_legal_ball) AS death_balls
                    FROM deliveries
                    WHERE batter ILIKE %s AND season = %s
                    GROUP BY batter, season
                ),
                dismissals AS (
                    SELECT
                        batter,
                        season,
                        COUNT(*) FILTER (WHERE wicket_type = 'caught') AS caught_outs,
                        COUNT(*) FILTER (WHERE wicket_type = 'bowled') AS bowled_outs,
                        COUNT(*) FILTER (WHERE wicket_type = 'lbw') AS lbw_outs,
                        COUNT(*) FILTER (WHERE wicket_type = 'stumped') AS stumped_outs
                    FROM deliveries
                    WHERE is_wicket = true
                      AND dismissed_batter = batter
                      AND batter ILIKE %s AND season = %s
                    GROUP BY batter, season
                )
                SELECT
                    b.batter,
                    b.season,
                    b.matches,
                    b.runs,
                    b.balls,
                    b.outs,
                    ROUND(b.runs::numeric / NULLIF(b.balls, 0) * 100, 2) AS strike_rate,
                    ROUND(b.runs::numeric / NULLIF(b.outs, 0), 2) AS average,
                    COALESCE(p.pp_runs, 0),
                    COALESCE(p.pp_balls, 0),
                    COALESCE(p.mid_runs, 0),
                    COALESCE(p.mid_balls, 0),
                    COALESCE(p.death_runs, 0),
                    COALESCE(p.death_balls, 0),
                    COALESCE(d.caught_outs, 0),
                    COALESCE(d.bowled_outs, 0),
                    COALESCE(d.lbw_outs, 0),
                    COALESCE(d.stumped_outs, 0)
                FROM base b
                LEFT JOIN phase_stats p USING (batter, season)
                LEFT JOIN dismissals d USING (batter, season)
                ORDER BY b.season
            """
            params = (batter_name, season, batter_name, season, batter_name, season)
        else:
            query = """
                WITH base AS (
                    SELECT
                        batter,
                        season,
                        COUNT(DISTINCT match_id) AS matches,
                        COUNT(*) FILTER (WHERE is_legal_ball) AS balls,
                        SUM(runs_batter) AS runs,
                        COUNT(*) FILTER (
                            WHERE is_wicket = true AND dismissed_batter = batter
                        ) AS outs
                    FROM deliveries
                    WHERE batter ILIKE %s
                    GROUP BY batter, season
                ),
                phase_stats AS (
                    SELECT
                        batter,
                        season,
                        SUM(runs_batter) FILTER (WHERE phase = 'powerplay') AS pp_runs,
                        COUNT(*) FILTER (WHERE phase = 'powerplay' AND is_legal_ball) AS pp_balls,
                        SUM(runs_batter) FILTER (WHERE phase = 'middle') AS mid_runs,
                        COUNT(*) FILTER (WHERE phase = 'middle' AND is_legal_ball) AS mid_balls,
                        SUM(runs_batter) FILTER (WHERE phase = 'death') AS death_runs,
                        COUNT(*) FILTER (WHERE phase = 'death' AND is_legal_ball) AS death_balls
                    FROM deliveries
                    WHERE batter ILIKE %s
                    GROUP BY batter, season
                ),
                dismissals AS (
                    SELECT
                        batter,
                        season,
                        COUNT(*) FILTER (WHERE wicket_type = 'caught') AS caught_outs,
                        COUNT(*) FILTER (WHERE wicket_type = 'bowled') AS bowled_outs,
                        COUNT(*) FILTER (WHERE wicket_type = 'lbw') AS lbw_outs,
                        COUNT(*) FILTER (WHERE wicket_type = 'stumped') AS stumped_outs
                    FROM deliveries
                    WHERE is_wicket = true
                      AND dismissed_batter = batter
                      AND batter ILIKE %s
                    GROUP BY batter, season
                )
                SELECT
                    b.batter,
                    b.season,
                    b.matches,
                    b.runs,
                    b.balls,
                    b.outs,
                    ROUND(b.runs::numeric / NULLIF(b.balls, 0) * 100, 2) AS strike_rate,
                    ROUND(b.runs::numeric / NULLIF(b.outs, 0), 2) AS average,
                    COALESCE(p.pp_runs, 0),
                    COALESCE(p.pp_balls, 0),
                    COALESCE(p.mid_runs, 0),
                    COALESCE(p.mid_balls, 0),
                    COALESCE(p.death_runs, 0),
                    COALESCE(p.death_balls, 0),
                    COALESCE(d.caught_outs, 0),
                    COALESCE(d.bowled_outs, 0),
                    COALESCE(d.lbw_outs, 0),
                    COALESCE(d.stumped_outs, 0)
                FROM base b
                LEFT JOIN phase_stats p USING (batter, season)
                LEFT JOIN dismissals d USING (batter, season)
                ORDER BY b.season
            """
            params = (batter_name, batter_name, batter_name)
        
        results = self.execute_query(query, params)
        
        if not results:
            return []
        
        return [
            {
                "batter": row[0],
                "season": row[1],
                "matches": row[2] or 0,
                "runs": row[3] or 0,
                "balls": row[4] or 0,
                "outs": row[5] or 0,
                "strike_rate": float(row[6]) if row[6] else 0.0,
                "average": float(row[7]) if row[7] else None,
                "pp_runs": row[8] or 0,
                "pp_balls": row[9] or 0,
                "mid_runs": row[10] or 0,
                "mid_balls": row[11] or 0,
                "death_runs": row[12] or 0,
                "death_balls": row[13] or 0,
                "caught_outs": row[14] or 0,
                "bowled_outs": row[15] or 0,
                "lbw_outs": row[16] or 0,
                "stumped_outs": row[17] or 0,
            }
            for row in results
        ]
