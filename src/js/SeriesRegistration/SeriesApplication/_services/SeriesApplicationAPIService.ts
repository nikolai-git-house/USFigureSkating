import {AbstractAPIService} from '../../../services/AbstractAPIService';
import {StateFormOption} from '../../../contracts/AppContracts';
import {MemberSearchParameters, MemberSearchResult} from '../../../contracts/app/MemberSearchContracts';
import {MemberSearchService} from '../../../services/MemberSearchService';
import {
    SkateTestDisciplineKey,
    SkateTestFormData,
    SkateTestRemoveAppPayload
} from '../../../contracts/app/SkateTestContracts';
import {UserAddSkateTestAPIPayload} from '../../../contracts/release3/api/UserAPIContracts';
import {SkateTestHistoryAPIAdaptor} from '../../../adaptors/APIAdaptors/SkateTestHistoryAPIAdaptor';
import {SeriesApplication, SeriesApplicationApi, SeriesApplicationService} from '../_contracts/';
import {SeriesApplicationAPITransformer} from '../_transformers/SeriesApplicationAPITransformer';
import {SeriesRegistrationAPIService} from '../../_services/SeriesRegistrationAPIService';

export class SeriesApplicationAPIService extends SeriesRegistrationAPIService {
    /**
     * Fetch Series information for the Series Application page
     */
    static fetchSeriesApplication(): Promise<SeriesApplicationService.FetchApplicationServiceResponse> {
        const series_id = SeriesApplicationAPIService.getActiveSeriesId();
        const team_id = SeriesApplicationAPIService.getActiveTeamId();

        if (team_id) {
            return SeriesApplicationAPIService.fetchSeriesApplicationTeam(series_id, team_id);
        }

        return this.fetchAndTransformResponse({
            url: `/api/series-registration/${series_id}/application`,
            /**
             * Transform API data to App data
             */
            transformResponse: function (response_data: SeriesApplicationApi.FetchApplicationAPIResponse): SeriesApplicationService.FetchUserApplicationServiceResponse {
                return SeriesApplicationAPITransformer.transformFetchSeriesRegistrationSeriesApplication(response_data);
            }
        });
    }

    /**
     * Fetch Series information for the Series Application page (Team)
     */
    static fetchSeriesApplicationTeam(series_id: string, team_id: string): Promise<SeriesApplicationService.FetchApplicationServiceResponse> {

        return this.fetchAndTransformResponse({
            url: `/api/series-registration/${series_id}/teams/${team_id}/application`,
            /**
             * Transform API data to App data
             */
            transformResponse: function (response_data: SeriesApplicationApi.FetchTeamApplicationAPIResponse): SeriesApplicationService.FetchTeamApplicationServiceResponse {
                return SeriesApplicationAPITransformer.transformFetchSeriesRegistrationSeriesApplicationTeam(response_data);
            }
        });
    }

    /**
     * Update the active user's profile information relative to a series application
     */
    static updateUserProfile(payload: SeriesApplication.UpdateProfilePayload): Promise<void> {
        const series_id = SeriesApplicationAPIService.getActiveSeriesId();
        const url = `/api/series-registration/${series_id}/profile`;
        const api_payload: SeriesApplicationApi.UpdateProfileAPIPayload = payload;

        return this.submitForAPISubmissionResponse({
            error_message: 'Error updating email address',
            method: 'patch',
            payload: api_payload,
            url
        });
    }

    /**
     * Fetch the state options for coach search
     */
    static fetchCoachSearchStateOptions(): Promise<StateFormOption[]> {
        const series_id = SeriesApplicationAPIService.getActiveSeriesId();
        const url = `/api/series-registration/${series_id}/coach-search`;

        return this.fetchAndTransformResponse({
            url,
            /**
             * Transform API data to App data
             */
            transformResponse: function (response_data: SeriesApplicationApi.CoachSearchFormOptionsAPIResponse): StateFormOption[] {
                return response_data.states;
            }
        });
    }

    /**
     * Fetch the state options for coach search
     */
    static fetchPartnerSearchStateOptions(): Promise<StateFormOption[]> {
        const series_id = SeriesApplicationAPIService.getActiveSeriesId();
        const url = `/api/series-registration/${series_id}/partner-search`;

        return this.fetchAndTransformResponse({
            url,
            /**
             * Transform API data to App data
             */
            transformResponse: function (response_data: SeriesApplicationApi.PartnerSearchFormOptionsAPIResponse): StateFormOption[] {
                return response_data.states;
            }
        });
    }

    /**
     * Run the coach search
     */
    static coachSearch(search_params: MemberSearchParameters): Promise<MemberSearchResult[]> {
        const series_id = SeriesApplicationAPIService.getActiveSeriesId();
        const url = `/api/series-registration/${series_id}/coach-search`;

        return MemberSearchService.memberSearch<SeriesApplication.CoachSearchResult, SeriesApplicationApi.CoachSearchAPIResponse>(search_params, url);
    }

    /**
     * Run the partner search
     */
    static partnerSearch(search_params: MemberSearchParameters, discipline_id: number): Promise<SeriesApplication.PartnerSearchResult[]> {
        const series_id = SeriesApplicationAPIService.getActiveSeriesId();
        const url = `/api/series-registration/${series_id}/partner-search/discipline/${discipline_id}`;

        return MemberSearchService.memberSearch<SeriesApplication.PartnerSearchResult, SeriesApplicationApi.PartnerSearchAPIResponse>(search_params, url);
    }

