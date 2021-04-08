import {MemberSearchResult} from '../../../../contracts/app/MemberSearchContracts';
import {FormOption, StateFormOption} from '../../../../contracts/AppContracts';
import {CompetitionManagementContact} from '../_models/CompetitionManagementContact';
import {
    ChangeCompetitionContactDisplayPayload,
    CompetitionManagementContactAddSearchParameters,
    CompetitionManagementContactLists,
    CompetitionManagementContactPositionFormOption,
    CompetitionManagementContactsIndexEntityInterface,
    CompetitionManagementContactsRequiredPositionsConfiguration,
    CompetitionManagementContactTypeKey
} from './CompetitionManagementContactsContracts';

/**
 * Service result when adding a contact
 */
export interface CompetitionManagementContactsAddResult extends CompetitionManagementContact {}

/**
 * Service payload when changing whether a contact should display
 */
export interface CompetitionManagementContactsChangeDisplayServicePayload extends ChangeCompetitionContactDisplayPayload {
    type_key: CompetitionManagementContactTypeKey;
}

/**
 * Service result when fetching contacts
 */
export interface CompetitionManagementContactsFetchResult extends CompetitionManagementContactLists {
    required_positions: CompetitionManagementContactsRequiredPositionsConfiguration;
}

/**
 * Service response when fetching add form options for contacts
 */
export interface CompetitionManagementContactsFetchAddFormOptionsResponse {
    position_form_options: {
        contact: FormOption[];
        official: FormOption[];
    };
    state_form_options: {
        contact: StateFormOption[];
        official: StateFormOption[];
    };
}

/**
 * Service payload to remove a contact
 */
export interface CompetitionManagementContactsRemoveServicePayload {
    entity: CompetitionManagementContactsIndexEntityInterface;
    type_key: CompetitionManagementContactTypeKey;
}

/**
 * Competition used by CompetitionManagementContactsService
 */
export type CompetitionManagementContactsServiceCompetition = {
    id: number;
}

/**
 * Method for submitting from the contacts service
 */
export interface CompetitionManagementContactsServiceSubmitMethod {
    (competition: CompetitionManagementContactsServiceCompetition, payload: any): Promise<any>;
}

/**
 * Method for fetching from the contacts service
 */
export interface CompetitionManagementContactsServiceFetchMethod {
    (competition: CompetitionManagementContactsServiceCompetition): Promise<any>;
}

/**
 * Payload from state to service when adding a competition management contact
 */
export interface CompetitionManagementContactAddSearchServiceParameters extends CompetitionManagementContactAddSearchParameters {
    type_key: 'contact' | 'official';
}

/**
 * Payload originating from state for running a add contact search.  Append type key
 */
export type CompetitionManagementContactAddServicePayload = {
    member: MemberSearchResult;
    position: CompetitionManagementContactPositionFormOption;
    type: CompetitionManagementContactTypeKey;
}