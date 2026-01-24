-- Players
CREATE TABLE IF NOT EXISTS players (
    player_name TEXT PRIMARY KEY
);

-- Matches
CREATE TABLE IF NOT EXISTS matches (
    match_id INTEGER PRIMARY KEY,
    season TEXT NOT NULL,
    venue TEXT NOT NULL
);

-- Deliveries (ball-by-ball event store)
CREATE TABLE IF NOT EXISTS deliveries (
    id SERIAL PRIMARY KEY,

    match_id INTEGER NOT NULL REFERENCES matches(match_id),
    season TEXT NOT NULL,
    venue TEXT NOT NULL,

    innings INTEGER NOT NULL,
    over INTEGER NOT NULL,
    ball INTEGER NOT NULL,          -- legal ball number
    delivery_seq INTEGER NOT NULL,  -- true event sequence

    batting_team TEXT NOT NULL,

    batter TEXT NOT NULL REFERENCES players(player_name),
    bowler TEXT NOT NULL REFERENCES players(player_name),
    non_striker TEXT NOT NULL REFERENCES players(player_name),

    runs_batter INTEGER NOT NULL,
    runs_extras INTEGER NOT NULL,
    extras_type TEXT,

    is_legal_ball BOOLEAN NOT NULL,

    is_wicket BOOLEAN NOT NULL,
    dismissed_batter TEXT,
    wicket_type TEXT,

    phase TEXT NOT NULL
);

-- Correct uniqueness (event-level, not ball-level)
CREATE UNIQUE INDEX IF NOT EXISTS ux_deliveries_unique_event
ON deliveries (match_id, innings, delivery_seq);
