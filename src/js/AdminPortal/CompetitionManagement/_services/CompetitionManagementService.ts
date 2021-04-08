import {COMPETITION_MANAGEMENT_COOKIE_NAME} from '../../../config/AppConfig';
import {AbstractAPIService} from '../../../services/AbstractAPIService';
import {SUBPAGE_COMPONENT_KEYS} from '../_constants/CompetitionManagementConstants';
import {
    CompetitionManagementFetchCompetitionListAPIResponse,
    FetchActiveCompetitionManagementCompetitionAPIResponse,
    FetchCompetitionManagementCompetitionInformationAPIResponse
} from '../_contracts/CompetitionManagementAPIContracts';
import {
    CompetitionManagementFetchCompetitionListResult,
    FetchActiveCompetitionManagementCompetitionInformationResponse,
    FetchActiveCompetitionManagementCompetitionResponse
} from '../_contracts/CompetitionManagementServiceContracts';
import {CompetitionManagementCompetition} from '../_models/CompetitionManagementCompetition';
import {CompetitionManagementAPITransformer} from '../_transformers/CompetitionManagementAPITransformer';

export class CompetitionManagementService extends AbstractAPIService {
    /**
     * Fetch the active competition
     */
    static fetchActiveCompetition() {
        return AbstractAPIService.fetchAndTransformResponse({
            url: CompetitionManagementService.getActiveCompetitionFetchURL(),
            /**
             * Validate that the response is an object
             */
            validateResponse: function (response_data: FetchActiveCompetitionManagementCompetitionAPIResponse) {
                if (!response_data || typeof response_data !== 'object' || typeof response_data.index_links !== 'object') {
                    console.error('Invalid competition data');

                    return false;
                }
                for (let i = 0; i < response_data.index_links.length; i++) {
                    const link_data = response_data.index_links[i];
                    if (link_data.component_link && SUBPAGE_COMPONENT_KEYS.indexOf(link_data.component_link) === -1) {
                        console.error('Invalid competition data: Component link "' + link_data.component_link + '" is invalid.');

                        return false;
                    }
                }

                return true;
            },
            /**
             * Transform API data to App data
             */
            transformResponse: function (response_data: FetchActiveCompetitionManagementCompetitionAPIResponse): FetchActiveCompetitionManagementCompetitionResponse {
                return CompetitionManagementAPITransformer.transformFetchActiveCompetition(response_data);
            }
        });
    }

    /**
     * Fetch the competition information for a competition
     */
    static fetchCompetitionInformation(competition: CompetitionManagementCompetition): Promise<FetchActiveCompetitionManagementCompetitionInformationResponse> {
        return AbstractAPIService.fetchAndTransformResponse({
            url: `/api/competition-management/competitions/${competition.id}/information`,
            /**
             * Validate that the response has the intended properties
             */
            validateResponse: function (response_data: FetchCompetitionManagementCompetitionInformationAPIResponse) {
                return !!response_data &&
                    !!response_data.deadlines &&
                    !!response_data.practice_ice &&
                    !!response_data.registrants &&
                    !!response_data.registration &&
                    !!response_data.volunteers;
            },
            /**
             * Transform API data to App data
             */
            transformResponse: function (response_data: FetchCompetitionManagementCompetitionInformationAPIResponse): FetchActiveCompetitionManagementCompetitionInformationResponse {
                return CompetitionManagementAPITransformer.transformFetchActiveCompetitionInformation(response_data);
            }
        });

    }

    /**
     * Fetch upcoming and past competitions lists for management
     */
    static fetchCompetitionLists(): Promise<CompetitionManagementFetchCompetitionListResult> {
        return AbstractAPIService.fetchAndTransformResponse({
            url: '/api/competition-management/competitions',
            /**
             * Validate that the response has expected properties
             */
            validateResponse: function (response_data: CompetitionManagementFetchCompetitionListAPIResponse) {
                return !!response_data && !!response_data.past && !!response_data.upcoming;
            },
            /**
             * Transform API data to App data
             */
            transformResponse: function (response_data: CompetitionManagementFetchCompetitionListAPIResponse): CompetitionManagementFetchCompetitionListResult {
                return CompetitionManagementAPITransformer.transformCompetitionManagementIndexListResponse(response_data);
            }
        });
    }

    /**
     * Get the proper endpoint url for fetching the active competition.
     *
     * If cookie is configured, set and value can be read, use stateless API url.
     * Otherwise, use state-based version
     *
     */
    static getActiveCompetitionFetchURL(): string {
        const url = '/api/competition-management/active-competition';
        if (COMPETITION_MANAGEMENT_COOKIE_NAME) {
            const pattern = `(?:(?:^|.*;\\s*)${COMPETITION_MANAGEMENT_COOKIE_NAME}\\s*\\=\\s*([^;]*).*$)|^.*$`;
            const cookieValue = document.cookie.replace(new RegExp(pattern), '$1');
            if (cookieValue.trim() !== '') {
                return `/api/competition-management/competitions/${cookieValue}`;
            }
            console.warn('Unable to read active competition cookie. Using state-based API');
        }

        return url;
    }
}