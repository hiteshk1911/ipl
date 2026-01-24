from collections import defaultdict
from typing import List

from ipl_analytics.models.delivery import Delivery


def validate_deliveries(deliveries: List[Delivery]) -> None:
    """
    Raise exceptions if cricket invariants are violated.
    """

    runs_by_innings = defaultdict(int)
    wickets_by_innings = defaultdict(int)
    legal_balls_by_innings = defaultdict(int)

    for d in deliveries:
        runs_by_innings[d.innings] += d.total_runs

        if d.is_wicket:
            wickets_by_innings[d.innings] += 1

        if d.is_legal_ball:
            legal_balls_by_innings[d.innings] += 1

    for innings in runs_by_innings.keys():
        wickets = wickets_by_innings[innings]
        balls = legal_balls_by_innings[innings]

        if wickets > 10:
            raise ValueError(f"Innings {innings} has {wickets} wickets")

        if balls > 120:
            raise ValueError(f"Innings {innings} has {balls} legal balls")

    print("✅ Delivery validation passed")
