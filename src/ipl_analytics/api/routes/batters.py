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


@router.get(
    "/{batter_name}/profile",
    response_model=BatterProfileResponse,
    summary="Get Batter Career Profile",
    description="""
    Get complete batter profile with comprehensive statistics.
    
    **Returns:**
    - Career statistics (matches, runs, average, strike rate, highest score)
    - Phase-wise performance (powerplay, middle, death overs)
    - Dismissal breakdown (caught, bowled, LBW, stumped)
    
    **Example:**
    - Batter name: "V Kohli" → URL encode to "V%20Kohli"
    - Request: `GET /api/v1/batters/V%20Kohli/profile`
    """,
    responses={
        200: {
            "description": "Batter profile retrieved successfully",
            "content": {
                "application/json": {
                    "example": {
                        "batter": "V Kohli",
                        "career": {
                            "matches": 237,
                            "runs": 7263,
                            "balls": 5587,
                            "outs": 195,
                            "average": 37.25,
                            "strike_rate": 130.02,
                            "highest_score": 113
                        },
                        "phase_performance": {
                            "powerplay": {
                                "runs": 1200,
                                "balls": 800,
                                "strike_rate": 150.0,
                                "outs": 25,
                                "average": 48.0
                            }
                        },
                        "dismissals": {
                            "caught": 120,
                            "bowled": 45,
                            "lbw": 20,
                            "stumped": 10
                        }
                    }
                }
            }
        },
        404: {
            "description": "Batter not found",
            "content": {
                "application/json": {
                    "example": {
                        "error": {
                            "code": "NOT_FOUND",
                            "message": "Batter 'XYZ' not found",
                            "details": {}
                        }
                    }
                }
            }
        }
    }
)
async def get_batter_profile(
    batter_name: str = Path(
        ...,
        description="Batter name (URL encoded, e.g., 'V%20Kohli' for 'V Kohli')",
        example="V%20Kohli"
    ),
    service: BatterService = Depends(get_batter_service)
):
    """
    Get complete batter profile including career stats, phase performance, and dismissals
    """
    return service.get_batter_profile(batter_name)


@router.get(
    "/{batter_name}/recent-form",
    response_model=BatterRecentFormResponse,
    summary="Get Batter Recent Form",
    description="""
    Get recent form analysis for a batter (last N matches).
    
    **Returns:**
    - Recent match performances with runs, balls, dismissals
    - Summary statistics (total runs, average, strike rate)
    - Match context (season, venue, match ID)
    
    **Query Parameters:**
    - `matches` (default: 5, max: 20): Number of recent matches to analyze
    - `season` (optional): Filter by specific season
    
    **Use Cases:**
    - Assess current form before team selection
    - Identify recent performance trends
    - Make tactical decisions based on recent data
    """,
    responses={
        200: {
            "description": "Recent form retrieved successfully"
        },
        404: {
            "description": "Batter not found"
        }
    }
)
async def get_batter_recent_form(
    batter_name: str = Path(
        ...,
        description="Batter name (URL encoded, e.g., 'V%20Kohli' for 'V Kohli')",
        example="V%20Kohli"
    ),
    matches: int = Query(
        5,
        ge=1,
        le=20,
        description="Number of recent matches to analyze (1-20)",
        example=5
    ),
    season: Optional[str] = Query(
        None,
        description="Filter by specific season (optional)",
        example="2011"
    ),
    service: BatterService = Depends(get_batter_service)
):
    """
    Get recent form for a batter (last N matches)
    """
    return service.get_recent_form(batter_name, matches, season)


@router.get(
    "/{batter_name}/profile/seasons",
    response_model=BatterSeasonProfileResponse,
    summary="Get Batter Profile by Season",
    description="""
    Get batter profile broken down by season for year-over-year analysis.
    
    **Returns:**
    - Season-wise statistics (matches, runs, average, strike rate per season)
    - Phase-wise performance breakdown per season
    - Dismissal patterns per season
    - Total number of seasons played
    
    **Use Cases:**
    - Track performance trends across seasons
    - Identify improving/declining form
    - Compare season-specific performance
    - Analyze role evolution over time
    
    **Query Parameters:**
    - `season` (optional): Filter by specific season (e.g., "2011"). If omitted, returns all seasons.
    
    **Example Requests:**
    - All seasons: `GET /api/v1/batters/V%20Kohli/profile/seasons`
    - Specific season: `GET /api/v1/batters/V%20Kohli/profile/seasons?season=2011`
    """,
    responses={
        200: {
            "description": "Season-wise profile retrieved successfully",
            "content": {
                "application/json": {
                    "example": {
                        "batter": "V Kohli",
                        "total_seasons": 3,
                        "seasons": [
                            {
                                "season": "2007/08",
                                "matches": 13,
                                "runs": 165,
                                "balls": 120,
                                "outs": 8,
                                "average": 20.63,
                                "strike_rate": 137.5,
                                "phase_performance": {
                                    "powerplay": {
                                        "runs": 45,
                                        "balls": 30,
                                        "strike_rate": 150.0,
                                        "outs": 2,
                                        "average": 22.5
                                    }
                                },
                                "dismissals": {
                                    "caught": 5,
                                    "bowled": 2,
                                    "lbw": 1,
                                    "stumped": 0
                                }
                            }
                        ]
                    }
                }
            }
        },
        404: {
            "description": "Batter not found",
            "content": {
                "application/json": {
                    "example": {
                        "error": {
                            "code": "NOT_FOUND",
                            "message": "Batter 'XYZ' not found",
                            "details": {}
                        }
                    }
                }
            }
        }
    }
)
async def get_batter_profile_by_season(
    batter_name: str = Path(
        ...,
        description="Batter name (URL encoded, e.g., 'V%20Kohli' for 'V Kohli')",
        example="V%20Kohli"
    ),
    season: Optional[str] = Query(
        None,
        description="Filter by specific season (e.g., '2011', '2007/08'). If omitted, returns all seasons.",
        example="2011"
    ),
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
