import {CompetitionManagementCompetition} from '../_models/CompetitionManagementCompetition';
import {CompetitionManagementCompetitionInformation} from '../_models/CompetitionManagementCompetitionInformation';
import {CompetitionManagementIndexCompetition} from './CompetitionManagementContracts';

/**
 * App response when fetching competition management index competition list
 */
export type CompetitionManagementFetchCompetitionListResult = {
    upcoming: CompetitionManagementIndexCompetition[];
    past: CompetitionManagementIndexCompetition[];
};

/**
 * App response when fetching competition management active competition
 */
export interface FetchActiveCompetitionManagementCompetitionResponse extends CompetitionManagementCompetition {}

/**
 * App response when fetching competition management active competition information
 */
export interface FetchActiveCompetitionManagementCompetitionInformationResponse extends CompetitionManagementCompetitionInformation {}