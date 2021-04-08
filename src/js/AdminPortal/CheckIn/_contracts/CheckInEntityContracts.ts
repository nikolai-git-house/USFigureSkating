import {UserLTSInformationSummaryWithExpiration} from '../../../contracts/app/UserContracts';
import {MemberNumber} from '../../../contracts/AppContracts';
import {CheckInEntityCoach} from '../_models/CheckInEntities/CheckInEntityCoach';
import {CheckInEntityCompetitionContact} from '../_models/CheckInEntities/CheckInEntityCompetitionContact';
import {CheckInEntityOfficial} from '../_models/CheckInEntities/CheckInEntityOfficial';
import {CheckInEntitySkater} from '../_models/CheckInEntities/CheckInEntitySkater';
import {CheckInEntityTeam} from '../_models/CheckInEntities/CheckInEntityTeam';
import {CheckInEntityTeamCoach} from '../_models/CheckInEntities/CheckInEntityTeamCoach';
import {CheckInEntityTeamServicePersonnel} from '../_models/CheckInEntities/CheckInEntityTeamServicePersonnel';
import {CheckInEntityVolunteer} from '../_models/CheckInEntities/CheckInEntityVolunteer';

/**
 * Structure required for the Entity Check-In Flow In State
 */
export interface CheckInEntityStateInterface {
    id: string;
}

export type CheckInEntityCheckInStatus = {
    checked_in: boolean;
    checked_in_by: string | null;
    checked_in_date_time_formatted: string | null;
    credential_received: boolean;
    unpaid_fees_received: boolean;
}

export type CheckInEntityOutstandingFee = {
    name: string;
    amount: string;
}
export type CheckInEntityTypeKey =
    'coach'
    | 'competition_contact'
    | 'official'
    | 'skater'
    | 'team'
    | 'team_coach'
    | 'team_personnel'
    | 'volunteer';

/**
 * A concrete instance of a check-in entity
 */
export type CheckInEntityInstance = (CheckInEntityCoach | CheckInEntityCompetitionContact | CheckInEntityOfficial | CheckInEntitySkater | CheckInEntityTeam | CheckInEntityTeamCoach | CheckInEntityTeamServicePersonnel | CheckInEntityVolunteer);

/**
 * A list of CheckInEntityInstance items
 */
export type CheckInEntityList = CheckInEntityInstance[];

/**
 * Structure required for Check-In Entity Card component
 */
export interface CheckInEntityCardEntity {
    checked_in: boolean;
    checked_in_by: string | null;
    checked_in_date_time_formatted: string | null;
    comment_count: number;
    eligible: boolean;
    entity_type_description: string;
    id: string;
    member_number: MemberNumber;
    name: string;
}

/**
 * Structure required for Check-In Index entities
 */
export interface CheckInIndexEntity extends CheckInEntityCardEntity {
}

/**
 * Structure required for Check-In Entity Index entities
 */
export interface CheckInEntityIndexEntity {
    check_in_index_heading: string;
    check_in_permitted: boolean;
    check_in_status: CheckInEntityCheckInStatus;
    checked_in: boolean;
    club: string | null;
    coach_count: number;
    comment_count: number;
    eligible: boolean;
    email: string | null;
    entity_type_description: string;
    entity_type_key: CheckInEntityTypeKey;
    events_complete: boolean;
    is_compliant: boolean;
    lts_summary: UserLTSInformationSummaryWithExpiration | null;
    member_number: MemberNumber;
    membership_status: {
        active: boolean;
        validity_date_formatted: string | null;
    };
    name: string;
    outstanding_fees: CheckInEntityOutstandingFee[];
    personal_schedule_url: string | null;
    phone: string | null;
    roster_count: number;
    skater_count: number;
    summary_name: string;
    team_level: string | null;
    team_service_personnel_count: number;
    unpaid_events: string[];
}