from typing import Iterable

from psycopg2.extras import execute_values

from ipl_analytics.db.connection import get_connection
from ipl_analytics.models.delivery import Delivery


def insert_deliveries(deliveries: Iterable[Delivery]) -> None:
    sql = """
        INSERT INTO deliveries (
            match_id,
            season,
            venue,
            innings,
            over,
            ball,
            delivery_seq,
            batting_team,
            batter,
            bowler,
            non_striker,
            runs_batter,
            runs_extras,
            extras_type,
            is_legal_ball,
            is_wicket,
            dismissed_batter,
            wicket_type,
            phase
        )
        VALUES %s
        ON CONFLICT (match_id, innings, delivery_seq) DO NOTHING
    """

    rows = [
        (
            d.match_id,
            d.season,
            d.venue,
            d.innings,
            d.over,
            d.ball,
            d.delivery_seq,
            d.batting_team,
            d.batter,
            d.bowler,
            d.non_striker,
            d.runs_batter,
            d.runs_extras,
            d.extras_type,
            d.is_legal_ball,
            d.is_wicket,
            d.dismissed_batter,
            d.wicket_type,
            d.phase,
        )
        for d in deliveries
    ]

    with get_connection() as conn:
        with conn.cursor() as cur:
            execute_values(cur, sql, rows, page_size=500)

    print(f"✅ Inserted deliveries (or already existed): {len(rows)}")
