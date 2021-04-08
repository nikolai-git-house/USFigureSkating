import {APISubmissionResponse} from '../../../../contracts/release3/api/CommonAPIContracts';
import {MemberSearchAPIParameters} from '../../../../contracts/release3/api/MemberSearchAPIContracts';
import {FormOptionDataValue, StateFormOptionData} from '../../../../contracts/release3/data/CommonDataContracts';
import {
    CompetitionManagementContactData,
    CompetitionManagementContactPositionFormOptionData,
    CompetitionManagementContactPositionFormOptionDataValue,
    CompetitionManagementContactPositionKeyData,
    CompetitionManagementContactTypeKeyData
} from './CompetitionManagementContactsDataContracts';

/**
 * Server payload when adding a Competition Management Contact
 */
export type CompetitionManagementContactsAddAPIPayload = {
    id: number;                                                              // The ID associated with the selected MemberSearchResult
    position: CompetitionManagementContactPositionFormOptionDataValue;       // The value of the selected CompetitionManagementContactPositionFormOptionData for position
    type: CompetitionManagementContactTypeKeyData;                           // The type of contact to add
}

/**
 * Server response when adding a Competition Management Contact
 */
export interface CompetitionManagementContactsAddAPIResponse extends APISubmissionResponse {
    contact: CompetitionManagementContactData;     // Data representing the added contact
}

/**
 * Server payload when changing whether a contact should display in the competitor/coach portal
 */
export interface CompetitionManagementContactsChangeDisplayAPIPayload {
    id: number;                                                    // The ID for the entity being changed
    is_display: boolean;                                           // The display selection for the entity
    type_key: CompetitionManagementContactTypeKeyData;             // The type key of the entity
}

/**
 * Server response when fetching Competition Management Contacts
 */
export interface CompetitionManagementContactsFetchAPIResponse {
    contacts: CompetitionManagementContactData[];      // List of contact type contacts
    officials: CompetitionManagementContactData[];     // List of official type contacts
    required_positions?: {                                          // Lists of `CompetitionManagementContactPositionKeyData` (for each entity list type) for positions for which the last instance of that position should be prevented from being removed
        contacts?: CompetitionManagementContactPositionKeyData[];       // Positions within the contacts list.  If not provided, all positions will be treated as always removable
        officials?: CompetitionManagementContactPositionKeyData[];      // Positions within the officials list.  If not provided, all positions will be treated as always removable
    };
}

/**
 * Server response when fetching add form data for the Competition Management Contacts page
 *
 * Options for a competition will only be fetched once, and return information necessary for all versions of the form
 */
export type CompetitionManagementContactsFetchAddFormOptionsAPIResponse = {
    position_form_options: {                 // Form options for the "Position" input on the add form
        contact: CompetitionManagementContactPositionFormOptionData[];      // Options when adding a contact
        official: CompetitionManagementContactPositionFormOptionData[];     // Options when adding an official
    };
    state_form_options: {                    // Form options for the "State" input on the add (search) form
        contact: StateFormOptionData[];         // Options when adding a contact
        official: StateFormOptionData[];        // Options when adding an official
    };
}

/**
 * Server payload when running an "Add Contact" search
 */
export interface CompetitionManagementContactsSearchAPIParameters extends MemberSearchAPIParameters {
    position: FormOptionDataValue;                                 // The value selected for the position input
    type_key: CompetitionManagementContactTypeKeyData;             // Whether the search is being run to add a contact or an official
}

/**
 * Server payload when removing a competition contact
 */
export type CompetitionManagementContactsRemoveAPIPayload = {
    id: number;                                                    // Identifier for the contact to be removed
    type_key: CompetitionManagementContactTypeKeyData;             // The whether the search is being run to add a contact or an official
}