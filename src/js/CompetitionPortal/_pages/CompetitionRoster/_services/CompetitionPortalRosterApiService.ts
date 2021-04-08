import {AbstractAPIService} from '../../../../services/AbstractAPIService';
import {CompetitionRosterApi, CompetitionRosterService} from '../_contracts';
import {CompetitionPortalAppService} from '../../../_services';
import {CompetitionRosterApiTransformer} from '../_transformers/CompetitionRosterApiTransformer';

export class CompetitionPortalRosterApiService extends AbstractAPIService {
    /**
     * Fetch competition roster page data
     */
    public static fetchCompetitionRoster(): Promise<CompetitionRosterService.FetchCompetitionRosterServiceResponse> {
        const competition_id = CompetitionPortalAppService.getActiveCompetitionPortalCompetitionId();
        const team_id = CompetitionPortalAppService.getActiveCompetitionPortalTeamId();
        const url = `/api/competitions/${competition_id}/teams/${team_id}/competition-roster`;

        return CompetitionPortalRosterApiService.fetchAndTransformResponse({
            url,
            /**
             * Transform API data to App Data
             */
            transformResponse: function (response: CompetitionRosterApi.FetchCompetitionRosterApiResponse): CompetitionRosterService.FetchCompetitionRosterServiceResponse {
                return CompetitionRosterApiTransformer.transformFetchCompetitionRoster(response);
            },
            /**
             * Validate API response
             */
            validateResponse: function (response: CompetitionRosterApi.FetchCompetitionRosterApiResponse): boolean {
                const required_props = ['competition_summary', 'competition_roster', 'page_introduction'];
                let valid = true;
                for (let i = 0; i < required_props.length; i++) {
                    const requiredProp = required_props[i];
                    if (!Object.prototype.hasOwnProperty.call(response, requiredProp)) {
                        console.error(`${requiredProp} missing from response`);
                        valid = false;
                    }
                }

                return valid;
            }
        });

    }

    /**
     * Fetch the full team roster for a competition
     */
    static fetchTeamRoster(): Promise<CompetitionRosterService.FetchTeamRosterServiceResponse> {
        const competition_id = CompetitionPortalAppService.getActiveCompetitionPortalCompetitionId();
        const team_id = CompetitionPortalAppService.getActiveCompetitionPortalTeamId();
        const url = `/api/competitions/${competition_id}/teams/${team_id}/team-roster`;

        return CompetitionPortalRosterApiService.fetchAndTransformResponse({
            url,
            /**
             * Transform API data to App Data
             */
            transformResponse: function (response: CompetitionRosterApi.FetchTeamRosterApiResponse): CompetitionRosterService.FetchTeamRosterServiceResponse {
                return CompetitionRosterApiTransformer.transformFetchTeamRoster(response);
            },
            /**
             * Validate API response
             */
            validateResponse: function (response: CompetitionRosterApi.FetchTeamRosterApiResponse): boolean {
                const required_props = ['team_roster'];
                let valid = true;
                for (let i = 0; i < required_props.length; i++) {
                    const requiredProp = required_props[i];
                    if (!Object.prototype.hasOwnProperty.call(response, requiredProp)) {
                        console.error(`${requiredProp} missing from response`);
                        valid = false;
                    }
                }

                return valid;
            }
        });
    }

    /**
     * Update a team's competition roster
     */
    static updateCompetitionRoster(ids: string[]): Promise<CompetitionRosterService.UpdateCompetitionRosterServiceResponse> {
        const competition_id = CompetitionPortalAppService.getActiveCompetitionPortalCompetitionId();
        const team_id = CompetitionPortalAppService.getActiveCompetitionPortalTeamId();
        const url = `/api/competitions/${competition_id}/teams/${team_id}/competition-roster`;
        const payload: CompetitionRosterApi.UpdateCompetitionRosterApiPayload = ids.slice();

        return CompetitionPortalRosterApiService.submitWithTransformedResponse({
            url,
            payload,
            method: 'patch',
            error_message: 'There was an error saving the competition roster.',
            /**
             * Transform API data to App Data
             */
            transformResponse: function (response: CompetitionRosterApi.UpdateCompetitionRosterApiResponse): CompetitionRosterService.UpdateCompetitionRosterServiceResponse {
                return CompetitionRosterApiTransformer.transformUpdateCompetitionRoster(response);
            },
            /**
             * Validate API response
             */
            validateResponse: function (response: CompetitionRosterApi.UpdateCompetitionRosterApiResponse): boolean {
                if (!response || !response.success) {
                    return false;
                }
                const required_props: string[] = ['competition_roster'];
                let valid = true;
                for (let i = 0; i < required_props.length; i++) {
                    const requiredProp = required_props[i];
                    if (!Object.prototype.hasOwnProperty.call(response, requiredProp)) {
                        console.error(`${requiredProp} missing from response`);
                        valid = false;
                    }
                }

                return valid;
            }
        });
    }
}