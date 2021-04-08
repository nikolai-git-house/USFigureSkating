import {CompetitionHeadingSource, MemberNumber} from '../../../../contracts/AppContracts';
import {ComplianceRequirementsSummaryItem} from '../../../_contracts/AdminPortalContracts';
import {SubmitEmailPayload} from '../../../EmailForm/_contracts/EmailFormContracts';
import {
    CompetitionManagementCompliancePositionEntity,
    CompetitionManagementEntityComplianceFreePositionFilters,
    CompetitionManagementEntityPosition,
    CompetitionManagementEntityPositionFilter
} from '../../_contracts/component-contracts/CompetitionManagementCompliancePositionFiltersContracts';

/* ===========================================================================================================
*                                              Entities
* ===========================================================================================================*/

/**
 * Interface for entities in compliance page
 */
export interface CompetitionManagementCompliancePageEntityInterface extends CompetitionManagementCompliancePositionEntity {
    city: string;
    compliance_summary: ComplianceRequirementsSummaryItem[];
    email_address: string;
    first_name: string;
    full_name: string;
    id: number;
    is_compliant: boolean;
    last_name: string;
    member_number: MemberNumber;
    phone_number: string;
    positions: CompetitionManagementComplianceComplianceEntityPosition[];
    state_abbreviation: string;
}

/**
 * A position key for a compliance entity
 */
export type CompetitionManagementComplianceComplianceEntityPositionKey =
    'coach_qualifying'
    | 'coach_nonqualifying'
    | 'coach_compete_usa'
    | 'coach_foreign'
    | 'team_service_personnel' | string;

/**
 * Represents a position for a compliance entity
 */
export interface CompetitionManagementComplianceComplianceEntityPosition extends CompetitionManagementEntityPosition {
    key: CompetitionManagementComplianceComplianceEntityPositionKey;
}

/* ===========================================================================================================
*                                              Payloads
* ===========================================================================================================*/

/**
 * Compliance Email target BCC compliance key
 */
type SubmitComplianceEmailComplianceConfiguration = 'all_compliance' | 'compliant' | 'non_compliant';
/**
 * Compliance email target BCC position key(s)
 */
type SubmitComplianceEmailPositionConfiguration =
    'all_positions'
    | CompetitionManagementComplianceComplianceEntityPositionKey;

/**
 * Compliance email BCC configuration
 */
interface SubmitComplianceEmailRecipientConfiguration extends Array<string> {
    0: SubmitComplianceEmailComplianceConfiguration;

    [index: number]: SubmitComplianceEmailPositionConfiguration;
}

/**
 * Payload when submitting a compliance email
 */
export interface SubmitComplianceEmailPayload extends SubmitEmailPayload {
    bcc: SubmitComplianceEmailRecipientConfiguration;
}

/* ===========================================================================================================
*                                              Competitions
* ===========================================================================================================*/
/**
 * Interface for competition required to power compliance page
 */
export interface CompetitionManagementCompliancePageCompetitionInterface extends CompetitionHeadingSource {
    compliance_report_link: string;
    manage_link: string;
}

/**
 * Competition used by CompetitionManagementComplianceService
 */
export interface CompetitionManagementComplianceServiceCompetition {
    id: number;
}

/* ===========================================================================================================
*                                              Filters
* ===========================================================================================================*/
/**
 * Interface for selected compliance filters
 */
export interface CompetitionManagementComplianceFiltersInterface extends CompetitionManagementEntityComplianceFreePositionFilters {
    positions: CompetitionManagementComplianceEntityPositionFilter[];
}

/**
 * An entity position filter specific to compliance entities
 */
export interface CompetitionManagementComplianceEntityPositionFilter extends CompetitionManagementEntityPositionFilter {
    value: CompetitionManagementComplianceEntityPositionFilterValue;
}

/**
 * Value of a "position" filter
 */
export type CompetitionManagementComplianceEntityPositionFilterValue =
    'all'
    | CompetitionManagementComplianceComplianceEntityPositionKey;