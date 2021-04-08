/* eslint-disable */
import {ActionTree, GetterTree, MutationTree} from "vuex"
import {
    RemoveSkateTestsAction,
    SaveSkateTestActionPayload,
    SaveSkateTestsAction,
    SkateTestFormData,
    SkateTestHistoryDiscipline,
    SkateTestRemoveAppPayload,
    UserSkateTestHistory
} from "../../contracts/app/SkateTestContracts";
import {FormOption} from "../../contracts/AppContracts";
import {UserService} from "../../services/UserService";
/* eslint-enable */

export class State {
    /**
     * The active discipline being modified with a new skate test
     */
    active_discipline: SkateTestHistoryDiscipline | null = null;
    /**
     * The active user's skate test history
     */
    user_skate_test_history: UserSkateTestHistory | null = null;
    /**
     * Action to use when saving a skate test instead of the default action
     */
    save_action: SaveSkateTestsAction | null = null;
    /**
     * Action to use when removing a skate test instead of the default action
     */
    remove_action: RemoveSkateTestsAction | null = null;
}

const actions = <ActionTree<State, any>>{
    /* eslint-disable */
    /**
     * Fetch a user's skate test history.  If partner_id is provided, fetch partner skate test
     */
    fetchSkateTestHistory: function (context, partner_id?: number): Promise<void> {
        return new Promise((resolve, reject) => {
            UserService.getSkateTestHistory(partner_id).then((user_skate_test_history: UserSkateTestHistory) => {
                context.commit('setActiveSkateTestHistory', user_skate_test_history);
                resolve();
            }).catch(() => {
                reject();
            })
        });
    },
    /* eslint-enable */
    /**
     * Save a skate test
     */
    saveTest: function (context, test_data: SkateTestFormData): Promise<void> {
        const active_discipline = context.getters.active_discipline;

        return new Promise((resolve, reject) => {
            const action: SaveSkateTestsAction = context.state.save_action || function (payload: SaveSkateTestActionPayload) {
                return UserService.addSkateTest(payload.test_data, payload.active_discipline.key);
            };

            const payload: SaveSkateTestActionPayload = {
                test_data,
                active_discipline
            };

            action(payload)
                .then((updated_test_history: UserSkateTestHistory) => {
                    context.commit('setActiveSkateTestHistory', updated_test_history);
                    resolve();
                })
                .catch((error_message) => {
                    reject(error_message);
                });
        });
    },
    /**
     * Remove a skate test
     */
    removeTest: function (context, remove_data: SkateTestRemoveAppPayload): Promise<void> {
        return new Promise((resolve, reject) => {
            const action = context.state.remove_action || UserService.removeSkateTest;

            action(remove_data)
                .then((updated_test_history: UserSkateTestHistory) => {
                    context.commit('setActiveSkateTestHistory', updated_test_history);
                    resolve();
                })
                .catch((error_message: string) => {
                    reject(error_message);
                });
        });
    }
};
/* eslint-disable */
const getters = <GetterTree<State, any>>{
    /**
     * Get the active discipline if it exists
     */
    active_discipline: function (state): SkateTestHistoryDiscipline | null {
        return state.active_discipline;
    },
    /**
     * Get the active skate test history, if it's been fetched
     */
    user_skate_test_history: function (state): UserSkateTestHistory | null {
        return state.user_skate_test_history;
    },
    /**
     * Get the list of skate test disciplines containing self-reported skate tests
     */
    user_self_reported_test_disciplines: function (state): SkateTestHistoryDiscipline[] {
        let userSkateTestHistory = state.user_skate_test_history;
        if (!userSkateTestHistory) {
            return [];
        }
        return userSkateTestHistory.disciplines.filter((discipline: SkateTestHistoryDiscipline) => {
            return discipline.self_reported_tests.length;
        });
    },
    /**
     * Get the list of available test options for the active discipline
     */
    active_discipline_test_options: function (state): FormOption[] {
        if (!state.active_discipline) {
            return [];
        }
        return state.active_discipline.available_tests;
    }
};
/* eslint-enable */

const mutations = <MutationTree<State>>{
    /* eslint-disable */
    setActiveDiscipline: function (state, discipline: SkateTestHistoryDiscipline) {
        state.active_discipline = discipline;
    },
    setActiveSkateTestHistory: function (state, skate_test_history: UserSkateTestHistory) {
        state.user_skate_test_history = skate_test_history;
    },
    /* eslint-enable */
    /**
     * Set the remove action to use in state
     */
    setRemoveAction: function (state, payload: RemoveSkateTestsAction) {
        state.remove_action = payload;
    },
    /**
     * Set the save action to use in state
     */
    setSaveAction: function (state, payload: SaveSkateTestsAction) {
        state.save_action = payload;
    },
    /**
     * Reset state to defaults
     */
    reset: function (state) {
        state.save_action = null;
        state.remove_action = null;
    }
    /* eslint-disable */
};

export const SkateTestHistoryState = {
    namespaced: true,
    state: new State(),
    actions: actions,
    getters: getters,
    mutations: mutations
};