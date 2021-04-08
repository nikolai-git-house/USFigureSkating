import {Teams} from './TeamsContracts';
import {ManagedTeam, MyCompetitionsTeamsCompetition} from '../_models';
import {BackLinkConfiguration} from '../../contracts/AppContracts';

export namespace TeamsService {
    /**
     * Service response when when fetching list of teams the user can register for competitions
     */
    export interface FetchManagedTeamsServiceResponse {
        teams: ManagedTeam[];
        selection_links: Teams.SelectTeamLinks;
    }

    export interface FetchManagedTeamCompetitionsServiceResponse {
        competitions: MyCompetitionsTeamsCompetition[];
        links: Teams.TeamsLinks | null;
        back_link: BackLinkConfiguration | null;
    }
}