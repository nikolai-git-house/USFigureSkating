import {AbstractAPIService} from '../services/AbstractAPIService';
import {TeamsApi, TeamsService} from './_contracts';
import {TeamsApiTransformer} from './TeamsApiTransformer';

export class TeamsApiService extends AbstractAPIService {
    /**
     * Fetch the teams managed by the active user
     */
    static fetchManagedTeams() {
        return this.fetchAndTransformResponse({
            /**
             * Transform API data to app data
             */
            transformResponse: function (response: TeamsApi.FetchManagedTeamsApiResponse): TeamsService.FetchManagedTeamsServiceResponse {
                return TeamsApiTransformer.transformFetchManagedTeams(response);
            },
            url: '/api/user/managed-teams',
            /**
             * Validate API response
             */
            validateResponse: function (response: TeamsApi.FetchManagedTeamsApiResponse) {
                if (!response.teams) {
                    console.error('teams not provided in response');

                    return false;
                }
                if (!response.selection_links) {
                    console.error('selection links not provided in response');

                    return false;
                }

                return true;
            }
        });
    }

    /**
     * Fetch the competitions the active user's managed teams are registered for
     */
    static fetchManagedTeamCompetitions(): Promise<TeamsService.FetchManagedTeamCompetitionsServiceResponse> {
        return this.fetchAndTransformResponse({
            /**
             * Transform API data to app data
             */
            transformResponse: function (response: TeamsApi.FetchManagedTeamCompetitionsApiResponse): TeamsService.FetchManagedTeamCompetitionsServiceResponse {
                return TeamsApiTransformer.transformFetchManagedTeamCompetitions(response);
            },
            url: '/api/user/managed-teams/competitions',
            /**
             * Validate API response
             */
            validateResponse: function (response: TeamsApi.FetchManagedTeamCompetitionsApiResponse) {
                if (!response.competitions) {
                    console.error('competitions not provided in response');

                    return false;
                }

                return true;
            }
        });
    }
}