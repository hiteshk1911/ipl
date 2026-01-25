1) Core Batter vs Bowler Analysis Query

SELECT
    batter,
    bowler,

    COUNT(*) FILTER (WHERE is_legal_ball) AS balls_faced,
    SUM(runs_batter)                      AS runs,

    COUNT(*) FILTER (
        WHERE is_wicket = true
          AND dismissed_batter = batter
    )                                     AS outs,

    ROUND(
        SUM(runs_batter)::numeric
        / NULLIF(COUNT(*) FILTER (WHERE is_legal_ball), 0)
        * 100,
        2
    )                                     AS strike_rate,

    ROUND(
        SUM(runs_batter)::numeric
        / NULLIF(
            COUNT(*) FILTER (
                WHERE is_wicket = true
                  AND dismissed_batter = batter
            ),
            0
        ),
        2
    )                                     AS average

FROM deliveries
GROUP BY batter, bowler
HAVING COUNT(*) FILTER (WHERE is_legal_ball) >= 12
ORDER BY outs DESC, balls_faced DESC;


-- 2) EXTENSION: Batter vs Bowler Analysis with Extras Breakdown
SELECT
    batter,
    bowler,

    COUNT(*) FILTER (WHERE is_legal_ball) AS balls_faced,
    SUM(runs_batter)                      AS runs,

    COUNT(*) FILTER (
        WHERE is_wicket = true
          AND dismissed_batter = batter
    )                                     AS outs,

    SUM(runs_extras)                      AS extras,
    SUM(runs_extras) FILTER (WHERE extras_type = 'wide') AS wides,
    SUM(runs_extras) FILTER (WHERE extras_type = 'no_ball') AS no_balls,
    SUM(runs_extras) FILTER (WHERE extras_type = 'bye') AS byes,
    SUM(runs_extras) FILTER (WHERE extras_type = 'leg_bye') AS leg_byes,

    ROUND(
        SUM(runs_batter)::numeric
        / NULLIF(COUNT(*) FILTER (WHERE is_legal_ball), 0)
        * 100,
        2
    )                                     AS strike_rate,

    ROUND(
        SUM(runs_batter)::numeric
        / NULLIF(
            COUNT(*) FILTER (
                WHERE is_wicket = true
                  AND dismissed_batter = batter
            ),
            0
        ),
        2
    )                                     AS average
FROM deliveries
GROUP BY batter, bowler
HAVING COUNT(*) FILTER (WHERE is_legal_ball) >= 12
ORDER BY outs DESC, balls_faced DESC;

-- 3) EXTENSION: Batter vs Bowler Analysis with Phase Breakdown
SELECT
    batter,
    bowler,
    phase,

    COUNT(*) FILTER (WHERE is_legal_ball) AS balls_faced,
    SUM(runs_batter)                      AS runs,

    COUNT(*) FILTER (
        WHERE is_wicket = true
          AND dismissed_batter = batter
    )                                     AS outs,

    ROUND(
        SUM(runs_batter)::numeric
        / NULLIF(COUNT(*) FILTER (WHERE is_legal_ball), 0)
        * 100,
        2
    )                                     AS strike_rate,

    ROUND(
        SUM(runs_batter)::numeric
        / NULLIF(
            COUNT(*) FILTER (
                WHERE is_wicket = true
                  AND dismissed_batter = batter
            ),
            0
        ),
        2
    )                                     AS average
FROM deliveries
GROUP BY batter, bowler, phase
HAVING COUNT(*) FILTER (WHERE is_legal_ball) >= 12
ORDER BY outs DESC, balls_faced DESC;
-- Note: To get overall stats, aggregate the results from this query.

4) Phase Aware Matchups
SELECT
    batter,
    bowler,
    phase,

    COUNT(*) FILTER (WHERE is_legal_ball) AS balls,
    SUM(runs_batter)                      AS runs,

    COUNT(*) FILTER (
        WHERE is_wicket = true
          AND dismissed_batter = batter
    )                                     AS outs

FROM deliveries
GROUP BY batter, bowler, phase
HAVING COUNT(*) FILTER (WHERE is_legal_ball) >= 8
ORDER BY batter, bowler, phase;

5) Top N Batter vs Bowler Matchups
WITH matchup_stats AS (
    SELECT
        batter,
        bowler,

        COUNT(*) FILTER (WHERE is_legal_ball) AS balls_faced,
        SUM(runs_batter)                      AS runs,

        COUNT(*) FILTER (
            WHERE is_wicket = true
              AND dismissed_batter = batter
        )                                     AS outs

    FROM deliveries
    GROUP BY batter, bowler
    HAVING COUNT(*) FILTER (WHERE is_legal_ball) >= 12
)
SELECT
    batter,
    bowler,
    balls_faced,
    runs,
    outs
