import {CompetitionScheduleData} from '../../contracts/data/DataContracts';
/**
 * Server response when fetching a Schedule for a Competition when the schedule is not yet available
 */
export type FetchUnavailableCompetitionScheduleAPIResponse = {
    schedule_unavailable: true;     // Flag indicates schedule is not available
}

/**
 * Server response when fetching a Schedule for a Competition when the schedule is available
 */
export interface FetchAvailableCompetitionScheduleAPIResponse extends CompetitionScheduleData {
    schedule_unavailable: undefined | false;   // Flag should either be false, or excluded from response
}

/**
 * Server response when fetching a Schedule for a Competition
 *
 * If the schedule is available - FetchAvailableCompetitionScheduleAPIResponse
 * If the schedule is not available - FetchUnavailableCompetitionScheduleAPIResponse
 */
export type FetchCompetitionScheduleAPIResponse =
    FetchAvailableCompetitionScheduleAPIResponse
    | FetchUnavailableCompetitionScheduleAPIResponse;