import {ActionTree, GetterTree, MutationTree} from "vuex"
import {FormOptionService} from "../../services/FormOptionService";
import {
    BillingAddressFormOptions,
    CountryFormOption,
    CreateAccountFormOptions,
    EditProfileFormOptions,
    FederationFormOption,
    FormOption,
    ProvinceFormOption,
    StateFormOption
} from "../../contracts/AppContracts";
import {
    CategorizedSkateTestOptions,
    SkateTestDisciplineKey,
    SkateTestEquivalencyDiscipline,
    SkateTestFormOption
} from "../../contracts/app/SkateTestContracts";

/**
 * Config outlining fetchers that complete the needs of child fetchers
 */
const FETCHER_CONFIG: { [key: string]: { children: string[] } } = {
    create_account: {
        children: [
            'states',
            'countries',
            'provinces',
            'federations',
            'categorized_skate_test_options',
        ]
    },
    edit_profile: {
        children: [
            'user_prefixes',
            'user_suffixes',
            'mobile_carriers'
        ]
    },
    billing_address: {
        children: [
            'states',
            'provinces',
            'billing_countries'
        ]
    }
};

export class State {
    states = <StateFormOption[]>[];
    countries = <CountryFormOption[]>[];
    federations = <FederationFormOption[]>[];
    provinces = <ProvinceFormOption[]>[];
    categorized_skate_test_options = <CategorizedSkateTestOptions>{
        free_skating: [],
        pair: [],
        dance: [],
        free_dance: [],
        figure: [],
    };
    skate_test_disciplines: SkateTestEquivalencyDiscipline[] = [];
    user_prefixes: FormOption[] = [];
    user_suffixes: FormOption[] = [];
    mobile_carriers: FormOption[] = [];
    waiver_relationships: FormOption[] = [];
    clubs: FormOption[] = [];
    billing_countries: CountryFormOption[] = [];
    volunteer_request_experiences: FormOption[] = [];
    /**
     * Fetchers in the process of retrieving data
     */
    active_fetchers: string[] = [];
    /**
     * Fetchers that have completed the process of retrieving data
     */
    completed_fetchers: string[] = [];
}

const actions = <ActionTree<State, any>>{
    /**
     * Fetch form options for all create account screens
     */
    fetchCreateAccountOptions: function (context): Promise<void> {
        let active_key: string = 'create_account';
        return new Promise(function (resolve, reject) {
            if (context.getters['block_fetcher'](active_key)) {
                resolve();
                return;
            }
            context.commit('addActiveFetcher', active_key);
            FormOptionService.GetCreateAccountOptions().then(function (result: CreateAccountFormOptions) {
                context.commit('removeActiveFetcher', active_key);
                context.commit('setCreateAccountOptions', result);
                context.commit('addCompletedFetcher', active_key);
                resolve();
            }).catch(() => {
                context.commit('removeActiveFetcher', active_key);
                reject();
            })
        });
    },
    fetchBillingAddressOptions: function (context): Promise<void> {
        let active_key: string = 'billing_address';
        return new Promise(function (resolve, reject) {
            if (context.getters['block_fetcher'](active_key)) {
                resolve();
                return;
            }
            context.commit('addActiveFetcher', active_key);
            FormOptionService.getBillingAddressOptions().then(function (result: BillingAddressFormOptions) {
                context.commit('removeActiveFetcher', active_key);
                context.commit('setBillingAddressOptions', result);
                context.commit('addCompletedFetcher', active_key);
                resolve();
            }).catch(() => {
                context.commit('removeActiveFetcher', active_key);
                reject();
            })
        });
    },
    fetchEditProfileOptions: function (context) {
        let active_key: string = 'edit_profile';
        return new Promise(function (resolve, reject) {
            if (context.getters['block_fetcher'](active_key)) {
                resolve();
                return;
            }
            context.commit('addActiveFetcher', active_key);
            FormOptionService.GetEditProfileOptions().then(function (result: EditProfileFormOptions) {
                context.commit('removeActiveFetcher', active_key);
                context.commit('setEditProfileOptions', result);
                context.commit('addCompletedFetcher', active_key);
                resolve();
            }).catch(() => {
                context.commit('removeActiveFetcher', active_key);
                reject();
            })
        });
    },
    fetchClubs: function (context) {
        let active_key: string = 'clubs';
        return new Promise(function (resolve, reject) {
            if (context.getters['block_fetcher'](active_key)) {
                resolve();
                return;
            }
            context.commit('addActiveFetcher', active_key);
            FormOptionService.getClubOptions().then(function (result: FormOption[]) {
                context.commit('removeActiveFetcher', active_key);
                context.commit('setClubOptions', result);
                context.commit('addCompletedFetcher', active_key);
                resolve();
            }).catch(() => {
                context.commit('removeActiveFetcher', active_key);
                reject();
            })
        });
    }
};

