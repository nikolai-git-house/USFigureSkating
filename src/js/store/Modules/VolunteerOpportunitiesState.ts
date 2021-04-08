import {ActionTree, GetterTree, MutationTree} from 'vuex';
import {UpdateUserProfileArgs} from '../../contracts/app/UserContracts';
import {
    CategorizedVolunteerOpportunityEvents,
    ExportedVolunteerRequestSearchForm,
    FetchVolunteerOpportunitiesResponse,
    FetchVolunteerRequestDataResponse,
    SubmitCompetitionVolunteerRequestServiceResponse,
    SubmitVolunteerRequestSubmissionResponse,
    VolunteerOpportunitiesStateConfiguration,
    VolunteerOpportunityEvent,
    VolunteerOpportunitySearchResponse,
    VolunteerRequestCategorizedOpportunities,
    VolunteerRequestCompletionResponse,
    VolunteerRequestGeneralInformationFormData,
    VolunteerRequestLinks,
    VolunteerRequestStandaloneCompletionResponse
} from '../../contracts/app/VolunteerOpportunitiesContracts';
import {FormOption, PerPageOption, StateFormOption, UpdateEmergencyContactArgs} from '../../contracts/AppContracts';
import CompetitionService from '../../services/CompetitionService';
import {VolunteerOpportunitiesService} from '../../services/VolunteerOpportunitiesService';
import {VolunteerRequestFormData} from '../../models/Forms/VolunteerRequestFormState';
import {UserWaiver} from '../../contracts/app/CompetitionRegistrationContracts';

export class State {
    /**
     * The ID for the competition currently under request
     */
    active_competition_id: number | null = null;
    /**
     * The active search criteria
     */
    active_search_criteria: ExportedVolunteerRequestSearchForm | null = null;
    /**
     * Whether the request is initiated from a single competition (View Competition Page) rather
     * than the opportunities list (Volunteer Opportunities)
     */
    is_standalone: boolean = false;
    /**
     * Links to other resources from within Volunteer Opportunities
     */
    links: VolunteerRequestLinks = {
        criminal_history_check: '',
        terms_and_conditions: ''
    };

    /**
     * Opportunities available to various categories
     */
    opportunities = {
        upcoming: {
            local: <VolunteerOpportunityEvent[]>[],
            usfs: <VolunteerOpportunityEvent[]>[]
        },
        requested: <VolunteerOpportunityEvent[]>[]
    };

    /**
     * Whether a request is active
     */
    request_active: boolean = false;
    /**
     * Whether the search is active
     */
    search_active: boolean = false;
    /**
     * Options for the opportunity search form
     */
    search_form_options = {
        states: <StateFormOption[]>[],
        clubs: <FormOption[]>[]
    };

    /**
     * The current search results
     */
    search_results: VolunteerOpportunityEvent[] = [];
    /**
     * Whether search results are active
     */
    search_results_active: boolean = false;
    /**
     * The active page index of the paginated search results
     */
    search_results_active_page_index: number = 0;
    /**
     * The amount of search results to show per page
     */
    search_results_per_page: PerPageOption | null = null;
    /**
     * The user's waivers associated with a volunteer request
     */
    waivers: UserWaiver[] = [];
    /**
     * Lead text for Waivers screen of request
     */
    waivers_lead: string = '';
}

