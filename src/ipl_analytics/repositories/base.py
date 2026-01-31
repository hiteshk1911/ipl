"""
Base repository class
"""
from abc import ABC, abstractmethod
from typing import Any, Dict, List, Optional
from ipl_analytics.db.pool import DatabasePool


class BaseRepository(ABC):
    """Base repository with common database operations"""
    
    def __init__(self):
        self.pool = DatabasePool
    
    def execute_query(
        self,
        query: str,
        params: Optional[tuple] = None,
        fetch_one: bool = False,
        fetch_all: bool = True
    ) -> Any:
        """
        Execute a SELECT query
        
        Args:
            query: SQL query string
            params: Query parameters
            fetch_one: Return single row
            fetch_all: Return all rows
            
        Returns:
            Query results
        """
        with self.pool.get_cursor() as cursor:
            cursor.execute(query, params)
            
            if fetch_one:
                return cursor.fetchone()
            elif fetch_all:
                return cursor.fetchall()
            else:
                return None
    
    def execute_many(
        self,
        query: str,
        params_list: List[tuple]
    ) -> None:
        """
        Execute query with multiple parameter sets
        
        Args:
            query: SQL query string
            params_list: List of parameter tuples
        """
        with self.pool.get_cursor() as cursor:
            cursor.executemany(query, params_list)
