import {ActionTree, GetterTree, MutationTree} from "vuex"
import {
    SkateTestDisciplineKey,
    SkateTestEquivalencyDiscipline,
    SkateTestEquivalencyStateData,
    SkateTestFormOption,
    SkateTestFormData
} from "../../contracts/app/SkateTestContracts";

export class State {
    test_data: SkateTestEquivalencyStateData = {};
}

const actions = <ActionTree<State, any>>{
    //
};

const getters = <GetterTree<State, any>>{
    /**
     * List of testable disciplines for form
     */
    testable_disciplines: function (state, getters, rootstate, rootGetters): SkateTestEquivalencyDiscipline[] {
        return rootGetters['form_options/skate_test_disciplines'];
    },
    /**
     * Get the active data for a specific discipline
     */
    discipline_data: function (state): (discipline_key: SkateTestDisciplineKey) => SkateTestFormData | null {
        return function (discipline_key: SkateTestDisciplineKey) {
            return state.test_data[discipline_key];
        }
    },
    /**
     * Get the active test data for a specific discipline
     */
    discipline_test: function (state, getters): (discipline_key: SkateTestDisciplineKey) => SkateTestFormOption | null {
        return function (discipline_key: SkateTestDisciplineKey) {
            let data = getters['discipline_data'](discipline_key);
            return data ? data.test : null;
        }
    },
    /**
     * Export state values as independent variables from state
     */
    export_data: function (state, getters): SkateTestEquivalencyStateData {
        let testable_disciplines = getters['testable_disciplines'];
        let result: SkateTestEquivalencyStateData = {};
        for (let i = 0; i < testable_disciplines.length; i++) {
            let testableDiscipline = testable_disciplines[i].key;
            result[testableDiscipline] = null;
        }
        for (let i in result) {
            let state_value = i in state.test_data ? state.test_data[i] : false;
            if (state_value) {
                result[i] = {
                    ...state_value,
                    test: {...state_value.test},
                }
            }
        }
        return result;
    }
};

const mutations = <MutationTree<State>>{
    /**
     * Add data to a discipline to state
     */
    addDisciplineData: function (state, data: { key: SkateTestDisciplineKey, form_data: SkateTestFormData }) {
        let {key, form_data} = data;
        state.test_data[key] = form_data;
    },
    /**
     * Remove data from a discipline in state
     */
    removeDisciplineData: function (state, key: SkateTestDisciplineKey) {
        if (key in state.test_data) {
            let current = {...state.test_data};
            delete current[key];
            state.test_data = current;
        }
    }
};

export const SkateTestEquivalencyState = {
    namespaced: true,
    state: new State(),
    actions: actions,
    getters: getters,
    mutations: mutations
};