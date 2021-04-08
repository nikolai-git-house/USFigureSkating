import {SeriesOverviewData} from './SeriesOverviewDataContracts';
import {SeriesApplicationData} from '../../SeriesApplication/_contracts';

export namespace SeriesOverviewApi {
    /**
     * Server response when fetching information for the Series Overview page
     */
    export interface FetchSeriesOverviewApiResponse {
        series: SeriesOverviewData.SeriesData;                                      // Core information about the series
        user_application?: SeriesApplicationData.SavedUserApplicationData | null;   // The user's application for the series, if one exists
        applied_teams?: SeriesOverviewData.SeriesAppliedTeamsData;                  // For team series, the teams that have been applied for the series, if any
    }
}