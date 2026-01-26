"""
FastAPI application entry point
"""
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import logging

from ipl_analytics.api.config import settings
from ipl_analytics.api.exceptions import IPLAnalyticsException
from ipl_analytics.api.routes import (
    players,
    batters,
    matchups,
    matches,
    health
)

# Configure logging
logging.basicConfig(
    level=logging.DEBUG if settings.debug else logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title=settings.api_title,
    version=settings.api_version,
    description="Professional-grade IPL cricket analytics API",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Global exception handler
@app.exception_handler(IPLAnalyticsException)
async def ipl_analytics_exception_handler(request: Request, exc: IPLAnalyticsException):
    """Handle custom IPL Analytics exceptions"""
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": {
                "code": exc.error_code,
                "message": exc.message,
                "details": exc.details
            }
        }
    )


# Include routers
app.include_router(health.router, prefix=settings.api_prefix)
app.include_router(players.router, prefix=settings.api_prefix)
app.include_router(batters.router, prefix=settings.api_prefix)
app.include_router(matchups.router, prefix=settings.api_prefix)
app.include_router(matches.router, prefix=settings.api_prefix)


@app.on_event("startup")
async def startup_event():
    """Initialize resources on startup"""
    logger.info("Starting IPL Analytics API...")
    logger.info(f"API Version: {settings.api_version}")
    logger.info(f"Database: {settings.db_name} @ {settings.db_host}:{settings.db_port}")
    
    # Initialize database pool if not already done
    try:
        from ipl_analytics.db.pool import DatabasePool
        DatabasePool.initialize()
        logger.info("Database connection pool initialized")
    except Exception as e:
        logger.error(f"Failed to initialize database pool: {e}")


@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup resources on shutdown"""
    logger.info("Shutting down IPL Analytics API...")
    try:
        from ipl_analytics.db.pool import DatabasePool
        DatabasePool.close_all()
        logger.info("Database connections closed")
    except Exception as e:
        logger.error(f"Error closing database connections: {e}")


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "IPL Analytics API",
        "version": settings.api_version,
        "docs": "/docs",
        "health": f"{settings.api_prefix}/health"
    }
