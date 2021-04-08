import {AbstractAPIService} from '../../../../services/AbstractAPIService';
import {CompetitionPortalAppService} from '../../../_services';
import {CompetitionTeamPersonnel, CompetitionTeamPersonnelApi, CompetitionTeamPersonnelService} from '../_contracts';
import {CompetitionTeamPersonnelApiTransformer} from '../_transformers/CompetitionTeamPersonnelApiTransformer';

export class CompetitionPortalTeamPersonnelApiService extends AbstractAPIService {

    /**
     * Fetch information for Competition Team Personnel page
     */
    static fetchTeamPersonnel(): Promise<CompetitionTeamPersonnelService.FetchTeamPersonnelServiceResponse> {
        const competition_id = CompetitionPortalAppService.getActiveCompetitionPortalCompetitionId();
        const team_id = CompetitionPortalAppService.getActiveCompetitionPortalTeamId();
        const url = `/api/competitions/${competition_id}/teams/${team_id}/competition-personnel`;

        return CompetitionPortalTeamPersonnelApiService.fetchAndTransformResponse({
            url,
            /**
             * Transform API data to App Data
             */
            transformResponse: function (response: CompetitionTeamPersonnelApi.FetchCompetitionPersonnelApiResponse): CompetitionTeamPersonnelService.FetchTeamPersonnelServiceResponse {
                return CompetitionTeamPersonnelApiTransformer.transformFetchTeamPersonnel(response);
            },
            /**
             * Validate API response
             */
            validateResponse: function (response: CompetitionTeamPersonnelApi.FetchCompetitionPersonnelApiResponse): boolean {
                const required_props = ['competition_summary', 'competition_team_personnel'];
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
     * Fetch the available personnel of a certain type for selection
     */
    static fetchAvailablePersonnel(type: CompetitionTeamPersonnel.CompetitionPersonnelTypeKey): Promise<CompetitionTeamPersonnelService.FetchTeamPersonnelTeamRosterServiceResponse> {
        const method_map = {
            coaches: CompetitionPortalTeamPersonnelApiService.fetchAvailableCoaches,
            team_service_personnel: CompetitionPortalTeamPersonnelApiService.fetchAvailableTeamServicePersonnel,
            prop_crew: CompetitionPortalTeamPersonnelApiService.fetchAvailablePropCrew
        };

        return method_map[type]();
    }

    /**
     * Fetch the full coach roster for a team
     */
    static fetchAvailableCoaches(): Promise<CompetitionTeamPersonnelService.FetchTeamPersonnelTeamRosterServiceResponse> {
        const competition_id = CompetitionPortalAppService.getActiveCompetitionPortalCompetitionId();
        const team_id = CompetitionPortalAppService.getActiveCompetitionPortalTeamId();
        const url = `/api/competitions/${competition_id}/teams/${team_id}/available-competition-personnel/coaches`;

        return CompetitionPortalTeamPersonnelApiService.fetchAndTransformResponse({
            url,
            /**
             * Transform API data to App Data
             */
            transformResponse: function (response: CompetitionTeamPersonnelApi.FetchTeamPersonnelAvailableCoachesApiResponse): CompetitionTeamPersonnelService.FetchTeamPersonnelTeamRosterServiceResponse {
                return CompetitionTeamPersonnelApiTransformer.transformFetchTeamPersonnelAvailableCoaches(response);
            },
            /**
             * Validate API response
             */
            validateResponse: function (response: CompetitionTeamPersonnelApi.FetchTeamPersonnelAvailableCoachesApiResponse): boolean {
                const required_props: string[] = ['team_coaches', 'coach_maximum'];
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
     * Fetch the full team service personnel roster for a team
     */
    static fetchAvailableTeamServicePersonnel(): Promise<CompetitionTeamPersonnelService.FetchTeamPersonnelTeamRosterServiceResponse> {
        const competition_id = CompetitionPortalAppService.getActiveCompetitionPortalCompetitionId();
        const team_id = CompetitionPortalAppService.getActiveCompetitionPortalTeamId();
        const url = `/api/competitions/${competition_id}/teams/${team_id}/available-competition-personnel/team-service-personnel`;

        return CompetitionPortalTeamPersonnelApiService.fetchAndTransformResponse({
            url,
            /**
             * Transform API data to App Data
             */
            transformResponse: function (response: CompetitionTeamPersonnelApi.FetchTeamPersonnelAvailableTeamServicePersonnelApiResponse): CompetitionTeamPersonnelService.FetchTeamPersonnelTeamRosterServiceResponse {
                return CompetitionTeamPersonnelApiTransformer.transformFetchTeamPersonnelAvailableTeamServicePersonnel(response);
            },
            /**
             * Validate API response
             */
            validateResponse: function (response: CompetitionTeamPersonnelApi.FetchTeamPersonnelAvailableTeamServicePersonnelApiResponse): boolean {
                const required_props: string[] = ['team_service_personnel', 'team_service_personnel_maximum'];
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
     * Fetch the full prop crew roster for a team
     */
    static fetchAvailablePropCrew(): Promise<CompetitionTeamPersonnelService.FetchTeamPersonnelTeamRosterServiceResponse> {
        const competition_id = CompetitionPortalAppService.getActiveCompetitionPortalCompetitionId();
        const team_id = CompetitionPortalAppService.getActiveCompetitionPortalTeamId();
        const url = `/api/competitions/${competition_id}/teams/${team_id}/available-competition-personnel/prop-crew`;

        return CompetitionPortalTeamPersonnelApiService.fetchAndTransformResponse({
            url,
            /**
             * Transform API data to App Data
             */
            transformResponse: function (response: CompetitionTeamPersonnelApi.FetchTeamPersonnelAvailablePropCrewApiResponse): CompetitionTeamPersonnelService.FetchTeamPersonnelTeamRosterServiceResponse {
                return CompetitionTeamPersonnelApiTransformer.transformFetchTeamPersonnelAvailablePropCrew(response);
            },
            /**
             * Validate API response
             */
            validateResponse: function (response: CompetitionTeamPersonnelApi.FetchTeamPersonnelAvailablePropCrewApiResponse): boolean {
                const required_props: string[] = ['prop_crew', 'prop_crew_maximum'];
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
     * Report updated coach selections for a team competition roster
     */
    static updateCoaches(ids: string[]): Promise<CompetitionTeamPersonnelService.UpdateCompetitionTeamPersonnelTypeServiceResponse> {
        const competition_id = CompetitionPortalAppService.getActiveCompetitionPortalCompetitionId();
        const team_id = CompetitionPortalAppService.getActiveCompetitionPortalTeamId();
        const url = `/api/competitions/${competition_id}/teams/${team_id}/competition-personnel/coaches`;
        const payload: CompetitionTeamPersonnelApi.UpdateCompetitionTeamPersonnelCoachesApiPayload = ids.slice();

        return CompetitionPortalTeamPersonnelApiService.submitWithTransformedResponse({
            url,
            payload,
            method: 'patch',
            error_message: 'There was an error saving the selected coaches.',
            /**
             * Transform API data to App Data
             */
            transformResponse: function (response: CompetitionTeamPersonnelApi.UpdateCompetitionTeamPersonnelCoachesApiResponse): CompetitionTeamPersonnelService.UpdateCompetitionTeamPersonnelTypeServiceResponse {
                return {
                    competition_roster: response.competition_coaches.map((coach_data) => {
                        return CompetitionTeamPersonnelApiTransformer.transformCompetitionTeamPerson(coach_data);
                    })
                };
            },
            /**
             * Validate API response
             */
            validateResponse: function (response: CompetitionTeamPersonnelApi.UpdateCompetitionTeamPersonnelCoachesApiResponse): boolean {
                if (!response || !response.success) {
                    return false;
                }
                const required_props: string[] = ['competition_coaches'];
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
     * Report updated PC selections for a team competition roster
     */
    static updatePropCrew(ids: string[]): Promise<CompetitionTeamPersonnelService.UpdateCompetitionTeamPersonnelTypeServiceResponse> {
        const competition_id = CompetitionPortalAppService.getActiveCompetitionPortalCompetitionId();
        const team_id = CompetitionPortalAppService.getActiveCompetitionPortalTeamId();
        const url = `/api/competitions/${competition_id}/teams/${team_id}/competition-personnel/prop-crew`;
        const payload: CompetitionTeamPersonnelApi.UpdateCompetitionTeamPersonnelPropCrewApiPayload = ids.slice();

        return CompetitionPortalTeamPersonnelApiService.submitWithTransformedResponse({
            url,
            payload,
            method: 'patch',
            error_message: 'There was an error saving the selected prop crew.',
            /**
             * Transform API data to App Data
             */
            transformResponse: function (response: CompetitionTeamPersonnelApi.UpdateCompetitionTeamPersonnelPropCrewApiResponse): CompetitionTeamPersonnelService.UpdateCompetitionTeamPersonnelTypeServiceResponse {
                return {
                    competition_roster: response.competition_prop_crew.map((entity_data) => {
                        return CompetitionTeamPersonnelApiTransformer.transformCompetitionTeamPerson(entity_data);
                    })
                };
            },
            /**
             * Validate API response
             */
            validateResponse: function (response: CompetitionTeamPersonnelApi.UpdateCompetitionTeamPersonnelPropCrewApiResponse): boolean {
                if (!response || !response.success) {
                    return false;
                }
                const required_props: string[] = ['competition_prop_crew'];
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
     * Report updated TSP selections for a team competition roster
     */
    static updateTeamServicePersonnel(ids: string[]): Promise<CompetitionTeamPersonnelService.UpdateCompetitionTeamPersonnelTypeServiceResponse> {
        const competition_id = CompetitionPortalAppService.getActiveCompetitionPortalCompetitionId();
        const team_id = CompetitionPortalAppService.getActiveCompetitionPortalTeamId();
        const url = `/api/competitions/${competition_id}/teams/${team_id}/competition-personnel/team-service-personnel`;
        const payload: CompetitionTeamPersonnelApi.UpdateCompetitionTeamPersonnelTeamServicePersonnelApiPayload = ids.slice();

        return CompetitionPortalTeamPersonnelApiService.submitWithTransformedResponse({
            url,
            payload,
            method: 'patch',
            error_message: 'There was an error saving the selected team service personnel.',
            /**
             * Transform API data to App Data
             */
            transformResponse: function (response: CompetitionTeamPersonnelApi.UpdateCompetitionTeamPersonnelTeamServicePersonnelApiResponse): CompetitionTeamPersonnelService.UpdateCompetitionTeamPersonnelTypeServiceResponse {
                return {
                    competition_roster: response.competition_team_service_personnel.map((entity_data) => {
                        return CompetitionTeamPersonnelApiTransformer.transformCompetitionTeamPerson(entity_data);
                    })
                };
            },
            /**
             * Validate API response
             */
            validateResponse: function (response: CompetitionTeamPersonnelApi.UpdateCompetitionTeamPersonnelTeamServicePersonnelApiResponse): boolean {
                if (!response || !response.success) {
                    return false;
                }
                const required_props: string[] = ['competition_team_service_personnel'];
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