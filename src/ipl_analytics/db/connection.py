import psycopg2
from psycopg2.extras import execute_batch

from ipl_analytics.api.config import settings


def get_connection():
    return psycopg2.connect(
        dbname=settings.db_name,
        user=settings.db_user,
        password=settings.db_password,
        host=settings.db_host,
        port=settings.db_port,
    )
