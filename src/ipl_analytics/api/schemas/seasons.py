"""
Seasons API schemas
"""
from pydantic import BaseModel, Field
from typing import List


class SeasonsResponse(BaseModel):
    """List of seasons that have data in the database."""

    seasons: List[str] = Field(..., description="Season identifiers, newest first")
