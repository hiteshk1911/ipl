from psycopg2.extras import execute_batch

from ipl_analytics.db.connection import get_connection
from ipl_analytics.models.delivery import Delivery


def insert_match(deliveries: list[Delivery]) -> None:
    if not deliveries:
        raise ValueError("No deliveries provided")

    d0 = deliveries[0]

    sql = """
        INSERT INTO matches (match_id, season, venue)
        VALUES (%s, %s, %s)
        ON CONFLICT (match_id) DO NOTHING
    """

    row = (d0.match_id, d0.season, d0.venue)

    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(sql, row)

    print(f"✅ Inserted match {d0.match_id} (or already existed)")
