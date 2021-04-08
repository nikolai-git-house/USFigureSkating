import {
    CompetitionManagementCompetitionData,
    CompetitionManagementCompetitionInformationData,
    CompetitionManagementIndexCompetitionData
} from './CompetitionManagementDataContracts';

/**
 * Server response when fetching competition management index list
 */
export type CompetitionManagementFetchCompetitionListAPIResponse = {
    past: CompetitionManagementIndexCompetitionData[];         // The list of past competitions
    upcoming: CompetitionManagementIndexCompetitionData[];     // The list of upcoming competitions
}

/**
 * Server response when fetching the active competition management competition
 */
export interface FetchActiveCompetitionManagementCompetitionAPIResponse extends CompetitionManagementCompetitionData {}

/**
 * Server response when fetching the Competition Management Competition Information for a Competition
 */
export interface FetchCompetitionManagementCompetitionInformationAPIResponse extends CompetitionManagementCompetitionInformationData {}