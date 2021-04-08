import {CompetitionPortalApi} from '../../../_contracts';
import {TeamRegistrationData} from '../../../../Teams/CompetitionRegistration/Registration/_contracts';
import {APISubmissionResponse} from '../../../../contracts/release3/api/CommonAPIContracts';
import {CompetitionTeamPersonnelData} from './CompetitionTeamPersonnelDataContracts';

export namespace CompetitionTeamPersonnelApi {
    /**
     * API Response when fetching information for the Competition Portal "Competition Team Personnel" page
     */
    export interface FetchCompetitionPersonnelApiResponse extends CompetitionPortalApi.FetchCompetitionPortalCoreApiResponse {
        competition_team_personnel: CompetitionTeamPersonnelData.CompetitionTeamPersonnel;      // Categorized lists of competition team personnel selected for the competition
        has_prop_crew: boolean;                                                                 // Whether prop crew is applicable to the current team
    }

    /**
     * API response when fetching information to enable the edit coaches screen on the "Competition Team Personnel" page
     */
    export interface FetchTeamPersonnelAvailableCoachesApiResponse {
        team_coaches: TeamRegistrationData.TeamCoachData[];     // The full list of available entities
        coach_maximum: number;                                  // The maximum number of entities allowed for selection
    }

    /**
     * API response when fetching information to enable the edit prop crew screen on the "Competition Team Personnel" page
     */
    export interface FetchTeamPersonnelAvailablePropCrewApiResponse {
        prop_crew: TeamRegistrationData.TeamServicePersonData[];        // The full list of available entities
        prop_crew_maximum: number;                                      // The maximum number of entities allowed for selection
    }

    /**
     * API response when fetching information to enable the edit team service personnel screen on the "Competition Team Personnel" page
     */
    export interface FetchTeamPersonnelAvailableTeamServicePersonnelApiResponse {
        team_service_personnel: TeamRegistrationData.PropCrewPersonData[];      // The full list of available entities
        team_service_personnel_maximum: number;                                 // The maximum number of entities allowed for selection
    }

    /**
     * API payload when updating selected coaches for a competition
     */
    export interface UpdateCompetitionTeamPersonnelCoachesApiPayload extends Array<string> {
    }

    /**
     * API payload when updating selected prop crew for a competition
     */
    export interface UpdateCompetitionTeamPersonnelPropCrewApiPayload extends Array<string> {
    }

    /**
     * API payload when updating selected team service personnel for a competition
     */
    export interface UpdateCompetitionTeamPersonnelTeamServicePersonnelApiPayload extends Array<string> {
    }

    /**
     * API response after updating coach selections
     */
    export interface UpdateCompetitionTeamPersonnelCoachesApiResponse extends APISubmissionResponse {
        competition_coaches: CompetitionTeamPersonnelData.CompetitionTeamPerson[];
    }

    /**
     * API response after updating prop crew selections
     */
    export interface UpdateCompetitionTeamPersonnelPropCrewApiResponse extends APISubmissionResponse {
        competition_prop_crew: CompetitionTeamPersonnelData.CompetitionTeamPerson[];
    }

    /**
     * API response after updating team service personnel selections
     */
    export interface UpdateCompetitionTeamPersonnelTeamServicePersonnelApiResponse extends APISubmissionResponse {
        competition_team_service_personnel: CompetitionTeamPersonnelData.CompetitionTeamPerson[];
    }
}