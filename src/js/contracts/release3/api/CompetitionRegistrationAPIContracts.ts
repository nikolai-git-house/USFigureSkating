import {SkaterCoachedEventCategoryData} from "../../data/DataContracts";
import {
    CompetitionPricesData,
    CompetitionRegistrationActiveCompetitionData,
    CompetitionRegistrationListCompetitionData,
    EventSelectionEventData,
    PartnerIdentificationCategoryData,
    PartnerSkateTestSummaryData,
    RepresentationSelectionData,
    UserProfileData,
    UserWaiverData
} from "../data/CompetitionRegistrationDataContracts";
import {IndividualSkateTestData, SavedSkateTestData, UserSkateTestHistoryData} from "../data/SkateTestDataContracts";
import {FormOptionData, FormOptionDataValue, StateFormOptionData} from "../data/CommonDataContracts";
import {APISubmissionResponse} from "./CommonAPIContracts";
import {SkateTestDisciplineKey} from "../../app/SkateTestContracts";
/* ===========================================================================================================
*                                              Common
* ===========================================================================================================*/
/**
 * Shared API response from multiple endpoints in relation to Event Selection page
 */
export interface EventSelectionAPIResponseData {
    available_events: EventSelectionEventData[];                // The events to display for event selection.  Includes events with paid registrations, and selected but unpaid events
    partner_skate_test_summary: PartnerSkateTestSummaryData[];  // Information about selected partners' relationships to relevant selected events
}


/* ===========================================================================================================
*                                              Screen Loading
* ===========================================================================================================*/
/**
 * API response when fetching the competition list
 */
export interface FetchRegistrationCompetitionListAPIResponse {
    competitions: CompetitionRegistrationListCompetitionData[]; // The list of competitions
}

/**
 * Data used to power the Competition Registration Overview page
 */
export interface CompetitionRegistrationOverviewScreenParamsData {
    competition: CompetitionRegistrationActiveCompetitionData;  // Information about the active competition
    prices: CompetitionPricesData;                              // Price information for the active competition
}

/**
 * Data used to power the Competition Registration "My Profile" page
 */
export interface CompetitionRegistrationProfileScreenParamsData {
    competition: CompetitionRegistrationActiveCompetitionData;   // Information about the active competition
    user_profile: UserProfileData;                               // The active user's profile data
    representation_selection_required: boolean;                  // Whether the user needs to select their representation as part of registration
    selected_representation: RepresentationSelectionData | null; // Representation selection the user has already made if continuing a registration
}

/**
 * Data used to power the Competition Registration "My Skate Tests" page
 */
export interface CompetitionRegistrationSkateTestsScreenParamsData {
    competition: CompetitionRegistrationActiveCompetitionData;  // Information about the active competition
    skate_test_history: UserSkateTestHistoryData;               // The active user's Skate Test History data
}

export interface CompetitionRegistrationPartnerEventsScreenParamsData {
    competition: CompetitionRegistrationActiveCompetitionData;  // Information about the active competition
    selected_events: FormOptionDataValue[];                     // Array of event FormOption values for events that have already been selected
}

/**
 * Data used to power the Competition Registration "My Partners" page
 */
export interface PartnerIdentificationScreenParamsData {
    competition: CompetitionRegistrationActiveCompetitionData;  // Information about the active competition
    partner_categories: PartnerIdentificationCategoryData[];    // The categories for which a user can select a partner, including the selected partners if present
    state_options: StateFormOptionData[];                       // State form options for partner search form
    user_profile: UserProfileData;                              // The active user's profile
}

/**
 * Data needed for initial load of "Event Selection" page.  Note extension of EventSelectionAPIResponseData, as those
 * data points are required as well
 */
export interface CompetitionRegistrationEventSelectionScreenParamsData extends EventSelectionAPIResponseData {
    competition: CompetitionRegistrationActiveCompetitionData;  // Information about the active competition
    selected_partner_events: FormOptionDataValue[];             // Event keys for partner event types the user selected during "Partner Events"
}

