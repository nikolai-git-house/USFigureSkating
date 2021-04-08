import {SeriesRegistrationAPIService} from '../../_services/SeriesRegistrationAPIService';
import {SeriesStandingsApi, SeriesStandingsService} from '../_contracts';
import {SeriesStandingsApiTransformer} from '../_transformers/SeriesStandingsApiTransformer';

export class SeriesStandingsApiService extends SeriesRegistrationAPIService {

    /**
     * Fetch the standings page information for a series
     */
    static fetchSeriesStandings(): Promise<SeriesStandingsService.FetchSeriesStandingsServiceResponse> {
        const series_id = this.getActiveSeriesId();
        const url = `/api/series-registration/${series_id}/standings`;

        return this.fetchAndTransformResponse({
            url,
            // eslint-disable-next-line jsdoc/require-jsdoc
            transformResponse: function (response_data: SeriesStandingsApi.FetchSeriesStandingsApiResponse): SeriesStandingsService.FetchSeriesStandingsServiceResponse {
                return SeriesStandingsApiTransformer.transformFetchSeriesStandings(response_data);
            },
            // eslint-disable-next-line jsdoc/require-jsdoc
            validateResponse: function (response_data: SeriesStandingsApi.FetchSeriesStandingsApiResponse): boolean {
                if (!response_data) {
                    console.error('Empty FetchSeriesStandingsApiResponse');

                    return false;
                }
                if (!response_data.series) {
                    console.error('Empty FetchSeriesStandingsApiResponse.series');

                    return false;
                }
                if (!response_data.standings) {
                    console.error('Empty FetchSeriesStandingsApiResponse.standings');

                    return false;
                }

                return true;
            }
        });
    }
}