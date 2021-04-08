import {BackLinkConfigurationData} from '../../contracts/release3/data/AppDataContracts';
import {CompetitionPortalData} from './CompetitionPortalDataContracts';
import {ViewCompetitionData} from '../../pages/ViewCompetition/ViewCompetitionDataContracts';
import {CompetitionDocumentsData} from '../../contracts/release3/data/CompeitionDocumentsDataContracts';
import {
    CoachSkaterData,
    CompetitionActiveSalesWindowData,
    CompetitionContactData,
    CompetitionInformationData,
    CompetitionScheduleData,
    ScheduledSessionData,
    SessionData,
    SkaterCoachedEventCategoryData,
    SkaterCompetitionCreditData,
    SkaterEventData,
    SkaterSkatingEventSegmentData
} from '../../contracts/data/DataContracts';
import {PracticeIceSchedulesData} from '../../contracts/data/PracticeIceSchedulesDataContracts';
import {CartDataV3} from '../../contracts/release3/data/CartDataContracts';
import {FetchCompetitionScheduleAPIResponse} from '../../CompetitionSchedule/_contracts/CompetitionScheduleAPIContracts';
import {SkaterSessionMap} from '../../models/Schedule/CoachSkatersSchedule';

export namespace CompetitionPortalApi {

    /**
     * Contains information when fetching for data for a Competition Portal Page
     */
    export interface FetchCompetitionPortalCoreApiResponse {
        competition_summary: CompetitionPortalData.ActiveCompetitionSummary;    // Summary of the specified competition
        back_link?: BackLinkConfigurationData;                                  // Back link to apply to the page, if desired
        entity_summary?: CompetitionPortalData.ActiveEntitySummary;             // Summary information about the active entity (team, participant) viewing the page, if applicable
    }

    /**
     * API response when fetching information for the Competition Portal "My Teams" page
     */
    export interface FetchMyTeamsApiResponse extends FetchCompetitionPortalCoreApiResponse {
        teams: CompetitionPortalData.CompetitionRegisteredManagedTeam[];                                         // The list of teams (managed by the current user) registered for the specified competition
    }

    /**
     * API response when fetching information for the Competition Portal Main page
     */
    export interface FetchCompetitionMainApiResponse {
        competition: ViewCompetitionData;                                       // Information about the active competition
        back_link?: BackLinkConfigurationData;                                  // Back link to apply to the page, if desired
        entity_summary?: CompetitionPortalData.ActiveEntitySummary;             // Summary information about the active entity (team, participant) viewing the page, if applicable
        user_manages_competition_eligible_teams: boolean;                       // Whether the active user manages teams that are either registered for the competition or can be registered for the competition
    }

    /**
     * API response when fetching information for the Competition Portal "Competition Documents" page
     */
    export interface FetchCompetitionDocumentsApiResponse extends FetchCompetitionPortalCoreApiResponse {
        competition_documents: CompetitionDocumentsData;                        // The lists of action and reference documents for the competition
    }

    /**
     * Server payload when changing the completion status of a User's Action Competition Document
     */
    export type ChangeActionCompetitionDocumentCompletionAPIPayload = {
        is_complete: boolean;      // Whether the document is being marked complete (true) or incomplete (false)
    }

    /**
     * API response when fetching information for the Competition Portal Competition Contacts page
     */
    export interface FetchCompetitionContactsApiResponse extends FetchCompetitionPortalCoreApiResponse {
        contacts: CompetitionContactData[];             // Array of competition contacts for the competition
    }

    /**
     * API response when fetching information for the Competition Portal Competition Information page
     */
    export interface FetchCompetitionInformationApiResponse extends FetchCompetitionPortalCoreApiResponse {
        competition_information: CompetitionPortalData.CompetitionInformation;  // Specific information needed by Competition Information page content area
    }

    /**
     * API response when fetching information for the Competition Portal "Select Competition Entity" page
     */
    export interface FetchEntitySelectApiResponse extends FetchCompetitionPortalCoreApiResponse {
        entities: CompetitionPortalData.CompetitionSelectableEntity[];  // The list of entities (managed teams and user's self) the active user can choose to view the competition as.
    }

    /**
     * API response when fetching information for the Competition Portal "Music & PPC" page
     */
    export interface FetchMusicAndPpcApiResponse extends FetchCompetitionPortalCoreApiResponse {
        entity_event_segments: SkaterSkatingEventSegmentData[];     // see `INTEGRATION_GUIDES/5_a__INTEGRATION-API-R2.md:576`
        competition_information: CompetitionInformationData;        // see `INTEGRATION_GUIDES/1_a__INTEGRATION-API.md:390`
    }