/**
 * Data needed for initial load of "My Coaches" page.
 */
export interface CompetitionRegistrationCoachIdentificationScreenParamsData {
    competition: CompetitionRegistrationActiveCompetitionData;  // Information about the active competition
    event_categories: SkaterCoachedEventCategoryData[];         // Preexisting data structure used in previous release "My Coaches" page.  Unchanged.
    state_options: StateFormOptionData[];                       // State options for coach search form
}

/**
 * Data needed for initial load of "Waivers" page.
 */
export interface CompetitionRegistrationWaiversScreenParamsData {
    competition: CompetitionRegistrationActiveCompetitionData; // Information about the active competition
    form_options: {
        relationships: FormOptionData[];                      // Form options for "relationship" input
    };
    user_waivers: UserWaiverData[];                           // List of waivers to display, and user's signing data relative to each
}


/* ===========================================================================================================
*                                              Interactions
* ===========================================================================================================*/

/**
 * API payload when a user submits information from "Select Representation"
 */
export interface RepresentationSelectionAPIPayload {
    representation: RepresentationSelectionData;        // The user's representation selection data
}

/**
 * API response to a user's representation selection.  Base APISubmissionResponse.
 */
export interface RepresentationSelectionAPIResponse extends APISubmissionResponse {
}

/**
 * API payload when a user submits which Partner Event Types they would like to register for from "Partner Events"
 */
export interface PartnerEventsSelectionAPIPayload {
    events: FormOptionDataValue[];                      // The FormOption values for the events selected by the user
}

/**
 * API response to a user's partner events selection.  Base APISubmissionResponse.
 */
export interface PartnerEventsSelectionAPIResponse extends APISubmissionResponse {
}

/**
 * API payload when a user adds an event to their selections on Event Selection
 */
export interface EventSelectionAddAPIPayload {
    event_id: number;           // The ID of the event to add
}

/**
 * API response to a users add event selection.
 * Note APISubmissionResponse extension
 * Standard extension of EventSelectionAPIResponseData, but those properties are outlined here for descriptive purposes
 */
export interface EventSelectionAddAPIResponse extends APISubmissionResponse, EventSelectionAPIResponseData {
    available_events: EventSelectionEventData[];                // The updated list of events to display for event selection based on the addition.
    partner_skate_test_summary: PartnerSkateTestSummaryData[];  // Updated list of partner summaries resulting from the event addition
}

/**
 * API payload when a user removes an event from their selections on Event Selection
 */
export interface EventSelectionRemoveAPIPayload {
    event_id: number;           // The ID of the event to remove
}

/**
 * API response to a users remove event from selection.
 * Note APISubmissionResponse extension
 * Standard extension of EventSelectionAPIResponseData, but those properties are outlined here for descriptive purposes
 */
export interface EventSelectionRemoveAPIResponse extends APISubmissionResponse, EventSelectionAPIResponseData {
    available_events: EventSelectionEventData[];                // The updated list of events to display for event selection based on the removal.
    partner_skate_test_summary: PartnerSkateTestSummaryData[];  // Updated list of partner summaries resulting from the event removal
}

/**
 * API payload when a user is adding a self-reported skate test for partner skate tests
 */
export interface PartnerSkateTestAddAPIPayload {
    test_data: IndividualSkateTestData;      // The data related to the skate test being self-reported
    discipline_key: SkateTestDisciplineKey;  // Key to identify the discipline to which the skate test belongs
    partner_id: number;                      // The ID of the partner for which the skate test is being added
}

/**
 * API response for a user submission of partner skate test addition.
 *
 * Contains the relevant updated skate test history and partner skate test summary
 */
