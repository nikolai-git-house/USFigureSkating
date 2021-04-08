import {ActionTree, GetterTree, MutationTree} from 'vuex';
import {CompetitionPortalTeamPerson} from '../_models';
import {TeamRegistration} from '../../../../Teams/CompetitionRegistration/Registration/_contracts';
import {StringHelpers} from '../../../../helpers/StringHelpers';
import {Vue} from 'vue/types/vue';
import {CompetitionPortalTeamPersonnelApiService} from '../_services/CompetitionPortalTeamPersonnelApiService';
import {AbstractTeamEntity} from '../../../../Teams/CompetitionRegistration/Registration/_models';
import {CompetitionTeamPersonnel, CompetitionTeamPersonnelService} from '../_contracts';

const CONFIRMATION_METHOD_MAP = {
    coaches: 'updateCoaches',
    team_service_personnel: 'updateTeamServicePersonnel',
    prop_crew: 'updatePropCrew'
};

export class State {
    /**
     * The type of the active edit entity group
     */
    active_edit_type: CompetitionTeamPersonnel.CompetitionPersonnelTypeKey | null = null;
    /**
     * The active selected competition rosters
     */
    active_rosters: CompetitionTeamPersonnel.CompetitionTeamPersonnel = {
        coaches: [],
        team_service_personnel: [],
        prop_crew: []
    };

    /**
     * The loading status of edit information
     */
    edit_load_status: CompetitionTeamPersonnel.EditLoadStatus = {
        error: false,
        is_loading: false
    };

    /**
     * The full team rosters
     */
    full_rosters: CompetitionTeamPersonnel.FullTeamPersonnel = {};
    /**
     * Whether the active team selects prop crew
     */
    has_prop_crew: boolean = true;
    /**
     * Configurations for the rules surrounding editing the team rosters
     */
    roster_configs: CompetitionTeamPersonnel.CompetitionTeamPersonnelRosterConfigs = {};
}

const actions = <ActionTree<State, any>>{
    /**
     * Fetch base information about Team Personnel
     */
    fetch: function (context) {
        return new Promise((resolve, reject) => {
            CompetitionPortalTeamPersonnelApiService.fetchTeamPersonnel()
                .then((response: CompetitionTeamPersonnelService.FetchTeamPersonnelServiceResponse) => {
                    context.commit('setActiveRosters', response.competition_team_personnel);
                    context.commit('setHasPropCrew', response.has_prop_crew);
                    context.dispatch('competition_portal/setCompetitionPortalCore', response, {root: true});

                    resolve();
                })
                .catch(() => {
                    reject();
                });
        });
    },
    /**
     * Open the edit screen for a particular type
     */
    openEdit: function (context, type: CompetitionTeamPersonnel.CompetitionPersonnelTypeKey): void {
        const status_payload: CompetitionTeamPersonnel.EditLoadStatus = {
            error: false,
            is_loading: true
        };
        context.commit('setEditLoadStatus', status_payload);
        context.commit('setActiveEditType', type);

        // If the full roster of the type has already been fetched, resolve immediately
        if (context.getters.full_roster_fetched(type)) {
            const status_payload: CompetitionTeamPersonnel.EditLoadStatus = {
                error: false,
                is_loading: false
            };
            context.commit('setEditLoadStatus', status_payload);

            return;
        }

        CompetitionPortalTeamPersonnelApiService.fetchAvailablePersonnel(type)
            .then((response: CompetitionTeamPersonnelService.FetchTeamPersonnelTeamRosterServiceResponse) => {
                const full_roster_payload: CompetitionTeamPersonnel.CommitFullRosterPayload = {
                    roster: response.roster,
                    type
                };
                const roster_config_payload: CompetitionTeamPersonnel.CommitRosterConfigPayload = {
                    config: response.roster_config,
                    type
                };
                const edit_load_status_payload: CompetitionTeamPersonnel.EditLoadStatus = {
                    error: false,
                    is_loading: false
                };
                context.commit('setFullRoster', full_roster_payload);
                context.commit('setRosterConfig', roster_config_payload);
                context.commit('setEditLoadStatus', edit_load_status_payload);
            })
            .catch(() => {
                const edit_load_status_payload: CompetitionTeamPersonnel.EditLoadStatus = {
                    is_loading: false,
                    error: true
                };
                context.commit('setEditLoadStatus', edit_load_status_payload);
            });
    },
    /**
     * Update the Coaches competition roster
     */
    updateCoaches: function (context, ids: string[]): Promise<void> {
        return new Promise((resolve, reject) => {
            CompetitionPortalTeamPersonnelApiService.updateCoaches(ids)
                .then((response: CompetitionTeamPersonnelService.UpdateCompetitionTeamPersonnelTypeServiceResponse) => {
                    const active_roster_payload: CompetitionTeamPersonnel.CommitActiveRosterPayload = {
                        type: 'coaches',
                        roster: response.competition_roster
                    };
                    context.commit('setActiveRoster', active_roster_payload);
                    resolve();
                })
                .catch((error: string) => {
                    reject(error);
                });
        });
    },
    /**
     * Update the  PropCrew competition roster
     */
    updatePropCrew: function (context, ids: string[]): Promise<void> {
        return new Promise((resolve, reject) => {
            CompetitionPortalTeamPersonnelApiService.updatePropCrew(ids)
                .then((response: CompetitionTeamPersonnelService.UpdateCompetitionTeamPersonnelTypeServiceResponse) => {
                    const active_roster_payload: CompetitionTeamPersonnel.CommitActiveRosterPayload = {
                        type: 'prop_crew',
                        roster: response.competition_roster
                    };
                    context.commit('setActiveRoster', active_roster_payload);
                    resolve();
                })
                .catch((error: string) => {
                    reject(error);
                });
        });
    },
    /**
     * Update the  TeamServicePersonnel competition roster
     */
    updateTeamServicePersonnel: function (context, ids: string[]): Promise<void> {
        return new Promise((resolve, reject) => {
            CompetitionPortalTeamPersonnelApiService.updateTeamServicePersonnel(ids)
                .then((response: CompetitionTeamPersonnelService.UpdateCompetitionTeamPersonnelTypeServiceResponse) => {
                    const active_roster_payload: CompetitionTeamPersonnel.CommitActiveRosterPayload = {
                        type: 'team_service_personnel',
                        roster: response.competition_roster
                    };
                    context.commit('setActiveRoster', active_roster_payload);
                    resolve();
                })
                .catch((error: string) => {
                    reject(error);
                });
        });
    }
};

