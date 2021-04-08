import {MemberNumberData, StatusSummaryItemData} from '../../../../contracts/data/DataContracts';

export namespace CompetitionTeamPersonnelData {
    /**
     * Represents a person associated with a team for a competition (coach, team service person, prop crew)
     */
    export interface CompetitionTeamPerson {
        id: string;                                     // Unique identifier for the person
        first_name: string;                             // First name for the person
        last_name: string;                              // Last name for the person
        is_compliant: boolean;                          // Whether the person is compliant for the person
        is_ineligible: boolean;                         // Whether the person is ineligible to participate
        member_number: MemberNumberData;                // The person's member number
        compliance_summary: StatusSummaryItemData[];    // Summary of the person's compliance information
    }

    /**
     * Represents the full collection of CompetitionTeamPersons associated with a team for a competition
     */
    export interface CompetitionTeamPersonnel {
        coaches: CompetitionTeamPerson[];                   // The list of coaches associated with the team for the competition
        team_service_personnel: CompetitionTeamPerson[];    // The list of team service personnel associated with the team for the competition
        prop_crew?: CompetitionTeamPerson[];                // The list of prop crew associated with the team for the competition
    }
}