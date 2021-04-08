import {SeriesOverview} from './SeriesOverviewContracts';
import {SeriesApplication} from '../../SeriesApplication/_contracts';

export namespace SeriesOverviewService {

    /**
     * The response actually returned by the service
     */
    export type FetchSeriesOverviewServiceResponse =
        FetchSeriesOverviewIndividualServiceResponse
        | FetchSeriesOverviewTeamServiceResponse;

    /**
     * Foundational service response.  Base types.  Not intended for direct use
     */
    interface FetchSeriesOverviewAbstractServiceResponse {
        applied_teams: SeriesApplication.AppliedTeams | null;
        series: SeriesOverview.Series;
        user_application: SeriesApplication.UserApplication | null;
    }

    /**
     * The response when fetching series overview for a non-team series
     */
    interface FetchSeriesOverviewIndividualServiceResponse extends FetchSeriesOverviewAbstractServiceResponse {
        applied_teams: null;
        user_application: SeriesApplication.UserApplication | null;
    }

    /**
     * The response when fetching series overview for a team series
     */
    interface FetchSeriesOverviewTeamServiceResponse extends FetchSeriesOverviewAbstractServiceResponse {
        applied_teams: SeriesApplication.AppliedTeams | null;
        user_application: null;
    }
}