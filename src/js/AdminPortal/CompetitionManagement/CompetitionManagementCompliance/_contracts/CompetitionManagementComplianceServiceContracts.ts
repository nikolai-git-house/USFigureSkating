import {EmailFormStateConfiguration} from '../../../EmailForm/_contracts/EmailFormContracts';
import {CompetitionManagementComplianceEntity} from '../_models/CompetitionManagementComplianceEntity';
import {
    CompetitionManagementComplianceEntityPositionFilter,
    CompetitionManagementComplianceServiceCompetition
} from './CompetitionManagementComplianceContracts';

/**
 * Service response when fetching compliance entities for a competition
 */
export interface CompetitionManagementComplianceFetchResult {
    entities: CompetitionManagementComplianceEntity[];
    position_filters: CompetitionManagementComplianceEntityPositionFilter[];
}

/**
 * Service response when fetching compliance email configuration
 *
 * BCC is always empty, since it's set by the component at large
 */
export interface ComplianceEmailConfiguration extends EmailFormStateConfiguration {
    bcc: false;
}

/**
 * Method for fetching from the compliance service
 */
export interface CompetitionManagementComplianceServiceFetchMethod {
    (competition: CompetitionManagementComplianceServiceCompetition): Promise<any>;
}

/**
 * Method for submitting from the compliance service
 */
export interface CompetitionManagementComplianceServiceSubmitMethod {
    (competition: CompetitionManagementComplianceServiceCompetition, payload: any): Promise<any>;
}