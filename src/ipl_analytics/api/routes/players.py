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


@router.get(
    "",
    response_model=PlayerListResponse,
    summary="List All Players",
    description="""
    List all players in the database with optional search and pagination.
    
    **Query Parameters:**
    - `search` (optional): Partial name match (case-insensitive)
    - `limit` (default: 100, max: 1000): Maximum number of results
    - `offset` (default: 0): Pagination offset for large result sets
    
    **Use Cases:**
    - Populate player selection dropdowns
    - Search for specific players
    - Get complete player list for admin interfaces
    """,
    responses={
        200: {
            "description": "Players retrieved successfully",
            "content": {
                "application/json": {
                    "example": {
                        "players": ["MS Dhoni", "V Kohli", "SC Ganguly"],
                        "total": 160,
                        "limit": 100,
                        "offset": 0
                    }
                }
            }
        }
    }
)
async def list_players(
    search: Optional[str] = Query(
        None,
        description="Search players by name (partial match, case-insensitive)",
        example="Kohli"
    ),
    limit: int = Query(
        100,
        ge=1,
        le=1000,
        description="Maximum number of results (1-1000)",
        example=100
    ),
    offset: int = Query(
        0,
        ge=0,
        description="Pagination offset (for large result sets)",
        example=0
    ),
    service: PlayerService = Depends(get_player_service)
):
    """
    List all players with optional search and pagination
    """
    result = service.get_all_players(search, limit, offset)
    return PlayerListResponse(**result)


@router.get(
    "/search",
    response_model=PlayerSearchResponse,
    summary="Search Players (Autocomplete)",
    description="""
    Search players for autocomplete functionality.
    
    **Query Parameters:**
    - `q` (required, min 2 chars): Search query
    - `limit` (default: 10, max: 50): Maximum results
    
    **Use Cases:**
    - Autocomplete in search boxes
    - Quick player lookup
    - Type-ahead suggestions
    
    **Example:**
    - Query: "Kohli" → Returns players matching "Kohli"
    - Query: "MS" → Returns players matching "MS"
    """,
    responses={
        200: {
            "description": "Search results retrieved successfully",
            "content": {
                "application/json": {
                    "example": {
                        "players": [
                            {"name": "V Kohli", "matches": 237},
                            {"name": "Virat Kohli", "matches": 15}
                        ]
                    }
                }
            }
        },
        400: {
            "description": "Invalid search query (must be at least 2 characters)"
        }
    }
)
async def search_players(
    q: str = Query(
        ...,
        min_length=2,
        description="Search query (minimum 2 characters)",
        example="Kohli"
    ),
    limit: int = Query(
        10,
        ge=1,
        le=50,
        description="Maximum number of results (1-50)",
        example=10
    ),
    service: PlayerService = Depends(get_player_service)
):
    """
    Search players for autocomplete
    """
    players = service.search_players(q, limit)
    return PlayerSearchResponse(
        players=[PlayerResponse(name=p["name"]) for p in players]
    )
