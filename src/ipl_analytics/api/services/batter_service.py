"""
Service for batter-related operations
"""
from typing import Optional
from ipl_analytics.repositories.batter_repository import BatterRepository
from ipl_analytics.api.exceptions import NotFoundError
from ipl_analytics.api.schemas.batters import (
    BatterProfileResponse,
    BatterCareerStats,
    PhaseBreakdown,
    PhaseStats,
    DismissalStats,
    BatterRecentFormResponse,
    RecentMatch,
    RecentFormSummary,
    BatterSeasonProfileResponse,
    SeasonProfile
)


class BatterService:
    """Business logic for batter operations"""
    
    def __init__(self):
        self.repository = BatterRepository()
    
    def get_batter_profile(self, batter_name: str) -> BatterProfileResponse:
        """
        Get complete batter profile
        
        Args:
            batter_name: Name of the batter
            
        Returns:
            BatterProfileResponse object
            
        Raises:
            NotFoundError if batter not found
        """
        data = self.repository.get_batter_profile(batter_name)
        
        if not data:
            raise NotFoundError("Batter", batter_name)
        
        # Calculate phase stats
        phase_performance = PhaseBreakdown(
            powerplay=PhaseStats(
                runs=data["pp_runs"],
                balls=data["pp_balls"],
                strike_rate=round((data["pp_runs"] / data["pp_balls"] * 100), 2)
                if data["pp_balls"] > 0 else 0.0,
                outs=0,  # Would need separate query for phase-specific outs
                average=None
            ) if data["pp_balls"] > 0 else None,
            middle=PhaseStats(
                runs=data["mid_runs"],
                balls=data["mid_balls"],
                strike_rate=round((data["mid_runs"] / data["mid_balls"] * 100), 2)
                if data["mid_balls"] > 0 else 0.0,
                outs=0,
                average=None
            ) if data["mid_balls"] > 0 else None,
            death=PhaseStats(
                runs=data["death_runs"],
                balls=data["death_balls"],
                strike_rate=round((data["death_runs"] / data["death_balls"] * 100), 2)
                if data["death_balls"] > 0 else 0.0,
                outs=0,
                average=None
            ) if data["death_balls"] > 0 else None
        )
        
        # Get highest score
        highest_score = self.repository.get_highest_score(batter_name)
        
        career = BatterCareerStats(
            matches=data["matches"],
            runs=data["runs"],
            balls=data["balls"],
            outs=data["outs"],
            average=data["average"],
            strike_rate=data["strike_rate"],
            highest_score=highest_score
        )
        
        dismissals = DismissalStats(
            caught=data["caught_outs"],
            bowled=data["bowled_outs"],
            lbw=data["lbw_outs"],
            stumped=data["stumped_outs"]
        )
        
        return BatterProfileResponse(
            batter=data["batter"],
            career=career,
            phase_performance=phase_performance,
            dismissals=dismissals
        )
    
    def get_recent_form(
        self,
        batter_name: str,
        num_matches: int = 5,
        season: Optional[str] = None
    ) -> BatterRecentFormResponse:
        """
        Get recent form for a batter
        
        Args:
            batter_name: Name of the batter
            num_matches: Number of recent matches
            season: Optional season filter
            
        Returns:
            BatterRecentFormResponse object
            
        Raises:
            NotFoundError if batter not found
        """
        # Validate player exists
        from ipl_analytics.api.services.player_service import PlayerService
        player_service = PlayerService()
        player_service.validate_player_exists(batter_name)
        
        recent_matches_data, summary_data = self.repository.get_recent_form(
            batter_name, num_matches, season
        )
        
        recent_matches = [
            RecentMatch(**match_data)
            for match_data in recent_matches_data
        ]
        
        summary = RecentFormSummary(**summary_data)
        
        return BatterRecentFormResponse(
            batter=batter_name,
            recent_matches=recent_matches,
            summary=summary
        )
    
    def get_batter_profile_by_season(
        self,
        batter_name: str,
        season: Optional[str] = None
    ) -> BatterSeasonProfileResponse:
        """
        Get batter profile broken down by season
        
        Args:
            batter_name: Name of the batter
            season: Optional season filter (if None, returns all seasons)
            
        Returns:
            BatterSeasonProfileResponse with season-wise breakdown
            
        Raises:
            NotFoundError if batter not found
        """
        # Validate player exists
        from ipl_analytics.api.services.player_service import PlayerService
        player_service = PlayerService()
        player_service.validate_player_exists(batter_name)
        
        seasons_data = self.repository.get_batter_profile_by_season(batter_name, season)
        
        # When filtering by season, empty result means "no data for this season", not "batter not found"
        if not seasons_data:
            if season:
                return BatterSeasonProfileResponse(
                    batter=batter_name,
                    seasons=[],
                    total_seasons=0
                )
            raise NotFoundError("Batter", batter_name)
        
        seasons = []
        for data in seasons_data:
            # Build phase breakdown
            phase_performance = PhaseBreakdown(
                powerplay=PhaseStats(
                    runs=data["pp_runs"],
                    balls=data["pp_balls"],
                    strike_rate=round((data["pp_runs"] / data["pp_balls"] * 100), 2)
                    if data["pp_balls"] > 0 else 0.0,
                    outs=0,
                    average=None
                ) if data["pp_balls"] > 0 else None,
                middle=PhaseStats(
                    runs=data["mid_runs"],
                    balls=data["mid_balls"],
                    strike_rate=round((data["mid_runs"] / data["mid_balls"] * 100), 2)
                    if data["mid_balls"] > 0 else 0.0,
                    outs=0,
                    average=None
                ) if data["mid_balls"] > 0 else None,
                death=PhaseStats(
                    runs=data["death_runs"],
                    balls=data["death_balls"],
                    strike_rate=round((data["death_runs"] / data["death_balls"] * 100), 2)
                    if data["death_balls"] > 0 else 0.0,
                    outs=0,
                    average=None
                ) if data["death_balls"] > 0 else None
            )
            
            dismissals = DismissalStats(
                caught=data["caught_outs"],
                bowled=data["bowled_outs"],
                lbw=data["lbw_outs"],
                stumped=data["stumped_outs"]
            )
            
            seasons.append(SeasonProfile(
                season=data["season"],
                matches=data["matches"],
                runs=data["runs"],
                balls=data["balls"],
                outs=data["outs"],
                average=data["average"],
                strike_rate=data["strike_rate"],
                phase_performance=phase_performance,
                dismissals=dismissals
            ))
        
        return BatterSeasonProfileResponse(
            batter=batter_name,
            seasons=seasons,
            total_seasons=len(seasons)
        )
