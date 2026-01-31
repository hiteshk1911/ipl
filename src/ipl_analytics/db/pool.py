"""
Database connection pooling
"""
import psycopg2
from psycopg2 import pool
from contextlib import contextmanager
from typing import Generator, Optional
import logging

from ipl_analytics.api.config import settings

logger = logging.getLogger(__name__)


class DatabasePool:
    """Manages PostgreSQL connection pool"""
    
    _pool: Optional[pool.ThreadedConnectionPool] = None
    
    @classmethod
    def initialize(cls, min_conn: int = 1, max_conn: int = 10) -> None:
        """Initialize the connection pool"""
        if cls._pool is not None:
            logger.warning("Connection pool already initialized")
            return
        
        try:
            cls._pool = pool.ThreadedConnectionPool(
                minconn=min_conn,
                maxconn=max_conn,
                dbname=settings.db_name,
                user=settings.db_user,
                password=settings.db_password,
                host=settings.db_host,
                port=settings.db_port,
            )
            logger.info(f"Database connection pool initialized ({min_conn}-{max_conn} connections)")
        except Exception as e:
            logger.error(f"Failed to initialize connection pool: {e}")
            raise
    
    @classmethod
    def get_connection(cls):
        """Get a connection from the pool"""
        if cls._pool is None:
            raise RuntimeError("Connection pool not initialized. Call initialize() first.")
        
        try:
            return cls._pool.getconn()
        except Exception as e:
            logger.error(f"Failed to get connection from pool: {e}")
            raise
    
    @classmethod
    def return_connection(cls, conn) -> None:
        """Return a connection to the pool"""
        if cls._pool is None:
            return
        
        try:
            cls._pool.putconn(conn)
        except Exception as e:
            logger.error(f"Failed to return connection to pool: {e}")
    
    @classmethod
    def close_all(cls) -> None:
        """Close all connections in the pool"""
        if cls._pool is not None:
            cls._pool.closeall()
            cls._pool = None
            logger.info("All database connections closed")
    
    @classmethod
    @contextmanager
    def get_cursor(cls) -> Generator:
        """Context manager for database cursor"""
        conn = None
        try:
            conn = cls.get_connection()
            cursor = conn.cursor()
            yield cursor
            conn.commit()
        except Exception as e:
            if conn:
                conn.rollback()
            raise
        finally:
            if cursor:
                cursor.close()
            if conn:
                cls.return_connection(conn)


# Initialize pool on module import
try:
    DatabasePool.initialize()
except Exception as e:
    logger.warning(f"Could not initialize database pool on import: {e}")
