import {ActionTree, GetterTree, MutationTree} from 'vuex';
import {CheckInEntityStateInterface} from '../../_contracts/CheckInEntityContracts';
import {FetchActiveEntityTeamServicePersonnelInformationResponse} from '../_contracts/EntityCheckInServiceContracts';
import {CheckInSubEntityTeamServicePersonnel} from '../_models/CheckInSubEntityTeamServicePersonnel';
import CheckInTeamServicePersonnelService from '../_services/EntityCheckInTeamServicePersonnelService';

export class State {
    /**
     * The IDs of the team service personnel assigned to the current competition
     */
    active_competition_team_service_personnel_ids: number[] = [];
    /**
     * All the team service personnel applicable to the active entity
     */
    all_team_service_personnel: CheckInSubEntityTeamServicePersonnel[] = [];
    /**
     * The id of the entity to which the personnel data currently in state belongs
     */
    team_service_personnel_entity_id: string | null = null;
}

const actions = <ActionTree<State, any>>{
    /**
     * Fetch data required for the team service personnel flow
     */
    fetchInformation: function (context): Promise<void> {
        return new Promise((resolve, reject) => {
            const active_entity: CheckInEntityStateInterface = context.rootState.checkin.active_entity;

            if (!active_entity) {
                reject('No active check-in entity');

                return;
            }
            const active_entity_id = active_entity.id;
            // If the active list is for the active entity, do nothing
            if (context.state.team_service_personnel_entity_id === active_entity_id) {
                resolve();

                return;
            }
            CheckInTeamServicePersonnelService.fetchActiveEntityTeamServicePersonnelInformation()
                .then((response: FetchActiveEntityTeamServicePersonnelInformationResponse) => {
                    context.commit('setAllTeamServicePersonnel', response.team_service_personnel);
                    context.commit('setActiveCompetitionTeamServicePersonnelIds', response.competition_team_service_personnel_ids);
                    context.commit('setTeamServicePersonnelEntityId', active_entity_id);
                    resolve();
                })
                .catch(() => {
                    reject();
                });
        });
    },
    /**
     * Update the team service personnel assigned to the current competition
     */
    updateCompetitionTeamServicePersonnel: function (context, team_service_personnel_ids: number[]): Promise<void> {
        return new Promise((resolve, reject) => {
            CheckInTeamServicePersonnelService.updateActiveEntityCompetitionTeamServicePersonnel(team_service_personnel_ids)
                .then(() => {
                    context.commit('setActiveCompetitionTeamServicePersonnelIds', team_service_personnel_ids);
                    context.commit('checkin/setActiveEntityTeamServicePersonnelCount', team_service_personnel_ids.length, {root: true});
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
     * Amount of TSP active on the current competition
     */
    active_competition_count: function (state) {
        return state.active_competition_team_service_personnel_ids.length;
    },
    /**
     * Get the full active competition roster
     */
    active_competition_team_service_personnel: function (state, getters): CheckInSubEntityTeamServicePersonnel[] {
        return getters.all_team_service_personnel.filter((team_service_person: CheckInSubEntityTeamServicePersonnel) => {
            return getters.teamServicePersonInActiveCompetitionRoster(team_service_person);
        });
    },
    /**
     * The full list of coaches applicable to the active entity
     */
    all_team_service_personnel: function (state): CheckInSubEntityTeamServicePersonnel[] {
        return state.all_team_service_personnel;
    },
    /**
     * Determine whether a skater is part of the active competition roster
     */
    teamServicePersonInActiveCompetitionRoster: function (state): (entity: CheckInSubEntityTeamServicePersonnel) => boolean {
        return function (entity: CheckInSubEntityTeamServicePersonnel): boolean {
            return state.active_competition_team_service_personnel_ids.indexOf(entity.id) !== -1;
        };
    }
};

const mutations = <MutationTree<State>>{
    /**
     * Update the skater ids associated with the active competition roster in state
     */
    setActiveCompetitionTeamServicePersonnelIds: function (state, team_service_personnel_ids: number[]): void {
        state.active_competition_team_service_personnel_ids = team_service_personnel_ids;
    },
    /**
     * Set all the team service personnel applicable to the active entity in state
     */
    setAllTeamServicePersonnel: function (state, payload: CheckInSubEntityTeamServicePersonnel[]): void {
        state.all_team_service_personnel = payload;
    },
    /**
     * Set tThe id of the entity to which the personnel data currently in state belongs
     */
    setTeamServicePersonnelEntityId: function (state, payload: string): void {
        state.team_service_personnel_entity_id = payload;
    }
};

export const EntityCheckInTeamServicePersonnelState = {
    namespaced: true,
    state: new State(),
    actions: actions,
    getters: getters,
    mutations: mutations
};