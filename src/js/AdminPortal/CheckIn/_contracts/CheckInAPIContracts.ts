import {APISubmissionResponse} from '../../../contracts/release3/api/CommonAPIContracts';
import {StateFormOptionData} from '../../../contracts/release3/data/CommonDataContracts';
import {
    FetchEmailConfigurationAPIResponse,
    SubmitEmailAPIPayload
} from '../../EmailForm/_contracts/EmailFormAPIContracts';
import {EmailRecipientOptionCategoryData} from '../../EmailForm/_contracts/EmailFormDataContracts';
import {
    CheckInEntityCoachedSkaterData,
    CheckInSubEntitySkaterCoachData,
    CheckInSubEntitySkaterData,
    CheckInSubEntityTeamCoachData,
    CheckInSubEntityTeamServicePersonnelData,
    ComplianceRequirementsSummaryItemData
} from '../EntityCheckIn/_contracts/CheckInSubEntityDataContracts';
import {
    CheckInEntityCommentData,
    CheckInEventData,
    SkaterCompliantCoachedEventCategoryData
} from './CheckInDataContracts';
import {
    CheckInEntityCheckInComplianceData,
    CheckInEntityCheckInStatusData,
    CheckInEntityListData
} from './CheckInEntityDataContracts';

/**
 * Server response when fetching the events for a check-in entity
 */
export interface FetchEntityEventsAPIResponse extends Array<CheckInEventData> {}

/**
 * Server response when fetching the coached skaters for a check-in entity
 */
export interface FetchEntityCoachedSkatersAPIResponse extends Array<CheckInEntityCoachedSkaterData> {}

/**
 * Server response when fetching an entity's check-in comments
 */
export interface FetchEntityCommentsAPIResponse extends Array<CheckInEntityCommentData> {}

/**
 * Server response when fetching an entity's check-in compliance information
 */
export interface FetchEntityComplianceAPIResponse extends Array<ComplianceRequirementsSummaryItemData> {}

/**
 * Server response when fetching information for the check-in roster subpage set
 */
export interface FetchEntityRosterInformationAPIResponse {
    competition_roster_skater_ids: number[];       // The IDs of the skaters in the active competition roster
    team_roster: CheckInSubEntitySkaterData[];     // List of skaters in the full team roster
    team_roster_rules?: string[];                  // The rules to display on the team roster page on Check-In
}

/**
 * Server response when fetching coach-event assignment information for a skater check-in entity
 */
export interface FetchEntitySkaterCoachInformationAPIResponse extends Array<SkaterCompliantCoachedEventCategoryData> {}

/**
 * Server response when fetching search form options for check-in skater coach search for an active entity
 */
export interface FetchEntitySkaterCoachSearchFormOptionsAPIResponse {
    states: StateFormOptionData[];     // list of options for state input
}

/**
 * Server response when fetching information about the check-in entity's team coaches
 */
export interface FetchEntityTeamCoachInformationAPIResponse {
    competition_coach_ids: number[];                   // List of IDs of coaches currently set to attend the competition
    team_coaches: CheckInSubEntityTeamCoachData[];     // The list of coaches available for the team
}

/**
 * Server response when fetching information about the check-in entity's team service personnel
 */
export interface FetchEntityTeamServicePersonnelInformationAPIResponse {
    competition_team_service_personnel_ids: number[];                       // The list of TSP selected for the competition
    team_service_personnel: CheckInSubEntityTeamServicePersonnelData[];     // The full list of TSP associated with the team
}

/**
 * Server payload to override the status on an Event Music/PPC item
 */
export interface OverrideCheckInEventSegmentMusicPpcItemAPIPayload {
    event_id: number;           // The ID of the CheckInEventData of the CheckInEventSegmentData being modified
    is_overridden: boolean;     // Whether the "viewed" checkbox has been checked
    segment_id: number;         // The ID of the CheckInEventSegmentData item being modified
}

/**
 * Server payload when overriding a compliance item for a check-in entity
 */
export interface OverrideComplianceItemAPIPayload {
    compliance_item_id: number;         // The ID of the compliance item being overridden
    is_overridden: boolean;             // Whether the item is being set to overridden
}

