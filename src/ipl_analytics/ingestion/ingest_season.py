from pathlib import Path
from typing import Optional

from ipl_analytics.ingestion.ingest_match import ingest_match
from ipl_analytics.db.insert_players import insert_players
from ipl_analytics.db.insert_match import insert_match
from ipl_analytics.db.insert_deliveries import insert_deliveries


def ingest_season(
    folder_path: Path,
    season: str,
) -> None:
    json_files = sorted(folder_path.glob("*.json"))

    if not json_files:
        raise ValueError(f"No JSON files found in {folder_path}")

    print(f"📦 Found {len(json_files)} total match files")
    print(f"🎯 Ingesting only season: {season}")

    ingested = 0

    for json_file in json_files:
        deliveries = ingest_match(json_file)

        if not deliveries:
            continue

        if deliveries[0].season != season:
            continue

        insert_players(deliveries)
        insert_match(deliveries)
        insert_deliveries(deliveries)

        ingested += 1
        print(f"✅ Ingested {json_file.name}")

    print(f"\n🏁 Completed ingestion for season {season}")
    print(f"📊 Matches ingested: {ingested}")
