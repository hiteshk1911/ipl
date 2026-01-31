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
    seasons,
    health
)

# Configure logging
logging.basicConfig(
    level=logging.DEBUG if settings.debug else logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# Create FastAPI app with enhanced Swagger documentation
app = FastAPI(
    title=settings.api_title,
    version=settings.api_version,
    description="""
    ## Professional-grade IPL Cricket Analytics API
    
    A RESTful API providing comprehensive cricket analytics for IPL matches.
    Built for professional teams, coaches, analysts, and cricket boards.
    
    ### Features
    
    * **Batter Analytics**: Career profiles, season breakdowns, recent form, phase-wise performance
    * **Matchup Analysis**: Head-to-head statistics between batters and bowlers
    * **Match Context**: Match information, venue statistics, team data
    * **Player Management**: Search and list players with pagination
    
    ### Getting Started
    
    1. All endpoints are prefixed with `/api/v1`
    2. Player names should be URL encoded (e.g., "V Kohli" → "V%20Kohli")
    3. All responses are in JSON format
    4. Error responses follow a standard format (see Error Handling section)
    
    ### Authentication
    
    Currently, the API does not require authentication. This may change in future versions.
    
    ### Rate Limiting
    
    Rate limiting may be implemented in production. Check response headers for rate limit information.
    
    ### Support
    
    For issues or questions, please refer to the project documentation or contact the development team.
    """,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    contact={
        "name": "IPL Analytics API Support",
        "email": "coderhitesh1911@gmail.com",
    },
    license_info={
        "name": "MIT",
    },
    servers=[
        {
            "url": "http://localhost:8000",
            "description": "Development server"
        },
        {
            "url": "https://api.ipl-analytics.com",
            "description": "Production server (if applicable)"
        }
    ],
    tags_metadata=[
        {
            "name": "health",
            "description": "Health check and system status endpoints"
        },
        {
            "name": "players",
            "description": "Player management endpoints. Search and list all players in the database."
        },
        {
            "name": "batters",
            "description": """
            Batter analytics endpoints. Get comprehensive statistics including:
            - Career profiles with phase-wise performance
            - Season-by-season breakdowns
            - Recent form analysis
            - Dismissal patterns
            """
        },
        {
            "name": "matchups",
            "description": """
            Matchup analysis endpoints. Analyze head-to-head statistics between:
            - Batter vs Bowler matchups
            - Phase-wise breakdowns
            - Recent encounter history
            """
        },
        {
            "name": "matches",
            "description": "Match information endpoints. Get details about specific matches."
        }
    ]
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
app.include_router(seasons.router, prefix=settings.api_prefix)


@app.on_event("startup")
async def startup_event():
    """Initialize resources on startup"""
    logger.info("Starting IPL Analytics API...")
    logger.info(f"API Version: {settings.api_version}")
    logger.info(f"Database: {settings.db_name} @ {settings.db_host}:{settings.db_port}")
    
    # (Re)initialize database pool at startup so it always uses current config
    try:
        from ipl_analytics.db.pool import DatabasePool
        DatabasePool.close_all()
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