const actions = <ActionTree<State, any>>{
    /**
     * Begin an opportunity request
     */
    beginRequest: function (context, competition_id: number) {
        context.commit('setActiveCompetitionId', competition_id);
        context.commit('setRequestActive', true);
        context.commit('setSearchActive', false);
    },
    /**
     * Cancel an opportunity request and reset state properties that were set when it was started
     *
     * Note: request_active is set elsewhere in the process of closing a request
     */
    cancelRequest: function (context): void {
        // Clear form options that will be defined upon next request start
        context.commit('form_options/setCountryOptions', [], {root: true});
        context.commit('form_options/setProvinceOptions', [], {root: true});
        context.commit('form_options/setStateOptions', [], {root: true});
        context.commit('form_options/setVolunteerRequestExperienceOptions', [], {root: true});
        context.commit('form_options/setWaiverRelationships', [], {root: true});

        // Clear external state properties that will be redefined upon next request start
        context.commit('user/setUserEmergencyContact', null, {root: true});
        context.commit('user/setUserProfile', null, {root: true});

        // Clear local state active competition
        context.commit('setActiveCompetitionId', null);
        context.commit('setWaivers', []);
    },
    /**
     * Exit search and active request
     */
    exitAll: function (context) {
        context.dispatch('exitSearch');
        context.dispatch('exitRequest');
        context.commit('setActiveCompetitionId', null);
    },
    /**
     * Exit the current request
     *
     * Differs from cancelling the request in that it allows falling back into search with active properties
     */
    exitRequest: function (context) {
        context.commit('setRequestActive', false);
        if (context.getters.search_results.length) {
            context.commit('setSearchActive', true);
        }
    },
    /**
     * Exit search and reset related state props
     */
    exitSearch: function (context) {
        context.commit('setSearchActive', false);
        context.commit('setSearchResults', []);
        context.commit('setActiveSearchCriteria', null);
        context.commit('setSearchResultsActive', false);
        context.commit('setSearchResultsPageIndex', 0);
        context.commit('setSearchResultsPerPage', null);
    },
    /**
     * Get the data to begin a request on an individual Opportunity
     */
    fetchRequestData: function (context, competition_id: number | null) {
        return new Promise((resolve, reject) => {
            if (competition_id === null) {
                console.warn('attempting to begin request without competition id');
                reject();

                return;
            }
            VolunteerOpportunitiesService.fetchVolunteerRequestData(competition_id)
                .then((response: FetchVolunteerRequestDataResponse) => {
                    context.commit('form_options/setCountryOptions', response.user_profile_form_options.countries, {root: true});
                    context.commit('form_options/setProvinceOptions', response.user_profile_form_options.provinces, {root: true});
                    context.commit('form_options/setStateOptions', response.user_profile_form_options.states, {root: true});
                    context.commit('form_options/setVolunteerRequestExperienceOptions', response.opportunity_request_form_options, {root: true});
                    context.commit('user/setUserEmergencyContact', response.user_emergency_contact, {root: true});
                    context.commit('user/setUserProfile', response.user_profile, {root: true});
                    context.commit('setLinks', response.links);
                    context.commit('form_options/setWaiverRelationships', response.waivers.form_options.relationships, {root: true});
                    context.commit('setWaivers', response.waivers.user_waivers);
                    context.commit('setWaiversLead', response.waivers.lead);
                    resolve();
                })
                .catch(() => {
                    reject();
                });
        });
    },
    /**
     * Fetch the page data required to load the volunteer opportunities page
     *  Includes search form options and opportunities for display
     */
    fetchVolunteerOpportunitiesPageData: function (context) {
        return new Promise((resolve, reject) => {
            VolunteerOpportunitiesService
                .fetchVolunteerOpportunities()
                .then((result: FetchVolunteerOpportunitiesResponse) => {
                    context.commit('setOpportunities', result.opportunities);
                    context.commit('setSearchOptions', result.search_form_options);
                    resolve();
                })
                .catch(() => {
                    reject();
                });
        });
    },
    /**
     * Run the opportunities search
     */
    runSearch: function (context, search_criteria: ExportedVolunteerRequestSearchForm): Promise<void> {
        return new Promise((resolve, reject) => {
            context.commit('setActiveSearchCriteria', search_criteria);
            VolunteerOpportunitiesService.volunteerOpportunitySearch(search_criteria)
                .then((search_response: VolunteerOpportunitySearchResponse) => {
                    if (search_response.opportunities.length) {
                        context.commit('setSearchResults', search_response.opportunities);
                        resolve();

                        return;
                    }
                    reject('No results found.');
                })
                .catch((error_message) => {
                    reject(error_message);
                });
        });
    },
    /**
     * Reset component state
     */
    reset: function (context) {
        context.dispatch('exitAll');
        context.commit('resetConfiguration');
    },
    /**
     * Save information from the general information form
     */
    saveGeneralInformation: function (context, form_data: VolunteerRequestGeneralInformationFormData): Promise<void> {
        return new Promise((resolve, reject) => {
            const competition_id = context.state.active_competition_id;
            if (!competition_id) {
                console.error('Attempting to save profile with no active competition id');
                reject();

                return;
            }
            VolunteerOpportunitiesService.updateVolunteerRequestUserProfile(competition_id, form_data)
                .then(() => {
                    const profile_args: UpdateUserProfileArgs = {
                        primary_email: {
                            value: form_data.email,
                            opt_out: false,
                            publish: false
                        },
                        primary_phone: {
                            value: form_data.cell_phone,
                            carrier: null
                        },
                        address: {
                            country: context.rootGetters['form_options/country_from_value'](form_data.country),
                            street: form_data.street,
                            street_2: form_data.street_2,
                            city: form_data.city,
                            state: context.rootGetters['form_options/state_from_value'](form_data.state),
                            province: context.rootGetters['form_options/province_from_value'](form_data.province),
                            zip_code: form_data.zip
                        }
                    };

                    const emergency_contact_args: UpdateEmergencyContactArgs = {
                        ...form_data.emergency_contact
                    };

                    context.dispatch('user/updateProfile', profile_args, {root: true});
                    context.dispatch('user/updateEmergencyContact', emergency_contact_args, {root: true});
                    resolve();
                })
                .catch((error_message: string) => {
                    reject(error_message);
                });
        });
    },
    /**
     * Submit the active request
     *
     * If in standalone mode, call standalone process.  Otherwise...
     *
     * If response contains a redirect URL, resolve with it and do nothing else
     * If not, update opportunities list based on response data and resolve null
     */
    submitRequest: function (context, form_data: VolunteerRequestFormData): Promise<VolunteerRequestCompletionResponse | VolunteerRequestStandaloneCompletionResponse> {
        if (context.state.is_standalone) {
            return context.dispatch('submitRequestStandalone', form_data);
        }

        return new Promise((resolve, reject) => {
            const competition_id = context.state.active_competition_id;
            if (!competition_id) {
                console.error('Attempting to submit volunteer request with no active competition id');
                reject();

                return;
            }
            VolunteerOpportunitiesService.submitVolunteerRequest(competition_id, form_data)
                .then((response: SubmitVolunteerRequestSubmissionResponse) => {
                    if (response.redirect_url) {
                        resolve(<VolunteerRequestCompletionResponse>{
                            redirect_url: response.redirect_url
                        });

                        return;
                    }
                    context.commit('setOpportunities', response.opportunities);
                    resolve({});
                })
                .catch((error) => {
                    reject(error);
                });
        });
    },
    /**
     * Submit a standalone volunteer opportunity request
     */
    submitRequestStandalone: function (context, form_data: VolunteerRequestFormData): Promise<VolunteerRequestStandaloneCompletionResponse> {
        return new Promise((resolve, reject) => {
            const competition_id = context.state.active_competition_id;
            if (!competition_id) {
                console.error('Attempting to submit volunteer request with no active competition id');
                reject();

                return;
            }
            CompetitionService.submitCompetitionVolunteerRequest(competition_id, form_data)
                .then((result: SubmitCompetitionVolunteerRequestServiceResponse) => {
                    context.commit('competitions/setViewCompetitionVolunteerCtaConfiguration', result.volunteer_cta_configuration, {root: true});
                    if (result.user_navigation) {
                        context.commit('competitions/setViewCompetitionUserNavigation', result.user_navigation, {root: true});
                    }
                    resolve({
                        message: result.confirmation_message
                    });
                })
                .catch((message) => {
                    reject(message);
                });
        });
    }
};