/**
 * Server payload when submitting a new check-in comment for an entity. The string content of the new comment
 */
export interface SubmitEntityCommentAPIPayload {
    comment: string;
}

/**
 * Server payload when submitting a new check-in comment for an entity
 */
export interface EntityCommentAPISubmissionResponse extends APISubmissionResponse {
    comment: CheckInEntityCommentData;
}

/**
 * Server payload to update an entity's competition roster during check-in
 *
 * Array of numbers, which are the IDs from each CheckInSubEntitySkaterData item intended for the competition roster
 */
export interface UpdateEntityCompetitionRosterAPIPayload extends Array<number> {}

/**
 * Server payload to update an entity's selection for team coaches for a competition during check-in
 *
 * Array of numbers, which are the IDs from each CheckInSubEntityTeamCoachData item intended for selection
 */
export interface UpdateEntityCompetitionTeamCoachesAPIPayload extends Array<number> {}

/**
 * Server payload to update an entity's selection for team service personnel for a competition during check-in
 *
 * Array of numbers, which are the IDs from each CheckInSubEntityTeamServicePersonnelData item intended for selection
 */
export interface UpdateEntityCompetitionTeamServicePersonnelAPIPayload extends Array<number> {}

/**
 * Server payload when adding a coach to a check-in entity's (skater's) event category
 */
export interface AddEntitySkaterCategoryCoachAPIPayload {
    category_id: number;     // The ID of the category to which the coach is being added
    coach_id: number;        // The ID of the coach being added
}

/**
 * Server response when adding a coach to a check-in entity's (skater's) event category
 */
export interface AddEntitySkaterCategoryCoachAPIResponse extends APISubmissionResponse {
    coach: CheckInSubEntitySkaterCoachData;     // The data representing the coach, with compliance information, that was successfully added
}

/**
 * Server response when replacing a coach for a check-in entity's (skater's) event category
 */
export interface ReplaceEntitySkaterCategoryCoachAPIResponse extends APISubmissionResponse {
    coach: CheckInSubEntitySkaterCoachData;     // The data representing the coach, with compliance information, that was successfully added as a replacement
}

/**
 * Server payload when removing a coach for a check-in entity's (skater's) event category
 */
export interface RemoveEntitySkaterCategoryCoachAPIPayload {
    category_id: number;     // The ID of the category to remove the coach from
    coach_id: number;        // The ID of the coach to remove for the category
}

/**
 * Server payload when replacing a coach for a check-in entity's (skater's) event category
 */
export interface ReplaceEntitySkaterCategoryCoachAPIPayload {
    category_id: number;          // The id of the category to the coach is being replaced in
    coach_id: number;             // the id of the member to add as a coach for the category
    replace_coach_id: number;     // the id of the member being replaced as a coach for the category
}

/**
 * Server response when fetching data necessary for Check-In index page
 */
export interface FetchCheckInEntitiesAPIResponse extends CheckInEntityListData {}

export interface FetchCheckInEntityApiResponse extends CheckInEntityCheckInComplianceData {}

/**
 * Server payload when checking an entity in
 */
export interface CheckEntityInAPIPayload {
    credential_provided: boolean;      // Whether the credential checkbox was checked during check-in.  Should always be true
    unpaid_fees_received: boolean;     // Whether the unpaid fees received checkbox was checked. False when entity has no unpaid fees
}

/**
 * Server response when checking an entity in
 */
export interface CheckEntityInAPIResponse extends APISubmissionResponse {
    status: CheckInEntityCheckInStatusData;     // The updated check-in status information for the entity
}

/**
 * Server response when fetching Check-In email recipient options
 *
 * BCC key with values is required
 *
 * CC key value is not explicitly required, but recommended to load the appropriate CC entities
 */
export interface FetchCheckInEmailConfigurationAPIResponse extends FetchEmailConfigurationAPIResponse {
    bcc: EmailRecipientOptionCategoryData[];     // The BCC options list
}

/**
 * Server payload when submitting a Check-in email
 *
 * Data will be posted with a Content-Type: multipart/form-data;
 */
export interface SubmitCheckInEmailAPIPayload extends SubmitEmailAPIPayload {
}