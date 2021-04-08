import {ActionTree, GetterTree, MutationTree} from 'vuex';
import {CheckInEntityStateInterface} from '../../_contracts/CheckInEntityContracts';
import {FetchActiveEntityCoachInformationResponse} from '../../_contracts/CheckInServiceContracts';
import {CheckInSubEntityTeamCoach} from '../_models/CheckInSubEntityTeamCoach';
import CheckInTeamCoachesService from '../_services/EntityCheckInTeamCoachesService';

export class State {
    /**
     * The IDs of the coaches assigned to the current competition
     */
    active_competition_coach_ids: number[] = [];
    /**
     * All the coaches applicable to the active entity
     */
    all_coaches: CheckInSubEntityTeamCoach[] = [];
    /**
     * The id of the entity to which the coaches data currently in state belongs
     */
    coaches_entity_id: string | null = null;
}

const actions = <ActionTree<State, any>>{
    /**
     * Fetch coach information for the active check-in entity
     */
    fetchCoachInformation: function (context): Promise<void> {
        return new Promise((resolve, reject) => {
            const active_entity: CheckInEntityStateInterface = context.rootState.checkin.active_entity;

            if (!active_entity) {
                reject('No active check-in entity');

                return;
            }
            const active_entity_id = active_entity.id;
            // If the active list is for the active entity, do nothing
            if (context.state.coaches_entity_id === active_entity_id) {
                resolve();

                return;
            }
            CheckInTeamCoachesService.fetchActiveEntityCoachInformation()
                .then((response: FetchActiveEntityCoachInformationResponse) => {
                    context.commit('setAllCoaches', response.team_coaches);
                    context.commit('setActiveCompetitionCoachIds', response.competition_coach_ids);
                    context.commit('setCoachesEntityID', active_entity_id);
                    resolve();
                })
                .catch(() => {
                    reject();
                });

        });
    },

    /**
     * Update the coaches attending the competition
     */
    updateCompetitionCoaches: function (context, coach_ids: number[]): Promise<void> {
        return new Promise((resolve, reject) => {
            CheckInTeamCoachesService.updateActiveEntityCompetitionTeamCoaches(coach_ids)
                .then(() => {
                    context.commit('setActiveCompetitionCoachIds', coach_ids);
                    context.commit('checkin/setActiveEntityCoachesCount', coach_ids.length, {root: true});
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
     * The amount of coaches in the active competition coach roster
     */
    active_competition_coach_count: function (state): number {
        return state.active_competition_coach_ids.length;
    },
    /**
     * Get the full active competition roster
     */
    active_competition_coaches: function (state, getters): CheckInSubEntityTeamCoach[] {
        return getters.all_coaches.filter((coach: CheckInSubEntityTeamCoach) => {
            return getters.coachInActiveCompetitionRoster(coach);
        });
    },
    /**
     * The full list of coaches applicable to the active entity
     */
    all_coaches: function (state): CheckInSubEntityTeamCoach[] {
        return state.all_coaches;
    },
    /**
     * Determine whether a skater is part of the active competition roster
     */
    coachInActiveCompetitionRoster: function (state): (member: CheckInSubEntityTeamCoach) => boolean {
        return function (coach: CheckInSubEntityTeamCoach): boolean {
            return state.active_competition_coach_ids.indexOf(coach.id) !== -1;
        };
    }
};

const mutations = <MutationTree<State>>{
    /**
     * Update the skater ids associated with the active competition roster in state
     */
    setActiveCompetitionCoachIds: function (state, coach_ids: number[]): void {
        state.active_competition_coach_ids = coach_ids;
    },
    /**
     * Set the coaches list in state
     */
    setAllCoaches: function (state, coaches: CheckInSubEntityTeamCoach[]): void {
        state.all_coaches = coaches;
    },
    /**
     * Set the ID of the entity owning the state coaches in state
     */
    setCoachesEntityID: function (state, id: string): void {
        state.coaches_entity_id = id;
    }
};

export const EntityCheckInTeamCoachesState = {
    namespaced: true,
    state: new State(),
    actions: actions,
    getters: getters,
    mutations: mutations
};