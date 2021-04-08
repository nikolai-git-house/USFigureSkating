import {TeamRegistrationApi, TeamRegistrationService} from '../_contracts';
import {TeamRegistrationTeamServicePersonnelApiTransformer} from '../_transformers/TeamRegistrationTeamServicePersonnelApiTransformer';
import {TeamRegistrationApiService} from '../TeamRegistrationApiService';

export class TeamRegistrationTeamServicePersonnelApiService extends TeamRegistrationApiService {
    public static fetchTeamServicePersonnel(): Promise<TeamRegistrationService.FetchTeamServicePersonnelServiceResponse> {
        const competition_id = this.getActiveCompetitionId();
        const team_id = this.getActiveTeamId();

        return this.fetchAndTransformResponse({
            /**
             * Transform API data to app data
             */
            transformResponse: function (response: TeamRegistrationApi.FetchTeamServicePersonnelApiResponse): TeamRegistrationService.FetchTeamServicePersonnelServiceResponse {
                return TeamRegistrationTeamServicePersonnelApiTransformer.transformFetchTeamServicePersonnel(response);
            },
            url: `/api/competition-registration/competitions/${competition_id}/teams/${team_id}/team-service-personnel`,
            /**
             * Validate response properties
             */
            validateResponse: function (response: TeamRegistrationApi.FetchTeamServicePersonnelApiResponse): boolean {
                if (!response.team_service_personnel) {
                    console.error('Team Service Personnel list not provided in response');

                    return false;
                }

                return true;
            }
        });
    }

    static updateTeamServicePersonnel(selected_roster_ids: number[]) {
        const competition_id = this.getActiveCompetitionId();
        const team_id = this.getActiveTeamId();
        const payload: TeamRegistrationApi.UpdateTeamServicePersonnelApiPayload = selected_roster_ids.slice();

        return this.submitForAPISubmissionResponse({
            error_message: 'Error updating team service personnel.',
            method: 'put',
            payload,
            url: `/api/competition-registration/competitions/${competition_id}/teams/${team_id}/team-service-personnel`
        });
    }
}