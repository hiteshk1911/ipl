"""
Match-related API routes
"""
from fastapi import APIRouter, Path, Depends
from ipl_analytics.api.services.match_service import MatchService
from ipl_analytics.api.schemas.matches import MatchInfoResponse
from ipl_analytics.api.dependencies import get_match_service

router = APIRouter(prefix="/matches", tags=["matches"])


@router.get("/{match_id}", response_model=MatchInfoResponse)
async def get_match_info(
    match_id: int = Path(..., description="Match ID"),
    service: MatchService = Depends(get_match_service)
):
    """
    Get match information including season, venue, and teams
    """
    return service.get_match_info(match_id)
