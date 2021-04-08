import {ActionTree, GetterTree, MutationTree} from 'vuex';
import {TeamRegistrationCompetitionRosterApiService} from '../_services/TeamRegistrationCompetitionRosterApiService';
import {TeamRosterMember} from '../_models/TeamRosterMember';
import {TeamRegistrationService} from '../_contracts';

export class State {
    team_roster: TeamRosterMember[] = [];
    selected_roster_ids: string[] = [];
    roster_rules: string[] = [];
    per_skater_fee: number | null = null;
    roster_minimum: number | null = null;
    roster_maximum: number | null = null;
}

const actions = <ActionTree<State, any>>{
    fetch: function (context): Promise<void> {
        return new Promise((resolve, reject) => {
            TeamRegistrationCompetitionRosterApiService.fetchCompetitionRoster()
                .then((response: TeamRegistrationService.FetchCompetitionRosterServiceResponse) => {
                    context.commit('setTeamRoster', response.team_roster);
                    context.commit('setSelectedRosterIds', response.selected_roster_ids);
                    context.commit('setRosterRules', response.roster_rules);
                    context.commit('setPerSkaterFee', response.per_skater_fee);
                    context.commit('setRosterMinimum', response.roster_minimum);
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
            TeamRegistrationCompetitionRosterApiService.updateActiveEntityCompetitionRoster(selected_roster_ids)
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
    setTeamRoster: function (state, payload: TeamRosterMember[]): void {
        state.team_roster = payload;
    },
    setSelectedRosterIds: function (state, payload: string[]): void {
        state.selected_roster_ids = payload;
    },
    setRosterRules: function (state, payload: string[]): void {
        state.roster_rules = payload;
    },
    setPerSkaterFee: function (state, payload: number | null) {
        state.per_skater_fee = payload;
    },
    setRosterMinimum: function (state, payload: number | null) {
        state.roster_minimum = payload;
    },
    setRosterMaximum: function (state, payload: number | null) {
        state.roster_maximum = payload;
    }
};

export const TeamRegistrationCompetitionRosterState = {
    namespaced: true,
    state: new State(),
    actions: actions,
    getters: getters,
    mutations: mutations
};