import {AbstractAPIService} from '../../../services/AbstractAPIService';
import {CompetitionPortalAppService} from '../../_services';
import {CompetitionPortalVolunteerApiTransformer} from '../_transformers/CompetitionPortalVolunteerApiTransformer';
import {CompetitionPortalVolunteerApi, CompetitionPortalVolunteerService} from '../_contracts';

export class CompetitionPortalVolunteerApiService extends AbstractAPIService {
    /**
     * Fetch competition portal My Volunteer Schedule page data
     */
    static fetchMyVolunteerSchedule(): Promise<CompetitionPortalVolunteerService.FetchMyVolunteerScheduleServiceResponse> {
        const competition_id = CompetitionPortalAppService.getActiveCompetitionPortalCompetitionId();
        const url = `/api/competitions/${competition_id}/volunteer-schedule`;

        return AbstractAPIService.fetchAndTransformResponse({
            url,
            /**
             * Validate that the response contains the proper structures
             */
            validateResponse: function (response: CompetitionPortalVolunteerApi.FetchMyVolunteerScheduleApiResponse): boolean {
                const required_props = ['competition_summary', 'links', 'schedule', 'user_is_compliant', 'volunteer_contacts'];
                for (let i = 0; i < required_props.length; i++) {
                    const requiredProp = required_props[i];
                    if (!Object.prototype.hasOwnProperty.call(response, requiredProp)) {
                        console.error(`${requiredProp} missing from response`);

                        return false;
                    }
                }

                return true;
            },
            /**
             * Transform API data to App data
             */
            transformResponse: function (response: CompetitionPortalVolunteerApi.FetchMyVolunteerScheduleApiResponse): CompetitionPortalVolunteerService.FetchMyVolunteerScheduleServiceResponse {
                return CompetitionPortalVolunteerApiTransformer.transformFetchMyVolunteerSchedule(response);
            }
        });
    }

    /**
     * Fetch competition portal Volunteer Shift Selection page data
     */
    static fetchShiftSelection(): Promise<CompetitionPortalVolunteerService.FetchShiftSelectionServiceResponse> {
        const competition_id = CompetitionPortalAppService.getActiveCompetitionPortalCompetitionId();
        const url = `/api/competitions/${competition_id}/volunteer-shift-selection`;

        return AbstractAPIService.fetchAndTransformResponse({
            url,
            /**
             * Validate that the response contains the proper structures
             */
            validateResponse: function (response: CompetitionPortalVolunteerApi.FetchShiftSelectionApiResponse): boolean {
                const required_props = ['competition_summary', 'links', 'user_is_compliant', 'selection_open'];
                for (let i = 0; i < required_props.length; i++) {
                    const requiredProp = required_props[i];
                    if (!Object.prototype.hasOwnProperty.call(response, requiredProp)) {
                        console.error(`${requiredProp} missing from response`);

                        return false;
                    }
                }

                return true;
            },
            /**
             * Transform API data to App data
             */
            transformResponse: function (response: CompetitionPortalVolunteerApi.FetchShiftSelectionApiResponse): CompetitionPortalVolunteerService.FetchShiftSelectionServiceResponse {
                return CompetitionPortalVolunteerApiTransformer.transformFetchVolunteerShiftSelection(response);
            }
        });
    }

    /**
     * Select a shift
     */
    static selectShift(shift: CompetitionPortalVolunteerService.Shift): Promise<CompetitionPortalVolunteerService.SelectVolunteerShiftServiceResponse> {
        const competition_id = CompetitionPortalAppService.getActiveCompetitionPortalCompetitionId();
        const url = `/api/competitions/${competition_id}/volunteer-schedule/shifts/${shift.id}`;
        const method = 'post';

        return AbstractAPIService.submitWithTransformedResponse(
            {
                method,
                error_message: 'Error selecting shift.',
                payload: null,
                url,
                /**
                 * Validate the submission was successful and updated coach is present
                 */
                validateResponse: function (response_data: CompetitionPortalVolunteerApi.SelectVolunteerShiftApiResponse) {
                    return !!response_data && response_data.success && !!response_data.result;
                },
                /**
                 * Transform API data to App data
                 */
                transformResponse: function (response_data: CompetitionPortalVolunteerApi.SelectVolunteerShiftApiResponse): CompetitionPortalVolunteerService.SelectVolunteerShiftServiceResponse {
                    return CompetitionPortalVolunteerApiTransformer.transformSelectVolunteerShiftApiResponse(response_data);
                }
            }
        );
    }

    /**
     * Remove a shift
     */
    static removeShift(shift: CompetitionPortalVolunteerService.Shift): Promise<CompetitionPortalVolunteerService.RemoveVolunteerShiftServiceResponse> {
        const competition_id = CompetitionPortalAppService.getActiveCompetitionPortalCompetitionId();
        const url = `/api/competitions/${competition_id}/volunteer-schedule/shifts/${shift.id}`;
        const method = 'delete';

        return AbstractAPIService.submitWithTransformedResponse(
            {
                method,
                error_message: 'Error removing shift.',
                payload: null,
                url,
                /**
                 * Validate the submission was successful and updated coach is present
                 */
                validateResponse: function (response_data: CompetitionPortalVolunteerApi.RemoveVolunteerShiftApiResponse) {
                    return !!response_data && response_data.success && !!response_data.result;
                },
                /**
                 * Transform API data to App data
                 */
                transformResponse: function (response_data: CompetitionPortalVolunteerApi.RemoveVolunteerShiftApiResponse): CompetitionPortalVolunteerService.RemoveVolunteerShiftServiceResponse {
                    return CompetitionPortalVolunteerApiTransformer.transformRemoveVolunteerShiftApiResponse(response_data);
                }
            }
        );
    }
}