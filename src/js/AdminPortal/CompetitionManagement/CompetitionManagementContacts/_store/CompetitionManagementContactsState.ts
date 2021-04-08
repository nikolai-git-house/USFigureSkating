import {ActionTree, GetterTree, MutationTree} from 'vuex';
import {MemberSearchResult} from '../../../../contracts/app/MemberSearchContracts';
import {StateFormOption} from '../../../../contracts/AppContracts';
import {ALL_POSITION_FILTER} from '../../_constants/CompetitionManagementConstants';
import {CompetitionManagementTransformer} from '../../_transformers/CompetitionManagementTransformer';
import {
    ChangeCompetitionContactDisplayPayload,
    CompetitionManagementContactAddComponentPayload,
    CompetitionManagementContactAddSearchParameters,
    CompetitionManagementContactLists,
    CompetitionManagementContactPositionFilter,
    CompetitionManagementContactPositionFormOption,
    CompetitionManagementContactsFiltersInterface,
    CompetitionManagementContactsIndexEntityInterface,
    CompetitionManagementContactsRequiredPositionsConfiguration,
    CompetitionManagementContactTypeKey
} from '../_contracts/CompetitionManagementContactsContracts';
import {
    CompetitionManagementContactAddSearchServiceParameters,
    CompetitionManagementContactAddServicePayload,
    CompetitionManagementContactsAddResult,
    CompetitionManagementContactsChangeDisplayServicePayload,
    CompetitionManagementContactsFetchAddFormOptionsResponse,
    CompetitionManagementContactsFetchResult,
    CompetitionManagementContactsRemoveServicePayload
} from '../_contracts/CompetitionManagementContactsServiceContracts';

import {CompetitionManagementContact} from '../_models/CompetitionManagementContact';
import CompetitionManagementContactsService from '../_services/CompetitionManagementContactsService';
import {CompetitionManagementsContactsFilterService} from '../_services/CompetitionManagementsContactsFilterService';

type ContactStatePositionFormOptions = {
    contact: CompetitionManagementContactPositionFormOption[];
    official: CompetitionManagementContactPositionFormOption[];
};

type ContactStateStateFormOptions = {
    contact: StateFormOption[];
    official: StateFormOption[];
};

export class State {
    /**
     * Active filters for entities
     */
    active_filters: CompetitionManagementContactsFiltersInterface = {
        free: '',
        compliance: 'both',
        positions: [
            {
                ...ALL_POSITION_FILTER
            }
        ]
    };

    /**
     * The active type
     */
    active_type: CompetitionManagementContactTypeKey = 'contact';
    /**
     * List of contact types
     */
    contacts: CompetitionManagementContact[] = [];
    /**
     * Whether contact entities have been fetched
     */
    entities_fetched: boolean = false;
    /**
     * List of official types
     */
    officials: CompetitionManagementContact[] = [];
    /**
     * The Add Form options for position (keyed by contact type)
     */
    position_form_options: ContactStatePositionFormOptions | null = null;
    /**
     * Lists of positions (by contact type) from which the last instance cannot be deleted
     */
    required_position_keys: CompetitionManagementContactsRequiredPositionsConfiguration = {
        contact: [],
        official: []
    };

    /**
     * The Add Form options for state (keyed by contact type)
     */
    state_form_options: ContactStateStateFormOptions | null = null;
}

