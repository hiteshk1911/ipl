# PRD vs Implementation Gap Analysis
## Cricket Matchup Intelligence MVP - Detailed Comparison

**Date:** January 25, 2026  
**Document Purpose:** Compare PRD requirements with current implementation status

---

## Executive Summary

The current implementation provides a **solid data foundation** with ingestion pipeline and basic analytics queries, but **lacks the structured MVP features** defined in the PRD. The project has the necessary data model and SQL capabilities, but needs feature-specific views/functions to match PRD requirements.

**Overall Status:** 🟡 **Partial Implementation** (Foundation Ready, Features Missing)

---

## PRD Requirements vs Implementation Status

### 1. Matchup Confidence Score (Historical)
**PRD Requirement:**
- High/Medium/Low indicator
- Based on: Historical strike rate, Balls per dismissal, Relative performance vs IPL average
- UX: Displayed prominently at top of screen

**Current Implementation:** ❌ **NOT IMPLEMENTED**
- **Gap:** No confidence score calculation or classification logic
- **Available Data:** Batter vs bowler stats exist (Query #1, #3 in analytics.sql)
- **What's Needed:**
  - Function/view to calculate confidence score
  - Logic to compare vs IPL average
  - Classification into High/Medium/Low categories

**Implementation Priority:** 🔴 **HIGH** (Core MVP feature)

---

### 2. Batter vs Bowler Historical Snapshot
**PRD Requirement:**
- Single-line summary: Balls faced, runs scored, strike rate, dismissals
- Aggregated from all IPL ball-by-ball records
- UX: Below confidence score

**Current Implementation:** ✅ **PARTIALLY IMPLEMENTED**
- **Status:** Query #1 in `analytics.sql` provides all required metrics
- **Gap:** Not structured as a reusable view/function for MVP
- **Available:**
  ```sql
  -- Query #1 provides: balls_faced, runs, outs, strike_rate, average
  ```
- **What's Needed:**
  - Create `analytics.batter_bowler_snapshot` view
  - Format as single-line summary ready for API/UI

**Implementation Priority:** 🟡 **MEDIUM** (Data exists, needs structure)

---

### 3. Dismissal Timing Risk (Historical)
**PRD Requirement:**
- Identifies overs when batter dismissed most often by specific bowler
- Grouped into over ranges (1–2, 3–4, 5–6, etc.)
- UX: Short caution-style insight

**Current Implementation:** ❌ **NOT IMPLEMENTED**
- **Gap:** No dismissal timing analysis by over ranges
- **Available Data:** `over` field exists in deliveries table
- **What's Needed:**
  - Query to group dismissals by over ranges
  - Identify high-risk over ranges for specific batter-bowler pairs
  - Format as insight text

**Implementation Priority:** 🟡 **MEDIUM**

---

### 4. Phase Advantage Breakdown
**PRD Requirement:**
- Performance comparison: Powerplay, Middle Overs, Death Overs
- Strike rate and dismissal rate per phase
- UX: Visual meter indicating relative strength

**Current Implementation:** ✅ **MOSTLY IMPLEMENTED**
- **Status:** Query #3 in `analytics.sql` provides phase-wise breakdown
- **Available:**
  ```sql
  -- Query #3: batter, bowler, phase, balls_faced, runs, outs, strike_rate, average
  ```
- **Gap:** Not aggregated/comparison view for MVP
- **What's Needed:**
  - Create `analytics.phase_advantage` view
  - Calculate relative strength indicators
  - Format for visual meter display

**Implementation Priority:** 🟡 **MEDIUM** (Data exists, needs aggregation)

---

### 5. Batting Style Profile (IPL – Historical)
**PRD Requirement:**
- Classification: Attacker, Rotator, or Anchor
- Based on: Boundary percentage, Singles percentage, Dot ball percentage
- UX: Human-readable label

**Current Implementation:** ❌ **NOT IMPLEMENTED**
- **Gap:** No batting style classification logic
- **Available Data:** `runs_batter` field can identify boundaries (4, 6), singles (1), dots (0)
- **What's Needed:**
  - Calculate boundary%, singles%, dot ball% per batter
  - Classification logic:
    - Attacker: High boundary%, low dot%
    - Rotator: Balanced singles%, moderate boundary%
    - Anchor: Low boundary%, high singles%, high dot%
  - Create `analytics.batting_style_profile` view

**Implementation Priority:** 🟡 **MEDIUM**

---

### 6. Matchup Control Index (Historical)
**PRD Requirement:**
- Shows bowler control: Strong / Neutral / Weak
- Based on: Dot ball percentage, Balls per boundary conceded, Balls per dismissal
- UX: Strong/Neutral/Weak indicator

**Current Implementation:** ❌ **NOT IMPLEMENTED**
- **Gap:** No control index calculation
- **Available Data:** All required metrics can be derived from deliveries
- **What's Needed:**
  - Calculate dot ball% for batter-bowler matchup
  - Calculate balls per boundary (boundary = runs_batter >= 4)
  - Calculate balls per dismissal
  - Classification logic into Strong/Neutral/Weak
  - Create `analytics.matchup_control_index` view

**Implementation Priority:** 🟡 **MEDIUM**

---

### 7. Recent IPL Form Indicator (Last N Innings)
**PRD Requirement:**
- Visual summary of last N IPL innings (e.g., 5 or 10)
- Metrics: Runs and strike rate
- UX: Color-based heat strip

**Current Implementation:** ✅ **PARTIALLY IMPLEMENTED**
- **Status:** Query #17 in `analytics.sql` provides last 5 matches form
- **Available:**
  ```sql
  -- Query #17: Recent form for last 5 matches with runs, strike_rate, average
  ```
- **Gap:** 
  - Hardcoded to 5 matches (needs parameterization)
  - Not structured as view/function
  - No heat strip formatting logic
- **What's Needed:**
  - Create `analytics.recent_form` function/view (parameterized for N)
  - Format for heat strip visualization
  - Include per-innings breakdown

**Implementation Priority:** 🟡 **MEDIUM** (Core logic exists)

---

### 8. Powerplay Performance Profile (Historical)
**PRD Requirement:**
- Batter behavior during Powerplay overs (1–6)
- Metrics: Strike rate, boundary percentage, dismissal frequency
- UX: Compact card (displayed when match in Powerplay)

**Current Implementation:** ✅ **PARTIALLY IMPLEMENTED**
- **Status:** 
  - `analytics.batter_profile` view has `pp_runs` and `pp_balls`
  - Query #13 provides phase-wise performance
- **Gap:**
  - Missing boundary% calculation for powerplay
  - Missing dismissal frequency
  - Not structured as powerplay-specific profile
- **What's Needed:**
  - Enhance or create `analytics.powerplay_profile` view
  - Add boundary% and dismissal frequency metrics
  - Format as compact card data

**Implementation Priority:** 🟡 **MEDIUM**

---

### 9. Venue Comfort Indicator (Historical)
**PRD Requirement:**
- Binary: Comfortable / Not Comfortable
- Based on: Venue-specific average and strike rate vs overall IPL performance
- UX: Binary indicator

**Current Implementation:** ✅ **PARTIALLY IMPLEMENTED**
- **Status:** 
  - Query #15 provides venue-wise performance
  - Query #10 provides venue-specific batter vs bowler analysis
- **Gap:**
  - No comparison vs overall performance
  - No binary classification logic
  - Not structured as comfort indicator
- **What's Needed:**
  - Create `analytics.venue_comfort` view
  - Compare venue stats vs overall IPL stats
  - Classification: Comfortable if venue avg/SR > overall avg/SR
  - Format as binary indicator

**Implementation Priority:** 🟡 **MEDIUM**

---

### 10. Historical Outcome Pattern
**PRD Requirement:**
- Shows what usually happened in similar historical situations
- Metrics: Average balls faced and runs scored in past matchups under similar phases
- UX: Highlighted insight text (avoid prediction language)

**Current Implementation:** ❌ **NOT IMPLEMENTED**
- **Gap:** No outcome pattern analysis
- **Available Data:** Phase, batter-bowler matchups exist
- **What's Needed:**
  - Create `analytics.historical_outcome_pattern` view
  - Group by phase and calculate average balls/runs
  - Format as descriptive insight text (not predictive)

**Implementation Priority:** 🟢 **LOW** (Nice to have)

---

## Data Model Assessment

### ✅ Strengths
1. **Solid Foundation:** Complete ingestion pipeline with validation
2. **Rich Data Model:** All necessary fields present (phase, venue, over, runs, wickets)
3. **Data Integrity:** Proper constraints, unique indexes, foreign keys
4. **Idempotent Operations:** Safe re-ingestion with ON CONFLICT

### ⚠️ Gaps
1. **Missing Field:** `bowling_team` referenced in `ingest_match.py` but not in Delivery model
2. **No Boundary Detection:** Need to identify boundaries (4s, 6s) from `runs_batter`
3. **No Dot Ball Flag:** Need to identify dot balls (runs_batter = 0 AND is_legal_ball)

---

## Implementation Roadmap

### Phase 1: Critical MVP Features (Week 1)
1. ✅ Fix `bowling_team` bug in `ingest_match.py`
2. 🔴 Implement Matchup Confidence Score (#1)
3. 🟡 Structure Batter vs Bowler Snapshot (#2)
4. 🟡 Create Phase Advantage Breakdown view (#4)

### Phase 2: Core Features (Week 2)
5. 🟡 Implement Batting Style Profile (#5)
6. 🟡 Implement Matchup Control Index (#6)
7. 🟡 Structure Recent Form Indicator (#7)
8. 🟡 Enhance Powerplay Profile (#8)

### Phase 3: Supporting Features (Week 3)
9. 🟡 Implement Venue Comfort Indicator (#9)
10. 🟡 Implement Dismissal Timing Risk (#3)
11. 🟢 Implement Historical Outcome Pattern (#10)

### Phase 4: Infrastructure
12. Create analytics schema setup script
13. Create API layer (if needed)
14. Add unit tests for new views/functions

---

## Technical Recommendations

### 1. Create Analytics Schema
```sql
CREATE SCHEMA IF NOT EXISTS analytics;
```
- Move all MVP feature views to `analytics` schema
- Keep base tables in `public` schema

### 2. Helper Functions Needed
- `is_boundary(runs_batter)` → BOOLEAN
- `is_dot_ball(runs_batter, is_legal_ball)` → BOOLEAN
- `calculate_confidence_score(strike_rate, balls_per_dismissal, relative_performance)` → TEXT

### 3. Materialized Views (Performance)
Consider materializing frequently accessed views:
- `analytics.batter_bowler_snapshot`
- `analytics.matchup_confidence_score`
- `analytics.recent_form`

### 4. API Layer (Future)
If building API:
- Create Python functions that query analytics views
- Return structured JSON matching PRD UX requirements
- Add caching for frequently accessed matchups

---

## Code Quality Issues Found

### 🔴 Critical
1. **Bug in `ingest_match.py:73`:** References `bowling_team=None` but Delivery model doesn't have this field
   - **Fix:** Remove this parameter or add to model

### 🟡 Medium
2. **Hardcoded DB credentials:** `connection.py` has hardcoded user `"hitesh"`
   - **Fix:** Use environment variables

3. **Python version mismatch:** `pyproject.toml` requires Python 3.14+ (may not exist)
   - **Fix:** Change to 3.11+ as per README

### 🟢 Low
4. **Missing analytics schema setup:** View definitions exist but no setup script
   - **Fix:** Create `sql/analytics_schema.sql` with all views

---

## Conclusion

**Current State:** The project has excellent data infrastructure but needs feature-specific analytics views/functions to match PRD requirements.

**Recommendation:** 
1. Fix critical bugs first
2. Implement MVP features in priority order
3. Structure existing queries as reusable views
4. Add missing calculations (boundary%, dot ball%, etc.)

**Estimated Effort:** 2-3 weeks for complete MVP implementation

---

## Appendix: Query Mapping

| PRD Feature | Current Query | Status |
|------------|---------------|--------|
| Batter vs Bowler Snapshot | Query #1, #3 | ✅ Data available |
| Phase Breakdown | Query #3, #13 | ✅ Data available |
| Recent Form | Query #17, #18 | ✅ Logic exists |
| Venue Performance | Query #15 | ✅ Data available |
| Dismissal Patterns | Query #6, #7, #9 | ✅ Data available |
| Matchup Confidence | None | ❌ Not implemented |
| Batting Style | None | ❌ Not implemented |
| Control Index | None | ❌ Not implemented |
| Dismissal Timing | None | ❌ Not implemented |
| Outcome Pattern | None | ❌ Not implemented |
