import {SeriesStandingsData} from './SeriesStandingsDataContracts';

export namespace SeriesStandingsApi {
    /**
     * API response when fetching series standings
     */
    export interface FetchSeriesStandingsApiResponse {
        series: SeriesStandingsData.SeriesData;           // Information about the series
        standings: SeriesStandingsData.StandingsData;     // Standings data for the series
    }
}