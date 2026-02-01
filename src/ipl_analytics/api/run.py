"""
Script to run the FastAPI server
"""
import os
import uvicorn
from ipl_analytics.api.config import settings

if __name__ == "__main__":
    port = int(os.environ.get("PORT", "8000"))
    uvicorn.run(
        "ipl_analytics.api.main:app",
        host="0.0.0.0",
        port=port,
        reload=settings.debug,
        log_level="debug" if settings.debug else "info"
    )
