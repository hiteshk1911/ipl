"""
Repository for match data access
"""
from typing import Optional, Dict, Any
from ipl_analytics.repositories.base import BaseRepository


class MatchRepository(BaseRepository):
    """Handles all match-related database queries"""
    
    def get_match_info(self, match_id: int) -> Optional[Dict[str, Any]]:
        """
        Get basic match information
        
        Args:
            match_id: Match ID
            
        Returns:
            Dictionary with match data or None
        """
        query = """
            SELECT match_id, season, venue
            FROM matches
            WHERE match_id = %s
        """
        result = self.execute_query(query, (match_id,), fetch_one=True)
        
        if not result:
            return None
        
        return {
            "match_id": result[0],
            "season": result[1],
            "venue": result[2],
            "teams": None,  # Would need additional schema for team names
            "date": None,    # Would need additional schema for dates
            "toss": None    # Would need additional schema for toss info
        }
    
    def match_exists(self, match_id: int) -> bool:
        """Check if a match exists"""
        query = "SELECT EXISTS(SELECT 1 FROM matches WHERE match_id = %s)"
        result = self.execute_query(query, (match_id,), fetch_one=True)
        return result[0] if result else False
