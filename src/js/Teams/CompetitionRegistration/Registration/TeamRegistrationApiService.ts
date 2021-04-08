import {AbstractAPIService} from '../../../services/AbstractAPIService';
import {TeamRegistrationApi, TeamRegistrationService} from './_contracts';
import {TEAM_REGISTRATION_COMPETITION_ID_COOKIE_NAME} from '../../../config/AppConfig';
import {TeamRegistrationApiTransformer} from './TeamRegistrationApiTransformer';
import {TeamsCompetitionRegistrationApiService} from '../TeamsCompetitionRegistrationApiService';

export class TeamRegistrationApiService extends AbstractAPIService {
    static fetchTeamRegistrationShell(): Promise<TeamRegistrationService.FetchShellServiceResponse> {
        const team_id = TeamRegistrationApiService.getActiveTeamId();
        const competition_id = TeamRegistrationApiService.getActiveCompetitionId();
        const url = `/api/competition-registration/competitions/${competition_id}/teams/${team_id}/shell`;

        return this.fetchAndTransformResponse({
            url,
            /**
             * Transform API data to app data
             */
            transformResponse: function (response: TeamRegistrationApi.FetchShellApiResponse): TeamRegistrationService.FetchShellServiceResponse {
                return TeamRegistrationApiTransformer.transformFetchShellApiResponse(response);
            },
            /**
             * Validate the response
             */
            validateResponse: function (response: TeamRegistrationApi.FetchShellApiResponse): boolean {
                if (!response.team) {
                    console.error('team information not provided in response');

                    return false;
                }
                if (!response.competition) {
                    console.error('competition information not provided in response');

                    return false;
                }

                return true;
            }
        });
    }

    /**
     * Fetch data for the team verification page
     */
    static fetchTeamVerification(): Promise<TeamRegistrationService.FetchTeamVerificationServiceResponse> {
        const team_id = TeamRegistrationApiService.getActiveTeamId();
        const competition_id = TeamRegistrationApiService.getActiveCompetitionId();
        const url = `/api/competition-registration/competitions/${competition_id}/teams/${team_id}`;

        return this.fetchAndTransformResponse({
            url,
            /**
             * Transform API data to app data
             */
            transformResponse: function (response: TeamRegistrationApi.FetchTeamVerificationApiResponse): TeamRegistrationService.FetchTeamVerificationServiceResponse {
                return TeamRegistrationApiTransformer.transformFetchTeamVerification(response);
            },
            /**
             * Validate the response
             */
            validateResponse: function (response: TeamRegistrationApi.FetchTeamVerificationApiResponse): boolean {
                if (!response.team_profile) {
                    console.error('team profile information not provided in response');

                    return false;
                }

                return true;
            }
        });
    }

    /**
     * Update the current team's name
     */
    static updateTeamName(payload: TeamRegistrationService.UpdateTeamNameServicePayload): Promise<void> {
        const api_payload: TeamRegistrationApi.UpdateTeamNameApiPayload = {
            name: payload.team_name
        };
        const error_message = 'Error updating team name.';
        const method = 'put';
        const team_id = payload.team_id;
        const competition_id = TeamRegistrationApiService.getActiveCompetitionId();
        const url = `/api/competition-registration/competitions/${competition_id}/teams/${team_id}`;

        return this.submitForAPISubmissionResponse({
            error_message,
            method,
            payload: api_payload,
            url
        });
    }

    /**
     * Fetch data for the registration overview page
     */
    static fetchRegistrationOverview(): Promise<TeamRegistrationService.FetchRegistrationOverviewServiceResponse> {
        const team_id = TeamRegistrationApiService.getActiveTeamId();
        const competition_id = TeamRegistrationApiService.getActiveCompetitionId();
        const url = `/api/competition-registration/competitions/${competition_id}/teams/${team_id}/registration-overview`;

        return this.fetchAndTransformResponse({
            url,
            /**
             * Transform API data to app data
             */
            transformResponse: function (response: TeamRegistrationApi.FetchRegistrationOverviewApiResponse): TeamRegistrationService.FetchRegistrationOverviewServiceResponse {
                return TeamRegistrationApiTransformer.transformFetchRegistrationOverview(response);
            },
            /**
             * Validate the response
             */
            validateResponse: function (response: TeamRegistrationApi.FetchRegistrationOverviewApiResponse): boolean {
                if (!response.registration_information) {
                    console.error('registration information not provided in response');

                    return false;
                }
                if (!response.rulebook_year) {
                    console.error('rulebook year not provided in response');

                    return false;
                }
                if (!response.price_information) {
                    console.error('price information not provided in response');

                    return false;
                }

                return true;
            }
        });
    }

    /**
     * Get the active Team ID from a cookie value
     */
    protected static getActiveTeamId(): string {
        return TeamsCompetitionRegistrationApiService.getActiveTeamId();
    }

    /**
     * Get the active Competition ID from a cookie value
     */
    protected static getActiveCompetitionId() {
        return AbstractAPIService.getValueFromCookie(TEAM_REGISTRATION_COMPETITION_ID_COOKIE_NAME, 'team registration competition ID');
    }
}