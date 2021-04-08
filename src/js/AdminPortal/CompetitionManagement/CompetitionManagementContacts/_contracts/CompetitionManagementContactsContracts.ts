import {MemberSearchParameters, MemberSearchResult} from '../../../../contracts/app/MemberSearchContracts';
import {FormOption, MemberNumber} from '../../../../contracts/AppContracts';
import {
    CompetitionManagementCompliancePositionEntity,
    CompetitionManagementEntityComplianceFreePositionFilters,
    CompetitionManagementEntityPosition,
    CompetitionManagementEntityPositionFilter
} from '../../_contracts/component-contracts/CompetitionManagementCompliancePositionFiltersContracts';
import {CompetitionManagementContact} from '../_models/CompetitionManagementContact';

/**
 * Payload from component when adding a competition management contact
 */
export type CompetitionManagementContactAddComponentPayload = {
    member: MemberSearchResult;
    position: CompetitionManagementContactPositionFormOption;
}

/**
 * Payload originating from component for running a add contact search
 */
export interface CompetitionManagementContactAddSearchParameters extends MemberSearchParameters {
    position: CompetitionManagementContactPositionFormOptionValue;
}

/**
 * Keyed lists of competition management contacts
 */
export type CompetitionManagementContactLists = {
    contacts: CompetitionManagementContact[];
    officials: CompetitionManagementContact[];
}

/**
 * Payload when changing whether a contact should display
 */
export type ChangeCompetitionContactDisplayPayload = {
    entity: CompetitionManagementContact;
    is_display: boolean;
};

/**
 * Key for category of contacts
 */
export type CompetitionManagementContactTypeKey = 'contact' | 'official';

/**
 * Interface for entity on contacts index page
 */
export interface CompetitionManagementContactsIndexEntityInterface extends CompetitionManagementCompliancePositionEntity {
    email_address: string;
    first_name: string;
    full_name: string;
    id: number;
    is_compliant: boolean;
    is_display: boolean;
    last_name: string;
    member_number: MemberNumber;
    phone_number: string;
    position: CompetitionManagementContactPosition;
}

/**
 * A position for a competition management contact
 */
export interface CompetitionManagementContactPosition extends CompetitionManagementEntityPosition {
    key: CompetitionManagementContactPositionKey;
}

/**
 * Unique key CompetitionManagementContactPosition
 */
export type CompetitionManagementContactPositionKey = string;

/**
 * A filter option for the Competition Management Contacts position filters
 */
export interface CompetitionManagementContactPositionFilter extends CompetitionManagementEntityPositionFilter {
    value: CompetitionManagementContactPositionFilterValue;
}

/**
 * A value for a CompetitionManagementContactPositionFilter
 */
type CompetitionManagementContactPositionFilterValue = CompetitionManagementContactPositionKey | 'all'

/**
 * Filter structure for competition contacts page
 */
export interface CompetitionManagementContactsFiltersInterface extends CompetitionManagementEntityComplianceFreePositionFilters {
    positions: CompetitionManagementContactPositionFilter[];
}

/**
 * A form option for position when adding a contact
 */
export interface CompetitionManagementContactPositionFormOption extends FormOption {
    value: CompetitionManagementContactPositionFormOptionValue;
}

/**
 * A value for a CompetitionManagementContactPositionFormOption
 */
export type CompetitionManagementContactPositionFormOptionValue = string;

export type CompetitionManagementContactsRequiredPositionsConfiguration = {
    contact: CompetitionManagementContactPositionKey[];
    official: CompetitionManagementContactPositionKey[];
};