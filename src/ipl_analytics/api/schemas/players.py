"""
Player-related schemas
"""
from pydantic import BaseModel, Field
from typing import List, Optional


class PlayerResponse(BaseModel):
    """Player information"""
    name: str = Field(..., description="Player name")


class PlayerListResponse(BaseModel):
    """List of players with pagination"""
    players: List[str] = Field(..., description="List of player names")
    total: int = Field(..., description="Total number of players")
    limit: int = Field(..., description="Results limit")
    offset: int = Field(..., description="Results offset")


class PlayerSearchResponse(BaseModel):
    """Player search result"""
    players: List[PlayerResponse] = Field(..., description="Matching players")