    /**
     * API response when fetching information for the Competition Portal "Practice Ice/Schedule" page
     */
    export interface FetchPracticeIceScheduleApiResponse extends FetchCompetitionPortalCoreApiResponse, PracticeIceSchedulesData {
        cart: CartDataV3;                                         // The cart relative to practice ice for the specified entity.
        entity_credits: SkaterCompetitionCreditData;              // Information about competition credits/packages for the specified entity.
        competition_information: CompetitionInformationData;      // Additional information about the specified competition.
        active_sales_window: CompetitionActiveSalesWindowData;    // The active sales window for the specified competition.
    }

    /**
     * API response when fetching information for the Competition Portal "Practice Ice Pre-Purchase Sales" page
     */
    export interface FetchPracticeIcePrePurchaseApiResponse extends FetchCompetitionPortalCoreApiResponse {
        cart: CartDataV3;                                         // The cart relative to practice ice for the specified entity.
        competition_information: CompetitionInformationData;      // Additional information about the specified competition.
        active_sales_window: CompetitionActiveSalesWindowData;    // The active sales window for the specified competition.
        entity_credits: SkaterCompetitionCreditData;              // Information about competition credits/packages for the specified entity.
        competition_schedule: CompetitionScheduleData;            // Information about the competition schedule. Although it appears this is not being used, it's been retained to avoid introducing hidden breaking changes
        entity_schedule: {                                        // Information about the entity's competition schedule.  See: INTEGRATION_GUIDES/1_a__INTEGRATION-API.md:305
            sessions: ScheduledSessionData[];
            events: SkaterEventData[];
        };
    }

    /**
     * API response when fetching information for the Competition Portal "Competition Schedule" page
     */
    export interface FetchCompetitionScheduleApiResponse extends FetchCompetitionPortalCoreApiResponse {
        competition_schedule: FetchCompetitionScheduleAPIResponse;  // Information about the competition schedule
    }

    /**
     * API response when fetching information for the Competition Portal "My Skaters" page
     */
    export interface FetchMySkatersApiResponse extends FetchCompetitionPortalCoreApiResponse {
        skaters: CoachSkaterData[];     // The list of skaters the active user coaches for the competition
    }

    /**
     * API response when fetching information for the Competition Portal "My Coaches" page
     *
     * see: INTEGRATION_GUIDES/5_a__INTEGRATION-API-R2.md:479
     */
    export interface FetchMyCoachesApiResponse extends FetchCompetitionPortalCoreApiResponse {
        event_categories: SkaterCoachedEventCategoryData[]; // The event categories and their associated coaches a skater has for a given competition
    }

    /**
     * API response when fetching information for the Competition Portal "My Schedule (Coach)" page
     *
     * see: INTEGRATION_GUIDES/9__INTEGRATION-COACH_SCHEDULE.md:30
     */
    export interface FetchMyScheduleCoachApiResponse extends FetchCompetitionPortalCoreApiResponse {
        coach_schedule?: {                          // Information about the coach's skaters' schedule for the competition
            sessions: SessionData[];                // The sessions a coach's skaters are assigned to for the competition
            skater_session_map: SkaterSessionMap;   // Map tying the skater names to the appropriate sessions
        };
        schedule_available: boolean;                // Whether the schedule is available
    }

    /**
     * API response when fetching information for the Competition Portal "My Schedule (Skater)" page
     *
     * see: INTEGRATION_GUIDES/1_a__INTEGRATION-API.md:563
     */
    export interface FetchMyScheduleSkaterApiResponse extends FetchCompetitionPortalCoreApiResponse {
        skater_schedule?: {                         // Information about the skater's schedule for the competition
            sessions: ScheduledSessionData[];       // The skater registered sessions for the competition
            events: SkaterEventData[];              // The skater registered events for the competition
        };
        schedule_available: boolean;// Whether the schedule is available
    }

    /**
     * API response when fetching information for the Competition Portal "Competition Schedule (Coach)" page
     */
    export interface FetchCoachCompetitionScheduleApiResponse extends FetchCompetitionPortalCoreApiResponse {
        competition_schedule: FetchCompetitionScheduleAPIResponse;  // Information about the competition schedule
        competition_information: CompetitionInformationData;        // Additional information about the specified competition.
        coached_skater_schedule: {                                  // Information about the coach's skaters' schedule for the competition
            sessions: SessionData[];                                // The sessions a coach's skaters are assigned to for the competition
            skater_session_map: SkaterSessionMap;                   // Map tying the skater names to the appropriate sessions
        };
    }
}