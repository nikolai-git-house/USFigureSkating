import {ActionTree, GetterTree, MutationTree} from 'vuex';
import {TeamRegistrationService} from '../_contracts';
import {TeamRegistrationTeamServicePersonnelApiService} from '../_services/TeamRegistrationTeamServicePersonnelApiService';
import {TeamServicePerson} from '../_models';

export class State {
    team_roster: TeamServicePerson[] = [];
    selected_roster_ids: string[] = [];
    roster_maximum: number | null = null;
}

const actions = <ActionTree<State, any>>{
    fetch: function (context): Promise<void> {
        return new Promise((resolve, reject) => {
            TeamRegistrationTeamServicePersonnelApiService.fetchTeamServicePersonnel()
                .then((response: TeamRegistrationService.FetchTeamServicePersonnelServiceResponse) => {
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
            TeamRegistrationTeamServicePersonnelApiService.updateTeamServicePersonnel(selected_roster_ids)
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
    setTeamRoster: function (state, payload: TeamServicePerson[]): void {
        state.team_roster = payload;
    },
    setSelectedRosterIds: function (state, payload: string[]): void {
        state.selected_roster_ids = payload;
    },
    setRosterMaximum: function (state, payload: number | null) {
        state.roster_maximum = payload;
    }
};

export const TeamRegistrationCompetitionTeamServicePersonnelState = {
    namespaced: true,
    state: new State(),
    actions: actions,
    getters: getters,
    mutations: mutations
};