const actions = <ActionTree<State, any>>{
    /**
     * Add a contact
     */
    addContact: function (context, payload: CompetitionManagementContactAddComponentPayload): Promise<void> {
        return new Promise((resolve, reject) => {
            const service_payload: CompetitionManagementContactAddServicePayload = {
                ...payload,
                type: context.state.active_type
            };
            CompetitionManagementContactsService.addActiveCompetitionContact(service_payload)
                .then((result: CompetitionManagementContactsAddResult) => {
                    context.commit('addContact', result);
                    resolve();
                })
                .catch((error: string) => {
                    reject(error);
                });
        });
    },
    /**
     * Change whether an entity is set to display
     */
    changeEntityDisplay: function (context, payload: ChangeCompetitionContactDisplayPayload): Promise<void> {
        // Immediately change the reflected value in state...
        context.commit('updateEntityDisplay', payload);

        return new Promise((resolve, reject) => {
            const service_payload: CompetitionManagementContactsChangeDisplayServicePayload = {
                ...payload,
                type_key: context.state.active_type
            };
            CompetitionManagementContactsService.updateEntityDisplay(service_payload)
                .then(() => {
                    resolve();
                })
                .catch((error: string) => {
                    // ...Set entity display status back if submission fails
                    context.commit('updateEntityDisplay', {
                        ...payload,
                        is_display: !payload.is_display
                    });
                    reject(error);
                });
        });
    },
    /**
     * Fetch active competition contacts
     */
    fetchContacts: function (context): Promise<void> {
        return new Promise((resolve, reject) => {
            if (context.state.entities_fetched) {
                resolve();

                return;
            }
            CompetitionManagementContactsService.fetchActiveCompetitionContacts()
                .then((result: CompetitionManagementContactsFetchResult) => {
                    context.commit('setContacts', result);
                    context.commit('setEntitiesFetched', true);
                    context.commit('setRequiredPositions', result.required_positions);
                    resolve();
                })
                .catch(() => {
                    reject();
                });
        });
    },
    /**
     * Fetch add contact form options
     */
    fetchFormData: function (context) {
        return new Promise((resolve, reject) => {
            /**
             * If options have already been fetched, do nothing and resolve
             */
            if (context.state.position_form_options !== null && context.state.state_form_options !== null) {
                resolve();

                return;
            }
            /**
             * Fetch and log options
             */
            CompetitionManagementContactsService.fetchActiveCompetitionAddFormData()
                .then((response: CompetitionManagementContactsFetchAddFormOptionsResponse) => {
                    context.commit('setStateOptions', response.state_form_options);
                    context.commit('setPositionFormOptions', response.position_form_options);
                    resolve();
                })
                .catch(() => {
                    reject();
                });
        });
    },
    /**
     * Retrieve and store data for contact add form
     */
    loadAddForm: function (context) {
        return new Promise((resolve, reject) => {
            // Fetch form options and store them in local state
            context.dispatch('fetchFormData')
                .then(() => {
                    // Configure member search
                    context.commit('member_search/setStateOptions',
                        // Options for search are the options in state for the active key
                        context.state.state_form_options && context.state.state_form_options[context.state.active_type],
                        {root: true});
                    resolve();
                })
                .catch(() => {
                    reject();
                });
        });
    },
    /**
     * Remove a contact entity
     */
    removeContact: function (context, payload: { entity: CompetitionManagementContactsIndexEntityInterface; }): Promise<void> {
        return new Promise((resolve, reject) => {
            const remove_payload: CompetitionManagementContactsRemoveServicePayload = {
                entity: payload.entity,
                type_key: context.state.active_type
            };
            CompetitionManagementContactsService.removeActiveCompetitionContact(remove_payload)
                .then(() => {
                    context.commit('removeContact', payload);
                    resolve();
                })
                .catch((error: string) => {
                    reject(error);
                });
        });
    },
    /**
     * Search for contacts
     */
    search: function (context, payload: CompetitionManagementContactAddSearchParameters): Promise<MemberSearchResult[]> {
        // Set current list members as already selected
        context.commit('member_search/setBlockedPreviousSelection', context.getters.active_list_member_ids, {root: true});

        return CompetitionManagementContactsService.search(<CompetitionManagementContactAddSearchServiceParameters>{
            ...payload,
            type_key: context.state.active_type
        });
    }
};

const getters = <GetterTree<State, any>>{
    /**
     * The active list based on the active type
     */
    active_list: function (state): CompetitionManagementContact[] {
        return state.active_type === 'contact' ? state.contacts : state.officials;
    },
    /**
     * The active list with entities that don't pass filters removed
     */
    active_list_filtered: function (state, getters): CompetitionManagementContact[] {
        return CompetitionManagementsContactsFilterService.filterEntities(getters.active_list, state.active_filters);
    },
    /**
     * List of member ids for the active entity list
     */
    active_list_member_ids: function (state, getters): number[] {
        return getters.active_list.map((item: CompetitionManagementContact) => {
            return item.id;
        });
    },
    /**
     * The active entity type display label
     */
    active_type_label: function (state): string {
        return state.active_type === 'contact' ? 'LOC Contact' : 'Official';
    },
    /**
     * The set of position options for the add form given the active type
     */
    add_contact_form_position_options: function (state): CompetitionManagementContactPositionFormOption[] {
        if (!state.position_form_options) {
            return [];
        }

        return state.position_form_options[state.active_type];
    },
    /**
     * Whether an entity can be removed:
     */
    entity_can_be_removed: function (state): (entity: CompetitionManagementContactsIndexEntityInterface, type_key: CompetitionManagementContactTypeKey) => boolean {
        /**
         * Determine if an entity of a certain type key can be removed by a user
         */
        return function (entity: CompetitionManagementContactsIndexEntityInterface, type_key: CompetitionManagementContactTypeKey): boolean {
            /**
             * Entity is not in a required position
             */
            if (state.required_position_keys[type_key].indexOf(entity.position.key) === -1) {
                return true;
            }
            /**
             * Entity is not last instance of a required position
             */
            const entity_type_list = type_key === 'contact' ? state.contacts : state.officials;
            for (let i = 0; i < entity_type_list.length; i++) {
                const list_entity = entity_type_list[i];
                if (list_entity.position.key === entity.position.key && list_entity.id !== entity.id) {
                    return true;
                }
            }

            return false;
        };
    },
    /**
     * List of position filters based on active entity set
     */
    position_filters: function (state, getters): CompetitionManagementContactPositionFilter[] {
        return CompetitionManagementTransformer.transformPositionEntitiesToPositionOptions(getters.active_list)
            .sort((item1, item2) => {
                return item1.label.localeCompare(item2.label);
            });
    }
};

