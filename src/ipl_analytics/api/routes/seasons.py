"""
Seasons API routes
"""
from fastapi import APIRouter, Depends
from ipl_analytics.api.services.match_service import MatchService
from ipl_analytics.api.schemas.seasons import SeasonsResponse
from ipl_analytics.api.dependencies import get_match_service

router = APIRouter(prefix="/seasons", tags=["seasons"])


@router.get(
    "",
    response_model=SeasonsResponse,
    summary="List available seasons",
    description="Returns distinct seasons that have match data, ordered newest first. Use this to populate season filters.",
)
async def get_available_seasons(
    service: MatchService = Depends(get_match_service),
) -> SeasonsResponse:
    """Get list of seasons for which data exists."""
    seasons = service.get_available_seasons()
    return SeasonsResponse(seasons=seasons)
