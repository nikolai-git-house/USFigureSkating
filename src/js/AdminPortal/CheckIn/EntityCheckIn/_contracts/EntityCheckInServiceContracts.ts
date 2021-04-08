import {StateFormOption} from '../../../../contracts/AppContracts';
import {SkaterCoachedEventCategoryCollection} from '../../../../models/Collections/SkaterCoachedEventCollection';
import {ComplianceRequirementsSummaryItem} from '../../../_contracts/AdminPortalContracts';
import {CheckInEntityCoachedSkater, CheckInEntityComment, CheckInEvent} from '../../_contracts/CheckInContracts';
import {CheckInSubEntitySkater} from '../_models/CheckInSubEntitySkater';
import {CheckInSubEntityTeamServicePersonnel} from '../_models/CheckInSubEntityTeamServicePersonnel';

/**
 * App service response when fetching check-in skater coach search form options
 */
export interface FetchActiveEntitySkaterCoachSearchFormOptionsResponse extends Array<StateFormOption> {}

/**
 * App service response when fetching check-in skater coach information
 */
export interface FetchActiveEntitySkaterCoachInformationResponse extends SkaterCoachedEventCategoryCollection {}

/**
 * App service response when fetching check-in coached skaters data
 */
export interface FetchCheckInCoachedSkatersResponse extends Array<CheckInEntityCoachedSkater> {}

/**
 * App service response when fetching check-in events data
 */
export interface FetchCheckInEventsResponse extends Array<CheckInEvent> {}

/**
 * App service response when fetching active entity check-in comments
 */
export interface FetchActiveEntityCommentsResponse extends Array<CheckInEntityComment> {}

/**
 * App service response when fetching roster sub-page data
 */
export interface FetchActiveEntityRosterInformationResponse {
    active_roster_skater_ids: number[];
    roster: CheckInSubEntitySkater[];
    team_roster_rules: string[];
}

/**
 * App service response when fetching team service personnel sub-page data
 */
export interface FetchActiveEntityTeamServicePersonnelInformationResponse {
    competition_team_service_personnel_ids: number[];
    team_service_personnel: CheckInSubEntityTeamServicePersonnel[];
}

/**
 * App service response when submitting a new comment
 */
export interface SubmitActiveEntityCommentResponse {
    comment: CheckInEntityComment;
}

export interface FetchEntityComplianceResponse extends Array<ComplianceRequirementsSummaryItem> {}