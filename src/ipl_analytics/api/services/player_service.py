"""
Service for player-related operations
"""
from typing import List, Optional
from ipl_analytics.repositories.player_repository import PlayerRepository
from ipl_analytics.api.exceptions import NotFoundError


class PlayerService:
    """Business logic for player operations"""
    
    def __init__(self):
        self.repository = PlayerRepository()
    
    def get_all_players(
        self,
        search: Optional[str] = None,
        limit: int = 100,
        offset: int = 0
    ) -> dict:
        """
        Get all players with pagination
        
        Args:
            search: Optional search term
            limit: Maximum results
            offset: Pagination offset
            
        Returns:
            Dictionary with players list and pagination info
        """
        players = self.repository.get_all_players(search, limit, offset)
        total = self.repository.get_player_count(search)
        
        return {
            "players": players,
            "total": total,
            "limit": limit,
            "offset": offset
        }
    
    def search_players(self, query: str, limit: int = 10) -> List[dict]:
        """
        Search players for autocomplete
        
        Args:
            query: Search query
            limit: Maximum results
            
        Returns:
            List of player dictionaries
        """
        results = self.repository.search_players(query, limit)
        return [
            {"name": row[0], "matches": row[1]}
            for row in results
        ]
    
    def validate_player_exists(self, player_name: str) -> None:
        """
        Validate that a player exists, raise exception if not
        
        Args:
            player_name: Name of the player
            
        Raises:
            NotFoundError if player doesn't exist
        """
        # #region agent log
        import json, os
        _exists = self.repository.player_exists(player_name)
        _line = json.dumps({"location": "player_service.py:validate_player_exists", "message": "player_exists check", "data": {"player_name": player_name, "exists": _exists}, "timestamp": __import__("time").time() * 1000, "sessionId": "debug-session", "hypothesisId": "H1"}) + "\n"
        for _p in ["/Users/himankverma/Developer/projects/.cursor/debug.log", os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", "..", "debug.log"))]:
            try: open(_p, "a").write(_line)
            except Exception: pass
        # #endregion
        if not _exists:
            raise NotFoundError("Player", player_name)
