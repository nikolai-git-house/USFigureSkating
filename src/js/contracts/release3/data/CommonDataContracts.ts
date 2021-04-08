/* ===========================================================================================================
*                                              FORM OPTIONS
* ===========================================================================================================*/
/**
 * The value of a Form Option.
 */
import {EmergencyContactData} from '../../../models/Forms/EmergencyContactFormState';

export type FormOptionDataValue = any; // [primitive] any primitive value

/**
 * Represents data for an option for use within a form
 */
export interface FormOptionData {
    label: string;                     // Value that displays to the user
    value: FormOptionDataValue;       // (primitive value) Value for the form option used for data tracking purposes
}

/**
 * Represents data for a form option for state selection
 */
export interface StateFormOptionData extends FormOptionData {
}

/**
 * Represents data for a form option for province selection
 */
export interface ProvinceFormOptionData extends FormOptionData {
}

/**
 * Represents data for a form option for country selection
 */
export interface CountryFormOptionData extends FormOptionData {
    is_usa: boolean;       // Whether the country is the United States.  Used within downstream app logic
    is_canada: boolean;    // Whether the country is Canada.  Used within downstream app logic
}

/* ===========================================================================================================
*                                              MISC
* ===========================================================================================================*/
/**
 * Represents information about a member that can be assigned by a user to a competition.
 * ex: Competition Coach or Competition Partner
 */
export interface AssignableMemberData {
    id: number;                 // Unique identifier for the member
    first_name: string;         // First name of the member
    last_name: string;          // Last name of the member
    ineligible: boolean;        // Whether the member is ineligible to participate in sanctioned events
}

/**
 * Represents data for an emergency contact, but no fields contain empty strings
 */
export interface CompletedEmergencyContactData extends EmergencyContactData {}