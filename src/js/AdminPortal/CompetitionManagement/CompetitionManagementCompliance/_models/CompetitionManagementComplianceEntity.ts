/* eslint-disable jsdoc/require-jsdoc */
import {MemberNumber} from '../../../../contracts/AppContracts';
import {ComplianceRequirementsSummaryItem} from '../../../_contracts/AdminPortalContracts';
import {
    CompetitionManagementComplianceComplianceEntityPosition,
    CompetitionManagementCompliancePageEntityInterface
} from '../_contracts/CompetitionManagementComplianceContracts';

export interface CompetitionManagementComplianceEntityParameters {
    city: string;
    compliance_summary: ComplianceRequirementsSummaryItem[];
    email_address: string;
    first_name: string;
    id: number;
    is_compliant: boolean;
    last_name: string;
    member_number: MemberNumber;
    phone_number: string;
    positions: CompetitionManagementComplianceComplianceEntityPosition[];
    state_abbreviation: string;
}

export class CompetitionManagementComplianceEntity implements CompetitionManagementCompliancePageEntityInterface {
    city: string;
    compliance_summary: ComplianceRequirementsSummaryItem[];
    email_address: string;
    first_name: string;
    id: number;
    is_compliant: boolean;
    last_name: string;
    member_number: MemberNumber;
    phone_number: string;
    positions: CompetitionManagementComplianceComplianceEntityPosition[];
    state_abbreviation: string;

    constructor(parameters: CompetitionManagementComplianceEntityParameters) {
        const {id, compliance_summary, is_compliant, member_number, positions, city, email_address, first_name, last_name, phone_number, state_abbreviation} = parameters;
        this.id = id;
        this.compliance_summary = compliance_summary;
        this.is_compliant = is_compliant;
        this.member_number = member_number;
        this.positions = positions;
        this.city = city;
        this.email_address = email_address;
        this.first_name = first_name;
        this.last_name = last_name;
        this.phone_number = phone_number;
        this.state_abbreviation = state_abbreviation;
    }

    get full_name(): string {
        return [this.first_name, this.last_name].join(' ');
    }

}