import {TeamRegistrationApi, TeamRegistrationService} from '../_contracts';
import {TeamRegistrationCompetitionRosterApiTransformer} from '../_transformers/TeamRegistrationCompetitionRosterApiTransformer';
import {TeamRegistrationApiService} from '../TeamRegistrationApiService';

export class TeamRegistrationCompetitionRosterApiService extends TeamRegistrationApiService {
    public static fetchCompetitionRoster(): Promise<TeamRegistrationService.FetchCompetitionRosterServiceResponse> {
        const competition_id = this.getActiveCompetitionId();
        const team_id = this.getActiveTeamId();

        return this.fetchAndTransformResponse({
            /**
             * Transform API data to app data
             */
            transformResponse: function (response: TeamRegistrationApi.FetchCompetitionRosterApiResponse): TeamRegistrationService.FetchCompetitionRosterServiceResponse {
                return TeamRegistrationCompetitionRosterApiTransformer.transformFetchCompetitionRoster(response);
            },
            url: `/api/competition-registration/competitions/${competition_id}/teams/${team_id}/competition-roster`,
            /**
             * Validate response properties
             */
            validateResponse: function (response: TeamRegistrationApi.FetchCompetitionRosterApiResponse): boolean {
                if (!response.team_roster) {
                    console.error('Roster information not provided in response');

                    return false;
                }

                return true;
            }
        });
    }

    static updateActiveEntityCompetitionRoster(selected_roster_ids: number[]) {
        const competition_id = this.getActiveCompetitionId();
        const team_id = this.getActiveTeamId();
        const payload: TeamRegistrationApi.UpdateCompetitionRosterApiPayload = selected_roster_ids.slice();

        return this.submitForAPISubmissionResponse({
            error_message: 'Error updating roster.',
            method: 'put',
            payload,
            url: `/api/competition-registration/competitions/${competition_id}/teams/${team_id}/competition-roster`
        });
    }
}