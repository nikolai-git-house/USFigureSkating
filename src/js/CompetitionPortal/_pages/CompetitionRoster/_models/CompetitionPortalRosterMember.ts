/* eslint-disable jsdoc/require-jsdoc */
import {CompetitionRosterPage} from '../_contracts';
import {MemberNumber} from '../../../../contracts/AppContracts';

interface ConstructorParams {
    first_name: string;
    id: string;
    is_compliant: boolean;
    is_ineligible: boolean;
    last_name: string;
    member_number: MemberNumber;
    age: number;
    compliance_requirements_summary: CompetitionRosterPage.RosterMemberComplianceRequirementsSection[];
}

export class CompetitionPortalRosterMember implements CompetitionRosterPage.CompetitionRosterMember {
    first_name: string;
    id: string;
    is_compliant: boolean;
    is_ineligible: boolean;
    last_name: string;
    member_number: MemberNumber;
    age: number;
    compliance_requirements_summary: CompetitionRosterPage.RosterMemberComplianceRequirementsSection[];

    constructor(params: ConstructorParams) {
        this.first_name = params.first_name;
        this.id = params.id;
        this.is_compliant = params.is_compliant;
        this.is_ineligible = params.is_ineligible;
        this.last_name = params.last_name;
        this.member_number = params.member_number;
        this.age = params.age;
        this.compliance_requirements_summary = params.compliance_requirements_summary;
    }

    get can_be_added_to_roster(): boolean {
        return !this.is_ineligible;
    }

    get cannot_be_added_to_roster_reason(): string {
        return this.is_ineligible ? 'Ineligible to participate' : '';
    }

    get supporting_information(): string {
        return '';
    }
}