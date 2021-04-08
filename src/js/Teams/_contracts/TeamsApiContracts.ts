import {TeamsData} from './TeamsDataContracts';
import {BackLinkConfigurationData} from '../../contracts/release3/data/AppDataContracts';

export namespace TeamsApi {

    /**
     * API response when fetching list of user managed teams for team selection
     */
    export interface FetchManagedTeamsApiResponse {
        teams: TeamsData.ManagedTeam[];          // List of teams the current user must choose from in order to begin registration
        selection_links: TeamsData.SelectTeamLinks;  // Set of links to which user can be redirected following the selection of a team
    }

    /**
     * API response when fetching data for the "My Competitions - Teams" page
     */
    export interface FetchManagedTeamCompetitionsApiResponse {
        competitions: TeamsData.MyCompetitionsTeamsCompetitionData[];       // The list of competitions for which any of the active user's managed teams is registered
        links?: { competition_registration: string; };                      // Object (for extensibility) containing a link to the root of team registration.  Populates a link that displays when competitions array above is empty.  If not provided, link will not show
        back_link?: BackLinkConfigurationData;                              // Optional configuration for "Back" link at the top of the page.  If not provided, back link will not show
    }
}