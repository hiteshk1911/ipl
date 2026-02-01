"""
Service for matchup-related operations
"""
from typing import Optional
from ipl_analytics.repositories.matchup_repository import MatchupRepository
from ipl_analytics.api.exceptions import NotFoundError
from ipl_analytics.api.schemas.matchups import (
    BatterBowlerMatchupResponse,
    MatchupStats,
    RecentEncounter
)
from ipl_analytics.api.schemas.common import PhaseStats


class MatchupService:
    """Business logic for matchup operations"""
    
    def __init__(self):
        self.repository = MatchupRepository()
    
    def get_batter_bowler_matchup(
        self,
        batter_name: str,
        bowler_name: str,
        season: Optional[str] = None,
        venue: Optional[str] = None,
        include_phases: bool = True
    ) -> BatterBowlerMatchupResponse:
        """
        Get batter vs bowler matchup analysis
        
        Args:
            batter_name: Name of the batter
            bowler_name: Name of the bowler
            season: Optional season filter
            venue: Optional venue filter
            include_phases: Whether to include phase breakdown
            
        Returns:
            BatterBowlerMatchupResponse object
            
        Raises:
            NotFoundError if matchup not found or insufficient data
        """
        # #region agent log
        import json, os
        _log_paths = ["/Users/himankverma/Developer/projects/.cursor/debug.log", os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", "..", "debug.log"))]
        _line = json.dumps({"location": "matchup_service.py:get_batter_bowler_matchup", "message": "before validation", "data": {"batter_name": batter_name, "bowler_name": bowler_name}, "timestamp": __import__("time").time() * 1000, "sessionId": "debug-session", "hypothesisId": "H1"}) + "\n"
        for _p in _log_paths:
            try:
                open(_p, "a").write(_line)
            except Exception:
                pass
        # #endregion
        # Validate players exist
        from ipl_analytics.api.services.player_service import PlayerService
        player_service = PlayerService()
        player_service.validate_player_exists(batter_name)
        player_service.validate_player_exists(bowler_name)
        # #region agent log
        _line2 = json.dumps({"location": "matchup_service.py:get_batter_bowler_matchup", "message": "after validation", "data": {"validated": True}, "timestamp": __import__("time").time() * 1000, "sessionId": "debug-session", "hypothesisId": "H1"}) + "\n"
        for _p in _log_paths:
            try:
                open(_p, "a").write(_line2)
            except Exception:
                pass
        # #endregion
        data = self.repository.get_batter_bowler_matchup(
            batter_name,
            bowler_name,
            season,
            venue,
            include_phases
        )
        # #region agent log
        _line3 = json.dumps({"location": "matchup_service.py:get_batter_bowler_matchup", "message": "repository result", "data": {"data_is_none": data is None, "has_overall": bool(data and data.get("overall"))}, "timestamp": __import__("time").time() * 1000, "sessionId": "debug-session", "hypothesisId": "H3-H5"}) + "\n"
        for _p in _log_paths:
            try:
                open(_p, "a").write(_line3)
            except Exception:
                pass
        # #endregion
        if not data:
            raise NotFoundError(
                "Matchup",
                f"{batter_name} vs {bowler_name}",
                details={"message": "Insufficient data for this matchup"}
            )
        
        overall = MatchupStats(**data["overall"])
        
        # Convert phase breakdown
        phase_breakdown = {}
        if data.get("phase_breakdown"):
            for phase, phase_data in data["phase_breakdown"].items():
                phase_breakdown[phase] = PhaseStats(**phase_data)
        
        recent_encounters = [
            RecentEncounter(**encounter)
            for encounter in data.get("recent_encounters", [])
        ]
        
        return BatterBowlerMatchupResponse(
            batter=data["batter"],
            bowler=data["bowler"],
            overall=overall,
            phase_breakdown=phase_breakdown if phase_breakdown else None,
            recent_encounters=recent_encounters
        )
