from enum import Enum
from typing import Optional
from pydantic import BaseModel, Field


class Phase(str, Enum):
    POWERPLAY = "powerplay"
    MIDDLE = "middle"
    DEATH = "death"


class Delivery(BaseModel):
    # Match context
    match_id: int
    season: str
    venue: str

    innings: int
    over: int
    ball: int

    batting_team: str

    # Players
    batter: str
    bowler: str
    non_striker: str

    # Runs
    runs_batter: int = Field(ge=0)
    runs_extras: int = Field(ge=0)
    extras_type: Optional[str] = None

    # Ball validity
    is_legal_ball: bool

    # Wicket info
    is_wicket: bool
    dismissed_batter: Optional[str] = None
    wicket_type: Optional[str] = None

    # Derived
    phase: Phase

    @property
    def total_runs(self) -> int:
        return self.runs_batter + self.runs_extras