const getters = <GetterTree<State, any>>{
    /**
     * Function to return skate test options by a supplied discipline key
     */
    skate_test_options: function (state): (discipline_key: SkateTestDisciplineKey) => SkateTestFormOption[] {
        return function (discipline_key: SkateTestDisciplineKey) {
            return state.categorized_skate_test_options[discipline_key];
        }
    },
    /**
     * Whether a fetcher should be blocked based on current state
     */
    block_fetcher: function (state): (fetcher_key: string) => boolean {
        return function (fetcher_key: string): boolean {
            return state.active_fetchers.indexOf(fetcher_key) !== -1 || state.completed_fetchers.indexOf(fetcher_key) !== -1;
        }
    },
    /**
     * State State options
     */
    states: function (state): StateFormOption[] {
        return state.states;
    },
    /**
     * State Country options
     */
    countries: function (state): CountryFormOption[] {
        return state.countries;
    },
    /**
     * State Federation options
     */
    federations: function (state): FederationFormOption[] {
        return state.federations;
    },
    /**
     * State Province options
     */
    provinces: function (state): ProvinceFormOption[] {
        return state.provinces;
    },
    /**
     * State SkateTestDiscipline options
     */
    skate_test_disciplines: function (state): SkateTestEquivalencyDiscipline[] {
        return state.skate_test_disciplines;
    },
    edit_profile_options: function (state): { [key: string]: FormOption[] } {
        return {
            prefixes: state.user_prefixes,
            suffixes: state.user_suffixes,
            mobile_carriers: state.mobile_carriers
        }
    },
    billing_countries: function (state): CountryFormOption[] {
        return state.billing_countries;
    },
    waiver_relationships: function (state): FormOption[] {
        return state.waiver_relationships;
    },
    clubs: function (state): FormOption[] {
        return state.clubs;
    },
    /**
     * Get the form option for a state by its value
     */
    state_from_value: function (state, getters): (value: string) => StateFormOption | null {
        return function (value: string) {
            const states = getters['states'];
            for (let i = 0; i < states.length; i++) {
                let state_option = states[i];
                if (state_option.value === value) {
                    return state_option;
                }
            }
            return null;
        };
    },
    /**
     * Get the form option for a country by its value
     */
    country_from_value: function (state, getters): (value: string) => CountryFormOption | null {
        return function (value: string) {
            const countries = getters['countries'];
            for (let i = 0; i < countries.length; i++) {
                let country_option = countries[i];
                if (country_option.value === value) {
                    return country_option;
                }
            }
            return null;
        };
    },
    /**
     * Get the form option for a province by its value
     */
    province_from_value: function (state, getters): (value: string) => ProvinceFormOption | null {
        return function (value: string) {
            const provinces = getters['provinces'];
            for (let i = 0; i < provinces.length; i++) {
                let province_option = provinces[i];
                if (province_option.value === value) {
                    return province_option;
                }
            }
            return null;
        };
    }
};

const mutations = <MutationTree<State>>{
    setStateOptions: function (state, value: StateFormOption[]) {
        state.states = value;
    },
    setCountryOptions: function (state, value: CountryFormOption[]) {
        state.countries = value;
    },
    setFederationOptions: function (state, value: FederationFormOption[]) {
        state.federations = value;
    },
    setProvinceOptions: function (state, value: ProvinceFormOption[]) {
        state.provinces = value;
    },
    setCategorizedSkateTestOptions: function (state, value: CategorizedSkateTestOptions) {
        state.categorized_skate_test_options = value;
    },
    /**
     * Add active fetcher to state.  If fetcher has children, include them
     */
    addActiveFetcher: function (state, key: string) {
        state.active_fetchers.push(key);
        if (key in FETCHER_CONFIG) {
            let children = FETCHER_CONFIG[key].children;
            for (let i = 0; i < children.length; i++) {
                let child = children[i];
                state.active_fetchers.push(child);
            }
        }
    },
    /**
     * Remove active fetcher from state.  If fetcher has children, remove them as well
     */
    removeActiveFetcher: function (state, key: string) {
        state.active_fetchers.splice(state.active_fetchers.indexOf(key), 1);
        if (key in FETCHER_CONFIG) {
            let children = FETCHER_CONFIG[key].children;
            for (let i = 0; i < children.length; i++) {
                let child = children[i];
                state.active_fetchers.splice(state.active_fetchers.indexOf(child), 1);
            }
        }
    },
    /**
     * Add completed fetcher to state.  If fetcher has children, include them
     */
    addCompletedFetcher: function (state, key: string) {
        state.completed_fetchers.push(key);
        if (key in FETCHER_CONFIG) {
            let children = FETCHER_CONFIG[key].children;
            for (let i = 0; i < children.length; i++) {
                let child = children[i];
                state.completed_fetchers.push(child);
            }
        }
    },
    /**
     * Commit create account options to state
     */
    setCreateAccountOptions: function (state, payload: CreateAccountFormOptions) {
        let {states, countries, provinces, federations, skate_tests, skate_test_disciplines} = payload;
        state.states = states;
        state.countries = countries;
        state.federations = federations;
        state.provinces = provinces;
        state.categorized_skate_test_options = skate_tests;
        state.skate_test_disciplines = skate_test_disciplines;
    },
    setBillingAddressOptions: function (state, payload: BillingAddressFormOptions) {
        let {states, countries, provinces} = payload;
        state.states = states;
        state.billing_countries = countries;
        state.provinces = provinces;

    },
    setEditProfileOptions: function (state, payload: EditProfileFormOptions) {
        let {user_prefixes, user_suffixes, mobile_carriers} = payload;
        state.user_prefixes = user_prefixes;
        state.user_suffixes = user_suffixes;
        state.mobile_carriers = mobile_carriers;
    },
    setWaiverRelationships: function (state, relationships: FormOption[]) {
        state.waiver_relationships = relationships;
    },
    setClubOptions: function (state, options: FormOption[]) {
        state.clubs = options;
    },
    setVolunteerRequestExperienceOptions(state, options: FormOption[]) {
        state.volunteer_request_experiences = options;
    }

};

export const FormOptionsState = {
    namespaced: true,
    state: new State(),
    actions: actions,
    getters: getters,
    mutations: mutations
};