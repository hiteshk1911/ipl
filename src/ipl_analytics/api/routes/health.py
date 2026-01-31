"""
Health check and utility routes
"""
from fastapi import APIRouter
from ipl_analytics.api.schemas.common import HealthResponse
from ipl_analytics.api.config import settings
from ipl_analytics.db.pool import DatabasePool

router = APIRouter(tags=["health"])


@router.get(
    "/health",
    response_model=HealthResponse,
    summary="Health Check",
    description="""
    Health check endpoint to verify API and database connectivity.
    
    **Use Cases:**
    - Monitoring and alerting systems
    - Load balancer health checks
    - Deployment verification
    - System status monitoring
    
    **Response Status:**
    - `healthy`: API and database are operational
    - `degraded`: API is running but database connection failed
    
    **Response Fields:**
    - `status`: Overall service status
    - `database`: Database connection status (connected/disconnected/error)
    - `version`: API version number
    """,
    responses={
        200: {
            "description": "Health status retrieved",
            "content": {
                "application/json": {
                    "example": {
                        "status": "healthy",
                        "database": "connected",
                        "version": "1.0.0"
                    }
                }
            }
        }
    },
    tags=["health"]
)
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