    /**
     * Save a skate test for a series application
     */
    static saveSkateTest(test_data: SkateTestFormData, discipline_key: SkateTestDisciplineKey): Promise<SeriesApplicationService.SaveSkateTestServiceResponse> {
        const series_id = SeriesApplicationAPIService.getActiveSeriesId();
        const error_message = 'Error saving skate test.';
        const url = `/api/series-registration/${series_id}/skate-test-history`;
        const payload: UserAddSkateTestAPIPayload = {
            test_data: SkateTestHistoryAPIAdaptor.adaptSkateTestFormDataToIndividualSkateTestData(test_data),
            discipline_key
        };

        return AbstractAPIService.submitWithTransformedResponse({
            error_message,
            method: 'post',
            payload,
            // eslint-disable-next-line jsdoc/require-jsdoc
            transformResponse: function (response_data: SeriesApplicationApi.AddSkateTestAPIResponse): SeriesApplicationService.SaveSkateTestServiceResponse {
                return {
                    skate_test_history: SkateTestHistoryAPIAdaptor.adaptUserSkateTestHistoryDataToUserSkateTestHistory(response_data.skate_test_history),
                    user_discipline_eligibility_update: response_data.user_discipline_eligibility_update ? response_data.user_discipline_eligibility_update.slice() : []
                };
            },
            url,
            // eslint-disable-next-line jsdoc/require-jsdoc
            validateResponse: function (response_data: SeriesApplicationApi.AddSkateTestAPIResponse) {
                return !!response_data && response_data.success && !!response_data.skate_test_history;
            }
        });
    }

    /**
     * Remove a skate test for a series application
     */
    static removeSkateTest(app_payload: SkateTestRemoveAppPayload): Promise<SeriesApplicationService.RemoveSkateTestServiceResponse> {
        const series_id = SeriesApplicationAPIService.getActiveSeriesId();
        const error_message = 'Error removing skate test.';
        const url = `/api/series-registration/${series_id}/skate-test-history`;
        const payload = SkateTestHistoryAPIAdaptor.adaptSkateTestRemoveAppPayloadToSkateTestRemoveAPIPayload(app_payload);

        return AbstractAPIService.submitWithTransformedResponse({
            error_message,
            method: 'delete',
            payload,
            // eslint-disable-next-line jsdoc/require-jsdoc
            transformResponse: function (response_data: SeriesApplicationApi.RemoveSkateTestAPIResponse): SeriesApplicationService.RemoveSkateTestServiceResponse {
                return {
                    skate_test_history: SkateTestHistoryAPIAdaptor.adaptUserSkateTestHistoryDataToUserSkateTestHistory(response_data.skate_test_history),
                    user_discipline_eligibility_update: response_data.user_discipline_eligibility_update ? response_data.user_discipline_eligibility_update.slice() : []
                };
            },
            url,
            // eslint-disable-next-line jsdoc/require-jsdoc
            validateResponse: function (response_data: SeriesApplicationApi.RemoveSkateTestAPIResponse) {
                return !!response_data && response_data.success && !!response_data.skate_test_history;
            }
        });
    }

    /**
     * Save a series application
     */
    static saveApplication(app_payload: SeriesApplicationService.SaveApplicationServicePayload): Promise<SeriesApplicationService.SaveApplicationServiceResponse> {
        const payload: SeriesApplicationApi.SaveApplicationAPIPayload = SeriesApplicationAPITransformer.transformSaveSeriesApplication(app_payload);
        const series_id = SeriesApplicationAPIService.getActiveSeriesId();
        const url = `/api/series-registration/${series_id}/application`;

        return AbstractAPIService.submitWithTransformedResponse({
            error_message: 'Error saving application.',
            method: 'post',
            payload,
            url,
            // eslint-disable-next-line jsdoc/require-jsdoc
            transformResponse: function (response_data: SeriesApplicationApi.SaveApplicationAPIResponse): SeriesApplicationService.SaveApplicationServiceResponse {
                return {
                    cart_link: response_data.cart_link
                };
            }
        });
    }

    /**
     * Save a series application
     */
    static saveApplicationTeam(app_payload: SeriesApplicationService.SaveApplicationServicePayload): Promise<SeriesApplicationService.SaveApplicationServiceResponse> {
        const payload: SeriesApplicationApi.SaveApplicationTeamAPIPayload = SeriesApplicationAPITransformer.transformSaveSeriesApplicationTeam(app_payload);
        const series_id = SeriesApplicationAPIService.getActiveSeriesId();
        const team_id = SeriesApplicationAPIService.getActiveTeamId(false);

        const url = `/api/series-registration/${series_id}/teams/${team_id}/application`;

        return AbstractAPIService.submitWithTransformedResponse({
            error_message: 'Error saving application.',
            method: 'post',
            payload,
            url,
            // eslint-disable-next-line jsdoc/require-jsdoc
            transformResponse: function (response_data: SeriesApplicationApi.SaveApplicationAPIResponse): SeriesApplicationService.SaveApplicationServiceResponse {
                return {
                    cart_link: response_data.cart_link
                };
            }
        });
    }
}