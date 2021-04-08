import {TeamRegistrationData} from './TeamRegistrationDataContracts';
import {APISubmissionResponse} from '../../../../contracts/release3/api/CommonAPIContracts';

export namespace TeamRegistrationApi {
    /**
     * API response when fetching shell information to power the Team Registration workflow
     */
    export interface FetchShellApiResponse {
        competition: TeamRegistrationData.CompetitionSummary;   // Information about the active competition
        team: TeamRegistrationData.TeamSummary;                 // Information about the active team
    }

    /**
     * API response when fetching information to power the Team Verification step of the registration process
     */
    export interface FetchTeamVerificationApiResponse {
        team_profile: TeamRegistrationData.TeamProfile;     // Team profile information
    }

    /**
     * API payload when updating the team name
     */
    export interface UpdateTeamNameApiPayload {
        name: string;       // The updated team name to save
    }

    /**
     * API response when fetching information to power the Registration Overview step of the registration process
     */
    export interface FetchRegistrationOverviewApiResponse {
        registration_information: string[];                          // Bullet point items for "Registration information" drawer.  Supports HTML
                                                                     // Note: if anchor elements are provided in HTML, they will automatically be assigned
                                                                     // the following attributes: `target="_blank"` and `rel="noopener noreferrer"`
        rulebook_year: string;                                       // The active rulebook year. Ex: "2019 - 2020"
        price_information: TeamRegistrationData.PricingTable[];      // Information to display in pricing tables
    }

    /**
     * API response when fetching information for the Event Selection page
     */
    export interface FetchEventSelectionApiResponse {
        events: TeamRegistrationData.EventSelectionEvent[];      // List of events for the page
    }

    /**
     * API response when removing an event
     */
    export interface RemoveEventApiResponse extends APISubmissionResponse {
        events: TeamRegistrationData.EventSelectionEvent[];      // The updated list of events for the page after the removal
    }

    /**
     * API response when adding an event
     */
    export interface AddEventApiResponse extends APISubmissionResponse {
        events: TeamRegistrationData.EventSelectionEvent[];      // The updated list of events for the page after the add
    }

    /**
     * API response when fetching information for the Competition Roster page
     */
    export interface FetchCompetitionRosterApiResponse {
        team_roster: TeamRegistrationData.TeamRosterMemberData[];   // The full team roster
        selected_roster_ids: string[];                              // The IDs of the roster team members currently selected
        roster_rules: string[];                                     // The rules to display above the roster selection component
        per_skater_fee?: number;                                    // The fee per skater for the competition, if applicable.
        roster_minimum?: number;                                    // The minimum number of members to ensure a valid roster
        roster_maximum?: number;                                    // If provided, this will prevent users from adding members to the roster once this amount is reached.
                                                                    // In this case, when user has not selected the maximum amount, a message "You can select up to <x>" will display.
                                                                    // Additionally, when the maximum has been reached, a message "You have reached the max allowed" will display.
                                                                    // If this property is not provided, UI will not prevent user from adding members past the maximum and messages noted above will not display
    }

    /**
     * Server payload to update the competition roster
     *
     * Array of numbers, which are the IDs from each TeamRegistrationData.TeamRosterMemberData item intended for the competition roster
     */
    export interface UpdateCompetitionRosterApiPayload extends Array<number> {
    }

    /**
     * API response when fetching information for the Coaches page
     */
    export interface FetchCoachesApiResponse {
        team_coaches: TeamRegistrationData.TeamCoachData[];         // The team coach list
        selected_coach_ids: string[];                               // The IDs of the currently selected coaches
        coach_maximum: number;                                      // The maximum amount of coaches allowed for selection
    }

    /**
     * Server payload to update the competition coach list
     *
     * Array of numbers, which are the IDs from each TeamRegistrationData.TeamCoachData item intended for the coach list
     */
    export interface UpdateCoachesApiPayload extends Array<number> {
    }

    /**
     * API response when fetching information for the Team Service Personnel page
     */
    export interface FetchTeamServicePersonnelApiResponse {
        team_service_personnel: TeamRegistrationData.TeamServicePersonData[];        // The team TSP list
        selected_team_service_personnel_ids: string[];                               // The IDs of the currently selected TSP
        team_service_personnel_maximum: number;                                      // The maximum amount of TSP allowed for selection
    }

    /**
     * Server payload to update the competition TSP list
     *
     * Array of numbers, which are the IDs from each TeamRegistrationData.TeamServicePersonData item intended for the TSP list
     */
    export interface UpdateTeamServicePersonnelApiPayload {
    }

    /**
     * API response when fetching information for the Prop Crew page
     */
    export interface FetchPropCrewApiResponse {
        prop_crew: TeamRegistrationData.PropCrewPersonData[];           // The team Prop Crew list
        selected_prop_crew_ids: string[];                               // The IDs of the currently selected Prop Crew
        prop_crew_maximum: number;                                      // The maximum amount of Prop Crew allowed for selection
    }

    /**
     * Server payload to update the competition Prop Crew list
     *
     * Array of numbers, which are the IDs from each TeamRegistrationData.PropCrewData item intended for the Prop Crew list
     */
    export interface UpdatePropCrewApiPayload {
    }
}