import {ActionTree, GetterTree, MutationTree} from 'vuex';
import {TeamRegistrationApiService} from './TeamRegistrationApiService';
import {TeamRegistration, TeamRegistrationService} from './_contracts';
import {CompetitionHeadingSource} from '../../../contracts/AppContracts';
import {CompetitionSummary, RegistrationOverview, TeamProfile, TeamSummary} from './_models';
import {TEAM_REGISTRATION_STEPS} from './TeamRegistrationConfig';
import {TeamRegistrationEventSelectionState} from './_store/TeamRegistrationEventSelectionState';

export class State {
    /**
     * Summary workflow-wide information about the active competition
     */
    active_competition_summary: CompetitionSummary | null = null;
    /**
     * Profile information for active team
     */
    active_team_profile: TeamProfile | null = null;
    /**
     * Summary workflow-wide information about the active team
     */
    active_team_summary: TeamSummary | null = null;
    /**
     * The index for the active step in the process
     */
    active_step_index: number = 0;
    /**
     * The configuration for steps for the workflow
     */
    active_step_config: TeamRegistration.StepsConfiguration = {...TEAM_REGISTRATION_STEPS};
    /**
     * The current registration overview information
     */
    registration_overview: RegistrationOverview | null = null;
}

const actions = <ActionTree<State, any>>{
    /**
     * Advance a step in the process
     */
    advance: function (context) {
        const current_step_index = context.state.active_step_index;
        const total_steps = context.getters.step_keys.length;
        if (current_step_index == total_steps - 1) {
            const active_competition_summary = context.state.active_competition_summary;
            if (!active_competition_summary) {
                throw 'unable to parse cart link';
            }
            location.assign(active_competition_summary.links.cart);

            return;
        }
        context.commit('setActiveStepIndex', current_step_index + 1);
    },
    /**
     * Initialize the workflow following shell fetch
     */
    initialize: function ({state, commit, getters}): void {
        const default_step_config = {...TEAM_REGISTRATION_STEPS};
        const active_team_summary = state.active_team_summary;

        if (!active_team_summary) {
            throw 'team summary not configured';
        }

        if (!active_team_summary.has_prop_crew) {
            delete default_step_config.prop_crew;
        }
        commit('setStepConfig', default_step_config);

        const step_keys = getters.step_keys;
        const initial_index = step_keys.indexOf(active_team_summary.initial_page);
        commit('setActiveStepIndex', initial_index);
    },
    /**
     * Fetch information for the event selection page
     */
    fetchEventSelection(context): Promise<void> {
        if (!this.state.team_registration.event_selection) {
            this.registerModule(['team_registration', 'event_selection'], TeamRegistrationEventSelectionState);
        }

        return new Promise((resolve, reject) => {
            context.dispatch('team_registration/event_selection/fetch', null, {root: true})
                .then(() => {
                    resolve();
                })
                .catch(() => {
                    reject();
                });

        });
    },
    /**
     * Fetch information for the team verification page
     */
    fetchTeamVerification({commit}): Promise<void> {
        return new Promise((resolve, reject) => {
            TeamRegistrationApiService.fetchTeamVerification()
                .then((response: TeamRegistrationService.FetchTeamVerificationServiceResponse) => {
                    commit('setActiveTeamProfile', response.team_profile);
                    resolve();
                })
                .catch(() => {
                    reject();
                });
        });
    },
    /**
     * Fetch information for the registration overview page
     */
    fetchRegistrationOverview: function ({commit}): Promise<void> {
        return new Promise((resolve, reject) => {
            TeamRegistrationApiService.fetchRegistrationOverview()
                .then((response) => {
                    commit('setRegistrationOverview', response.overview);
                    resolve();
                })
                .catch(() => {
                    reject();
                });
        });
    },
    /**
     * Load registration app shell
     */
    loadShell: function (context): Promise<void> {
        return new Promise((resolve, reject) => {
            TeamRegistrationApiService.fetchTeamRegistrationShell()
                .then((response: TeamRegistrationService.FetchShellServiceResponse) => {
                    context.commit('setActiveTeamSummary', response.team);
                    context.dispatch('initialize');
                    context.commit('setActiveCompetitionSummary', response.competition);
                    resolve();
                })
                .catch(() => {
                    reject();
                });
        });
    },
    /**
     * Retreat a step in the process
     */
    retreat: function (context) {
        context.commit('setActiveStepIndex', context.state.active_step_index - 1);
    },
    /**
     * Update the team's name
     */
    updateTeamName: function (context, payload: TeamRegistrationService.UpdateTeamNameServicePayload): Promise<void> {
        return new Promise((resolve, reject) => {
            TeamRegistrationApiService.updateTeamName(payload)
                .then(() => {
                    context.commit('setTeamName', payload.team_name);
                    resolve();
                })
                .catch((error_message: string) => {
                    reject(error_message);
                });
        });
    }
};

