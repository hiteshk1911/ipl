"""
Batter-related API routes
"""
from fastapi import APIRouter, Path, Query, Depends
from typing import Optional
from ipl_analytics.api.services.batter_service import BatterService
from ipl_analytics.api.schemas.batters import (
    BatterProfileResponse,
    BatterRecentFormResponse,
    BatterSeasonProfileResponse
)
from ipl_analytics.api.dependencies import get_batter_service

router = APIRouter(prefix="/batters", tags=["batters"])


@router.get("/{batter_name}/profile", response_model=BatterProfileResponse)
async def get_batter_profile(
    batter_name: str = Path(..., description="Batter name (URL encoded)"),
    service: BatterService = Depends(get_batter_service)
):
    """
    Get complete batter profile including career stats, phase performance, and dismissals
    """
    return service.get_batter_profile(batter_name)


@router.get("/{batter_name}/recent-form", response_model=BatterRecentFormResponse)
async def get_batter_recent_form(
    batter_name: str = Path(..., description="Batter name (URL encoded)"),
    matches: int = Query(5, ge=1, le=20, description="Number of recent matches"),
    season: Optional[str] = Query(None, description="Filter by season"),
    service: BatterService = Depends(get_batter_service)
):
    """
    Get recent form for a batter (last N matches)
    """
    return service.get_recent_form(batter_name, matches, season)


@router.get("/{batter_name}/profile/seasons", response_model=BatterSeasonProfileResponse)
async def get_batter_profile_by_season(
    batter_name: str = Path(..., description="Batter name (URL encoded)"),
    season: Optional[str] = Query(None, description="Filter by specific season (optional)"),
    service: BatterService = Depends(get_batter_service)
):
    """
    Get batter profile broken down by season.
    
    Returns season-wise statistics including:
    - Matches, runs, balls, outs per season
    - Average and strike rate per season
    - Phase-wise performance per season
    - Dismissal breakdown per season
    
    If season parameter is provided, returns only that season's data.
    Otherwise, returns all seasons.
    """
    return service.get_batter_profile_by_season(batter_name, season)
