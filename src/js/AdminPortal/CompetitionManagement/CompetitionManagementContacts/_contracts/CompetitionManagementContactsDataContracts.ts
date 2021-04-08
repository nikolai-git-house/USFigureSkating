import {MemberNumberData} from '../../../../contracts/data/DataContracts';
import {FormOptionData} from '../../../../contracts/release3/data/CommonDataContracts';

/**
 * Represents a Competition Management Contact (contact or official)
 */
export interface CompetitionManagementContactData {
    email_address: string;                                   // Contact's email address
    first_name: string;                                      // Contact's first name
    id: number;                                              // Unique identifier for contact
    is_compliant: boolean;                                   // Whether the contact is compliant
    is_display: boolean;                                     // Whether the contact is configured to display in the Coach/Competitor Portal.
    last_name: string;                                       // Contact's last name
    member_number: MemberNumberData;                         // Contact's member number
    phone_number: string;                                    // Contact's phone number
    position: CompetitionManagementContactPositionData;      // Contact's position/role information
}

/**
 * Represents information about a Contact's position
 */
export type CompetitionManagementContactPositionData = {
    key: CompetitionManagementContactPositionKeyData;       // Key identifier for position
    label: string;                                          // The display label for the position
}

/**
 * Unique key for contact position
 */
export type CompetitionManagementContactPositionKeyData = string;

/**
 * Represents a form option for a competition management contact's position
 */
export interface CompetitionManagementContactPositionFormOptionData extends FormOptionData {
    value: CompetitionManagementContactPositionFormOptionDataValue;
}

/**
 * Represents a form option value when selecting a position for a competition management contact
 */
export type CompetitionManagementContactPositionFormOptionDataValue = string;

/**
 * Represents a type category key for Competition Management Contacts
 */
export type CompetitionManagementContactTypeKeyData = 'contact' | 'official';