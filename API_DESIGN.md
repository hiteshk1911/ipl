# IPL Analytics API Design

## Overview
RESTful API to connect React Native frontend to PostgreSQL backend. All endpoints return JSON.

**Base URL**: `http://localhost:8000/api/v1` (development)

---

## 1. Player Management APIs

### 1.1 List All Players
**GET** `/players`

**Query Parameters:**
- `search` (optional): Filter players by name (partial match)
- `limit` (optional, default: 100): Max results
- `offset` (optional, default: 0): Pagination offset

**Response:**
```json
{
  "players": [
    "MS Dhoni",
    "V Kohli",
    "SC Ganguly"
  ],
  "total": 160,
  "limit": 100,
  "offset": 0
}
```

**SQL Backend:**
```sql
SELECT player_name FROM players
WHERE player_name ILIKE '%search%'
ORDER BY player_name
LIMIT limit OFFSET offset;
```

---

### 1.2 Search Players (Autocomplete)
**GET** `/players/search`

**Query Parameters:**
- `q` (required): Search query (min 2 chars)
- `limit` (optional, default: 10): Max results

**Response:**
```json
{
  "players": [
    {"name": "V Kohli", "matches": 237},
    {"name": "Virat Kohli", "matches": 15}
  ]
}
```

---

## 2. Batter Profile APIs

### 2.1 Get Batter Career Profile
**GET** `/batters/{batter_name}/profile`

**Path Parameters:**
- `batter_name`: Player name (URL encoded, e.g., "V%20Kohli")

**Response:**
```json
{
  "batter": "V Kohli",
  "career": {
    "matches": 237,
    "runs": 7263,
    "balls": 5587,
    "outs": 195,
    "average": 37.25,
    "strike_rate": 130.02,
    "highest_score": 113
  },
  "phase_performance": {
    "powerplay": {
      "runs": 1200,
      "balls": 800,
      "strike_rate": 150.0,
      "outs": 25
    },
    "middle": {
      "runs": 3500,
      "balls": 2800,
      "strike_rate": 125.0,
      "outs": 100
    },
    "death": {
      "runs": 2563,
      "balls": 1987,
      "strike_rate": 129.0,
      "outs": 70
    }
  },
  "dismissals": {
    "caught": 120,
    "bowled": 45,
    "lbw": 20,
    "stumped": 10
  }
}
```

**SQL Backend:** Uses `analytics.batter_profile` view

---

### 2.2 Get Batter Season Profile
**GET** `/batters/{batter_name}/seasons`

**Query Parameters:**
- `season` (optional): Filter specific season (e.g., "2011")

**Response:**
```json
{
  "batter": "V Kohli",
  "seasons": [
    {
      "season": "2007/08",
      "matches": 13,
      "runs": 165,
      "balls": 120,
      "outs": 8,
      "average": 20.63,
      "strike_rate": 137.5,
      "phase_performance": {
        "powerplay": {"runs": 45, "balls": 30, "strike_rate": 150.0},
        "middle": {"runs": 80, "balls": 60, "strike_rate": 133.3},
        "death": {"runs": 40, "balls": 30, "strike_rate": 133.3}
      }
    },
    {
      "season": "2009",
      "matches": 16,
      "runs": 246,
      "balls": 180,
      "outs": 10,
      "average": 24.6,
      "strike_rate": 136.7
    }
  ]
}
```

**SQL Backend:** Uses `analytics.batter_profile_season` view

---

### 2.3 Get Batter Recent Form
**GET** `/batters/{batter_name}/recent-form`

**Query Parameters:**
- `matches` (optional, default: 5): Number of recent matches
- `season` (optional): Filter by season

**Response:**
```json
{
  "batter": "V Kohli",
  "recent_matches": [
    {
      "match_id": 335982,
      "season": "2011",
      "venue": "M. Chinnaswamy Stadium",
      "runs": 92,
      "balls": 59,
      "dismissed": false,
      "strike_rate": 155.93,
      "date": "2011-04-15"
    },
    {
      "match_id": 335980,
      "season": "2011",
      "venue": "Wankhede Stadium",
      "runs": 45,
      "balls": 32,
      "dismissed": true,
      "strike_rate": 140.63,
      "date": "2011-04-12"
    }
  ],
  "summary": {
    "matches": 5,
    "runs": 320,
    "balls": 240,
    "outs": 2,
    "average": 160.0,
    "strike_rate": 133.33
  }
}
```

**SQL Backend:** Query #17 from analytics.sql (Recent Form)

---

### 2.4 Get Batter Scoring Pattern
**GET** `/batters/{batter_name}/scoring-pattern`

**Response:**
```json
{
  "batter": "V Kohli",
  "pattern": {
    "0": 1200,
    "1": 800,
    "2": 600,
    "3": 200,
    "4": 500,
    "6": 300
  },
  "boundary_percentage": 35.5,
  "dot_ball_percentage": 21.5
}
```

**SQL Backend:** Query #12 from analytics.sql

---

### 2.5 Get Batter Weaknesses
**GET** `/batters/{batter_name}/weaknesses`

