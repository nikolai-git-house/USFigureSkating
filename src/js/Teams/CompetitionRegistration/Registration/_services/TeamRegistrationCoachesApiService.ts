import {TeamRegistrationApi, TeamRegistrationService} from '../_contracts';
import {TeamRegistrationCoachesApiTransformer} from '../_transformers/TeamRegistrationCoachesApiTransformer';
import {TeamRegistrationApiService} from '../TeamRegistrationApiService';

export class TeamRegistrationCoachesApiService extends TeamRegistrationApiService {
    public static fetchCoaches(): Promise<TeamRegistrationService.FetchCoachesServiceResponse> {
        const competition_id = this.getActiveCompetitionId();
        const team_id = this.getActiveTeamId();

        return this.fetchAndTransformResponse({
            /**
             * Transform API data to app data
             */
            transformResponse: function (response: TeamRegistrationApi.FetchCoachesApiResponse): TeamRegistrationService.FetchCoachesServiceResponse {
                return TeamRegistrationCoachesApiTransformer.transformFetchCoaches(response);
            },
            url: `/api/competition-registration/competitions/${competition_id}/teams/${team_id}/coaches`,
            /**
             * Validate response properties
             */
            validateResponse: function (response: TeamRegistrationApi.FetchCoachesApiResponse): boolean {
                if (!response.team_coaches) {
                    console.error('Coach list not provided in response');

                    return false;
                }

                return true;
            }
        });
    }

    static updateCoaches(selected_roster_ids: number[]) {
        const competition_id = this.getActiveCompetitionId();
        const team_id = this.getActiveTeamId();
        const payload: TeamRegistrationApi.UpdateCoachesApiPayload = selected_roster_ids.slice();

        return this.submitForAPISubmissionResponse({
            error_message: 'Error updating coaches.',
            method: 'put',
            payload,
            url: `/api/competition-registration/competitions/${competition_id}/teams/${team_id}/coaches`
        });
    }
}