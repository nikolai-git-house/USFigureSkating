import {AbstractAPIService} from '../../services/AbstractAPIService';
import {TeamsCompetitionRegistrationApi, TeamsCompetitionRegistrationService} from './_contracts';

import {TEAM_REGISTRATION_TEAM_ID_COOKIE_NAME} from '../../config/AppConfig';
import {TeamsCompetitionRegistrationApiTransformer} from './TeamsCompetitionRegistrationApiTransformer';

export class TeamsCompetitionRegistrationApiService extends AbstractAPIService {
    /**
     * Fetch the competition list for registration
     */
    static fetchCompetitionList(): Promise<TeamsCompetitionRegistrationService.FetchCompetitionListServiceResponse> {
        const team_id = TeamsCompetitionRegistrationApiService.getActiveTeamId();
        const url = `/api/competition-registration/teams/${team_id}`;

        return AbstractAPIService.fetchAndTransformResponse({
            /**
             * Transform API data into App data
             */
            transformResponse: function (response: TeamsCompetitionRegistrationApi.FetchCompetitionListApiResponse): TeamsCompetitionRegistrationService.FetchCompetitionListServiceResponse {
                return TeamsCompetitionRegistrationApiTransformer.transformFetchCompetitionListApiResponse(response);
            },
            url,
            /**
             * Validate response data
             */
            validateResponse: function (response: TeamsCompetitionRegistrationApi.FetchCompetitionListApiResponse): boolean {
                if (!response.competitions) {
                    console.error('competitions not provided in response');

                    return false;
                }
                if (!response.team) {
                    console.error('team information not provided in response');

                    return false;
                }

                return true;
            }
        });
    }

    /**
     * Get the active Series ID from a cookie value
     */
    public static getActiveTeamId(): string {
        return AbstractAPIService.getValueFromCookie(TEAM_REGISTRATION_TEAM_ID_COOKIE_NAME, 'team registration team id');
    }
}