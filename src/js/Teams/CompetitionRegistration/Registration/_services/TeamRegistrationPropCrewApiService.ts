import {TeamRegistrationApi, TeamRegistrationService} from '../_contracts';
import {TeamRegistrationApiService} from '../TeamRegistrationApiService';
import {TeamRegistrationPropCrewApiTransformer} from '../_transformers/TeamRegistrationPropCrewApiTransformer';

export class TeamRegistrationPropCrewApiService extends TeamRegistrationApiService {
    public static fetchPropCrew(): Promise<TeamRegistrationService.FetchPropCrewServiceResponse> {
        const competition_id = this.getActiveCompetitionId();
        const team_id = this.getActiveTeamId();

        return this.fetchAndTransformResponse({
            /**
             * Transform API data to app data
             */
            transformResponse: function (response: TeamRegistrationApi.FetchPropCrewApiResponse): TeamRegistrationService.FetchPropCrewServiceResponse {
                return TeamRegistrationPropCrewApiTransformer.transformFetchPropCrew(response);
            },
            url: `/api/competition-registration/competitions/${competition_id}/teams/${team_id}/prop-crew`,
            /**
             * Validate response properties
             */
            validateResponse: function (response: TeamRegistrationApi.FetchPropCrewApiResponse): boolean {
                if (!response.prop_crew) {
                    console.error('Prop Crew list not provided in response');

                    return false;
                }

                return true;
            }
        });
    }

    static updatePropCrew(selected_roster_ids: number[]) {
        const competition_id = this.getActiveCompetitionId();
        const team_id = this.getActiveTeamId();
        const payload: TeamRegistrationApi.UpdatePropCrewApiPayload = selected_roster_ids.slice();

        return this.submitForAPISubmissionResponse({
            error_message: 'Error updating prop crew.',
            method: 'put',
            payload,
            url: `/api/competition-registration/competitions/${competition_id}/teams/${team_id}/prop-crew`
        });
    }
}