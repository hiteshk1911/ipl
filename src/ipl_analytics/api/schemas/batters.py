"""
Batter-related schemas
"""
from pydantic import BaseModel, Field
from typing import Optional, List
from ipl_analytics.api.schemas.common import PhaseStats, PhaseBreakdown


class DismissalStats(BaseModel):
    """Dismissal statistics"""
    caught: int = Field(default=0, description="Times caught out")
    bowled: int = Field(default=0, description="Times bowled")
    lbw: int = Field(default=0, description="Times LBW")
    stumped: int = Field(default=0, description="Times stumped")


class BatterCareerStats(BaseModel):
    """Career statistics for a batter"""
    matches: int = Field(..., description="Number of matches played")
    runs: int = Field(..., description="Total runs scored")
    balls: int = Field(..., description="Total balls faced")
    outs: int = Field(..., description="Number of dismissals")
    average: Optional[float] = Field(None, description="Batting average")
    strike_rate: float = Field(..., description="Strike rate")
    highest_score: Optional[int] = Field(None, description="Highest score")


class BatterProfileResponse(BaseModel):
    """Complete batter profile"""
    batter: str = Field(..., description="Batter name")
    career: BatterCareerStats = Field(..., description="Career statistics")
    phase_performance: PhaseBreakdown = Field(..., description="Phase-wise performance")
    dismissals: DismissalStats = Field(..., description="Dismissal breakdown")


class RecentMatch(BaseModel):
    """Recent match performance"""
    match_id: int = Field(..., description="Match ID")
    season: str = Field(..., description="Season")
    venue: str = Field(..., description="Venue name")
    runs: int = Field(..., description="Runs scored")
    balls: int = Field(..., description="Balls faced")
    dismissed: bool = Field(..., description="Whether dismissed")
    strike_rate: float = Field(..., description="Strike rate in this match")


class RecentFormSummary(BaseModel):
    """Summary of recent form"""
    matches: int = Field(..., description="Number of matches")
    runs: int = Field(..., description="Total runs")
    balls: int = Field(..., description="Total balls")
    outs: int = Field(..., description="Number of dismissals")
    average: Optional[float] = Field(None, description="Average")
    strike_rate: float = Field(..., description="Strike rate")


class BatterRecentFormResponse(BaseModel):
    """Recent form for a batter"""
    batter: str = Field(..., description="Batter name")
    recent_matches: List[RecentMatch] = Field(..., description="Recent match performances")
    summary: RecentFormSummary = Field(..., description="Summary statistics")


class SeasonProfile(BaseModel):
    """Batter profile for a specific season"""
    season: str = Field(..., description="Season")
    matches: int = Field(..., description="Number of matches")
    runs: int = Field(..., description="Total runs")
    balls: int = Field(..., description="Total balls faced")
    outs: int = Field(..., description="Number of dismissals")
    average: Optional[float] = Field(None, description="Batting average")
    strike_rate: float = Field(..., description="Strike rate")
    phase_performance: PhaseBreakdown = Field(..., description="Phase-wise performance")
    dismissals: DismissalStats = Field(..., description="Dismissal breakdown")


class BatterSeasonProfileResponse(BaseModel):
    """Batter profile broken down by season"""
    batter: str = Field(..., description="Batter name")
    seasons: List[SeasonProfile] = Field(..., description="Season-wise profiles")
    total_seasons: int = Field(..., description="Total number of seasons")
