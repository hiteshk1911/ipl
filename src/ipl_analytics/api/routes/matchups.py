"""
Matchup-related API routes
"""
from fastapi import APIRouter, Path, Query, Depends
from typing import Optional
from ipl_analytics.api.services.matchup_service import MatchupService
from ipl_analytics.api.schemas.matchups import BatterBowlerMatchupResponse
from ipl_analytics.api.dependencies import get_matchup_service

router = APIRouter(prefix="/matchups", tags=["matchups"])


@router.get(
    "/batter/{batter_name}/bowler/{bowler_name}",
    response_model=BatterBowlerMatchupResponse
)
async def get_batter_bowler_matchup(
    batter_name: str = Path(..., description="Batter name (URL encoded)"),
    bowler_name: str = Path(..., description="Bowler name (URL encoded)"),
    season: Optional[str] = Query(None, description="Filter by season"),
    venue: Optional[str] = Query(None, description="Filter by venue"),
    include_phases: bool = Query(True, description="Include phase breakdown"),
    service: MatchupService = Depends(get_matchup_service)
):
    """
    Get batter vs bowler matchup analysis with phase breakdown and recent encounters
    """
    # #region agent log
    import json, os
    _line = json.dumps({"location": "matchups.py:get_batter_bowler_matchup", "message": "route received", "data": {"batter_name": batter_name, "bowler_name": bowler_name, "batter_repr": repr(batter_name), "bowler_repr": repr(bowler_name)}, "timestamp": __import__("time").time() * 1000, "sessionId": "debug-session", "hypothesisId": "H2"}) + "\n"
    for _p in ["/Users/himankverma/Developer/projects/.cursor/debug.log", os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", "..", "debug.log"))]:
        try:
            with open(_p, "a") as _f: _f.write(_line)
        except Exception: pass
    # #endregion
    return service.get_batter_bowler_matchup(
        batter_name,
        bowler_name,
        season,
        venue,
        include_phases
    )
