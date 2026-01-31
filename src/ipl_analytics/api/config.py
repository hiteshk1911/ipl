"""
Configuration management for the API
"""
from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    """Application settings loaded from environment variables"""
    
    # Database settings
    db_name: str = "ipl_analytics"
    db_user: str = "hitesh"
    db_password: Optional[str] = None
    db_host: str = "localhost"
    db_port: int = 5432
    
    # API settings
    api_title: str = "IPL Analytics API"
    api_version: str = "1.0.0"
    api_prefix: str = "/api/v1"
    debug: bool = False
    
    # CORS settings
    cors_origins: list[str] = ["*"]
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = False


# Global settings instance
settings = Settings()
