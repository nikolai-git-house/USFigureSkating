import {ActionTree, GetterTree, MutationTree} from "vuex"
import {FormOption, PaginationOption, PerPageOption} from "../../contracts/AppContracts";
import SearchResultHelpers, {SearchResultsSpread} from "../../helpers/SearchResultHelpers";
import {
    MemberSearchConfig,
    MemberSearchFormAdditionalValidator,
    MemberSearchParameters,
    MemberSearchResult,
    MemberSearchResultValidationFunction
} from "../../contracts/app/MemberSearchContracts";
import {PaginatedList} from "../../services/PaginationService";


export class State {
    /**
     * Additional functions to validate search form
     */
    additional_form_validators: MemberSearchFormAdditionalValidator[] = [];
    /**
     * Whether results are active
     */
    results_active: boolean = false;
    /**
     * Set of search results
     */
    results: MemberSearchResult[] = [];
    /**
     * Array of member IDs to prevent selection (as already selected)
     */
    block_previous_selection: (number | string)[] = [];
    /**
     * State form options for search form
     */
    state_options: FormOption[] = [];
    /**
     * Currently active amount of items per page
     */
    per_page: PerPageOption = 10;
    /**
     * The index of the active page of results
     */
    active_page_index: number = 0;
    /**
     * The function that actually performs the search
     */
    search_function?: (search_params: MemberSearchParameters) => Promise<MemberSearchResult[]>;
    /**
     * The method to run when selecting a result
     */
    selection_method?: (result: MemberSearchResult) => Promise<void>;
    /**
     * The method to run when closing search
     */
    close_method?: () => void;
    /**
     * The instruction to display in the ineligible member popup
     */
    ineligible_instruction: string = "Please choose another coach or leave blank";
    /**
     * The descriptor for the search entity type
     */
    entity_descriptor: string = "Member";
    /**
     * Additional validation functions to run on results
     */
    result_validators?: MemberSearchResultValidationFunction[];
    /**
     * Function to determine if there was an error loading the search form
     */
    search_form_load_error_check: (() => boolean) = (() => {
        return false;
    });
}

const actions = <ActionTree<State, any>>{
    /**
     * Run a search for members
     */
    runSearch: function (context, search_params: MemberSearchParameters): Promise<MemberSearchResult[]> {
        return new Promise(function (resolve, reject) {

            let searchFunction = context.state.search_function;
            if (!searchFunction) {
                console.error("No member search function specified");
                reject();
                return;
            }
            searchFunction(search_params).then(function (member_results: MemberSearchResult[]) {
                context.commit('setSearchResults', member_results);
                context.commit('setActivePageIndex', 0);
                context.commit('setPerPage', context.getters.per_page_options[0].value);
                resolve(member_results);
            }).catch(function () {
                reject();
            });
        });
    },
    /**
     * Handle selection of a member
     */
    handleSelection: function (context, member: MemberSearchResult): Promise<void> {
        return new Promise(function (resolve, reject) {
            let selectionMethod = context.state.selection_method;
            if (!selectionMethod) {
                console.error('No selection method configured');
                reject('Error selecting member.');
                return;
            }
            selectionMethod(member).then(() => {
                resolve();
            }).catch((message) => {
                reject(message);
            });
        });
    }
};

const getters = <GetterTree<State, any>>{
    /**
     * Determine if a result should be blocked for selection and display as already selected
     */
    previously_selected_selection_blocked: function (state): (member_id: number | string) => boolean {
        return function (member_id: number | string): boolean {
            return state.block_previous_selection.indexOf(member_id) !== -1;
        }
    },
    /**
     * The amount of results
     */
    result_count: function (state): number {
        return state.results.length;
    },
    /**
     * The options for "per page" selection
     */
    per_page_options: function (state, getters): FormOption[] {
        let base_options = [10, 25];
        let result: FormOption[] = [];
        for (let i = 0; i < base_options.length; i++) {
            let option = base_options[i];
            if (option <= getters.result_count) {
                result.push({
                    label: String(option),
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
    /**
     * The paginated set of search results
     */
    paginated_results: function (state): PaginatedList<MemberSearchResult> {
        let per_page = state.per_page;
        let result: PaginatedList<MemberSearchResult> = [];
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
    /**
     * Form state options
     */
    state_options: function (state): FormOption[] {
        return state.state_options;
    },
    /**
     * Get the display results from the paginated list for the active page
     */
    active_results: function (state, getters): MemberSearchResult[] {
        return getters.paginated_results[state.active_page_index];
    },
    /**
     * Current begin and end page range
     */
    current_spread: function (state, getters): SearchResultsSpread {
        return SearchResultHelpers.getSpread(getters.result_count, state.active_page_index, state.per_page);
    },
    /**
     * Options to show in pagination
     */
    pagination_options: function (state, getters): PaginationOption[] {
        return SearchResultHelpers.getPaginationOptions(getters.paginated_results, state.active_page_index);
    },
    /**
     * Whether pagination is available
     */
    pagination_available: function (state, getters): boolean {
        return getters.pagination_options.length > 1;
    },
    /**
     * Get the string reason a member result is invalid, or false if the result is valid
     * Determined through additional validation functions added to state
     */
    memberResultInvalid: function (state, getters): (member_result: MemberSearchResult) => string | false {
        return function (member_result: MemberSearchResult): string | false {
            if (!state.result_validators) {
                return false;
            }
            for (let i = 0; i < state.result_validators.length; i++) {
                let memberValidator = state.result_validators[i];
                let error = memberValidator((member_result));
                if (error) {
                    return error;
                }
            }
            return false;
        };
    },
    search_form_load_error:function(state):boolean{
        return state.search_form_load_error_check();
    }
};

const mutations = <MutationTree<State>>{
    setResultsActive: function (state, active: boolean) {
        state.results_active = active;
    },
    setSearchResults: function (state, member_results: MemberSearchResult[]) {
        state.results = member_results;
    },
    setStateOptions: function (state, options: FormOption[]) {
        state.state_options = options;
    },
    closeSearch: function (state) {
        let closeMethod = state.close_method;
        if (closeMethod) {
            closeMethod();
            return;
        }
        console.error('No close method configured');
    },
    setPerPage: function (state, per_page: PerPageOption) {
        state.per_page = per_page;
    },
    setActivePageIndex: function (state, page_index: number) {
        state.active_page_index = page_index;
    },
    /**
     * Set the list of ids to display as previously selected
     */
    setBlockedPreviousSelection: function (state, previous_selection: number[]) {
        state.block_previous_selection = previous_selection;
    },
    /**
     * Configure the search
     */
    configure: function (state: State, config: MemberSearchConfig) {
        if (config.search_function) {
            state.search_function = config.search_function;
        }
        if (config.selection_method) {
            state.selection_method = config.selection_method;
        }
        if (config.close_method) {
            state.close_method = config.close_method;
        }
        if (config.ineligible_instruction) {
            state.ineligible_instruction = config.ineligible_instruction;
        }
        if (config.entity_descriptor) {
            state.entity_descriptor = config.entity_descriptor;
        }
        if (config.result_validators) {
            state.result_validators = config.result_validators;
        }
        if (config.form_validators) {
            state.additional_form_validators = config.form_validators;
        }
    },
    /**
     * Set function to evaluate to determine if there was a search form load error
     */
    setFormLoadErrorCheckFunction: function (state, payload: (() => boolean)) {
        state.search_form_load_error_check = payload;
    }
};


export const MemberSearchState = {
    namespaced: true,
    state: new State(),
    actions: actions,
    getters: getters,
    mutations: mutations
};