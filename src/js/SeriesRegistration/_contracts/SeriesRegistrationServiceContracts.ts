import {SeriesRegistration, SeriesRegistrationIndexSeries} from './SeriesRegistrationContracts';
import {SeriesManagedTeam} from '../_models';

/**
 * Service response when fetching series registration index list
 */
export type FetchSeriesRegistrationSeriesListServiceResponse = {
    series: SeriesRegistrationIndexSeries[];
};

export interface FetchSeriesTeamSelectServiceResponse {
    series: SeriesRegistration.SubpageSeriesSummary;
    teams: SeriesManagedTeam[];
}