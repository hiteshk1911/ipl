from pathlib import Path
from ipl_analytics.ingestion.ingest_season import ingest_season

ingest_season(
 folder_path=Path("ipl_analytics/data/ipl_json"),
 season="2011"
)
