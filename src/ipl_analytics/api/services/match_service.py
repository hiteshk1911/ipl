"""
Service for match-related operations
"""
from typing import List
from ipl_analytics.repositories.match_repository import MatchRepository
from ipl_analytics.api.exceptions import NotFoundError
from ipl_analytics.api.schemas.matches import MatchInfoResponse


class MatchService:
    """Business logic for match operations"""
    
    def __init__(self):
        self.repository = MatchRepository()
    
    def get_match_info(self, match_id: int) -> MatchInfoResponse:
        """
        Get match information
        
        Args:
            match_id: Match ID
            
        Returns:
            MatchInfoResponse object
            
        Raises:
            NotFoundError if match not found
        """
        data = self.repository.get_match_info(match_id)
        
        if not data:
            raise NotFoundError("Match", str(match_id))
        
        return MatchInfoResponse(**data)

    def get_available_seasons(self) -> List[str]:
        """Return distinct seasons that have data, newest first."""
        return self.repository.get_available_seasons()
