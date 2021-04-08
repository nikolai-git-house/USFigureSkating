import {CompetitionListCompetition} from '../_models/';
import {TeamsCompetitionRegistration} from './TeamsCompetitionRegistrationContracts';

export namespace TeamsCompetitionRegistrationService {
    /**
     * Service response when fetching data for the team competition registration index page
     */
    export interface FetchCompetitionListServiceResponse {
        competitions: CompetitionListCompetition[];     // List of competitions
        team: TeamsCompetitionRegistration.TeamSummary; // Summary of the active team
    }
}