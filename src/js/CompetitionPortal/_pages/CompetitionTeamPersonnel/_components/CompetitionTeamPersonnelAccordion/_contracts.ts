import {MemberNumber, StatusSummaryItem} from '../../../../../contracts/AppContracts';

export namespace CompetitionTeamPersonnelAccordion {
    export interface Person {
        id: string;
        last_name: string;
        first_name: string;
        member_number: MemberNumber;
        is_compliant: boolean;
        compliance_summary: StatusSummaryItem[];
        is_ineligible: boolean;
    }
}