**Response:**
```json
{
  "batter": "V Kohli",
  "bowler_matchups": [
    {
      "bowler": "Ravindra Jadeja",
      "runs": 89,
      "balls": 112,
      "dismissals": 5,
      "strike_rate": 79.5,
      "average": 17.8,
      "advantage": "bowler"
    }
  ],
  "dismissal_patterns": {
    "by_type": {
      "caught": 120,
      "bowled": 45,
      "lbw": 20
    },
    "by_phase": {
      "powerplay": {"caught": 30, "bowled": 10},
      "middle": {"caught": 60, "lbw": 15},
      "death": {"caught": 30, "bowled": 5}
    }
  },
  "bowling_type_weakness": {
    "pace": {"dismissals": 100, "average": 40.0},
    "spin": {"dismissals": 95, "average": 28.5}
  }
}
```

**SQL Backend:** 
- Query #14 ("Who troubles him?")
- Query #6 (Dismissal breakdown)
- Query #8 (Bowling type weakness)
- Query #9 (Phase-wise dismissals)

---

## 3. Matchup Analysis APIs

### 3.1 Get Batter vs Bowler Matchup
**GET** `/matchups/batter/{batter_name}/bowler/{bowler_name}`

**Query Parameters:**
- `season` (optional): Filter by season
- `venue` (optional): Filter by venue
- `include_phases` (optional, default: true): Include phase breakdown

**Response:**
```json
{
  "batter": "V Kohli",
  "bowler": "Jasprit Bumrah",
  "overall": {
    "runs": 156,
    "balls": 89,
    "dismissals": 3,
    "strike_rate": 175.3,
    "average": 52.0,
    "confidence_score": 72
  },
  "phase_breakdown": {
    "powerplay": {
      "runs": 45,
      "balls": 30,
      "dismissals": 1,
      "strike_rate": 150.0
    },
    "middle": {
      "runs": 78,
      "balls": 45,
      "dismissals": 1,
      "strike_rate": 173.3
    },
    "death": {
      "runs": 33,
      "balls": 14,
      "dismissals": 1,
      "strike_rate": 235.7
    }
  },
  "recent_encounters": [
    {
      "match_id": 335982,
      "season": "2011",
      "runs": 25,
      "balls": 18,
      "dismissed": false
    }
  ]
}
```

**SQL Backend:** 
- Query #1 (Core Batter vs Bowler)
- Query #3 (Phase breakdown)

**Confidence Score Calculation:**
- Based on sample size (balls faced)
- Recent form weight
- Phase-specific performance

---

### 3.2 Get Batter's Top Matchups
**GET** `/matchups/batter/{batter_name}/top-bowlers`

**Query Parameters:**
- `limit` (optional, default: 10): Number of top matchups
- `advantage` (optional): Filter by "batter" or "bowler"
- `min_balls` (optional, default: 12): Minimum balls faced

**Response:**
```json
{
  "batter": "V Kohli",
  "matchups": [
    {
      "bowler": "Jasprit Bumrah",
      "runs": 156,
      "balls": 89,
      "dismissals": 3,
      "strike_rate": 175.3,
      "average": 52.0,
      "advantage": "batter"
    },
    {
      "bowler": "Ravindra Jadeja",
      "runs": 89,
      "balls": 112,
      "dismissals": 5,
      "strike_rate": 79.5,
      "average": 17.8,
      "advantage": "bowler"
    }
  ]
}
```

**SQL Backend:** Query #5 (Top N Matchups)

---

## 4. Match Context APIs

### 4.1 Get Match Information
**GET** `/matches/{match_id}`

**Response:**
```json
{
  "match_id": 335982,
  "season": "2011",
  "venue": "M. Chinnaswamy Stadium, Bangalore",
  "teams": {
    "team1": "Royal Challengers Bangalore",
    "team2": "Chennai Super Kings"
  },
  "date": "2011-04-15",
  "toss": {
    "won_by": "CSK",
    "decision": "field"
  }
}
```

**SQL Backend:** `SELECT * FROM matches WHERE match_id = ?`

---

### 4.2 Get Venue Statistics
**GET** `/venues/{venue_name}/stats`

**Response:**
```json
{
  "venue": "M. Chinnaswamy Stadium, Bangalore",
  "matches": 45,
  "average_first_innings": 185,
  "average_second_innings": 172,
  "highest_total": 263,
  "lowest_total": 49,
  "pitch_type": "batting_friendly",
  "dew_factor": "moderate"
}
```

**SQL Backend:** Aggregation from `deliveries` table grouped by venue

---

### 4.3 Get Team Head-to-Head
**GET** `/teams/{team1}/vs/{team2}/head-to-head`

**Response:**
```json
{
  "team1": "RCB",
  "team2": "CSK",
  "total_matches": 32,
  "team1_wins": 10,
  "team2_wins": 20,
  "no_result": 2,
  "recent_matches": [
    {
      "match_id": 335982,
      "season": "2011",
      "winner": "CSK",
      "date": "2011-04-15"
    }
  ]
}
```

**Note:** Requires match results data (may need to extend schema)

---

## 5. Analytics & Insights APIs

### 5.1 Get Detailed Insights for Batter
**GET** `/batters/{batter_name}/insights`

