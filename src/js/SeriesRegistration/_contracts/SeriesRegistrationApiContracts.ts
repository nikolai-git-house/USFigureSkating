import {SeriesRegistrationData, SeriesRegistrationIndexSeriesData} from './SeriesRegistrationDataContracts';

/**
 * Server response when fetching the list of series items for the "Series Information" page
 */
export type FetchSeriesRegistrationSeriesListApiResponse = {
    series: SeriesRegistrationIndexSeriesData[];    // The list of series items
};

export namespace SeriesRegistrationApi {
    /**
     * Server response when fetching the list of selectable teams for a team series
     */
    export interface FetchTeamSelectApiResponse {
        series: SeriesRegistrationData.SupageSeriesSummary;  // Summary information about series for page skeleton
        teams: SeriesRegistrationData.ManagedTeam[];         // List of teams to display in page
    }
}