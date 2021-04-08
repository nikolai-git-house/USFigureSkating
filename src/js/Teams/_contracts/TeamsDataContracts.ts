import {EntityMembershipFieldData, MemberNumberData} from '../../contracts/data/DataContracts';
import {
    CompetitionFormattedDatesData,
    CompetitionFoundationData,
    CompetitionIconData
} from '../../contracts/data/CompetitionFieldDataContracts';

export namespace TeamsData {
    /**
     * Represents information about a team within the list from which a manager must choose in order to begin team registration
     */
    export interface ManagedTeam extends EntityMembershipFieldData {
        level: string;                          // The level of the team
        name: string;                           // The name of the team
        id: string;                             // Unique identifier for the team
        member_number: MemberNumberData;        // The member # for the team
        membership_status: {                    // Information about the team's membership status
            active: boolean;                    // Whether the team has active membership
            validity_date_formatted: string;    // The formatted date through which the team's membership is valid
        };
        selection_information:                  // Data supporting whether the team can be selected to begin registration
            SelectableTeamSelectionInformation | NonSelectableTeamSelectionInformation;
    }

    /**
     * Interface to enable transformation of team information with or without links
     */
    export interface ExtendedManagedTeam extends ManagedTeam {
        links?: {
            [key: string]: string;
        };
    }

    /**
     * Represents selection information about a team who can be selected for registration
     */
    export interface SelectableTeamSelectionInformation {
        is_selectable: true;                    // Indicates the team can be selected
    }

    /**
     * Represents selection information about a team who cannot be selected for registration
     */
    export interface NonSelectableTeamSelectionInformation {
        is_selectable: false;                   // Indicates the team cannot be selected
        is_not_selectable_reason: string;       // Description of why the team cannot be selected (eg: "Renew Membership")
        not_selectable_link?: string;           // Link applied to the not selectable reason in the UI
    }

    /**
     * Represents links to which a user can be redirected after selecting a team
     */
    export type SelectTeamLinks = {
        competition_registration: string;       // Link to teams competition registration
    }

    /**
     * Represents information about a competition on the My Competitions - Teams page
     */
    export interface MyCompetitionsTeamsCompetitionData extends CompetitionFoundationData, CompetitionFormattedDatesData, CompetitionIconData {
        links: {
            select_team: string;    // Link to select team page (next page in user flow when viewing a competition from this list)
        };
    }
}