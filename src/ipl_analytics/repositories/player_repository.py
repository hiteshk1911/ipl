"""
Repository for player data access
"""
from typing import List, Optional
from ipl_analytics.repositories.base import BaseRepository


class PlayerRepository(BaseRepository):
    """Handles all player-related database queries"""
    
    def get_all_players(
        self,
        search: Optional[str] = None,
        limit: int = 100,
        offset: int = 0
    ) -> List[str]:
        """
        Get all players with optional search filter
        
        Args:
            search: Optional search term (partial match)
            limit: Maximum results
            offset: Pagination offset
            
        Returns:
            List of player names
        """
        if search:
            query = """
                SELECT player_name
                FROM players
                WHERE player_name ILIKE %s
                ORDER BY player_name
                LIMIT %s OFFSET %s
            """
            params = (f"%{search}%", limit, offset)
        else:
            query = """
                SELECT player_name
                FROM players
                ORDER BY player_name
                LIMIT %s OFFSET %s
            """
            params = (limit, offset)
        
        results = self.execute_query(query, params)
        return [row[0] for row in results] if results else []
    
    def get_player_count(self, search: Optional[str] = None) -> int:
        """Get total count of players"""
        if search:
            query = "SELECT COUNT(*) FROM players WHERE player_name ILIKE %s"
            params = (f"%{search}%",)
        else:
            query = "SELECT COUNT(*) FROM players"
            params = None
        
        result = self.execute_query(query, params, fetch_one=True)
        return result[0] if result else 0
    
    def player_exists(self, player_name: str) -> bool:
        """Check if a player exists"""
        query = "SELECT EXISTS(SELECT 1 FROM players WHERE player_name = %s)"
        result = self.execute_query(query, (player_name,), fetch_one=True)
        return result[0] if result else False
    
    def search_players(self, query: str, limit: int = 10) -> List[tuple]:
        """
        Search players for autocomplete
        
        Args:
            query: Search query (min 2 chars)
            limit: Maximum results
            
        Returns:
            List of (player_name, match_count) tuples
        """
        if len(query) < 2:
            return []
        
        sql = """
            SELECT 
                p.player_name,
                COUNT(DISTINCT d.match_id) as matches
            FROM players p
            LEFT JOIN deliveries d ON d.batter = p.player_name
            WHERE p.player_name ILIKE %s
            GROUP BY p.player_name
            ORDER BY matches DESC, p.player_name
            LIMIT %s
        """
        params = (f"%{query}%", limit)
        results = self.execute_query(sql, params)
        return results if results else []
