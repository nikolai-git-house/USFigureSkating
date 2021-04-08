/**
 * Summary of a data point related to a user's compliance or requirements
 */
export interface ComplianceRequirementsSummaryItem {
    complete: boolean;
    id: number;
    name: string;
    overridden: boolean;
}

/**
 * Summary of a data point related to a user's compliance or requirements with a description of its status
 */
export interface ComplianceRequirementsSummaryItemDescribed extends ComplianceRequirementsSummaryItem {
    status_description: string;
}