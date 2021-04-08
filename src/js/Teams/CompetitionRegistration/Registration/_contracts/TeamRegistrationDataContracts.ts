import {
    CompetitionFormattedDatesData,
    CompetitionFoundationData,
    CompetitionIconData
} from '../../../../contracts/data/CompetitionFieldDataContracts';
import {EntityMembershipFieldData, MemberNumberData} from '../../../../contracts/data/DataContracts';

export namespace TeamRegistrationData {
    /**
     * Represents information about the active competition within the registration workflow
     */
    export interface CompetitionSummary extends CompetitionFoundationData, CompetitionIconData, CompetitionFormattedDatesData {
        links: {
            cart: string;  // Link to direct the user to following completion of the registration workflow
        };
    }

    /**
     * Represents team profile information for the team verification page
     */
    export interface TeamProfile extends EntityMembershipFieldData {
        level: string;                          // The level of the team
        name: string;                           // The name of the team
        id: string;                             // Unique identifier for the team.  Used to construct endpoint URL when changing team name
        club: string;                           // The name of the club associated with the team. "Individual Member" if team not associated with club
        member_number: MemberNumberData;        // The member # for the team
        membership_status: {                    // Information about the team's membership status
            active: boolean;                    // Whether the team has active membership
            validity_date_formatted: string;    // The formatted date through which the team's membership is valid
        };
        section?: string;                       // The name of the section the team belongs to, if applicable
    }

    /**
     * Represents information about the active team within the registration workflow
     */
    export interface TeamSummary {
        name: string;                   // The name of the team
        level: string;                  // The level of the team
        has_prop_crew: boolean;         // Whether the prop crew step displays in registration for the team
        initial_page?: PageKey;         // The page to display upon initial load. If not provided, the first page in the workflow will load
    }

    /**
     * A key indicating a workflow page step
     */
    export type PageKey =
        'team_verification' |
        'overview' |
        'event_selection' |
        'roster' |
        'coaches' |
        'team_service_personnel' |
        'prop_crew';

    /**
     * Represents data to populate a pricing table
     */
    export interface PricingTable {
        config: PricingTableConfiguration;  // Configuration for the table
        rows: PricingRow[];                 // Row data for table
    }

    /**
     * Represents configuration data for a pricing table
     */
    interface PricingTableConfiguration {
        title: string;              // Title to display above table
        column_names: string[];     // List of column names for the table
        null_row_message: string;   // Message to display in a row when the row contains only null values
    }

    /**
     * Represents a row within a pricing table
     */
    export interface PricingRow {
        label: string;              // Label for the row.  First column to display for the row
        values: (number | null)[];  // Values for remaining columns in table
    }

    /**
     * Represents an event available for selection, or already selected, by the current team
     */
    export type EventSelectionEvent = {
        id: number;                     // Unique identifier for the event
        is_registered_for: boolean;     // Whether the event has been registered for by the team
        is_selected: boolean;           // Whether the event has been selected, but not registered for, by the team
        judging_system: string;         // Judging system name
        music_required: boolean;        // Whether music is required
        name: string;                   // Name of the event
        ppc_required: boolean;          // Whether PPC is required
    }

    /**
     * Represents common information for a team entity (Skater, Coach, TSP, Prop Crew)
     */
    interface AbstractTeamEntityData {
        id: string;                                     // Unique identifier for the Skater
        last_name: string;                              // Member's last name
        first_name: string;                             // Member's first name
        member_number: MemberNumberData;                // Member's member number
        can_be_added_to_roster: boolean;                // Whether the member can be added to the competition roster
        cannot_be_added_to_roster_reason?: string;      // If the member can't be added to the competition roster, reason for why not ('Invalid age,' 'Ineligible to Participate,' etc)
    }

    /**
     * Represents information about a member in a team roster
     */
    export interface TeamRosterMemberData extends AbstractTeamEntityData {
        age: number;                                    // The age of the member
    }

    /**
     * Represents information about a coach associated with a team
     */
    export interface TeamCoachData extends AbstractTeamEntityData {
    }

    /**
     * Represents information about a team service person associated with a team
     */
    export interface TeamServicePersonData extends AbstractTeamEntityData {
    }

    /**
     * Represents information about a prop crew person associated with a team
     */
    export interface PropCrewPersonData extends AbstractTeamEntityData {
    }
}