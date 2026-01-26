"""
Custom exceptions for the API
"""
from typing import Optional


class IPLAnalyticsException(Exception):
    """Base exception for IPL Analytics API"""
    
    def __init__(
        self,
        message: str,
        status_code: int = 500,
        error_code: Optional[str] = None,
        details: Optional[dict] = None
    ):
        self.message = message
        self.status_code = status_code
        self.error_code = error_code or "INTERNAL_ERROR"
        self.details = details or {}
        super().__init__(self.message)


class NotFoundError(IPLAnalyticsException):
    """Resource not found"""
    
    def __init__(self, resource: str, identifier: str, details: Optional[dict] = None):
        super().__init__(
            message=f"{resource} '{identifier}' not found",
            status_code=404,
            error_code="NOT_FOUND",
            details=details or {}
        )


class BadRequestError(IPLAnalyticsException):
    """Bad request error"""
    
    def __init__(self, message: str, details: Optional[dict] = None):
        super().__init__(
            message=message,
            status_code=400,
            error_code="BAD_REQUEST",
            details=details or {}
        )


class DatabaseError(IPLAnalyticsException):
    """Database operation error"""
    
    def __init__(self, message: str, details: Optional[dict] = None):
        super().__init__(
            message=f"Database error: {message}",
            status_code=500,
            error_code="DATABASE_ERROR",
            details=details or {}
        )
