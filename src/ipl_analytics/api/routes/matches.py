"""
Match-related API routes
"""
from fastapi import APIRouter, Path, Depends
from ipl_analytics.api.services.match_service import MatchService
from ipl_analytics.api.schemas.matches import MatchInfoResponse
from ipl_analytics.api.dependencies import get_match_service

router = APIRouter(prefix="/matches", tags=["matches"])


@router.get(
    "/{match_id}",
    response_model=MatchInfoResponse,
    summary="Get Match Information",
    description="""
    Get basic information about a specific match.
    
    **Returns:**
    - Match ID, season, venue
    - Team information (if available)
    - Match date and toss information (if available)
    
    **Use Cases:**
    - Match context for analytics
    - Venue-specific analysis
    - Historical match lookup
    """,
    responses={
        200: {
            "description": "Match information retrieved successfully",
            "content": {
                "application/json": {
                    "example": {
                        "match_id": 335982,
                        "season": "2011",
                        "venue": "M. Chinnaswamy Stadium, Bangalore",
                        "teams": None,
                        "date": None,
                        "toss": None
                    }
                }
            }
        },
        404: {
            "description": "Match not found",
            "content": {
                "application/json": {
                    "example": {
                        "error": {
                            "code": "NOT_FOUND",
                            "message": "Match '12345' not found",
                            "details": {}
                        }
                    }
                }
            }
        }
    }
)
async def get_match_info(
    match_id: int = Path(
        ...,
        description="Match ID (integer)",
        example=335982
    ),
    service: MatchService = Depends(get_match_service)
):
    """
    Get match information including season, venue, and teams
    """
    return service.get_match_info(match_id)
