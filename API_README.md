# IPL Analytics API

Professional-grade REST API for IPL cricket analytics, built with FastAPI following best practices.

## Architecture

The API follows a **clean architecture** pattern with clear separation of concerns:

```
┌─────────────────────────────────────────┐
│         API Routes (FastAPI)            │  ← HTTP layer
├─────────────────────────────────────────┤
│         Services (Business Logic)       │  ← Business rules
├─────────────────────────────────────────┤
│      Repositories (Data Access)         │  ← Database queries
├─────────────────────────────────────────┤
│    Database Pool (Connection Mgmt)      │  ← Connection handling
└─────────────────────────────────────────┘
```

### Key Principles

1. **Separation of Concerns**: Each layer has a single responsibility
2. **Dependency Injection**: Services and repositories are injected via FastAPI dependencies
3. **Type Safety**: Pydantic models for request/response validation
4. **Error Handling**: Custom exceptions with proper HTTP status codes
5. **Connection Pooling**: Efficient database connection management
6. **Configuration Management**: Environment-based configuration

## Project Structure

```
src/ipl_analytics/
├── api/
│   ├── main.py              # FastAPI app & middleware
│   ├── config.py            # Configuration management
│   ├── exceptions.py       # Custom exceptions
│   ├── dependencies.py      # Dependency injection
│   ├── routes/              # API endpoints
│   │   ├── players.py
│   │   ├── batters.py
│   │   ├── matchups.py
│   │   ├── matches.py
│   │   └── health.py
│   ├── schemas/             # Pydantic models
│   │   ├── common.py
│   │   ├── players.py
│   │   ├── batters.py
│   │   ├── matchups.py
│   │   └── matches.py
│   └── services/            # Business logic
│       ├── player_service.py
│       ├── batter_service.py
│       ├── matchup_service.py
│       └── match_service.py
├── repositories/             # Data access layer
│   ├── base.py
│   ├── player_repository.py
│   ├── batter_repository.py
│   ├── matchup_repository.py
│   └── match_repository.py
└── db/
    └── pool.py              # Connection pooling
```

## Setup

### 1. Install Dependencies

```bash
poetry install
```

### 2. Environment Configuration

Create a `.env` file (optional, defaults are used if not present):

```env
DB_NAME=ipl_analytics
DB_USER=hitesh
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
DEBUG=false
```

### 3. Ensure Analytics Views Exist

Make sure the analytics views are created in your database:

```bash
psql ipl_analytics -f src/ipl_analytics/misc/batter_profile
psql ipl_analytics -f src/ipl_analytics/misc/batter_profile_season
```

Or manually create the `analytics` schema and views.

### 4. Run the API

```bash
# Using Poetry
poetry run python -m ipl_analytics.api.run

# Or directly with uvicorn
poetry run uvicorn ipl_analytics.api.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at:
- **API**: http://localhost:8000
- **Docs**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## API Endpoints

### Phase 1 MVP Endpoints

#### Health Check
- `GET /api/v1/health` - Check API and database status

#### Players
- `GET /api/v1/players` - List all players (with search & pagination)
- `GET /api/v1/players/search?q={query}` - Search players (autocomplete)

#### Batters
- `GET /api/v1/batters/{batter_name}/profile` - Get complete batter profile
- `GET /api/v1/batters/{batter_name}/recent-form?matches=5` - Get recent form

#### Matchups
- `GET /api/v1/matchups/batter/{batter}/bowler/{bowler}` - Get matchup analysis

#### Matches
- `GET /api/v1/matches/{match_id}` - Get match information

## Example Requests

### Get Batter Profile
```bash
curl http://localhost:8000/api/v1/batters/V%20Kohli/profile
```

### Get Matchup Analysis
```bash
curl "http://localhost:8000/api/v1/matchups/batter/V%20Kohli/bowler/Jasprit%20Bumrah?include_phases=true"
```

### Get Recent Form
```bash
curl "http://localhost:8000/api/v1/batters/V%20Kohli/recent-form?matches=5"
```

## Error Handling

All errors follow a standard format:

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
- `200` - Success
- `400` - Bad Request
- `404` - Not Found
- `500` - Internal Server Error

## Best Practices Implemented

### 1. **Clean Architecture**
- Clear separation between routes, services, and repositories
- Business logic isolated in service layer
- Database queries isolated in repository layer

### 2. **Type Safety**
- Pydantic models for all request/response validation
- Type hints throughout the codebase
- Automatic API documentation generation

### 3. **Dependency Injection**
- Services injected via FastAPI dependencies
- Easy to mock for testing
- Loose coupling between components

### 4. **Error Handling**
- Custom exception hierarchy
- Consistent error response format
- Proper HTTP status codes

### 5. **Connection Management**
- Connection pooling for efficiency
- Context managers for safe resource cleanup
- Automatic connection retry logic

### 6. **Configuration Management**
- Environment-based configuration
- Sensible defaults
- Easy to override for different environments

### 7. **Logging**
- Structured logging throughout
- Configurable log levels
- Request/response logging (can be added)

### 8. **Extensibility**
- Easy to add new endpoints
- Repository pattern allows easy data source changes
- Service layer allows business logic changes without affecting API

## Testing

To test the API:

```bash
# Health check
curl http://localhost:8000/api/v1/health

# List players
curl http://localhost:8000/api/v1/players?limit=10

# Get batter profile
curl http://localhost:8000/api/v1/batters/SC%20Ganguly/profile
```

## Extending the API

### Adding a New Endpoint

1. **Create Repository Method** (if needed)
   ```python
   # repositories/batter_repository.py
   def get_new_metric(self, batter_name: str):
       query = "SELECT ..."
       return self.execute_query(query, (batter_name,))
   ```

2. **Create Service Method**
   ```python
   # services/batter_service.py
   def get_new_metric(self, batter_name: str):
       data = self.repository.get_new_metric(batter_name)
       # Transform/validate data
       return NewMetricResponse(**data)
   ```

3. **Create Schema**
   ```python
   # schemas/batters.py
   class NewMetricResponse(BaseModel):
       metric: str
       value: float
   ```

4. **Add Route**
   ```python
   # routes/batters.py
   @router.get("/{batter_name}/new-metric")
   async def get_new_metric(
       batter_name: str,
       service: BatterService = Depends(get_batter_service)
   ):
       return service.get_new_metric(batter_name)
   ```

## Performance Considerations

1. **Connection Pooling**: Reuses database connections efficiently
2. **Query Optimization**: Uses indexed columns and efficient SQL
3. **Caching**: Can easily add Redis caching layer in service methods
4. **Pagination**: All list endpoints support pagination

## Security Considerations

1. **Input Validation**: All inputs validated via Pydantic
2. **SQL Injection**: Parameterized queries prevent SQL injection
3. **CORS**: Configurable CORS settings
4. **Rate Limiting**: Can be added via middleware (e.g., slowapi)

## Next Steps

1. Add authentication/authorization if needed
2. Add rate limiting
3. Add caching layer (Redis)
4. Add comprehensive logging
5. Add unit and integration tests
6. Add API versioning strategy
7. Add monitoring and metrics

## Troubleshooting

### Database Connection Issues
- Check PostgreSQL is running: `psql -U hitesh -d ipl_analytics`
- Verify connection settings in `.env` or `config.py`
- Check database pool initialization logs

### Analytics View Not Found
- Ensure analytics views are created: `psql ipl_analytics -f src/ipl_analytics/misc/batter_profile`
- Check if `analytics` schema exists: `\dn` in psql

### Import Errors
- Ensure all dependencies are installed: `poetry install`
- Check Python path includes `src/` directory
