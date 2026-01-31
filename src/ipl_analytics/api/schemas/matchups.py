"""
Matchup-related schemas
"""
from pydantic import BaseModel, Field
from typing import Optional, List
from ipl_analytics.api.schemas.common import PhaseStats


class MatchupStats(BaseModel):
    """Overall matchup statistics"""
    runs: int = Field(..., description="Total runs scored")
    balls: int = Field(..., description="Balls faced")
    dismissals: int = Field(..., description="Number of dismissals")
    strike_rate: float = Field(..., description="Strike rate")
    average: Optional[float] = Field(None, description="Average")
    confidence_score: Optional[int] = Field(None, description="Confidence score (0-100)")


class RecentEncounter(BaseModel):
    """Recent encounter between batter and bowler"""
    match_id: int = Field(..., description="Match ID")
    season: str = Field(..., description="Season")
    runs: int = Field(..., description="Runs scored")
    balls: int = Field(..., description="Balls faced")
    dismissed: bool = Field(..., description="Whether dismissed")


class BatterBowlerMatchupResponse(BaseModel):
    """Batter vs bowler matchup analysis"""
    batter: str = Field(..., description="Batter name")
    bowler: str = Field(..., description="Bowler name")
    overall: MatchupStats = Field(..., description="Overall statistics")
    phase_breakdown: Optional[dict[str, PhaseStats]] = Field(
        None,
        description="Phase-wise breakdown"
    )
    recent_encounters: List[RecentEncounter] = Field(
        default_factory=list,
        description="Recent encounters"
    )
