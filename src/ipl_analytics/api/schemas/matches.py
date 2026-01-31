"""
Match-related schemas
"""
from pydantic import BaseModel, Field
from typing import Optional


class MatchInfoResponse(BaseModel):
    """Match information"""
    match_id: int = Field(..., description="Match ID")
    season: str = Field(..., description="Season")
    venue: str = Field(..., description="Venue name")
    teams: Optional[dict[str, str]] = Field(None, description="Team names")
    date: Optional[str] = Field(None, description="Match date")
    toss: Optional[dict[str, str]] = Field(None, description="Toss information")
