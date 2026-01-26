"""
Common schemas used across the API
"""
from pydantic import BaseModel, Field
from typing import Optional


class ErrorResponse(BaseModel):
    """Standard error response format"""
    error: dict = Field(
        ...,
        description="Error details",
        example={
            "code": "NOT_FOUND",
            "message": "Batter 'XYZ' not found",
            "details": {}
        }
    )


class HealthResponse(BaseModel):
    """Health check response"""
    status: str = Field(..., description="Service status")
    database: str = Field(..., description="Database connection status")
    version: str = Field(..., description="API version")


class PhaseStats(BaseModel):
    """Phase-wise performance statistics"""
    runs: int = Field(..., description="Total runs scored")
    balls: int = Field(..., description="Balls faced")
    strike_rate: float = Field(..., description="Strike rate")
    outs: int = Field(..., description="Number of dismissals")
    average: Optional[float] = Field(None, description="Average (if outs > 0)")


class PhaseBreakdown(BaseModel):
    """Breakdown by match phases"""
    powerplay: Optional[PhaseStats] = None
    middle: Optional[PhaseStats] = None
    death: Optional[PhaseStats] = None
