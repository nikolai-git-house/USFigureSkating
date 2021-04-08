import {TeamsCompetitionRegistrationData} from './TeamsCompetitionRegistrationDataContracts';

export namespace TeamsCompetitionRegistrationApi {
    /**
     * API response when fetching the competition list
     */
    export interface FetchCompetitionListApiResponse {
        competitions: TeamsCompetitionRegistrationData.CompetitionListCompetitionData[];    // The list of competitions
        team: TeamsCompetitionRegistrationData.TeamSummaryData;                             // Information about the active team
    }
}