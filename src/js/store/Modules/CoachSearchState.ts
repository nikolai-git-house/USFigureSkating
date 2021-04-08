import {ActionTree, GetterTree, MutationTree} from "vuex"
import {
    CoachAddPayload,
    CoachReplacePayload,
    CoachResult,
    FormOption,
    MyCoachesSearchParameters,
    PerPageOption,
    SearchActionKey,
    SearchActivationPayload,
    SkaterEventCategoryCoach
} from "../../contracts/AppContracts";
import {CoachService} from "../../services/CoachService";
import SearchResultHelpers from "../../helpers/SearchResultHelpers";


export class State {
    results: CoachResult[] = [];
    state_options: FormOption[] = [];
    active_coach_id: number = -1;
    active_category_id: number = -1;
    active_action: SearchActionKey = "";
    search_active: boolean = false;
    per_page: PerPageOption = 10;
    active_page_index: number = 0;
}

const actions = <ActionTree<State, any>>{
    /**
     * Run a search for coaches
     */
    coachSearch: function (context, search_params: MyCoachesSearchParameters): Promise<CoachResult[]> {
        return new Promise(function (resolve, reject) {
            CoachService.coachSearch(search_params).then(function (coach_results: CoachResult[]) {
                context.commit('setSearchResults', coach_results);
                context.commit('setActivePageIndex', 0);
                context.commit('setPerPage', context.getters.per_page_options[0].value);
                resolve(coach_results);
            }).catch(function () {
                reject();
            });
        });
    },
    /**
     * Get the options for state in the search form
     */
    fetchStateOptions: function (context) {
        return new Promise(function (resolve, reject) {
            return CoachService.fetchStateOptions().then(function (state_options: FormOption[]) {
                context.commit('setStateOptions', state_options);
                resolve(state_options);
            }).catch(function () {
                reject();
            })
        });
    },
    /**
     * Add a coach
     */
    addCoach: function (context, coach: SkaterEventCategoryCoach) {
        return new Promise(function (resolve, reject) {
            let payload: CoachAddPayload = {
                coach,
                event_category_id: context.state.active_category_id,
                competition_id: context.rootState.competitions.active_competition_id
            };
            context.dispatch('skater/addCoach', payload, {root: true}).then(function () {
                resolve();
            }).catch(function () {
                reject();
            })
        });
    },
    /**
     * Replace a coach
     */
    replaceCoach: function (context, coach: SkaterEventCategoryCoach) {
        let payload: CoachReplacePayload = {
            coach,
            event_category_id: context.state.active_category_id,
            competition_id: context.rootState.competitions.active_competition_id,
            previous_coach_id: context.state.active_coach_id
        };
        return new Promise(function (resolve, reject) {
            context.dispatch('skater/replaceCoach', payload, {root: true}).then(function () {
                resolve();
            }).catch(function () {
                reject();
            })
        });
    }

};

const getters = <GetterTree<State, any>>{
    result_count: function (state) {
        return state.results.length;
    },
    per_page_options: function (state, getters) {
        let base_options = [10, 25];
        let result = [];
        for (let i = 0; i < base_options.length; i++) {
            let option = base_options[i];
            if (option <= getters.result_count) {
                result.push({
                    label: option,
                    value: option
                });
            }
        }
        result.push({
            label: "All",
            value: "all"
        });

        return result;
    },
    paginated_results: function (state) {
        let per_page = state.per_page;
        let result: CoachResult[][] = [];
        return state.results.reduce(function (accumulator, item, index) {
            let result_index = 0;
            if (typeof per_page === "number") {
                result_index = Math.floor(index / per_page);
            }
            if (!accumulator[result_index]) {
                accumulator[result_index] = [];
            }
            accumulator[result_index].push(item);
            return accumulator;
        }, result);
    },
    state_options: function (state): FormOption[] {
        return state.state_options;
    },
    active_results: function (state, getters): CoachResult[] {
        return getters.paginated_results[state.active_page_index];
    },
    current_spread: function (state, getters) {
        return SearchResultHelpers.getSpread(getters.result_count, state.active_page_index, state.per_page);
    },
    pagination_options: function (state, getters) {
        return SearchResultHelpers.getPaginationOptions(getters.paginated_results, state.active_page_index);
    },
    pagination_available: function (state, getters) {
        return getters.pagination_options.length > 1;
    }
};

const mutations = <MutationTree<State>>{
    setSearchResults: function (state, coach_results: CoachResult[]) {
        state.results = coach_results;
    },
    setStateOptions: function (state, options: FormOption[]) {
        state.state_options = options;
    },
    closeSearch: function (state) {
        state.search_active = false;
        state.active_action = "";
        state.active_category_id = -1;
        state.active_coach_id = -1;
    },
    activateSearch: function (state, activation_payload: SearchActivationPayload) {
        state.search_active = true;
        state.active_action = activation_payload.search_type;
        state.active_category_id = activation_payload.category_id;
        state.active_coach_id = activation_payload.coach_id ? activation_payload.coach_id : -1;
    },
    setPerPage: function (state, per_page: PerPageOption) {
        state.per_page = per_page;
    },
    setActivePageIndex: function (state, page_index: number) {
        state.active_page_index = page_index;
    }
};


export const CoachSearchState = {
    namespaced: true,
    state: new State(),
    actions: actions,
    getters: getters,
    mutations: mutations
};