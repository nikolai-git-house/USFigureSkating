/* eslint-disable jsdoc/require-jsdoc */
import {CompetitionManagementContactsFetchAPIResponse} from '../_contracts/CompetitionManagementContactsAPIContracts';
import {CompetitionManagementContactData} from '../_contracts/CompetitionManagementContactsDataContracts';
import {CompetitionManagementContactsFetchResult} from '../_contracts/CompetitionManagementContactsServiceContracts';
import {CompetitionManagementContact} from '../_models/CompetitionManagementContact';

export class CompetitionManagementContactsAPITransformer {

    static transformCompetitionContact(contact_data: CompetitionManagementContactData): CompetitionManagementContact {
        return new CompetitionManagementContact(contact_data);
    }

    static transformFetchContacts(response_data: CompetitionManagementContactsFetchAPIResponse): CompetitionManagementContactsFetchResult {

        return {
            contacts: response_data.contacts.map((contact_data: CompetitionManagementContactData) => {
                return this.transformCompetitionContact(contact_data);
            }),
            officials: response_data.officials.map((official_data: CompetitionManagementContactData) => {
                return this.transformCompetitionContact(official_data);
            }),
            required_positions: {
                contact: response_data.required_positions && response_data.required_positions.contacts ?
                    response_data.required_positions.contacts.slice() :
                    [],
                official: response_data.required_positions && response_data.required_positions.officials ?
                    response_data.required_positions.officials.slice() :
                    []
            }
        };
    }
}