FROM matchup_stats
ORDER BY outs DESC, balls_faced DESC
LIMIT 20;
-- Note: Adjust LIMIT value as needed for top N matchups.

6) Batter Dismissal Breakdown
SELECT
    batter,
    wicket_type,
    COUNT(*) AS dismissals
FROM deliveries
WHERE is_wicket = true
  AND dismissed_batter = batter
GROUP BY batter, wicket_type
ORDER BY batter, dismissals DESC;

7) Dismissal Mix per Batter
WITH batter_outs AS (
    SELECT
        batter,
        wicket_type,
        COUNT(*) AS outs
    FROM deliveries
    WHERE is_wicket = true
      AND dismissed_batter = batter
    GROUP BY batter, wicket_type
),
total_outs AS (
    SELECT
        batter,
        SUM(outs) AS total_outs
    FROM batter_outs
    GROUP BY batter
)
SELECT
    b.batter,
    b.wicket_type,
    b.outs,
    ROUND(b.outs::numeric / t.total_outs * 100, 1) AS pct_of_dismissals
FROM batter_outs b
JOIN total_outs t USING (batter)
ORDER BY batter, pct_of_dismissals DESC;

8) Weakness Identification Of Batters Against Bowling Types
SELECT
    batter,
    CASE
        WHEN bowler ILIKE '%Singh%'
          OR bowler ILIKE '%Sharma%'
          OR bowler ILIKE '%Kumar%'
          THEN 'pace'
        ELSE 'spin'
    END AS bowling_type,
    COUNT(*) AS outs
FROM deliveries
WHERE is_wicket = true
  AND dismissed_batter = batter
GROUP BY batter, bowling_type
ORDER BY batter, outs DESC;

9) Phase Wise Dismissal Patterns
SELECT
    batter,
    phase,
    wicket_type,
    COUNT(*) AS outs
FROM deliveries
WHERE is_wicket = true
  AND dismissed_batter = batter
GROUP BY batter, phase, wicket_type
ORDER BY batter, phase, outs DESC;

10) Venue Specific Batter vs Bowler Analysis
SELECT
    batter,
    bowler,
    venue,

    COUNT(*) FILTER (WHERE is_legal_ball) AS balls_faced,
    SUM(runs_batter)                      AS runs,

    COUNT(*) FILTER (
        WHERE is_wicket = true
          AND dismissed_batter = batter
    )                                     AS outs
FROM deliveries
GROUP BY batter, bowler, venue
HAVING COUNT(*) FILTER (WHERE is_legal_ball) >= 12
ORDER BY outs DESC, balls_faced DESC;
-- Note: This query helps identify venue-specific batter vs bowler matchups.

11) Summary
SELECT
    batter,
    COUNT(DISTINCT match_id)                         AS matches,
    COUNT(*) FILTER (WHERE is_legal_ball)            AS balls_faced,
    SUM(runs_batter)                                 AS runs,
    COUNT(*) FILTER (
        WHERE is_wicket = true
          AND dismissed_batter = batter
    )                                                 AS outs,
    ROUND(
        SUM(runs_batter)::numeric
        / NULLIF(COUNT(*) FILTER (WHERE is_legal_ball), 0)
        * 100, 2
    )                                                 AS strike_rate,
    ROUND(
        SUM(runs_batter)::numeric
        / NULLIF(
            COUNT(*) FILTER (
                WHERE is_wicket = true
                AND dismissed_batter = batter
            ), 0
        ), 2
    )                                                 AS average
FROM deliveries
WHERE batter = :batter_name
GROUP BY batter;

12) Scoring Pattern
SELECT
    runs_batter,
    COUNT(*) AS times
FROM deliveries
WHERE batter = :batter_name
  AND is_legal_ball = true
GROUP BY runs_batter
ORDER BY runs_batter;

13) Phase wise performance
SELECT
    phase,
    COUNT(*) FILTER (WHERE is_legal_ball) AS balls,
    SUM(runs_batter)                      AS runs,
    COUNT(*) FILTER (
        WHERE is_wicket = true
          AND dismissed_batter = batter
    )                                     AS outs,
    ROUND(
        SUM(runs_batter)::numeric
        / NULLIF(COUNT(*) FILTER (WHERE is_legal_ball), 0)
        * 100, 2
    )                                     AS strike_rate
FROM deliveries
WHERE batter = :batter_name
GROUP BY phase
ORDER BY phase;