**Response:**
```json
{
  "batter": "V Kohli",
  "key_insights": [
    {
      "title": "Powerplay Dominance",
      "description": "Batter has scored 45% of runs in powerplay overs with a strike rate of 180+",
      "impact": "high",
      "category": "batting",
      "data": {
        "powerplay_runs": 1200,
        "total_runs": 7263,
        "percentage": 16.5
      }
    },
    {
      "title": "Weakness Against Spin",
      "description": "Dismissed 8 times by spinners in last 15 matches, average drops to 28.5",
      "impact": "critical",
      "category": "batting",
      "data": {
        "spin_dismissals": 95,
        "spin_average": 28.5,
        "pace_average": 40.0
      }
    }
  ],
  "recommendations": [
    "Avoid exposing batter to spin in middle overs",
    "Utilize powerplay strength for aggressive starts"
  ]
}
```

**SQL Backend:** Aggregates multiple queries to generate insights

---

### 5.2 Get Phase Analysis
**GET** `/batters/{batter_name}/phase-analysis`

**Response:**
```json
{
  "batter": "V Kohli",
  "phases": {
    "powerplay": {
      "runs": 1200,
      "balls": 800,
      "strike_rate": 150.0,
      "outs": 25,
      "average": 48.0,
      "risk_level": "low"
    },
    "middle": {
      "runs": 3500,
      "balls": 2800,
      "strike_rate": 125.0,
      "outs": 100,
      "average": 35.0,
      "risk_level": "medium"
    },
    "death": {
      "runs": 2563,
      "balls": 1987,
      "strike_rate": 129.0,
      "outs": 70,
      "average": 36.6,
      "risk_level": "high"
    }
  }
}
```

**SQL Backend:** Query #13 (Phase-wise performance)

---

## 6. Search & Discovery APIs

### 6.1 Search Matchups
**GET** `/matchups/search`

**Query Parameters:**
- `batter` (optional): Batter name
- `bowler` (optional): Bowler name
- `min_balls` (optional, default: 12): Minimum sample size
- `limit` (optional, default: 20)

**Response:**
```json
{
  "matchups": [
    {
      "batter": "V Kohli",
      "bowler": "Jasprit Bumrah",
      "runs": 156,
      "balls": 89,
      "dismissals": 3,
      "strike_rate": 175.3
    }
  ],
  "total": 150
}
```

---

## 7. Utility APIs

### 7.1 Health Check
**GET** `/health`

**Response:**
```json
{
  "status": "healthy",
  "database": "connected",
  "version": "1.0.0"
}
```

---

### 7.2 Get Available Seasons
**GET** `/seasons`

**Response:**
```json
{
  "seasons": [
    "2007/08",
    "2009",
    "2011"
  ]
}
```

**SQL Backend:** `SELECT DISTINCT season FROM matches ORDER BY season`

---

### 7.3 Get Available Venues
**GET** `/venues`

**Response:**
```json
{
  "venues": [
    "M. Chinnaswamy Stadium, Bangalore",
    "Wankhede Stadium, Mumbai"
  ]
}
```

**SQL Backend:** `SELECT DISTINCT venue FROM matches ORDER BY venue`

---

## Error Responses

All endpoints return standard error format:

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Batter 'XYZ' not found",
    "details": {}
  }
}
```

**HTTP Status Codes:**
- `200`: Success
- `400`: Bad Request (invalid parameters)
- `404`: Not Found (player/match not found)
- `500`: Internal Server Error

---

## Implementation Priority

### Phase 1 (MVP - Core Functionality)
1. ✅ `/players` - List players
2. ✅ `/batters/{name}/profile` - Batter profile
3. ✅ `/matchups/batter/{batter}/bowler/{bowler}` - Matchup analysis
4. ✅ `/batters/{name}/recent-form` - Recent form
5. ✅ `/health` - Health check

### Phase 2 (Enhanced Analytics)
6. `/batters/{name}/seasons` - Season breakdown
7. `/batters/{name}/weaknesses` - Weakness analysis
8. `/batters/{name}/insights` - Detailed insights
9. `/matchups/batter/{name}/top-bowlers` - Top matchups

### Phase 3 (Match Context)
10. `/matches/{id}` - Match info
11. `/venues/{name}/stats` - Venue stats
12. `/seasons` - Available seasons
13. `/venues` - Available venues

---

## Technology Stack Recommendation

**Backend Framework:** FastAPI (Python)
- Async support
- Automatic OpenAPI docs
- Type validation with Pydantic
- Easy PostgreSQL integration

**Database:** PostgreSQL (already in use)
- Use `psycopg2` or `asyncpg` for async queries

**API Documentation:** 
- Auto-generated OpenAPI/Swagger docs
- Available at `/docs` endpoint

---

## Notes

1. **Player Name Normalization**: Handle name variations (e.g., "V Kohli" vs "Virat Kohli")
2. **Caching**: Consider Redis for frequently accessed data (batter profiles, matchups)
3. **Pagination**: All list endpoints should support pagination
4. **Rate Limiting**: Implement rate limiting for production
5. **Authentication**: Add API keys/auth if needed for production
