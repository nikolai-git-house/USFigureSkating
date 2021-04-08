import {MemberNumber} from '../../../../contracts/AppContracts';
import {
    ComplianceRequirementsSummaryItem,
    ComplianceRequirementsSummaryItemDescribed
} from '../../../_contracts/AdminPortalContracts';

/**
 * Interface for subentities for a CheckIn Entity
 * ex: Coached Skaters, Team Members, Team Service Personnel
 */
export interface CheckInSubEntity {
    email_address?: string;
    first_name: string;
    is_checkin_complete: boolean;
    last_name: string;
    member_number?: MemberNumber;
    phone_number?: string;
}

export interface CheckInSubEntityTeamCoachParameters {
    can_be_added_to_roster: boolean;
    cannot_be_added_to_roster_reason: string;
    compliance_summary: ComplianceRequirementsSummaryItem[];
    email_address: string;
    first_name: string;
    full_name: string;
    id: number;
    last_name: string;
    member_number: MemberNumber;
    phone_number: string;
}

export interface CheckInSubEntitySkaterParameters {
    age: number;
    can_be_added_to_roster: boolean;
    cannot_be_added_to_roster_reason: string;
    compliance_summary: ComplianceRequirementsSummaryItemDescribed[];
    first_name: string;
    full_name: string;
    id: number;
    last_name: string;
    member_number: MemberNumber;
    requirements_summary: ComplianceRequirementsSummaryItemDescribed[];
}

export interface CheckInSubEntityTeamServicePersonnelParameters {
    can_be_added_to_roster: boolean;
    cannot_be_added_to_roster_reason: string;
    compliance_summary: ComplianceRequirementsSummaryItem[];
    email_address: string;
    first_name: string;
    full_name: string;
    id: number;
    last_name: string;
    member_number: MemberNumber;
    phone_number: string;
    team_role: string;
}

export type CheckInSubEntitySkaterCoachParameters = {
    first_name: string;
    id: number;
    last_name: string;
    compliance_summary: ComplianceRequirementsSummaryItem[];
    ineligible: boolean;
};