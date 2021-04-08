import {CompetitionTeamPersonnel} from './CompetitionTeamPersonnelContracts';
import {
    PropCrewMember,
    TeamCoach,
    TeamServicePerson
} from '../../../../Teams/CompetitionRegistration/Registration/_models';
import {CompetitionPortalTeamPerson} from '../_models';
import {CompetitionPortalService} from '../../../_contracts';

export namespace CompetitionTeamPersonnelService {
    /**
     * Service response when fetching competition team personnel page
     */
    export interface FetchTeamPersonnelServiceResponse extends CompetitionPortalService.FetchCompetitionPortalCoreServiceResponse {
        competition_team_personnel: CompetitionTeamPersonnel.CompetitionTeamPersonnel;
        has_prop_crew: boolean;
    }

    /**
     * Service response when fetching the list of TP (coaches, TSP, PC) available for selection
     */
    export interface FetchTeamPersonnelTeamRosterServiceResponse {
        roster: (TeamCoach | TeamServicePerson | PropCrewMember)[];                     // The list of entities
        roster_config: CompetitionTeamPersonnel.CompetitionPersonnelRosterConfig;       // The rules impacting the selection of entities
    }

    /**
     * Service response after updating a list of selected TP
     */
    export interface UpdateCompetitionTeamPersonnelTypeServiceResponse {
        competition_roster: CompetitionPortalTeamPerson[];
    }
}