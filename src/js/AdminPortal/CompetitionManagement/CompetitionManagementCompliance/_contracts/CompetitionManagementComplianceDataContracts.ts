import {MemberNumberData} from '../../../../contracts/data/DataContracts';

/**
 * Display-only version of ComplianceRequirementsSummaryItemData
 */
export interface ComplianceRequirementsSummaryItemDisplayData {
    complete: boolean;          // Whether the compliance/requirements item is complete
    name: string;               // Name of the compliance/requirements item
}

/**
 * Identifying key for a compliance entity's position
 */
export type CompetitionManagementComplianceEntityPositionKeyData =
    'coach_qualifying'
    | 'coach_nonqualifying'
    | 'coach_compete_usa'
    | 'coach_foreign'
    | 'team_service_personnel'
    | string;

/**
 * Represents information about an entity's position
 */
export type CompetitionManagementComplianceEntityPositionData = {
    key: CompetitionManagementComplianceEntityPositionKeyData;           // Key identifier for position
    label: string;                                                       // The display label for the position
}

/**
 * Represents an entity for the Competition Management "Compliance" page
 */
export interface CompetitionManagementComplianceEntityData {
    city: string;                                                           // The display city for the entity
    compliance_summary: ComplianceRequirementsSummaryItemDisplayData[];     // Summary of the entity's compliance
    email_address: string;                                                  // Display email address for the entity
    first_name: string;                                                     // Entity first name
    id: number;                                                             // Unique identifier for the entity
    is_compliant: boolean;                                                  // Whether the entity is compliant
    last_name: string;                                                      // Entity last name
    member_number: MemberNumberData;                                        // Entity member number
    phone_number: string;                                                   // Entity phone number
    positions: CompetitionManagementComplianceEntityPositionData[];         // List of positions for the entity
    state_abbreviation: string;                                             // Display state abbreviation for the entity
}