"""
Dependency injection for FastAPI routes
"""
from ipl_analytics.api.services.player_service import PlayerService
from ipl_analytics.api.services.batter_service import BatterService
from ipl_analytics.api.services.matchup_service import MatchupService
from ipl_analytics.api.services.match_service import MatchService


def get_player_service() -> PlayerService:
    """Dependency for player service"""
    return PlayerService()


def get_batter_service() -> BatterService:
    """Dependency for batter service"""
    return BatterService()


def get_matchup_service() -> MatchupService:
    """Dependency for matchup service"""
    return MatchupService()


def get_match_service() -> MatchService:
    """Dependency for match service"""
    return MatchService()
