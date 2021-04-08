import {MemberNumber} from '../../../../contracts/AppContracts';
import {TeamRegistration} from '../../../../Teams/CompetitionRegistration/Registration/_contracts';

export namespace CompetitionRosterPage {
    /**
     * A selected roster member on the Competition Roster page
     */
    export interface CompetitionRosterMember extends TeamRegistration.RosterEditMember {
        id: string;
        is_compliant: boolean;
        is_ineligible: boolean;
        last_name: string;
        first_name: string;
        member_number: MemberNumber;
        age: number;
        compliance_requirements_summary: RosterMemberComplianceRequirementsSection[];
    }

    /**
     * A section for a member's roster/compliance information
     */
    export type RosterMemberComplianceRequirementsSection = {
        name: string;
        items: RosterMemberComplianceRequirementsItem[];
        is_complete: boolean;
    }
    /**
     * An item within a compliance requirements summary
     */
    type RosterMemberComplianceRequirementsItem = {
        name: string;
        complete: boolean;
        is_membership?: boolean;
        is_age_verification?: boolean;
        membership_expiration_date_formatted?: string;
    }
}