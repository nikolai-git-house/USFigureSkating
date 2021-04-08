import {CompetitionPortalApi} from '../../../_contracts';
import {CompetitionRosterData} from './CompetitionRosterDataContracts';
import {TeamRegistrationData} from '../../../../Teams/CompetitionRegistration/Registration/_contracts';
import {APISubmissionResponse} from '../../../../contracts/release3/api/CommonAPIContracts';

export namespace CompetitionRosterApi {
    /**
     * API Response when fetching information for the Competition Portal "Competition Roster" page
     */
    export interface FetchCompetitionRosterApiResponse extends CompetitionPortalApi.FetchCompetitionPortalCoreApiResponse {
        competition_roster: CompetitionRosterData.CompetitionRosterMember[];    // The current selected roster for the competition
        download_link: string;                                                  // Link to download the roster
        roster_edit_disabled?: boolean;                                         // Whether editing the roster should be disabled
        roster_rules: string[];                                                 // The rules to display above the roster selection component
        roster_minimum?: number;                                                // The minimum number of members to ensure a valid roster
        roster_maximum?: number;                                                // If provided, this will prevent users from adding members to the roster once this amount is reached.
        page_introduction: string;                                              // Page introduction text (to support dynamic dates)
    }

    /**
     * API response when fetching the full team roster for the "Edit Roster" screen
     */
    export interface FetchTeamRosterApiResponse {
        team_roster: TeamRegistrationData.TeamRosterMemberData[];   // The full team roster
    }

    /**
     * API payload when updating the competition roster
     *
     * Array of selected member IDs
     */
    export interface UpdateCompetitionRosterApiPayload extends Array<string> {
    }

    /**
     * API response when updating the competition roster
     */
    export interface UpdateCompetitionRosterApiResponse extends APISubmissionResponse {
        competition_roster: CompetitionRosterData.CompetitionRosterMember[];    // The selected competition roster resulting from the update
    }
}