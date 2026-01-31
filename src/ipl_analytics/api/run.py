"""
Script to run the FastAPI server
"""
import uvicorn
from ipl_analytics.api.config import settings

if __name__ == "__main__":
    uvicorn.run(
        "ipl_analytics.api.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.debug,
        log_level="debug" if settings.debug else "info"
    )
