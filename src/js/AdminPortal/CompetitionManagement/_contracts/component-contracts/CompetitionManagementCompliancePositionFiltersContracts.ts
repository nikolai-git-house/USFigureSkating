import {FormOption} from '../../../../contracts/AppContracts';

/**
 * Represents the state of an active set of compliance, position and free filters
 */
export interface CompetitionManagementEntityComplianceFreePositionFilters {
    compliance: CompetitionManagementEntityComplianceFilter;
    free: string;
    positions: CompetitionManagementEntityPositionFilter[];
}

export interface CompetitionManagementEntityPositionFilter extends FormOption {
    label: string;
    value: CompetitionManagementEntityPositionFilterValue;
}

/**
 * A position filter for an entity
 */
export type CompetitionManagementEntityPositionFilterValue = CompetitionManagementEntityPositionKey | 'all';

/**
 * Key to identify a value of an entity position
 */
export type CompetitionManagementEntityPositionKey = string;

/**
 * A compliance filter for an entity.  Either compliant, not, or both
 */
export type CompetitionManagementEntityComplianceFilter = boolean | 'both';

/**
 * Payload when changing compliance and position filters
 */
export interface CompetitionManagementCompliancePositionFiltersChangePayload {
    compliance: CompetitionManagementEntityComplianceFilter;
    positions: CompetitionManagementEntityPositionFilter[];
}

export interface CompetitionManagementEntityPosition {
    key: CompetitionManagementEntityPositionKey;
    label: string;
}

export interface CompetitionManagementCompliancePositionEntity {
    is_compliant: boolean;
    positions: CompetitionManagementEntityPosition[];
}