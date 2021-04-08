import {ActionTree, GetterTree, MutationTree} from 'vuex';
import {TeamCoach} from '../_models/TeamCoach';
import {TeamRegistrationService} from '../_contracts';
import {TeamRegistrationCoachesApiService} from '../_services/TeamRegistrationCoachesApiService';

export class State {
    team_roster: TeamCoach[] = [];
    selected_roster_ids: string[] = [];
    roster_maximum: number | null = null;
}

const actions = <ActionTree<State, any>>{
    fetch: function (context): Promise<void> {
        return new Promise((resolve, reject) => {
            TeamRegistrationCoachesApiService.fetchCoaches()
                .then((response: TeamRegistrationService.FetchCoachesServiceResponse) => {
                    context.commit('setTeamRoster', response.team_roster);
                    context.commit('setSelectedRosterIds', response.selected_roster_ids);
                    context.commit('setRosterMaximum', response.roster_maximum);
                    resolve();
                })
                .catch(() => {
                    reject();
                });
        });
    },
    /**
     * Update the competition roster for an entity
     */
    update: function (context, selected_roster_ids: number[]): Promise<void> {
        return new Promise((resolve, reject) => {
            TeamRegistrationCoachesApiService.updateCoaches(selected_roster_ids)
                .then(() => {
                    context.commit('setSelectedRosterIds', selected_roster_ids);
                    resolve();
                })
                .catch((message: string) => {
                    reject(message);
                });
        });
    }
};

const getters = <GetterTree<State, any>>{};

const mutations = <MutationTree<State>>{
    setTeamRoster: function (state, payload: TeamCoach[]): void {
        state.team_roster = payload;
    },
    setSelectedRosterIds: function (state, payload: string[]): void {
        state.selected_roster_ids = payload;
    },
    setRosterMaximum: function (state, payload: number | null) {
        state.roster_maximum = payload;
    }
};

export const TeamRegistrationCompetitionCoachesState = {
    namespaced: true,
    state: new State(),
    actions: actions,
    getters: getters,
    mutations: mutations
};