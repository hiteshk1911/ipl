import psycopg2
from psycopg2.extras import execute_batch


def get_connection():
    return psycopg2.connect(
        dbname="ipl_analytics",
        user="hitesh",      # change if needed
        host="localhost",
        port=5432,
    )
