# API Extensibility Example: Season-Wise Batter Profile

This document demonstrates how easy it is to extend the API with new features, using the **season-wise batter profile** endpoint as an example.

## ✅ What We Added

A new endpoint: `GET /api/v1/batters/{batter_name}/profile/seasons`

This endpoint returns batter statistics broken down by season, showing:
- Performance metrics per season
- Phase-wise performance per season  
- Dismissal patterns per season
- Year-over-year comparison capability

## 🏗️ How We Extended It (4 Simple Steps)

### Step 1: Add Schema (Response Model)
**File**: `src/ipl_analytics/api/schemas/batters.py`

```python
class SeasonProfile(BaseModel):
    """Batter profile for a specific season"""
    season: str
    matches: int
    runs: int
    # ... other fields

class BatterSeasonProfileResponse(BaseModel):
    """Batter profile broken down by season"""
    batter: str
    seasons: List[SeasonProfile]
    total_seasons: int
```

**Why**: Defines the structure of our response data with type safety.

---

### Step 2: Add Repository Method (Data Access)
**File**: `src/ipl_analytics/repositories/batter_repository.py`

```python
def get_batter_profile_by_season(
    self,
    batter_name: str,
    season: Optional[str] = None
) -> List[Dict[str, Any]]:
    """Get batter profile broken down by season"""
    query = """
        SELECT ... FROM analytics.batter_profile_season
        WHERE batter = %s
    """
    # Execute query and return results
```

**Why**: Handles the database query. Uses existing analytics view or falls back to direct query.

---

### Step 3: Add Service Method (Business Logic)
**File**: `src/ipl_analytics/api/services/batter_service.py`

```python
def get_batter_profile_by_season(
    self,
    batter_name: str,
    season: Optional[str] = None
) -> BatterSeasonProfileResponse:
    """Get batter profile broken down by season"""
    # Validate player exists
    player_service.validate_player_exists(batter_name)
    
    # Get data from repository
    seasons_data = self.repository.get_batter_profile_by_season(...)
    
    # Transform data to response model
    return BatterSeasonProfileResponse(...)
```

**Why**: Contains business logic, validation, and data transformation.

---

### Step 4: Add Route (API Endpoint)
**File**: `src/ipl_analytics/api/routes/batters.py`

```python
@router.get("/{batter_name}/profile/seasons", response_model=BatterSeasonProfileResponse)
async def get_batter_profile_by_season(
    batter_name: str = Path(...),
    season: Optional[str] = Query(None),
    service: BatterService = Depends(get_batter_service)
):
    """Get batter profile broken down by season"""
    return service.get_batter_profile_by_season(batter_name, season)
```

**Why**: Exposes the endpoint via HTTP with automatic validation and documentation.

---

## 🎯 Result

**That's it!** The new endpoint is:
- ✅ **Automatically documented** (Swagger/OpenAPI)
- ✅ **Type-validated** (Pydantic)
- ✅ **Error-handled** (Custom exceptions)
- ✅ **Testable** (Dependency injection)
- ✅ **Maintainable** (Follows established patterns)

## 📝 Usage Examples

### Get All Seasons
```bash
curl http://localhost:8000/api/v1/batters/V%20Kohli/profile/seasons
```

**Response:**
```json
{
  "batter": "V Kohli",
  "total_seasons": 3,
  "seasons": [
    {
      "season": "2007/08",
      "matches": 13,
      "runs": 165,
      "balls": 120,
      "average": 20.63,
      "strike_rate": 137.5,
      "phase_performance": {
        "powerplay": {...},
        "middle": {...},
        "death": {...}
      },
      "dismissals": {
        "caught": 5,
        "bowled": 2,
        ...
      }
    },
    {
      "season": "2009",
      ...
    }
  ]
}
```

### Get Specific Season
```bash
curl "http://localhost:8000/api/v1/batters/V%20Kohli/profile/seasons?season=2011"
```

## 🔑 Key Benefits of This Architecture

### 1. **Separation of Concerns**
- **Routes**: Handle HTTP requests/responses
- **Services**: Business logic and validation
- **Repositories**: Database queries
- Each layer has a single responsibility

### 2. **Easy to Test**
```python
# Mock the repository in tests
def test_get_batter_profile_by_season():
    mock_repo = Mock()
    service = BatterService()
    service.repository = mock_repo
    # Test business logic without database
```

### 3. **Easy to Modify**
- Change database query? → Only modify repository
- Change business logic? → Only modify service
- Change API format? → Only modify route/schema

### 4. **Reusable Components**
- Repository methods can be reused by multiple services
- Service methods can be reused by multiple routes
- Schemas can be reused across endpoints

### 5. **Type Safety**
- Pydantic validates all inputs/outputs
- Type hints catch errors at development time
- IDE autocomplete works everywhere

## 🚀 Adding More Features

Want to add another feature? Just follow the same pattern:

1. **Schema** → Define data structure
2. **Repository** → Add database query
3. **Service** → Add business logic
4. **Route** → Expose endpoint

**Example**: Want to add "batter vs venue analysis"?

```python
# 1. Schema
class VenueProfile(BaseModel): ...

# 2. Repository
def get_batter_profile_by_venue(self, batter_name: str): ...

# 3. Service  
def get_batter_profile_by_venue(self, batter_name: str): ...

# 4. Route
@router.get("/{batter_name}/profile/venues")
async def get_batter_profile_by_venue(...): ...
```

## 📊 Architecture Diagram

```
┌─────────────────────────────────────────┐
│  Route Layer                            │
│  - HTTP handling                        │
│  - Input validation                     │
│  - Response formatting                  │
├─────────────────────────────────────────┤
│  Service Layer                          │
│  - Business logic                       │
│  - Data transformation                  │
│  - Validation                           │
├─────────────────────────────────────────┤
│  Repository Layer                       │
│  - Database queries                     │
│  - Data mapping                         │
│  - SQL execution                        │
└─────────────────────────────────────────┘
```

Each layer only knows about the layer directly below it, making the system:
- **Modular**: Change one layer without affecting others
- **Testable**: Mock dependencies easily
- **Maintainable**: Clear responsibilities

## ✅ Conclusion

The API is **highly extensible** because:
1. **Clear patterns** to follow
2. **Separation of concerns** makes changes isolated
3. **Type safety** catches errors early
4. **Dependency injection** enables easy testing
5. **Consistent structure** makes code easy to understand

**Adding new features is straightforward and follows established best practices!**
