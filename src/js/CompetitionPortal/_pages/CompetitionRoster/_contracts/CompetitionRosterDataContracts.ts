import {MemberNumberData} from '../../../../contracts/data/DataContracts';

export namespace CompetitionRosterData {
    /**
     * Represents a member of the active competition roster for a team
     */
    export interface CompetitionRosterMember {
        id: string;                        // Unique identifier for the member
        first_name: string;                // first name for the member
        last_name: string;                 // last name for the member
        is_compliant: boolean;             // Whether the member is compliant
        is_ineligible: boolean;            // Whether the member is ineligible to participate
        member_number: MemberNumberData;   // Member number for the member
        age: number;                       // Age of the member
        compliance_requirements_summary: ComplianceRequirementsSection[]; // Summary about the member's compliance/requirements information
    }

    /**
     * Represents a section of a member's compliance/requirements information
     */
    interface ComplianceRequirementsSection {
        name: string;                           // The name of the section
        items: ComplianceRequirementsItem[];    // Items within the section
        is_complete: boolean;                   // Whether the overall section is complete
    }

    /**
     * Represents a single compliance/requirements item for a member
     */
    interface ComplianceRequirementsItem {
        name: string;                                      // The name of the item
        complete: boolean;                                 // Whether the item is complete
        is_membership?: boolean;                           // Whether the item is the "Membership" item.  Controls display of membership end date
        is_age_verification?: boolean;                     // Whether the item is the "Age Verified" item.  Controls display of supplementary information when not complete
        membership_expiration_date_formatted?: string;     // The formatted membership end date.  Displays when `is_membership` is true
    }
}