const getters = <GetterTree<State, any>>{
    /**
     * Get the method to pass to the edit component to confirm the selected roster from a CompetitionPersonnelTypeKey.
     *
     * Accessor to pass a state action to be called within a Vue component context
     */
    confirmation_method: function (): (type_key: CompetitionTeamPersonnel.CompetitionPersonnelTypeKey) => TeamRegistration.RosterConfirmMethod {
        return function (type_key: CompetitionTeamPersonnel.CompetitionPersonnelTypeKey): TeamRegistration.RosterConfirmMethod {

            return function (this: Vue, ids: string[]) {
                /**
                 * Factory function to call the state action within whatever Vue component context the factory is called
                 *
                 * <VueContext>.confirm_method(ids) call result in this.$store.dispatch(...) where "this" is the Vue context
                 */
                return function (this: Vue, ids: string[]) {
                    return this.$store.dispatch(`competition_portal/team_personnel/${CONFIRMATION_METHOD_MAP[type_key]}`, ids);
                    // eslint-disable-next-line no-invalid-this
                }.call(this, ids);

            } as TeamRegistration.RosterConfirmMethod;
        };
    },
    /**
     * The current edit component binding
     */
    edit_binding: function (state, getters, rootState): TeamRegistration.TeamRegistrationRosterEditConfig | null {
        const active_edit_type: CompetitionTeamPersonnel.CompetitionPersonnelTypeKey | null = state.active_edit_type;

        if (!active_edit_type) {
            return null;
        }

        const entity_descriptor: string = StringHelpers.titleCase(active_edit_type.replace(/_/g, ' '));

        const subtitle = (rootState.competition_portal.active_entity_summary && rootState.competition_portal.active_entity_summary.name) || null;
        const {min, max} = getters.roster_config(active_edit_type);

        return {
            confirm_method: getters.confirmation_method(active_edit_type),
            confirm_label: `Confirm ${entity_descriptor}`,
            subtitle,
            title: `Edit ${entity_descriptor}`,
            available_roster: getters.full_roster(active_edit_type),
            maximum_size: max,
            member_type_descriptor: {
                singular: entity_descriptor.replace('Coaches', 'Coach'),
                plural: entity_descriptor
            },
            minimum_size: min,
            per_member_fee: null,
            selected_roster_ids: getters.roster_ids(active_edit_type),
            show_secondary_messaging: true,
            summary_label: entity_descriptor,
            loading_state: {
                load_error: state.edit_load_status.error,
                loaded: !state.edit_load_status.is_loading,
                loading_timeout: true,
                error_message: `Error loading team ${entity_descriptor.toLowerCase()} list.`
            }
        };
    },
    /**
     * The full team roster of a given type
     */
    full_roster: function (state): (type: CompetitionTeamPersonnel.CompetitionPersonnelTypeKey) => AbstractTeamEntity[] {
        return function (type: CompetitionTeamPersonnel.CompetitionPersonnelTypeKey): AbstractTeamEntity[] {
            return state.full_rosters[type] || [];
        };
    },
    /**
     * Whether a full team roster of a certain type has been fetched
     */
    full_roster_fetched: function (state): (type: CompetitionTeamPersonnel.CompetitionPersonnelTypeKey) => boolean {
        return function (type: CompetitionTeamPersonnel.CompetitionPersonnelTypeKey): boolean {
            return Object.prototype.hasOwnProperty.call(state.full_rosters, type);
        };
    },
    /**
     * The roster config(rules) of a given type
     */
    roster_config: function (state): (type: CompetitionTeamPersonnel.CompetitionPersonnelTypeKey) => CompetitionTeamPersonnel.CompetitionPersonnelRosterConfigDefined {
        return function (type: CompetitionTeamPersonnel.CompetitionPersonnelTypeKey): CompetitionTeamPersonnel.CompetitionPersonnelRosterConfigDefined {
            return {
                min: null,
                max: null,
                ...state.roster_configs[type]
            };
        };
    },
    /**
     * The selected roster IDs of a given type
     */
    roster_ids: function (state): (type: CompetitionTeamPersonnel.CompetitionPersonnelTypeKey) => string[] {
        return function (type: CompetitionTeamPersonnel.CompetitionPersonnelTypeKey): string[] {
            return state.active_rosters[type].map((item: CompetitionPortalTeamPerson): string => {
                return item.id;
            });
        };
    }
};

