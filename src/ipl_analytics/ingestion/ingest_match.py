import json
from pathlib import Path
from typing import List

from ipl_analytics.models.delivery import Delivery, Phase


def determine_phase(over: int) -> Phase:
    """
    IPL convention:
    - Overs 0–5  : Powerplay
    - Overs 6–14 : Middle
    - Overs 15+  : Death
    """
    if over <= 5:
        return Phase.POWERPLAY
    elif over <= 14:
        return Phase.MIDDLE
    else:
        return Phase.DEATH


def ingest_match(json_path: Path) -> List[Delivery]:
    """
    Parse a single IPL match JSON file into Delivery objects.
    """
    with open(json_path, "r") as f:
        match = json.load(f)

    info = match["info"]
    innings_data = match["innings"]

    match_id = info["event"]["match_number"]
    season = info["season"]
    venue = info["venue"]

    deliveries: List[Delivery] = []

    for innings_index, innings in enumerate(innings_data, start=1):
        batting_team = innings["team"]
        delivery_seq = 0  # resets per innings

        for over_data in innings["overs"]:
            over_number = over_data["over"]

            legal_ball_counter = 0

            for delivery_data in over_data["deliveries"]:
                delivery_seq += 1

                runs = delivery_data["runs"]
                extras = delivery_data.get("extras", {})
                wickets = delivery_data.get("wickets", [])

                is_legal_ball = not (
                    "wides" in extras or "noballs" in extras
                )

                if is_legal_ball:
                    legal_ball_counter += 1

                delivery = Delivery(
                    match_id=match_id,
                    season=season,
                    venue=venue,
                    innings=innings_index,
                    over=over_number,
                    ball=legal_ball_counter,
                    delivery_seq=delivery_seq,
                    batting_team=batting_team,
                    bowling_team=None,  # can be inferred later
                    batter=delivery_data["batter"],
                    bowler=delivery_data["bowler"],
                    non_striker=delivery_data["non_striker"],
                    runs_batter=runs["batter"],
                    runs_extras=runs["extras"],
                    extras_type=next(iter(extras.keys()), None) if extras else None,
                    is_legal_ball=is_legal_ball,
                    is_wicket=len(wickets) > 0,
                    dismissed_batter=wickets[0]["player_out"] if wickets else None,
                    wicket_type=wickets[0]["kind"] if wickets else None,
                    phase=determine_phase(over_number),
                )

                deliveries.append(delivery)

    return deliveries
