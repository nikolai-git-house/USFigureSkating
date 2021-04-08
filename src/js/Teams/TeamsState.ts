import {ActionTree, GetterTree, MutationTree} from 'vuex';
import {TeamsApiService} from './TeamsApiService';
import {ManagedTeam, MyCompetitionsTeamsCompetition} from './_models';
import {Teams, TeamsService} from './_contracts';

export class State {
    links: Teams.TeamsLinks = {};
    managed_team_competitions: MyCompetitionsTeamsCompetition[] = [];
    managed_teams: ManagedTeam[] = [];
    selection_links: Teams.SelectTeamLinks | null = null;
}

const actions = <ActionTree<State, any>>{
    /**
     * Fetch all the teams managed by the current user
     */
    fetchManagedTeams: function (context) {
        return new Promise((resolve, reject) => {
            TeamsApiService.fetchManagedTeams()
                .then((response: TeamsService.FetchManagedTeamsServiceResponse) => {
                    context.commit('setManagedTeams', response.teams);
                    context.commit('setSelectionLinks', response.selection_links);
                    resolve();
                })
                .catch((error_message: string) => {
                    reject(error_message);
                });
        });
    },
    /**
     * Fetch data for my competitions - teams page
     */
    fetchManagedTeamCompetitions: function (context): Promise<void> {
        return new Promise((resolve, reject) => {
            TeamsApiService.fetchManagedTeamCompetitions()
                .then((response: TeamsService.FetchManagedTeamCompetitionsServiceResponse) => {
                    context.commit('setManagedTeamCompetitions', response.competitions);
                    context.commit('setLinks', response.links || {});
                    context.commit('app/setActivePageBackLink', response.back_link, {root: true});
                    resolve();
                })
                .catch((error_message: string) => {
                    reject(error_message);
                });
        });
    }
};

const getters = <GetterTree<State, any>>{};

const mutations = <MutationTree<State>>{
    /**
     * Set link set in state
     */
    setLinks: function (state, payload: Teams.TeamsLinks): void {
        state.links = payload;
    },
    /**
     * Set user managed teams in state
     */
    setManagedTeams: function (state, payload: ManagedTeam[]) {
        state.managed_teams = payload;
    },
    /**
     * Set user managed teams' competitions in state
     */
    setManagedTeamCompetitions: function (state, payload: MyCompetitionsTeamsCompetition[]) {
        state.managed_team_competitions = payload;
    },
    /**
     * Set selection links in state
     */
    setSelectionLinks: function (state, payload: Teams.SelectTeamLinks) {
        state.selection_links = payload;
    }
};

export const TeamsState = {
    namespaced: true,
    state: new State(),
    actions: actions,
    getters: getters,
    mutations: mutations
};