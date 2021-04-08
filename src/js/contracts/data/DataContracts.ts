import {
    CompetitionScheduleLegendData,
    CompetitionScheduleLinksData
} from '../../CompetitionSchedule/_contracts/CompetitionScheduleDataContracts';
import {CreditCollectionConfigContract} from '../../models/Credits/CreditCollectionConfigContract';
import {CreditList, NullableCreditList, SalesWindowKey, SessionType} from '../AppContracts';

import {CompetitionDocumentsData} from '../release3/data/CompeitionDocumentsDataContracts';

export interface FacilityData {
    name: string;
    id: number;
}

export interface RinkData {
    id: number;
    name: string;
    facility_id: number;
}

export interface RinkDataComplete extends RinkData {
    facility: FacilityData;
}

export interface CreditConfigData {
    key: SessionType;
    cost: number;
    limit: number;
}

export interface SkaterEventData {
    id: number;
    name: string;
    competition_id: number;

}

export interface CreditPackageData {
    cost: number;
    name: string;
    limit: number;
    id: number;
    event_id: number;
    credits: NullableCreditList;
}

export interface CartCreditPackageData {
    [key: string]: number | string | CreditList;

    id: number;
    event_id: number;
    cost: number;
    competition_id: number;
    event_name: string;
    competition_name: string;
    name: string;
    credits: CreditList;
}

export interface SkatingEventData extends SkaterEventData {
    credit_config: CreditConfigData[];
    credit_packages: CreditPackageData[];
}

/**
 * The global type key for a session.  Identifies the global session type
 */
export type SessionTypeKeyData = 'practice_ice' | 'warm_up' | 'event' | 'resurface';

export interface SessionData {
    id: number;
    name: string;
    date: number;
    time_start: number;
    time_end: number;
    slots_registered: number;
    slots_available: number;
    rink_id: number;
    rink: RinkDataComplete;
    event_ids: number[];
    type_key: SessionTypeKeyData;
    location?: string;
    utc_timezone_offset: number;
}

export interface ScheduledSessionData {
    session: SessionData;
    scheduled_as: SessionType;
    scheduled_event_id: number;
}

export interface EventSessionData extends SessionData {
    event_type: string;
    icon_color?: string;
}

export interface PracticeIceData extends SessionData {
    practice_ice_types: SessionType[];
}

// warm ups have no unique args
export interface WarmUpData extends SessionData {
}

/**
 * A key to identify an active competition's sales window
 *
 * 2020-07-13 - enum defined from previous string type with guidelines for usage
 */
export type CompetitionActiveSalesWindowData =
    'open_sales' |
    'none' |
    'pre_purchase' |
    'selection' |
    'on_site';

export interface CompetitionData {
    id: number;                         // unique identifier for each Competition
    name: string;                       // The name of the Competition
    start_date: number;                 // Unix timestamp for start date
    end_date: number;                   // Unix timestamp for start date
    icon: string;                       // url string linking to the Competition icon image
    schedule_available: boolean;        // whether skaters can access "My Schedule"
    practice_ice_available: boolean;    // whether skaters can access "Practice Ice/Schedule"
    active_sales_window: CompetitionActiveSalesWindowData;        // Key for the active sales window. Options are "open_sales", "none", "pre_purchase", "selection", "on_site"
    directions?: {                      // [OPTIONAL] Directions information for the competition.
        location_name: string;          // The name of the location
        link: string;                   // Directions link URL
    }[];
    announcement_url?: string;          // [OPTIONAL] URL for the Competition Announcement
    website_url?: string;               // [OPTIONAL] URL for the Competition Website
}

export interface SalesWindowData {
    name: string;
    start_datetime_timestamp: number;
    end_datetime_timestamp: number;
    start_datetime_formatted: string;
    end_datetime_formatted: string;
    key: SalesWindowKey;
}
/**
 * Represents additional supporting information for a Competition
 */
export interface CompetitionInformationData {
    competition_id: number;                             // Unique identifier for the competition
    sales_windows: SalesWindowData[];                   // Information about the Practice Ice Sales Windows
    practice_ice_instructions: string;                  // Instructions for Practice Ice.
    practice_ice_terminology: string;                   // Terminology for Practice Ice.
    skating_events: SkatingEventData[];                 // Events associated with the competition
    schedulable_session_types: SessionType[];           // Types of Practice Ice sessions that are user-schedulable
    pricing_message?: string | false;                   // Message to display in place of Practice Ice pricing data
    music_ppc_deadline_description: string;             // Supporting description for display on Music/PPC page
    ppc_deadline: MusicPPCDeadlineData | null;          // Deadline information for PPC
    music_deadline: MusicPPCDeadlineData | null;        // Deadline information for Music
    /**
     * @deprecated - 2020-06-17
     */
    competition_documents: CompetitionDocumentsData;    // Information about documents related to the competition
}

export interface CreditStateData extends CreditCollectionConfigContract {
    opi: number;
    wu: number;
    upi: number;
}

export interface SkaterEventCreditData {
    event_id: number;
    total: CreditStateData;
    scheduled: CreditStateData;
}

/**
 * See: INTEGRATION_GUIDES/1_a__INTEGRATION-API.md:248
 */
export interface SkaterCompetitionCreditData {
    event_credits: SkaterEventCreditData[];
    purchased_package_ids: number[];
}

export interface CartSessionData extends ScheduledSessionData {
    cost: number;
    competition_id: number;
    competition_name: string;
    scheduled_event_name: string;
}

export interface CartCreditData {
    [key: string]: number | SessionType | string;

