import {AbstractAPIService} from '../../services/AbstractAPIService';
import {
    FetchSeriesRegistrationSeriesListApiResponse,
    SeriesRegistrationApi
} from '../_contracts/SeriesRegistrationApiContracts';
import {SeriesRegistrationAPITransformer} from '../_transformers/SeriesRegistrationAPITransformer';
import {
    FetchSeriesRegistrationSeriesListServiceResponse,
    FetchSeriesTeamSelectServiceResponse
} from '../_contracts/SeriesRegistrationServiceContracts';
import {SeriesOverviewApi, SeriesOverviewService} from '../SeriesOverview/_contracts';
import {SERIES_REGISTRATION_ACTIVE_TEAM_ID_COOKIE_NAME, SERIES_REGISTRATION_COOKIE_NAME} from '../../config/AppConfig';
import {SeriesOverviewAPITransformer} from '../SeriesOverview/_transformers/SeriesOverviewAPITransformer';

export class SeriesRegistrationAPIService extends AbstractAPIService {
    /**
     * Fetch the index series list
     */
    static fetchSeriesList(): Promise<FetchSeriesRegistrationSeriesListServiceResponse> {
        return this.fetchAndTransformResponse({
            url: '/api/series-registration/series',
            /**
             * Transform API data to App data
             */
            transformResponse: function (response_data: FetchSeriesRegistrationSeriesListApiResponse): FetchSeriesRegistrationSeriesListServiceResponse {
                return SeriesRegistrationAPITransformer.transformFetchSeriesRegistrationSeriesList(response_data);
            }
        });
    }

    /**
     * Fetch data for a series overview
     */
    static fetchSeriesOverview(): Promise<SeriesOverviewService.FetchSeriesOverviewServiceResponse> {
        const series_id = SeriesRegistrationAPIService.getActiveSeriesId();

        return this.fetchAndTransformResponse({
            url: `/api/series-registration/${series_id}/overview`,
            /**
             * Transform API data into App data
             */
            transformResponse: function (response_data: SeriesOverviewApi.FetchSeriesOverviewApiResponse): SeriesOverviewService.FetchSeriesOverviewServiceResponse {
                return SeriesOverviewAPITransformer.transformFetchSeriesRegistrationSeriesOverview(response_data);
            }
        });
    }

    /**
     * Get the active Series ID from a cookie value
     */
    protected static getActiveSeriesId(): string {
        let series_id = '';
        if (SERIES_REGISTRATION_COOKIE_NAME) {
            const pattern = `(?:(?:^|.*;\\s*)${SERIES_REGISTRATION_COOKIE_NAME}\\s*\\=\\s*([^;]*).*$)|^.*$`;
            const cookieValue = document.cookie.replace(new RegExp(pattern), '$1');
            series_id = cookieValue.trim();
            if (series_id !== '') {
                return series_id;
            }
        }
        console.warn('Unable to determine active series ID');
        throw 'Unable to determine active series ID';
    }

    protected static getActiveTeamId(suppress_errors = true): string | null {
        if (suppress_errors) {
            try {
                return AbstractAPIService.getValueFromCookie(SERIES_REGISTRATION_ACTIVE_TEAM_ID_COOKIE_NAME, 'active team id', true);
            } catch (e) {
                return null;
            }
        }

        return AbstractAPIService.getValueFromCookie(SERIES_REGISTRATION_ACTIVE_TEAM_ID_COOKIE_NAME, 'active team id', false);
    }

    static fetchSeriesTeamSelect(): Promise<FetchSeriesTeamSelectServiceResponse> {
        const series_id = SeriesRegistrationAPIService.getActiveSeriesId();

        return this.fetchAndTransformResponse({
            url: `/api/series-registration/${series_id}/managed-teams`,
            /**
             * Transform API data into App data
             */
            transformResponse: function (response_data: SeriesRegistrationApi.FetchTeamSelectApiResponse): FetchSeriesTeamSelectServiceResponse {
                return SeriesRegistrationAPITransformer.transformFetchSeriesSelectTeam(response_data);
            }
        });
    }
}