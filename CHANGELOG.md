# API Changelog

## [Unreleased]

### Added
- **Season-wise Batter Profile Endpoint** (`GET /api/v1/batters/{batter_name}/profile/seasons`)
  - Returns batter statistics broken down by season
  - Supports optional season filter query parameter
  - Includes phase-wise performance and dismissal breakdown per season
  - Enables year-over-year performance comparison
  - Uses `analytics.batter_profile_season` view with fallback to direct query

### Changed
- Updated API documentation to include season-wise endpoint
- Enhanced extensibility documentation with real-world example

### Documentation
- Added `EXTENSIBILITY_EXAMPLE.md` demonstrating how to add new endpoints
- Updated `API_DESIGN.md` with season-wise endpoint specification
- Updated `API_README.md` with usage examples
- Updated `IMPLEMENTATION_SUMMARY.md` with new endpoint

---

## [0.1.0] - Phase 1 MVP

### Added
- Health check endpoint
- Player listing and search endpoints
- Batter profile endpoint (career stats)
- Batter recent form endpoint
- Matchup analysis endpoint
- Match information endpoint
- Clean architecture with separation of concerns
- Connection pooling for database
- Comprehensive error handling
- Auto-generated API documentation (Swagger/OpenAPI)
