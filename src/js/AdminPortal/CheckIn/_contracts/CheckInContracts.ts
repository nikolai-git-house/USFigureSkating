import {CompetitionHeadingSource, IdIndexedSubmissionStatus} from '../../../contracts/AppContracts';
import {Music} from '../../../models/Music/Music';
import {ComplianceRequirementsSummaryItem} from '../../_contracts/AdminPortalContracts';
import {SubmitEmailPayload} from '../../EmailForm/_contracts/EmailFormContracts';
import {AbstractCheckInEntity} from '../_models/CheckInEntities/AbstractCheckInEntity';
import {CheckInEntityCheckInStatus} from './CheckInEntityContracts';

/**
 * Interface for Competition within CheckIn
 */
export interface CheckInCompetitionInterface extends CompetitionHeadingSource {
    check_in_report_url: string;
    id: number;
    name: string;
    team_roster_can_be_edited: boolean;
}

/**
 * A skater coached by the active check-in entity
 */
export type CheckInEntityCoachedSkater = {
    checked_in: boolean;
    first_name: string;
    last_name: string;
}
/**
 * A comment applied to a check-in entity
 */
export type CheckInEntityComment = {
    author: string;
    comment: string;
    datetime_formatted: string;
    id: number;
}
/**
 * A single event for a check-in entity.  Contains music/ppc information
 *
 * ex: "Intermediate Teams - Free"
 */
export type CheckInEventSegment = {
    event_id: number;
    id: number;
    name: string;
    music: Music | null;
    music_required: boolean;
    music_status: CheckInEventSegmentRequirementStatus;
    ppc: string[];
    ppc_required: boolean;
    ppc_status: CheckInEventSegmentRequirementStatus;
}
/**
 * Represents the status of Music or PPC for a check-in entity's CheckInEventSegment
 */
export type CheckInEventSegmentRequirementStatus = {
    completed: boolean;
    overridden: boolean;
}
/**
 * Payload to change a CheckInEventSegmentRequirementStatus for a check-in entity's CheckInEventSegment
 *
 * Can be used for Music or PPC override change
 */
export type CheckInEventSegmentStatusOverridePayload = {
    segment: CheckInEventSegment;
    is_overridden: boolean;
}
/**
 * Parent wrapper for a check-in entity's events.  Wraps one or more CheckInEventSegment items
 *
 * ex: "Intermediate Teams"
 */
export type CheckInEvent = {
    segments: CheckInEventSegment[];
    id: number;
    name: string;
}
/**
 * Criteria representing full check-in index filters information
 */
export type CheckInIndexFilterCriteria = {
    filter_term: string;                                     // The text term entered by the user
    selected_status_filters: CheckInIndexStatusFilter[];     // The status filters selected by the user
}
/**
 * Status filter for check-in index page
 */
export type CheckInIndexStatusFilter = {
    label: string;
    value: CheckInIndexStatusFilterValue;
}
/**
 * Value for a status filter on check-in index page
 */
export type CheckInIndexStatusFilterValue = 'all' | 'checked_in' | 'not_checked_in' | 'ineligible';

/**
 * In-app payload to alter the override status of a ComplianceRequirementsSummaryItem
 */
export type ComplianceRequirementsSummaryItemOverridePayload = {
    compliance_item: ComplianceRequirementsSummaryItem;
    overridden: boolean;
};

export interface EditableComplianceSummaryState extends IdIndexedSubmissionStatus{}

/**
 * State payload to update an entity's check-in status
 */
/**
 * App payload to check an entity in
 */
export interface CheckEntityInPayload {
    credential_provided: boolean;
    unpaid_fees_received: boolean;
}

export type UpdateEntityCheckInStatusStatePayload = {
    entity: AbstractCheckInEntity;
    status: CheckInEntityCheckInStatus;
}

/**
 * App payload when submitting a Check-in email
 */
export interface SubmitCheckInEmailPayload extends SubmitEmailPayload {
}