const mutations = <MutationTree<State>>{
    /**
     * Add a contact to state.  Adds to the active list
     */
    addContact: function (state, payload: CompetitionManagementContact) {
        if (state.active_type === 'contact') {
            state.contacts.push(payload);

            return;
        }
        state.officials.push(payload);
    },
    /**
     * Remove an entity in state
     */
    removeContact: function (state, payload: { entity: CompetitionManagementContact; }) {
        const {entity} = payload;
        const entity_list = state.active_type === 'contact' ? state.contacts : state.officials;
        for (let i = 0; i < entity_list.length; i++) {
            const entityElement = entity_list[i];
            if (entityElement.id === entity.id) {
                entity_list.splice(i, 1);

                return;
            }
        }
    },
    /**
     * Reset the filters and active type to default values
     */
    restoreDefaults: function (state) {
        state.active_filters.free = '';
        state.active_filters.compliance = 'both';
        state.active_filters.positions = [
            {
                ...ALL_POSITION_FILTER
            }
        ];
        state.active_type = 'contact';
    },
    /**
     * Set all active filters in state
     */
    setActiveFilters: function (state, filters: CompetitionManagementContactsFiltersInterface) {
        state.active_filters = filters;
    },
    /**
     * Set the active type.  Reset filters
     */
    setActiveType: function (state, type: CompetitionManagementContactTypeKey) {
        state.active_type = type;
        state.active_filters.free = '';
        state.active_filters.positions = [
            {
                ...ALL_POSITION_FILTER
            }
        ];
        state.active_filters.compliance = 'both';
    },
    /**
     * Set the entity contacts lists
     */
    setContacts: function (state, contacts: CompetitionManagementContactLists) {
        state.contacts = contacts.contacts;
        state.officials = contacts.officials;
    },
    /**
     * Set whether entities have been fetched in state
     */
    setEntitiesFetched: function (state, are_fetched: boolean) {
        state.entities_fetched = are_fetched;
    },
    /**
     * Set the free filter in state
     */
    setFreeFilter: function (state, filter: string) {
        state.active_filters.free = filter;
    },
    /**
     * Set position options for the add contact form (both types)
     */
    setPositionFormOptions: function (state, options: ContactStatePositionFormOptions) {
        state.position_form_options = options;
    },
    /**
     * Set required position configuration in state
     */
    setRequiredPositions: function (state, payload: CompetitionManagementContactsRequiredPositionsConfiguration) {
        state.required_position_keys = payload;
    },
    /**
     * Set state options for the add contact form
     */
    setStateOptions: function (state, options: ContactStateStateFormOptions) {
        state.state_form_options = options;
    },
    /**
     * Change whether an entity is set to display in state
     */
    updateEntityDisplay: function (state, payload: ChangeCompetitionContactDisplayPayload) {
        const {entity, is_display} = payload;
        const entity_list: CompetitionManagementContact[] = state.active_type === 'contact' ? state.contacts : state.officials;

        for (let i = 0; i < entity_list.length; i++) {
            const entityElement = entity_list[i];
            if (entityElement.id === entity.id) {
                entityElement.is_display = is_display;

                return;
            }
        }
    }
};

export const CompetitionManagementContactsState = {
    namespaced: true,
    state: new State(),
    actions: actions,
    getters: getters,
    mutations: mutations
};