    event_id: number;
    credit_type: SessionType;
    amount: number;
    cost: number;
    competition_id: number;
    competition_name: string;
    event_name: string;
}

export interface CartData {
    sessions: CartSessionData[];                      // Data for sessions in the cart.  Unchanged from previous releases
    credits: CartCreditData[];                        // Data for Credits in the cart. Unchanged from previous releases
    packages: CartCreditPackageData[];                // Data for Credit Packages in the cart. Unchanged from previous releases
}

/**
 * Represents the data related to a competition's schedule
 */
export interface CompetitionScheduleData {
    facilities: FacilityData[];                 // An array of Facilities for the Competition
    rinks: RinkDataComplete[];                  // An array of Complete Rinks for the Competition
    sessions: SessionData[];                    // An array of all the Sessions for the Competition
    legend?: CompetitionScheduleLegendData;     // [OPTIONAL] Data to display in competition schedule legend
    links?: CompetitionScheduleLinksData;       // [OPTIONAL] Links associated with the competition schedule
}

export interface SkaterInfoData {
    first_name: string;
    last_name: string;
    address: {
        street: string;
        street_2: string | null;
        city: string;
        state: string;
        zip_code: number;
    };
}

export type CompetitionContactData = {
    name: string;       // The contact's name
    role: string;       // The contact's role for the competition
    email: string;      // The contact's email address
}

export type CoachSkaterEventData = {
    name: string;
    coaching_role: string;
    music_complete: boolean;
    ppc_complete: boolean;
    music_required: boolean;
    ppc_required: boolean;
}

export type CoachSkaterData = {
    id: number;
    first_name: string;
    last_name: string;
    federation_letter_status: string | false;
    events: CoachSkaterEventData[];
}

/**
 * Represents information about a coach a skater has assigned to an event category
 */
export type SkaterEventCoachData = {
    id: number;                         // Coach identifier
    first_name: string;                 // Coach first name
    last_name: string;                  // Coach last name
    ineligible: boolean;                // Whether the coach is ineligible to participate in sanctioned events
    state_abbreviation: string;         // Abbreviation of the coach's state location
    member_number: string;              // The coach's member number
    club_name: string;                  // The coach's home club name
}

/**
 * Represents information about an event category
 */
export interface EventCategoryData {
    id: number;            // Identifier for the category
    name: string;          // Name of the category
    coach_limit: number;   // Limit to the amount of coaches allowed for the category
}

/**
 * Represents information related to an event category and coaches assigned to it for a skater.
 * Note EventCategoryData extension
 */
export interface SkaterCoachedEventCategoryData extends EventCategoryData {
    coaches: SkaterEventCoachData[]; // The list of coaches assigned to the category
}

export type CoachResultData = {
    club_name: string;
    first_name: string;
    id: number;
    ineligible: boolean;
    last_name: string;
    member_number: string;
    state_abbreviation: string;
}

export type UserUploadFileCapabilityData = {
    can_upload: boolean;
    error_message: string;
}

type UserRoleKey = 'skater' | 'coach' | 'team_manager';

export type UserData = {
    roles: UserRoleKey[];
    upload_file_capability: UserUploadFileCapabilityData;
    member_number: number;
    email: string;
}

export type SkaterSkatingEventSegmentData = {
    event_name: string;
    segment_name: string;
    event_id: number;
    segment_id: number;
    ppc_required: boolean;
    music_required: boolean;
    rhythm_required: boolean;  // @downstream-sync 2020-07-02 - import rhythm/theme feature
    theme_required: boolean;  // @downstream-sync 2020-07-02 - import rhythm/theme feature
    is_ppc_complete: boolean;
    is_music_complete: boolean;
    is_rhythm_complete: boolean;  // @downstream-sync 2020-07-02 - import rhythm/theme feature
    is_theme_complete: boolean;  // @downstream-sync 2020-07-02 - import rhythm/theme feature
    ppc_last_modified_timestamp: number | null;
    music_last_modified_timestamp: number | null;
    competition_skated_event_id: number;
    rhythms: string[];  // @downstream-sync 2020-07-02 - import rhythm/theme feature
    theme: string;  // @downstream-sync 2020-07-02 - import rhythm/theme feature
}

export type MusicPPCDeadlineData = {
    formatted: string;
    timestamp: number;
    late_fee: string;
}

export type MemberNumberData = string | number;  // An entity's member number

/**
 * Server response when fetching competition contacts for a competition
 *
 * @deprecated 2020-07-01; see: CompetitionPortalApi.FetchCompetitionContactsApiResponse
 */
export interface FetchCompetitionContactsAPIResponse {
    contacts: CompetitionContactData[];             // Array of competition contacts for the competition
}

export type StatusMessageTypeKeyData = null | // Normal text
    'info' |            // Blue status text
    'success' |         // Green status text
    'warning' |         // Orange status text
    'alert';            // Red status text

export type StatusMessageData = {
    text: string;       // The message to display
    type_key: StatusMessageTypeKeyData;   // Determines the display color of the text

}

export interface EntityMembershipFieldData {
    membership_status: {                    // Information about the team's membership status
        active: boolean;                    // Whether the team has active membership
        validity_date_formatted: string;    // The formatted date through which the team's membership is valid
    };
}

/**
 * Represents an item within the status summary (such as compliance/requirements summary) for an entity
 */
export interface StatusSummaryItemData {
    name: string;           // Name of the status item
    complete: boolean;      // Whether the item is complete
}
/**
 * Represents a configuration for a link
 */
export interface LinkConfigurationData {
    url: string;            // Link URL
    is_new_tab: boolean;    // Whether link should open in a new tab
}