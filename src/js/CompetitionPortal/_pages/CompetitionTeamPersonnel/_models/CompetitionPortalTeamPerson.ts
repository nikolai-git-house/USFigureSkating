/* eslint-disable jsdoc/require-jsdoc */
import {MemberNumber, StatusSummaryItem} from '../../../../contracts/AppContracts';
import {CompetitionTeamPersonnelAccordion, CompetitionTeamPersonnelPage} from '../_contracts';

interface ConstructorParams {
    compliance_summary: StatusSummaryItem[];
    first_name: string;
    id: string;
    is_compliant: boolean;
    is_ineligible: boolean;
    last_name: string;
    member_number: string | number;
}

export class CompetitionPortalTeamPerson implements CompetitionTeamPersonnelAccordion.Person, CompetitionTeamPersonnelPage.Person {
    compliance_summary: StatusSummaryItem[];
    first_name: string;
    id: string;
    is_compliant: boolean;
    is_ineligible: boolean;
    last_name: string;
    member_number: MemberNumber;

    constructor(params: ConstructorParams) {
        this.compliance_summary = params.compliance_summary;
        this.first_name = params.first_name;
        this.id = params.id;
        this.is_compliant = params.is_compliant;
        this.is_ineligible = params.is_ineligible;
        this.last_name = params.last_name;
        this.member_number = params.member_number;
    }
}