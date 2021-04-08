import {ActionTree, GetterTree, MutationTree} from 'vuex';
import {TEAM_REGISTRATION_TEAM_ID_COOKIE_NAME} from '../../config/AppConfig';
import {Teams} from '../_contracts';
import {TeamsCompetitionRegistrationApiService} from './TeamsCompetitionRegistrationApiService';
import {TeamsCompetitionRegistration, TeamsCompetitionRegistrationService} from './_contracts';
import {CompetitionListCompetition} from './_models';

export class State {
    available_competitions: CompetitionListCompetition[] = [];
    active_team: TeamsCompetitionRegistration.TeamSummary | null = null;
}

const actions = <ActionTree<State, any>>{
    /**
     * Initialize the team registration competition list
     */
    fetchCompetitionList: function ({commit}) {
        return new Promise((resolve, reject) => {
            TeamsCompetitionRegistrationApiService.fetchCompetitionList()
                .then((response: TeamsCompetitionRegistrationService.FetchCompetitionListServiceResponse) => {
                    commit('setAvailableCompetitions', response.competitions);
                    commit('setActiveTeam', response.team);
                    resolve(response);
                })
                .catch(() => {
                    reject();
                });
        });
    },
    /**
     * Fetch team select page information
     */
    fetchTeamSelect: function (context): Promise<void> {
        return context.dispatch('teams/fetchManagedTeams', null, {root: true});
    },
    /**
     * Select a team for registration
     */
    selectTeam: function (context, team: Teams.SelectableTeam) {
        return new Promise((resolve, reject) => {
            try {
                document.cookie = `${TEAM_REGISTRATION_TEAM_ID_COOKIE_NAME}=${team.id}`;
                const redirect_url = context.rootState.teams.selection_links.competition_registration;
                if (!redirect_url) {
                    throw 'Unable to redirect';
                }
                location.assign(redirect_url);
                resolve();
            } catch {
                reject(`There was an error transferring you to registration for ${team.name}. Please try again.`);
            }
        });
    }
};

const getters = <GetterTree<State, any>>{
    /**
     * Teams for team selection page
     */
    selection_teams: function (state, getters, rootState): Teams.SelectTeamPageTeam[] {
        return rootState.teams.managed_teams;
    }
};

const mutations = <MutationTree<State>>{
    /**
     * Set the active team summary in state
     */
    setActiveTeam: function (state, payload: TeamsCompetitionRegistration.TeamSummary) {
        state.active_team = payload;
    },
    /**
     * Set the available competitions for registration in state
     */
    setAvailableCompetitions: function (state, payload: CompetitionListCompetition[]) {
        state.available_competitions = payload;
    }
};

export const TeamsCompetitionRegistrationState = {
    namespaced: true,
    state: new State(),
    actions: actions,
    getters: getters,
    mutations: mutations
};