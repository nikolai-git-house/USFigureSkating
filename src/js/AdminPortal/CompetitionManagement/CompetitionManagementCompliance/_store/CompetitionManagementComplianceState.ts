import {ActionTree, GetterTree, MutationTree} from 'vuex';
import {EmailFormStateConfiguration, EmailRecipientOption} from '../../../EmailForm/_contracts/EmailFormContracts';
import {CategoryIndexedRecipients} from '../../../EmailForm/_models/CategoryIndexedRecipients';
import {EmailFormFormState} from '../../../EmailForm/_models/EmailFormFormState';
import {ALL_POSITION_FILTER, COMPLIANCE_OPTIONS} from '../../_constants/CompetitionManagementConstants';
import {
    CompetitionManagementComplianceEntityPositionFilter,
    CompetitionManagementComplianceFiltersInterface
} from '../_contracts/CompetitionManagementComplianceContracts';
import {CompetitionManagementComplianceFetchResult} from '../_contracts/CompetitionManagementComplianceServiceContracts';
import {CompetitionManagementComplianceEntity} from '../_models/CompetitionManagementComplianceEntity';
import {CompetitionManagementComplianceFilterService} from '../_services/CompetitionManagementComplianceFilterService';
import CompetitionManagementComplianceService from '../_services/CompetitionManagementComplianceService';

export class State {
    /**
     * Active filters set by the user
     */
    active_filters: CompetitionManagementComplianceFiltersInterface = {
        compliance: 'both',
        positions: [
            {
                ...ALL_POSITION_FILTER
            }
        ],
        free: ''
    };

    /**
     * Compliance entities
     */
    entities: CompetitionManagementComplianceEntity[] = [];
    /**
     * Whether compliance entities have been fetched
     */
    entities_fetched: boolean = false;
    /**
     * The available position filters for the filter form
     */
    position_filters: CompetitionManagementComplianceEntityPositionFilter[] = [];
}

const actions = <ActionTree<State, any>>{
    /**
     * Set the BCC form options for email component based on available position filters
     */
    configureEmailRecipientOptions: function (context) {
        const email_configuration: EmailFormStateConfiguration = {
            bcc: [
                {
                    ...COMPLIANCE_OPTIONS[0],
                    options: [
                        {...COMPLIANCE_OPTIONS[1]},
                        {...COMPLIANCE_OPTIONS[2]}
                    ]
                },
                {
                    ...ALL_POSITION_FILTER,
                    options: context.state.position_filters
                }
            ]
        };
        context.commit('email_form/configure', email_configuration, {root: true});
    },
    /**
     * Fetch active competition compliance entities
     */
    fetchActiveCompetitionComplianceEntities: function (context): Promise<void> {
        return new Promise((resolve, reject) => {
            if (context.state.entities_fetched) {
                resolve();

                return;
            }
            CompetitionManagementComplianceService.fetchCompetitionComplianceEntities()
                .then((response: CompetitionManagementComplianceFetchResult) => {
                    context.commit('setEntities', response.entities);
                    context.commit('setEntitiesFetched', true);
                    context.commit('setPositionFilters', response.position_filters);
                    resolve();
                })
                .catch(() => {
                    reject();
                });
        });
    },
    /**
     * Load compliance page data.  Fetch necessary API data, then configure Email form
     */
    loadCompliance: function (context): Promise<void> {
        return new Promise((resolve, reject) => {
            context.dispatch('fetchActiveCompetitionComplianceEntities')
                .then(() => {
                    context.dispatch('configureEmailRecipientOptions');
                    resolve();
                })
                .catch(() => {
                    reject();
                });
        });
    },
    /**
     * Set the default email form data.
     *
     * 1. BCC based on active filters
     * 2. Subject from Competition Name
     * 3. All Other data empty
     */
    resetEmailFormData: function (context) {
        const form_data = new EmailFormFormState();
        form_data.bcc = context.getters.default_email_bcc;
        const competition = context.rootState.competition_management.active_competition;
        form_data.subject = competition ? competition.name : '';
        context.commit('email_form/setFormData', form_data, {root: true});
    }
};

const getters = <GetterTree<State, any>>{
    /**
     * The default email BCC based on active filters
     */
    default_email_bcc: function (state) {
        const compliance_map: {
            [key: string]: EmailRecipientOption;
        } = {
            'both': {
                ...COMPLIANCE_OPTIONS[0]
            },
            'true': {
                ...COMPLIANCE_OPTIONS[1]
            },
            'false': {
                ...COMPLIANCE_OPTIONS[2]
            }
        };
        const activeFilters = state.active_filters;
        const compliance_value = compliance_map[activeFilters.compliance.toString()];
        const position_value = activeFilters.positions.slice();

        return new CategoryIndexedRecipients([[compliance_value], position_value]);
    },
    /**
     * The entities that pass any active filters
     */
    filtered_entities: function (state) {
        return CompetitionManagementComplianceFilterService.filterEntities(state.entities, state.active_filters);
    }
};

const mutations = <MutationTree<State>>{
    /**
     * Reset filters to defaults
     */
    resetFilters: function (state) {
        state.active_filters.compliance = 'both';
        state.active_filters.positions = [
            {
                ...ALL_POSITION_FILTER
            }
        ];
        state.active_filters.free = '';
    },
    /**
     * Set active filters in state
     */
    setActiveFilters: function (state, filters: CompetitionManagementComplianceFiltersInterface) {
        state.active_filters = filters;
    },
    /**
     * Set compliance entities in state
     */
    setEntities: function (state, entities: CompetitionManagementComplianceEntity[]) {
        state.entities = entities;
    },
    /**
     * Set whether compliance entities have been fetched in state
     */
    setEntitiesFetched: function (state, are_fetched: boolean) {
        state.entities_fetched = are_fetched;
    },
    /**
     * Set position filters in state
     */
    setPositionFilters: function (state, filters: CompetitionManagementComplianceEntityPositionFilter[]) {
        state.position_filters = filters;
    }
};

export const CompetitionManagementComplianceState = {
    namespaced: true,
    state: new State(),
    actions: actions,
    getters: getters,
    mutations: mutations
};