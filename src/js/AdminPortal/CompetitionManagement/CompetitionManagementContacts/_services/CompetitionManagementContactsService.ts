import {MemberSearchResult} from '../../../../contracts/app/MemberSearchContracts';
import {AbstractAPIService} from '../../../../services/AbstractAPIService';
import {
    CompetitionManagementContactsAddAPIPayload,
    CompetitionManagementContactsAddAPIResponse,
    CompetitionManagementContactsChangeDisplayAPIPayload,
    CompetitionManagementContactsFetchAddFormOptionsAPIResponse,
    CompetitionManagementContactsFetchAPIResponse,
    CompetitionManagementContactsRemoveAPIPayload,
    CompetitionManagementContactsSearchAPIParameters
} from '../_contracts/CompetitionManagementContactsAPIContracts';
import {CompetitionManagementContactAddSearchParameters} from '../_contracts/CompetitionManagementContactsContracts';
import {
    CompetitionManagementContactAddSearchServiceParameters,
    CompetitionManagementContactAddServicePayload,
    CompetitionManagementContactsAddResult,
    CompetitionManagementContactsChangeDisplayServicePayload,
    CompetitionManagementContactsFetchAddFormOptionsResponse,
    CompetitionManagementContactsFetchResult,
    CompetitionManagementContactsRemoveServicePayload,
    CompetitionManagementContactsServiceCompetition,
    CompetitionManagementContactsServiceFetchMethod,
    CompetitionManagementContactsServiceSubmitMethod
} from '../_contracts/CompetitionManagementContactsServiceContracts';
import {CompetitionManagementContactsAPITransformer} from '../_transformers/CompetitionManagementContactsAPITransformer';

export class CompetitionManagementContactsService extends AbstractAPIService {
    /**
     * The active competition being worked with
     */
    private _active_competition: CompetitionManagementContactsServiceCompetition | null = null;

    /**
     * Active competition accessor
     */
    get active_competition(): CompetitionManagementContactsServiceCompetition | null {
        return this._active_competition;
    }

    /**
     * Set the active competition
     */
    set active_competition(value: CompetitionManagementContactsServiceCompetition | null) {
        this._active_competition = value;
    }

    /**
     * Add a contact for a competition
     */
    static addContact(competition: CompetitionManagementContactsServiceCompetition, payload: CompetitionManagementContactAddServicePayload): Promise<CompetitionManagementContactsAddResult> {
        const api_payload: CompetitionManagementContactsAddAPIPayload = {
            id: payload.member.id,
            position: payload.position.value,
            type: payload.type
        };

        return AbstractAPIService.submitWithTransformedResponse({
            error_message: `Error adding ${payload.type}.`,
            payload: api_payload,
            url: `/api/competition-management/competitions/${competition.id}/contacts`,
            /**
             * Ensure submission was successful and it contains the proper data element
             */
            validateResponse: function (response_data: CompetitionManagementContactsAddAPIResponse) {
                return !!response_data && !!response_data.success && !!response_data.contact;
            },
            /**
             * Transform API data to App data
             */
            transformResponse: function (response_data: CompetitionManagementContactsAddAPIResponse): CompetitionManagementContactsAddResult {
                return CompetitionManagementContactsAPITransformer.transformCompetitionContact(response_data.contact);
            }
        });
    }

    /**
     * Fetch Add Contact form options for a competition
     */
    static fetchCompetitionAddFormOptions(): Promise<CompetitionManagementContactsFetchAddFormOptionsResponse> {
        return AbstractAPIService.fetchAndTransformResponse({
            url: '/api/form-options/competition-contact-add',
            /**
             * Validate that the response contains intended props
             */
            validateResponse: function (response_data: CompetitionManagementContactsFetchAddFormOptionsAPIResponse) {
                return !!response_data && !!response_data.position_form_options && !!response_data.state_form_options;
            },
            /**
             * Transform API data to App data
             */
            transformResponse: function (response_data: CompetitionManagementContactsFetchAddFormOptionsAPIResponse): CompetitionManagementContactsFetchAddFormOptionsResponse {
                return {
                    ...response_data
                };
            }
        });
    }

    /**
     * Fetch contacts for a competition
     */
    static fetchCompetitionContacts(competition: CompetitionManagementContactsServiceCompetition): Promise<CompetitionManagementContactsFetchResult> {
        return AbstractAPIService.fetchAndTransformResponse({
            url: `/api/competition-management/competitions/${competition.id}/contacts`,
            /**
             * Validate that the response contains intended props
             */
            validateResponse: function (response_data: CompetitionManagementContactsFetchAPIResponse) {
                return !!response_data && !!response_data.contacts && !!response_data.officials;
            },
            /**
             * Transform API data to App data
             */
            transformResponse: function (response_data: CompetitionManagementContactsFetchAPIResponse): CompetitionManagementContactsFetchResult {
                return CompetitionManagementContactsAPITransformer.transformFetchContacts(response_data);
            }
        });
    }

