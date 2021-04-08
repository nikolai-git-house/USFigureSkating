export const URL_CONFIG = {
    login: '/Account/CheckLogin',
    getSkaterComps: '/EMS/UpcomingCompsSkater',
    getCompetitionList: '/api/competitions'
};
export const PracticeIceConfig = {
    allow_all_dates_filter: false
};

export const CREDIT_CARD_GAP_SEPARATOR = ' ';
export const DATE_INPUT_GAP_SEPARATOR = '/';
/**
 * Whether to bypass validation for forms.  Used for development
 *
 * @note: not all forms are tied to this value as of this writing and may still validate even when this is true
 */
export const SKIP_VALIDATION = false;

/**
 * Enable debug mode for entity check-in:
 *
 * 1. Shows all subpage items on entity check-in index
 */
export const ENTITY_CHECK_IN_DEBUG = false;

/**
 * Start check-in with an entity active.
 *
 * Set to a number to load the appropriate entity.
 * Set to false or undefined to prevent autoload.
 */
export const AUTOLOAD_ENTITY_CHECK_IN_INDEX: number | false = false;

/**
 * Name of cookie from which active Competition Management Competition ID can be read.
 *
 * False if cookie is not being used.
 */
export const COMPETITION_MANAGEMENT_COOKIE_NAME: string | false = false; // 'competition_management_active_competition_id';

/**
 * Name of cookie from which active Series Registration Series ID can be read
 */
export const SERIES_REGISTRATION_COOKIE_NAME: string = 'series_registration_series_id';
/**
 * Name of cookie from which active Team Registration Team ID can be read
 */
export const TEAM_REGISTRATION_TEAM_ID_COOKIE_NAME: string = 'team_competition_registration_team_id';
/**
 * Name of cookie from which active Team Registration Competition ID can be read
 */
export const TEAM_REGISTRATION_COMPETITION_ID_COOKIE_NAME: string = 'team_competition_registration_competition_id';
/**
 * Name of cookie that tracks the active competition ID within the Competition Portal
 */
export const COMPETITION_PORTAL_ACTIVE_COMPETITION_ID_COOKIE_NAME: string = 'competition_portal_competition_id';
/**
 * Name of cookie that tracks the active team ID within the Competition Portal
 */
export const COMPETITION_PORTAL_ACTIVE_TEAM_ID_COOKIE_NAME: string = 'competition_portal_team_id';
/**
 * Name of cookie that tracks the active team ID within Series Registration
 */
export const SERIES_REGISTRATION_ACTIVE_TEAM_ID_COOKIE_NAME: string = 'series_registration_team_id';