const mutations = <MutationTree<State>>{
    /**
     * Set the type of the roster currently being edited
     */
    setActiveEditType: function (state, payload: CompetitionTeamPersonnel.CompetitionPersonnelTypeKey | null): void {
        state.active_edit_type = payload;
    },
    /**
     * Set an active roster in state by type
     */
    setActiveRoster: function (state, payload: CompetitionTeamPersonnel.CommitActiveRosterPayload): void {
        state.active_rosters[payload.type] = payload.roster;
    },
    /**
     * Set the full active rosters in state
     */
    setActiveRosters: function (state, payload: CompetitionTeamPersonnel.CompetitionTeamPersonnel): void {
        state.active_rosters = payload;
    },
    /**
     * Set the loading status of edit information
     */
    setEditLoadStatus: function (state, payload: CompetitionTeamPersonnel.EditLoadStatus): void {
        state.edit_load_status = payload;
    },
    /**
     * Set a full roster of a certain type in state
     */
    setFullRoster: function (state, payload: CompetitionTeamPersonnel.CommitFullRosterPayload): void {
        const {type, roster} = payload;
        const complete_rosters = {
            ...state.full_rosters
        };
        complete_rosters[type] = roster;
        state.full_rosters = complete_rosters;
    },
    /**
     * Set whether the team personnel features prop crew
     */
    setHasPropCrew: function (state, payload: boolean): void {
        state.has_prop_crew = payload;
    },
    /**
     * Set the config of a given roster type in state
     */
    setRosterConfig: function (state, payload: CompetitionTeamPersonnel.CommitRosterConfigPayload): void {
        const {config, type} = payload;
        state.roster_configs[type] = config;
    }
};

export const CompetitionPortalTeamPersonnelState = {
    namespaced: true,
    state: new State(),
    actions: actions,
    getters: getters,
    mutations: mutations
};