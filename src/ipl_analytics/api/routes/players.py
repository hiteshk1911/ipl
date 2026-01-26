"""
Player-related API routes
"""
from fastapi import APIRouter, Query, Depends
from typing import Optional
from ipl_analytics.api.services.player_service import PlayerService
from ipl_analytics.api.schemas.players import (
    PlayerListResponse,
    PlayerSearchResponse,
    PlayerResponse
)
from ipl_analytics.api.dependencies import get_player_service

router = APIRouter(prefix="/players", tags=["players"])


@router.get("", response_model=PlayerListResponse)
async def list_players(
    search: Optional[str] = Query(None, description="Search players by name"),
    limit: int = Query(100, ge=1, le=1000, description="Maximum results"),
    offset: int = Query(0, ge=0, description="Pagination offset"),
    service: PlayerService = Depends(get_player_service)
):
    """
    List all players with optional search and pagination
    """
    result = service.get_all_players(search, limit, offset)
    return PlayerListResponse(**result)


@router.get("/search", response_model=PlayerSearchResponse)
async def search_players(
    q: str = Query(..., min_length=2, description="Search query (min 2 characters)"),
    limit: int = Query(10, ge=1, le=50, description="Maximum results"),
    service: PlayerService = Depends(get_player_service)
):
    """
    Search players for autocomplete
    """
    players = service.search_players(q, limit)
    return PlayerSearchResponse(
        players=[PlayerResponse(name=p["name"]) for p in players]
    )
