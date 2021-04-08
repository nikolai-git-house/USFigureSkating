import {
    COMPETITION_PORTAL_ACTIVE_COMPETITION_ID_COOKIE_NAME,
    COMPETITION_PORTAL_ACTIVE_TEAM_ID_COOKIE_NAME
} from '../../config/AppConfig';
import {AbstractAPIService} from '../../services/AbstractAPIService';

export class CompetitionPortalAppService {
    /**
     * Get the active competition portal competition ID from cookie
     */
    static getActiveCompetitionPortalCompetitionId(): number {
        return parseInt(AbstractAPIService.getValueFromCookie(COMPETITION_PORTAL_ACTIVE_COMPETITION_ID_COOKIE_NAME, 'active competition id'));
    }

    /**
     * Get the active competition portal competition ID from cookie
     */
    static getActiveCompetitionPortalTeamId(): number | null {
        try {
            return parseInt(AbstractAPIService.getValueFromCookie(COMPETITION_PORTAL_ACTIVE_TEAM_ID_COOKIE_NAME, 'active team id', true));
        } catch (e) {
            return null;
        }
    }
}