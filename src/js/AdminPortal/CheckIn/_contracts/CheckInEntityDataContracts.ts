/**
 * A list of items representing complete check-in entities
 */
import {MemberNumberData} from '../../../contracts/data/DataContracts';

export interface CheckInEntityListData extends Array<CheckInEntityInstanceData> {
}

/**
 * Complete data for a check-in entity of any type
 */
export type CheckInEntityInstanceData =
    CheckInEntityCoachData
    | CheckInEntityCompetitionContactData
    | CheckInEntityOfficialData
    | CheckInEntitySkaterData
    | CheckInEntityTeamData
    | CheckInEntityTeamCoachData
    | CheckInEntityTeamServicePersonnelData
    | CheckInEntityVolunteerData;

/**
 * Represents core data present for all Check-in Entity types
 */
export interface CheckInEntityBaseData {
    check_in_status: CheckInEntityCheckInStatusData;     // Information about the check-in status of the
                                                         // entity
    club: string | null;                                 // The club for the check-in entity.  Displays
                                                         // on Entity Check-in Index if present
    comment_count: number;                               // How many comments are associated with the entity
    eligible: boolean;                                   // Whether the entity is eligible to check-in for
                                                         // the competition
    entity_type_key: CheckInEntityTypeKeyData;           // Entity type identifier
    id: string;                                          // Unique identifier for the entity. Used in URL
                                                         // segments for downstream API calls
    lts_program: string | null;                          // LTS program for the entity.  Displays on Entity
                                                         // Check-in Index if present
    member_number: MemberNumberData;                     // Entity's member number
    membership_status: {                                 // Information about the entity's membership status
        active: boolean;                                 // If false, "Expired" will show on Entity Check-in
                                                         // Index and the entity cannot check-in
        validity_date_formatted: string | null;          // Displays on Entity Check-in Index if present
    };
    name: string;                                        // Name of the entity
}

/**
 * Key to identify a Check-in Entity type
 */
export type CheckInEntityTypeKeyData =
    'coach'
    | 'competition_contact'
    | 'official'
    | 'skater'
    | 'team'
    | 'team_coach'
    | 'team_personnel'
    | 'volunteer';

/**
 * Represents information about the check-in status for an entity
 *
 * Note:  credential_received and unpaid_fees_received serve to pre-check their respective checkboxes
 *        on the Entity Check-in page.  No adverse effects will happen if they're always false
 */
export interface CheckInEntityCheckInStatusData {
    checked_in: boolean;                               // Whether the entity is checked in
    checked_in_by: string | null;                      // The name of the person who checked the entity in
    checked_in_date_time_formatted: string | null;     // The formatted date/time the entity was checked in
    credential_received: boolean;                      // Whether the entity has been given a credential
    unpaid_fees_received: boolean;                     // Whether the entity's unpaid fees have been
                                                       // received
}

/**
 * Represents outstanding fees for a Check-in entity
 */
export interface CheckInEntityOutstandingFeeData {
    amount: string;     // The amount for the fee
    name: string;       // The name of the fee
}

/**
 * Represents a check-in Coach entity
 */
export interface CheckInEntityCoachData extends CheckInEntityBaseData {
    email: string | null;                     // Email for display on Entity Check-in Index page
    entity_type_key: 'coach';                 // Identifies the entity as a coach
    personal_schedule_url: string | null;     // URL to the entity's personal schedule
    phone: string | null;                     // Phone number for display on Entity Check-in Index page
    skater_count: number;                     // Number of skaters the entity is coaching
}

/**
 * Represents additional check-in information fetched upon initiation of check-in for an entity containing compliance
 */
export interface CheckInEntityCheckInComplianceData {
    is_compliant: boolean;                    // Whether the entity is compliance-complete
}

/**
 * Represents a check-in Competition Contact entity
 */
export interface CheckInEntityCompetitionContactData extends CheckInEntityBaseData {
    email: string | null;                       // Email for display on Entity Check-in Index page
    entity_type_key: 'competition_contact';     // Identifies the entity as a competition contact
    phone: string | null;                       // Phone number for display on Entity Check-in Index page
}

/**
 * Represents a check-in Official entity
 */
export interface CheckInEntityOfficialData extends CheckInEntityBaseData {
    email: string | null;            // Email for display on Entity Check-in Index page
    entity_type_key: 'official';     // Identifies the entity as an official
    is_compliant: boolean;           // Whether the entity is compliance-complete
    phone: string | null;            // Phone number for display on Entity Check-in Index page
}

/**
 * Represents a check-in Skater entity
 */
export interface CheckInEntitySkaterData extends CheckInEntityBaseData {
    coach_count: number;                                     // The number of coaches the entity has for the
                                                             // competition
    entity_type_key: 'skater';                               // Identifies the entity as a skater
    events_complete: boolean;                                // Whether the entity's event requirements are
                                                             // complete
    outstanding_fees: CheckInEntityOutstandingFeeData[];     // Outstanding fees for the entity
    personal_schedule_url: string | null;                    // URL to the entity's personal schedule for
                                                             // the competition
    unpaid_events: string[];                                 // List of unpaid events for the entity
}

/**
 * Represents a check-in Team entity
 */
export interface CheckInEntityTeamData extends CheckInEntityBaseData {
    coach_count: number;                                     // The number of coaches the entity has for the
                                                             // competition
    entity_type_key: 'team';                                 // Identifies the entity as a team
    events_complete: boolean;                                // Whether the entity's event requirements
                                                             // are complete
    outstanding_fees: CheckInEntityOutstandingFeeData[];     // Outstanding fees for the entity
    roster_count: number;                                    // The amount of people in the entity's
                                                             // competition roster
    team_level: string;                                      // The entity's team level.  Displays in
                                                             // various places along with the team name
    team_service_personnel_count: number;                    // The number of team service personnel
                                                             // the entity has for the competition
    unpaid_events: string[];                                 // List of unpaid events for the entity
}

/**
 * Represents a check-in Team Coach entity
 */
export interface CheckInEntityTeamCoachData extends CheckInEntityBaseData {
    email: string | null;                     // Email for display on Entity Check-in Index page
    entity_type_key: 'team_coach';            // Identifies the entity as a team coach
    personal_schedule_url: string | null;     // URL to the entity's personal schedule
    phone: string | null;                     // Phone number for display on Entity Check-in Index page
}

/**
 * Represents a check-in Team Service Personnel entity
 */
export interface CheckInEntityTeamServicePersonnelData extends CheckInEntityBaseData {
    email: string | null;                  // Email for display on Entity Check-in Index page
    entity_type_key: 'team_personnel';     // Identifies the entity as a team service personnel
    is_compliant: boolean;                 // Whether the entity is compliance-complete
    phone: string | null;                  // Phone number for display on Entity Check-in Index page
}

/**
 * Represents a check-in Volunteer entity
 */
export interface CheckInEntityVolunteerData extends CheckInEntityBaseData {
    email: string | null;                     // Email for display on Entity Check-in Index page
    entity_type_key: 'volunteer';             // Identifies the entity as a volunteer
    personal_schedule_url: string | null;     // URL to the entity's personal schedule
    phone: string | null;                     // Phone number for display on Entity Check-in Index page
}