const getters = <GetterTree<State, any>>{
    /**
     * Club search form input options
     */
    club_options: function (state): FormOption[] {
        return state.search_form_options.clubs;
    },
    /**
     * Only requested Opportunities
     */
    requested_volunteer_events: function (state): VolunteerOpportunityEvent[] {
        return state.opportunities.requested;
    },
    /**
     * Opportunities resulting from a search
     */
    search_results: function (state): VolunteerOpportunityEvent[] {
        return state.search_results;
    },
    /**
     * State search form input options
     */
    state_options: function (state): StateFormOption[] {
        return state.search_form_options.states;
    },
    /**
     * Only sorted upcoming Opportunities
     */
    upcoming_volunteer_events: function (state): CategorizedVolunteerOpportunityEvents {
        return state.opportunities.upcoming;
    }
};

const mutations = <MutationTree<State>>{
    /**
     * Configure state module
     */
    configure: function (state, conf: VolunteerOpportunitiesStateConfiguration) {
        if (typeof conf.is_standalone !== 'undefined') {
            state.is_standalone = conf.is_standalone;
        }
    },
    /**
     * Reset configuration to initial state
     */
    resetConfiguration: function (state) {
        state.is_standalone = false;
    },
    /**
     * Set the active competition ID in state
     */
    setActiveCompetitionId: function (state, competition_id: number | null): void {
        state.active_competition_id = competition_id;
    },
    /**
     * Set the active search criteria in state
     */
    setActiveSearchCriteria: function (state, search_criteria: ExportedVolunteerRequestSearchForm) {
        state.active_search_criteria = search_criteria;
    },
    /**
     * Set Volunteer Request Links in state
     */
    setLinks: function (state, links: { [key: string]: string; }) {
        for (const i in links) {
            if (Object.prototype.hasOwnProperty.call(links, i)) {
                const link = links[i];
                if (i in state.links) {
                    state.links[i] = link;
                }
            }
        }
    },
    /**
     * Set opportunities in state
     */
    setOpportunities: function (state, payload: VolunteerRequestCategorizedOpportunities): void {
        state.opportunities = {...payload};
    },
    /**
     * Set whether the request process is active
     */
    setRequestActive: function (state, is_active: boolean) {
        state.request_active = is_active;
    },
    /**
     * Set whether the search component is active
     */
    setSearchActive: function (state, is_active: boolean) {
        state.search_active = is_active;
    },
    /**
     * Set search options in state
     */
    setSearchOptions: function (state, payload: { states: StateFormOption[]; clubs: FormOption[]; }): void {
        state.search_form_options = {...payload};
    },
    /**
     * Set search results in state
     */
    setSearchResults: function (state, search_results: VolunteerOpportunityEvent[]) {
        state.search_results = search_results;
    },
    /**
     * Set search results in state
     */
    setSearchResultsActive: function (state, is_active: boolean) {
        state.search_results_active = is_active;
    },
    /**
     * Set search results active page index in state
     */
    setSearchResultsPageIndex: function (state, page_index: number) {
        state.search_results_active_page_index = page_index;
    },
    /**
     * Set search results per page option in state
     */
    setSearchResultsPerPage: function (state, per_page: PerPageOption) {
        state.search_results_per_page = per_page;
    },
    /**
     * Set waivers in state
     */
    setWaivers: function (state, payload: UserWaiver[]) {
        state.waivers = payload;
    },
    /**
     * Set waivers component lead text in state
     */
    setWaiversLead: function (state, payload: string) {
        state.waivers_lead = payload;
    }
};

export const VolunteerOpportunitiesState = {
    namespaced: true,
    state: new State(),
    actions: actions,
    getters: getters,
    mutations: mutations
};