const getters = <GetterTree<State, any>>{
    /**
     * The key for the active step's component
     */
    active_step_component: function (state, getters): TeamRegistration.StepComponent {
        return getters.step_components[state.active_step_index];
    },
    /**
     * Source data for the registration heading
     */
    registration_heading_source: function (state): TeamRegistration.RegistrationHeaderSource | null {
        let competition: CompetitionHeadingSource | null = null;
        if (state.active_competition_summary) {
            competition = {
                id: state.active_competition_summary.id,
                name: state.active_competition_summary.name,
                icon: state.active_competition_summary.icon,
                start_date_pretty: state.active_competition_summary.start_date_pretty,
                end_date_pretty: state.active_competition_summary.end_date_pretty,
                directions: [],
                announcement_url: null,
                website_url: null
            };
        }
        let team: string | null = null;
        if (state.active_team_summary) {
            team = state.active_team_summary.summary_name;
        }

        if (competition || team) {
            return {
                competition,
                team
            };
        }

        return null;
    },
    /**
     * The step components for active workflow
     */
    step_components: function (state): TeamRegistration.StepComponent[] {
        const result: TeamRegistration.StepComponent[] = [];
        const source = state.active_step_config;
        for (const i in source) {
            if (Object.prototype.hasOwnProperty.call(source, i)) {

                result.push(source[i]);
            }
        }

        return result;
    },
    /**
     * The step keys for active workflow
     */
    step_keys: function (state): TeamRegistration.StepKey[] {
        const result: TeamRegistration.StepKey[] = [];
        const source = state.active_step_config;
        for (const i in source) {
            if (Object.prototype.hasOwnProperty.call(source, i)) {
                result.push(i as TeamRegistration.StepKey);
            }
        }

        return result;
    }
};

const mutations = <MutationTree<State>>{
    /**
     * Set the active competition summary in state
     */
    setActiveCompetitionSummary: function (state, payload: CompetitionSummary): void {
        state.active_competition_summary = payload;
    },
    /**
     * Set the index of the active step in state
     */
    setActiveStepIndex: function (state, payload: number): void {
        state.active_step_index = payload;
    },
    /**
     * Set the active team profile in state
     */
    setActiveTeamProfile: function (state, payload: TeamProfile): void {
        state.active_team_profile = payload;
    },
    /**
     * Set the active team summary in state
     */
    setActiveTeamSummary: function (state, payload: TeamSummary): void {
        state.active_team_summary = payload;
    },
    /**
     * Set the registration overview in state
     */
    setRegistrationOverview: function (state, payload: RegistrationOverview): void {
        state.registration_overview = payload;
    },
    /**
     * Set the active step config in state
     */
    setStepConfig: function (state, payload: TeamRegistration.StepsConfiguration): void {
        state.active_step_config = payload;
    },
    /**
     * Set the active team's name in state
     */
    setTeamName: function (state, payload: string): void {
        if (state.active_team_profile) {
            state.active_team_profile.name = payload;
        }
        if (state.active_team_summary) {
            state.active_team_summary.name = payload;
        }
    }
};

export const TeamRegistrationState = {
    namespaced: true,
    state: new State(),
    actions: actions,
    getters: getters,
    mutations: mutations
};