export interface PartnerSkateTestAddAPIResponse extends APISubmissionResponse {
    partner_skate_test_summary: PartnerSkateTestSummaryData[];  //The updated partner skate test summary for display on event selection.  Potentially updated based on submission ("meets requirements")
    skate_test_history: UserSkateTestHistoryData;               // The updated skate test history data resulting from the addition
}

/**
 * API payload when a user is removing a self-reported skate test for partner skate tests
 */
export interface PartnerSkateTestRemoveAPIPayload {
    test: SavedSkateTestData;                       // The data identifying the test being removed
    discipline_key: SkateTestDisciplineKey;         // Key to identify the discipline to which the skate test being removed belongs
    partner_id: number;                             // The ID of the partner for which the skate test is being removed
}

/**
 * API response for a user submission of partner skate test removal.
 *
 * Contains the relevant updated skate test history and partner skate test summary
 */
export interface PartnerSkateTestRemoveAPIResponse extends APISubmissionResponse {
    partner_skate_test_summary: PartnerSkateTestSummaryData[];  //The updated partner skate test summary for display on event selection.  Potentially updated based on submission ("meets requirements")
    skate_test_history: UserSkateTestHistoryData;               // The updated skate test history data resulting from the test removal
}

/**
 * API payload to add a partner for an event category
 */
export interface AddPartnerAPIPayload {
    member_id: number;          // the id of the member to assign as a partner for the category
    category_id: number;        // The id of the category present for the relevant PartnerIdentificationCategoryData
}

/**
 * API response to a add partner request
 * Note APISubmissionResponse extension
 */
export interface AddPartnerAPIResponse extends APISubmissionResponse {
    partner_categories: PartnerIdentificationCategoryData[];    //The updated partner identification data following the partner addition
}

/**
 * API payload to remove a partner for an event category
 */
export interface RemovePartnerAPIPayload {
    member_id: number;          // the id of the member to remove as a partner for the category
    category_id: number;        // The id of the category present for the relevant PartnerIdentificationCategoryData
}

/**
 * API response to a remove partner request
 * Note APISubmissionResponse extension
 */
export interface RemovePartnerAPIResponse extends APISubmissionResponse {
    partner_categories: PartnerIdentificationCategoryData[];    //The updated partner identification data following the partner removal
}

/**
 * API payload to add a coach for an event category
 */
export interface CompRegAddCoachAPIPayload {
    coach_id: number;           // the id of the member to add as a coach for the category
    category_id: number;        // The id of the category present for the relevant SkaterCoachedEventCategoryData
}

/**
 * API response to a add coach request
 * Note APISubmissionResponse extension
 */
export interface CompRegAddCoachAPIResponse extends APISubmissionResponse {
    event_categories: SkaterCoachedEventCategoryData[];      //The updated coach identification data following the coach addition
}

/**
 * API payload to remove a coach for an event category
 */
export interface CompRegRemoveCoachAPIPayload {
    coach_id: number;       // the id of the member to remove as a coach for the category
    category_id: number;    // The id of the category present for the relevant SkaterCoachedEventCategoryData
}

/**
 * API response to a remove coach request
 * Note APISubmissionResponse extension
 */
export interface CompRegRemoveCoachAPIResponse extends APISubmissionResponse {
    event_categories: SkaterCoachedEventCategoryData[];     //  The updated coach identification data following the coach removal
}

/**
 * API payload to replace a coach for an event category
 */
export interface CompRegReplaceCoachAPIPayload {
    coach_id: number;               // the id of the member to add as a coach for the category
    category_id: number;            // The id of the category present for the relevant SkaterCoachedEventCategoryData
    replace_coach_id: number;       // the id of the member being replaced as a coach for the category
}

/**
 * API response to a replace coach request
 * Note APISubmissionResponse extension
 */
export interface CompRegReplaceCoachAPIResponse extends APISubmissionResponse {
    event_categories: SkaterCoachedEventCategoryData[];     //  The updated coach identification data following the coach replacement
}