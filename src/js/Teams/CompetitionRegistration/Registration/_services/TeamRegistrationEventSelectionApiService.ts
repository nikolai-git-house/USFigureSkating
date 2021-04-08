import {TeamRegistrationApi, TeamRegistrationService} from '../_contracts';
import {TeamRegistrationEventSelectionApiTransformer} from '../_transformers/TeamRegistrationEventSelectionApiTransformer';
import {TeamRegistrationApiService} from '../TeamRegistrationApiService';

export class TeamRegistrationEventSelectionApiService extends TeamRegistrationApiService {
    public static fetchEventSelection(): Promise<TeamRegistrationService.FetchEventSelectionServiceResponse> {
        const competition_id = this.getActiveCompetitionId();
        const team_id = this.getActiveTeamId();

        return this.fetchAndTransformResponse({
            /**
             * Transform API data to app data
             */
            transformResponse: function (response: TeamRegistrationApi.FetchEventSelectionApiResponse): TeamRegistrationService.FetchEventSelectionServiceResponse {
                return TeamRegistrationEventSelectionApiTransformer.transformFetchEventSelection(response);
            },
            url: `/api/competition-registration/competitions/${competition_id}/teams/${team_id}/events`,
            /**
             * Validate response properties
             */
            validateResponse: function (response: TeamRegistrationApi.FetchEventSelectionApiResponse): boolean {
                if (!response.events) {
                    console.error('Events information not provided in response');

                    return false;
                }

                return true;
            }
        });
    }

    /**
     * Remove an event
     */
    public static removeEvent(event_id: number): Promise<TeamRegistrationService.RemoveEventServiceResponse> {
        const competition_id = this.getActiveCompetitionId();
        const team_id = this.getActiveTeamId();

        return this.submitWithTransformedResponse({
            payload: null,
            error_message: 'Error removing event.',
            method: 'delete',
            /**
             * Transform API data to app data
             */
            transformResponse: function (response: TeamRegistrationApi.RemoveEventApiResponse): TeamRegistrationService.RemoveEventServiceResponse {
                return TeamRegistrationEventSelectionApiTransformer.transformFetchEventSelection(response);
            },
            url: `/api/competition-registration/competitions/${competition_id}/teams/${team_id}/events/${event_id}`,
            /**
             * Validate response properties
             */
            validateResponse: function (response: TeamRegistrationApi.RemoveEventApiResponse): boolean {
                if (!response || !response.success) {
                    return false;
                }
                if (!response.events) {
                    console.error('Events information not provided in response');

                    return false;
                }

                return true;
            }
        });
    }

    /**
     * Add an event
     */
    public static addEvent(event_id: number): Promise<TeamRegistrationService.AddEventServiceResponse> {
        const competition_id = this.getActiveCompetitionId();
        const team_id = this.getActiveTeamId();

        return this.submitWithTransformedResponse({
            payload: null,
            error_message: 'Error adding event.',
            method: 'put',
            /**
             * Transform API data to app data
             */
            transformResponse: function (response: TeamRegistrationApi.AddEventApiResponse): TeamRegistrationService.AddEventServiceResponse {
                return TeamRegistrationEventSelectionApiTransformer.transformFetchEventSelection(response);
            },
            url: `/api/competition-registration/competitions/${competition_id}/teams/${team_id}/events/${event_id}`,
            /**
             * Validate response properties
             */
            validateResponse: function (response: TeamRegistrationApi.RemoveEventApiResponse): boolean {
                if (!response || !response.success) {
                    return false;
                }
                if (!response.events) {
                    console.error('Events information not provided in response');

                    return false;
                }

                return true;
            }
        });
    }
}