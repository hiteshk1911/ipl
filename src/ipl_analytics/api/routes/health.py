"""
Health check and utility routes
"""
from fastapi import APIRouter
from ipl_analytics.api.schemas.common import HealthResponse
from ipl_analytics.api.config import settings
from ipl_analytics.db.pool import DatabasePool

router = APIRouter(tags=["health"])


@router.get("/health", response_model=HealthResponse)
async def health_check():
    """
    Health check endpoint to verify API and database connectivity
    """
    # Check database connection
    db_status = "disconnected"
    try:
        with DatabasePool.get_cursor() as cursor:
            cursor.execute("SELECT 1")
            db_status = "connected"
    except Exception:
        db_status = "error"
    
    return HealthResponse(
        status="healthy" if db_status == "connected" else "degraded",
        database=db_status,
        version=settings.api_version
    )