    /**
     * Remove a contact from a competition
     */
    static removeCompetitionContact(competition: CompetitionManagementContactsServiceCompetition, payload: CompetitionManagementContactsRemoveServicePayload): Promise<void> {
        const api_payload: CompetitionManagementContactsRemoveAPIPayload = {
            id: payload.entity.id,
            type_key: payload.type_key
        };

        return AbstractAPIService.submitForAPISubmissionResponse({
            error_message: 'Error removing contact.',
            method: 'delete',
            url: `/api/competition-management/competitions/${competition.id}/contacts`,
            payload: api_payload
        });
    }

    /**
     * Search for contacts to add
     */
    static search(competition: CompetitionManagementContactsServiceCompetition, payload: CompetitionManagementContactAddSearchServiceParameters): Promise<MemberSearchResult[]> {
        return AbstractAPIService.submitMemberSearch({
            payload: <CompetitionManagementContactAddSearchParameters>payload,
            /**
             * Transform payload prior to submission
             */
            transformPayload: function (data: CompetitionManagementContactAddSearchServiceParameters): CompetitionManagementContactsSearchAPIParameters {
                return data;
            },
            url: `/api/competition-management/competitions/${competition.id}/contact-search`
        });
    }

    /**
     * Update an entity's display boolean for a competition
     */
    static updateEntityCompetitionDisplay(competition: CompetitionManagementContactsServiceCompetition, payload: CompetitionManagementContactsChangeDisplayServicePayload) {
        const api_payload: CompetitionManagementContactsChangeDisplayAPIPayload = {
            id: payload.entity.id,
            is_display: payload.is_display,
            type_key: payload.type_key
        };

        return AbstractAPIService.submitForAPISubmissionResponse({
            error_message: 'Error updating contact display.',
            method: 'put',
            payload: api_payload,
            url: `/api/competition-management/competitions/${competition.id}/contact-display`
        });
    }

    /**
     * Add a contact for the active competition
     */
    public addActiveCompetitionContact(payload: CompetitionManagementContactAddServicePayload): Promise<CompetitionManagementContactsAddResult> {
        return this.runSubmit(CompetitionManagementContactsService.addContact, payload);
    }

    /**
     * Fetch Add Contact form options for active competition
     */
    public fetchActiveCompetitionAddFormData() {
        return this.runFetch(CompetitionManagementContactsService.fetchCompetitionAddFormOptions);
    }

    /**
     * Fetch contacts for the active competition
     */
    public fetchActiveCompetitionContacts(): Promise<CompetitionManagementContactsFetchResult> {
        return this.runFetch(CompetitionManagementContactsService.fetchCompetitionContacts);
    }

    /**
     * Remove a contact from the active competition
     */
    public removeActiveCompetitionContact(payload: CompetitionManagementContactsRemoveServicePayload): Promise<void> {
        return this.runSubmit(CompetitionManagementContactsService.removeCompetitionContact, payload);
    }

    /**
     * Run a fetch method using active state
     */
    public runFetch(method: CompetitionManagementContactsServiceFetchMethod): Promise<any> {

        if (!this.active_competition) {
            throw 'no active competition';
        }

        if (typeof method === 'function') {
            return method(this.active_competition);
        }
        console.error('Invalid contacts service GET method call');
        throw 'invalid method call';
    }

    /**
     * Run a submit method using active state
     */
    public runSubmit(method: CompetitionManagementContactsServiceSubmitMethod, payload: any): Promise<any> {

        if (!this.active_competition) {
            throw 'no active competition';
        }
        if (typeof method === 'function') {
            return method(this.active_competition, payload);
        }
        console.error('Invalid contacts service POST method call');
        throw 'invalid method call';
    }

    /**
     * Search for a member to add relative to the active competition
     */
    public search(payload: CompetitionManagementContactAddSearchServiceParameters): Promise<MemberSearchResult[]> {
        return this.runSubmit(CompetitionManagementContactsService.search, payload);
    }

    /**
     * Update an entity's display for the active competition
     */
    public updateEntityDisplay(payload: CompetitionManagementContactsChangeDisplayServicePayload): Promise<void> {
        return this.runSubmit(CompetitionManagementContactsService.updateEntityCompetitionDisplay, payload);
    }
}

export default new CompetitionManagementContactsService();