import {ActionTree, GetterTree, MutationTree} from 'vuex';
import {MemberSearchParameters, MemberSearchResult} from '../../../../contracts/app/MemberSearchContracts';
import {SkaterCoachedEventCategoryCollection} from '../../../../models/Collections/SkaterCoachedEventCollection';
import {CheckInEntityStateInterface} from '../../_contracts/CheckInEntityContracts';
import {CheckInSkaterCoachedEventCategory} from '../../_models/CheckInSkaterCoachedEventCategory';
import {
    CheckInAddCoachResultPayload,
    CheckInAddSkaterCoachActionPayload,
    CheckInRemoveCoachActionPayload,
    CheckInRemoveCoachResultPayload,
    CheckInReplaceCoachResultPayload,
    CheckInReplaceSkaterCoachActionPayload
} from '../_contracts/EntityCheckInContracts';
import {
    FetchActiveEntitySkaterCoachInformationResponse,
    FetchActiveEntitySkaterCoachSearchFormOptionsResponse
} from '../_contracts/EntityCheckInServiceContracts';
import CheckInSkaterCoachesService from '../_services/EntityCheckInSkaterCoachesService';

export class State {
    /**
     * All the coach assignments applicable to the active skater
     */
    coach_identification: SkaterCoachedEventCategoryCollection<CheckInSkaterCoachedEventCategory> = new SkaterCoachedEventCategoryCollection();
    /**
     * The entity ID owning the coaches in state
     */
    coach_identification_entity_id: string | null = null;
}

const actions = <ActionTree<State, any>>{
    /**
     * Fetch the coach identification information
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
            if (context.state.coach_identification_entity_id === active_entity_id) {
                resolve();

                return;
            }
            CheckInSkaterCoachesService.fetchActiveEntitySkaterCoachInformation()
                .then((response: FetchActiveEntitySkaterCoachInformationResponse) => {
                    context.commit('setCoachIdentification', response);
                    context.commit('setCoachIdentificationEntityId', active_entity_id);
                    resolve();
                })
                .catch(() => {
                    reject();
                });

        });
    },
    /**
     * Fetch the state options for the member search form
     */
    fetchSearchFormOptions: function (context): Promise<void> {
        return new Promise((resolve, reject) => {
            /**
             * If form options have already been fetched, resolve and return
             */
            if (context.rootState.member_search.state_options.length) {
                resolve();

                return;
            }
            /**
             * Otherwise fetch form options
             */
            CheckInSkaterCoachesService.fetchActiveEntitySkaterCoachSearchFormOptions()
                .then((response: FetchActiveEntitySkaterCoachSearchFormOptionsResponse) => {
                    context.commit('member_search/setStateOptions', response, {root: true});
                    resolve();
                })
                .catch(() => {
                    reject();
                });
        });
    },
    /**
     * Update the count of coaches in global check-in state
     */
    updateCoachCount: function (context) {
        context.commit('checkin/setActiveEntityCoachesCount', context.state.coach_identification.coach_count(), {root: true});
    },
    /**
     * Search for coaches
     */
    search: function (context, search_params: MemberSearchParameters): Promise<MemberSearchResult[]> {
        return CheckInSkaterCoachesService.skaterCoachSearch(search_params);
    },
    /**
     * Add a coach to a category
     */
    addCategoryCoach: function (context, payload: CheckInAddSkaterCoachActionPayload): Promise<void> {
        return new Promise((resolve, reject) => {
            CheckInSkaterCoachesService.addActiveEntityCategoryCoach(payload)
                .then((response: CheckInAddCoachResultPayload) => {
                    context.commit('addCoach', response);
                    context.dispatch('updateCoachCount');
                    resolve();
                })
                .catch((error_message: string) => {
                    reject(error_message);
                });
        });
    },
    /**
     * Remove a coach from a category
     */
    removeCategoryCoach: function (context, payload: CheckInRemoveCoachActionPayload): Promise<void> {
        return new Promise((resolve, reject) => {
            CheckInSkaterCoachesService.removeActiveEntityCategoryCoach(payload)
                .then(() => {
                    context.commit('removeCoach', payload);
                    context.dispatch('updateCoachCount');
                    resolve();
                })
                .catch((error_message: string) => {
                    reject(error_message);
                });
        });
    },
    /**
     * Replace a coach in a category
     */
    replaceCategoryCoach: function (context, payload: CheckInReplaceSkaterCoachActionPayload): Promise<void> {
        return new Promise((resolve, reject) => {
            CheckInSkaterCoachesService.replaceActiveEntityCategoryCoach(payload)
                .then((response: CheckInReplaceCoachResultPayload) => {
                    context.commit('replaceCoach', response);
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
     * The list of SkaterCompliantCoachedEventCategory items in state
     */
    coach_assignment: function (state): CheckInSkaterCoachedEventCategory[] {
        return state.coach_identification.all();
    }
};

const mutations = <MutationTree<State>>{
    /**
     * Add a Coach to a category in state
     */
    addCoach: function (state, payload: CheckInAddCoachResultPayload) {
        const {coach, category_id} = payload;
        state.coach_identification.add(category_id, coach);
    },
    /**
     * Remove a Coach from a category in state
     */
    removeCoach: function (state, payload: CheckInRemoveCoachResultPayload) {
        const {coach_id, category_id} = payload;
        state.coach_identification.remove(category_id, coach_id);
    },
    /**
     * Replace a Coach in a category in state
     */
    replaceCoach: function (state, payload: CheckInReplaceCoachResultPayload) {
        const {coach, category_id, previous_coach_id} = payload;
        state.coach_identification.replace(category_id, previous_coach_id, coach);
    },
    /**
     * Set coach identification data in state
     */
    setCoachIdentification: function (state, payload: SkaterCoachedEventCategoryCollection<CheckInSkaterCoachedEventCategory>) {
        state.coach_identification = payload;
    },
    /**
     * Set owner id of state coach identification data in state
     */
    setCoachIdentificationEntityId: function (state, payload: string): void {
        state.coach_identification_entity_id = payload;
    }
};

export const EntityCheckInSkaterCoachesState = {
    namespaced: true,
    state: new State(),
    actions: actions,
    getters: getters,
    mutations: mutations
};