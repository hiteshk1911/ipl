from typing import Iterable, Set

from psycopg2.extras import execute_batch

from ipl_analytics.db.connection import get_connection
from ipl_analytics.models.delivery import Delivery


def extract_players(deliveries: Iterable[Delivery]) -> Set[str]:
    players = set()
    for d in deliveries:
        players.add(d.batter)
        players.add(d.bowler)
        players.add(d.non_striker)
        if d.dismissed_batter:
            players.add(d.dismissed_batter)
    return players


def insert_players(deliveries: Iterable[Delivery]) -> None:
    players = extract_players(deliveries)

    rows = [(p,) for p in players]

    sql = """
        INSERT INTO players (player_name)
        VALUES (%s)
        ON CONFLICT (player_name) DO NOTHING
    """

    with get_connection() as conn:
        with conn.cursor() as cur:
            execute_batch(cur, sql, rows)

    print(f"✅ Inserted players (or already existed): {len(players)}")
