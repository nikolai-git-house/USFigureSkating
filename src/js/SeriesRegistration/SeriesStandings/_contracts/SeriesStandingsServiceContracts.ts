import {SeriesStandings} from './SeriesStandingsContracts';

export namespace SeriesStandingsService {

    export interface FetchSeriesStandingsServiceResponse {
        series: SeriesStandings.Series;
        standings: SeriesStandings.Standings;
        filters: SeriesStandings.StandingsGlobalFilterSet;
    }
}