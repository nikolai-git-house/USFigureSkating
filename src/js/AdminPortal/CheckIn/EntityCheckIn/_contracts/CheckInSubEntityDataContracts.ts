/**
 * Represents a skater being coached for a competition by the active entity
 */
import {MemberNumberData} from '../../../../contracts/data/DataContracts';

export interface CheckInEntityCoachedSkaterData {
    checked_in: boolean;            // Whether the skater is checked in
    first_name: string;             // The skater's first name
    last_name: string;              // The skater's last name
}

/**
 * A sub-entity skater for a check-in entity, ex: A skater in a team roster
 */
export interface CheckInSubEntitySkaterData {
    age: number;                                                                // The age of the skater
    can_be_added_to_roster: boolean;                                            // Whether the skater can be added to the active competition roster
    cannot_be_added_to_roster_reason: string;                                   // If the skater can't be added to the active competition roster, reason for why not
    compliance_summary: ComplianceRequirementsSummaryItemDescribedData[];       // Summary of the skater's compliance information
    first_name: string;                                                         // Skater's first name
    full_name: string;                                                          // Skater's full name
    id: number;                                                                 // Unique identifier for the Skater
    last_name: string;                                                          // Skater's last name
    member_number: MemberNumberData;                                            // Skater's member number
    requirements_summary: ComplianceRequirementsSummaryItemDescribedData[];     // Summary of the skater's requirements information
}

/**
 *  A sub-entity coach for a check-in entity, ex: A Coach in a team's coach roster
 */
export interface CheckInSubEntityTeamCoachData {
    can_be_added_to_roster: boolean;                                 // Whether the Coach can be added to the active competition coach roster
    cannot_be_added_to_roster_reason: string;                        // If the Coach can't be added to the active competition roster, reason for why not
    compliance_summary: ComplianceRequirementsSummaryItemData[];     // Summary of the Coach's compliance information
    email_address: string;                                           // Coach's email address
    first_name: string;                                              // Coach's first name
    full_name: string;                                               // Coach's full name
    id: number;                                                      // Unique identifier for the Coach
    last_name: string;                                               // Coach's last name
    member_number: MemberNumberData;                                 // Coach's member number
    phone_number: string;                                            // Coach's phone number
}

/**
 *  A sub-entity team service person for a check-in entity.
 */
export interface CheckInSubEntityTeamServicePersonnelData {
    can_be_added_to_roster: boolean;                                 // Whether the Person can be added to the active competition coach roster
    cannot_be_added_to_roster_reason: string;                        // If the Person can't be added to the active competition roster, reason for why not
    compliance_summary: ComplianceRequirementsSummaryItemData[];     // Summary of the Person's compliance information
    email_address: string;                                           // Person's email address
    first_name: string;                                              // Person's first name
    full_name: string;                                               // Person's full name
    id: number;                                                      // Unique identifier for the Person
    last_name: string;                                               // Person's last name
    member_number: MemberNumberData;                                 // Person's member number
    phone_number: string;                                            // Person's phone number
    team_role: string;                                               // Description of the Person's team role
}

/**
 * Represents information about a skater-coach check-in sub-entity (a coach belonging to a check-in skater entity)
 */
export interface CheckInSubEntitySkaterCoachData {
    compliance_summary: ComplianceRequirementsSummaryItemData[];     // Summary of the Coach's compliance information
    first_name: string;                                              // Coach's first name
    id: number;                                                      // Unique identifier for the Coach
    ineligible: boolean;                                             // Whether the coach is ineligible to participate
    last_name: string;                                               // Coach's last name
}

/**
 * Represents a single compliance/requirements item and its completeness/override status
 */
export interface ComplianceRequirementsSummaryItemData {
    complete: boolean;          // Whether the compliance/requirements item is complete
    id: number;                 // Unique identifier for the compliance/requirements item
    name: string;               // Name of the compliance/requirements item
    overridden: boolean;        // Whether the compliance/requirements item has been overridden despite incomplete status
}

/**
 * ComplianceRequirementsSummaryItemData with a supporting status description
 */
export interface ComplianceRequirementsSummaryItemDescribedData extends ComplianceRequirementsSummaryItemData {
    status_description: string;     // Description elaborating on status: "Complete," "Incomplete," "Yes," "No," etc.
}