14) Who troubles him ?
SELECT
    bowler,
    COUNT(*) FILTER (WHERE is_legal_ball) AS balls,
    SUM(runs_batter)                      AS runs,
    COUNT(*) FILTER (
        WHERE is_wicket = true
        AND dismissed_batter = batter
    )                                     AS outs,
    ROUND(
        SUM(runs_batter)::numeric
        / NULLIF(COUNT(*) FILTER (WHERE is_legal_ball), 0)
        * 100, 2
    )                                     AS strike_rate
FROM deliveries
WHERE batter = :batter_name
GROUP BY bowler
HAVING COUNT(*) FILTER (WHERE is_legal_ball) >= 12
ORDER BY outs DESC, balls DESC;

15) Performance over seasons
SELECT
    season,
    COUNT(*) FILTER (WHERE is_legal_ball) AS balls,
    SUM(runs_batter)                      AS runs,
    COUNT(*) FILTER (
        WHERE is_wicket = true
          AND dismissed_batter = batter
    )                                     AS outs,
    ROUND(
        SUM(runs_batter)::numeric
        / NULLIF(COUNT(*) FILTER (WHERE is_legal_ball), 0)
        * 100, 2
    )                                     AS strike_rate
FROM deliveries
WHERE batter = :batter_name
GROUP BY season
ORDER BY season;
-- Note: Replace :batter_name with the actual batter's name when executing the queries.

15) Venue wise performance
SELECT
    venue,
    COUNT(*) FILTER (WHERE is_legal_ball) AS balls,
    SUM(runs_batter)                      AS runs,
    COUNT(*) FILTER (
        WHERE is_wicket = true
        AND dismissed_batter = batter
    )                                     AS outs,
    ROUND(
        SUM(runs_batter)::numeric
        / NULLIF(COUNT(*) FILTER (WHERE is_legal_ball), 0)
        * 100, 2
    )                                     AS strike_rate
FROM deliveries
WHERE batter = :batter_name
GROUP BY venue
ORDER BY balls DESC;

16) Identify Batter’s Recent Matches (Core Building Block)
WITH batter_matches AS (
    SELECT
        batter,
        match_id,
        MAX(delivery_seq) AS last_delivery_in_match
    FROM deliveries
    WHERE batter = :batter_name
    GROUP BY batter, match_id
)
SELECT
    batter,
    match_id
FROM batter_matches
ORDER BY match_id DESC;


17) Recent Form – Last 5 Matches (Key Insight)
WITH recent_matches AS (
    SELECT match_id
    FROM (
        SELECT
            match_id,
            ROW_NUMBER() OVER (ORDER BY match_id DESC) AS rn
        FROM (
            SELECT DISTINCT match_id
            FROM deliveries
            WHERE batter = 'MS Dhoni'
        ) m
    ) ranked
    WHERE rn <= 5
)
SELECT
    batter,
    COUNT(DISTINCT match_id)                         AS matches,
    COUNT(*) FILTER (WHERE is_legal_ball)            AS balls,
    SUM(runs_batter)                                 AS runs,
    COUNT(*) FILTER (
        WHERE is_wicket = true
          AND dismissed_batter = batter
    )                                                 AS outs,
    ROUND(
        SUM(runs_batter)::numeric
        / NULLIF(COUNT(*) FILTER (WHERE is_legal_ball), 0)
        * 100, 2
    )                                                 AS strike_rate,
    ROUND(
        SUM(runs_batter)::numeric
        / NULLIF(
            COUNT(*) FILTER (
                WHERE is_wicket = true
                AND dismissed_batter = batter
            ), 0
        ), 2
    )                                                 AS average
FROM deliveries
WHERE batter = 'MS Dhoni'
  AND match_id IN (SELECT match_id FROM recent_matches)
GROUP BY batter;


18) Phase-Aware Recent Form (Elite)
WITH recent_matches AS (
    SELECT match_id
    FROM (
        SELECT
            match_id,
            ROW_NUMBER() OVER (ORDER BY match_id DESC) AS rn
        FROM (
            SELECT DISTINCT match_id
            FROM deliveries
            WHERE batter = 'V Kohli'
        ) m
    ) ranked
    WHERE rn <= 5
)
SELECT
    phase,
    COUNT(*) FILTER (WHERE is_legal_ball) AS balls,
    SUM(runs_batter)                      AS runs,
    COUNT(*) FILTER (
        WHERE is_wicket = true
          AND dismissed_batter = batter
    )                                     AS outs,
    ROUND(
        SUM(runs_batter)::numeric
        / NULLIF(COUNT(*) FILTER (WHERE is_legal_ball), 0)
        * 100, 2
    )                                     AS strike_rate
FROM deliveries
WHERE batter = 'V Kohli'
  AND match_id IN (SELECT match_id FROM recent_matches)
GROUP BY phase
ORDER BY phase;

