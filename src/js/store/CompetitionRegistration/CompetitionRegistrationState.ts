import {ActionTree, GetterTree, MutationTree} from "vuex"
import {
    AddPartnerPayload,
    CompetitionPrices,
    CompetitionRegistrationActiveCompetition,
    CompetitionRegistrationCoachIdentificationScreenParams,
    CompetitionRegistrationEventSelectionScreenParams,
    CompetitionRegistrationOverviewScreenParams,
    CompetitionRegistrationPartnerEventsScreenParams,
    CompetitionRegistrationPartnerIdentificationScreenParams,
    CompetitionRegistrationProfileScreenParams,
    CompetitionRegistrationSkateTestsScreenParams,
    CompetitionRegistrationWaiversScreenParams,
    CompRegAddCoachPayload,
    CompRegRemoveCoachPayload,
    CompRegReplaceCoachPayload,
    EventSelectionEvent,
    EventSelectionResponse,
    PartnerIdentificationCategory,
    PartnerSkateTestAddResult,
    PartnerSkateTestRemoveResult,
    PartnerSkateTestSummary,
    RegistrationListCompetition,
    RemovePartnerPayload,
    RepresentationSelection,
} from "../../contracts/app/CompetitionRegistrationContracts";
import {CompetitionRegistrationService} from "../../services/CompetitionRegistrationService";
import {FormOptionValue} from "../../contracts/AppContracts";
import {PartnerSkateTestAddAppPayload, PartnerSkateTestRemoveAppPayload} from "../../contracts/app/SkateTestContracts";
import {SkaterCoachedEventCategory} from "../../models/SkaterCoachedEventCategory";


export class State {
    /**
     * The list of available competitions for registration
     */
    available_competitions: RegistrationListCompetition[] = [];
    /**
     * The currently active competition being registered for
     */
    active_competition: CompetitionRegistrationActiveCompetition | null = null;
    /**
     * The prices for the competition being registered for
     */
    active_competition_prices: CompetitionPrices | null = null;
    /**
     * The partner event categories identified by the user as event types they'd like to register for
     */
    selected_partner_events: FormOptionValue[] = [];
    /**
     * The selection for user representation for the competition
     */
    representation_selection: RepresentationSelection | null = null;
    /**
     * The list of events to display on event selection page
     */
    event_selection_events: EventSelectionEvent[] = [];
    /**
     * Based on selected events and partners, summary list of partner assignment including skate test requirement status
     */
    partner_skate_test_summary: PartnerSkateTestSummary[] = [];
    /**
     * List of categories (and assigned partners) for partner identification
     */
    partner_identification: PartnerIdentificationCategory[] = [];
    /**
     * List of categories (and assigned partners) for coach identification
     */
    coach_identification: SkaterCoachedEventCategory[] = [];
    /**
     * Whether the active user needs to select their representation for the active competition registration
     */
    representation_selection_required: boolean = true;
}

const actions = <ActionTree<State, any>>{
    /**
     * Fetch data needed to power the Competition Overview page
     */
    fetchCompetitionOverviewScreenData: function (context) {
        return new Promise((resolve, reject) => {
            CompetitionRegistrationService.fetchCompetitionOverviewScreenData().then((response: CompetitionRegistrationOverviewScreenParams) => {
                context.commit('setActiveCompetition', response.competition);
                context.commit('setActiveCompetitionPrices', response.prices);
                resolve();
                return;
            }).catch(() => {
                reject();
            })
        });
    },
    /**
     * Fetch data needed to power the Profile page
     */
    fetchProfileScreenData: function (context) {
        return new Promise((resolve, reject) => {
            CompetitionRegistrationService.fetchProfileScreenData().then((response: CompetitionRegistrationProfileScreenParams) => {
                context.commit('setActiveCompetition', response.competition);
                context.commit('user/setUserProfile', response.user_profile, {root: true});
                context.commit('setRepresentationSelectionRequired', response.representation_selection_required);
                context.commit('setActiveRegistrationRepresentation', response.selected_representation);
                resolve();
                return;
            }).catch(() => {
                reject();
            })
        });
    },
    /**
     * Fetch data needed to power the Skate Tests page
     */
    fetchSkateTestsScreenData: function (context) {
        return new Promise((resolve, reject) => {
            CompetitionRegistrationService.fetchSkateTestsScreenData().then((response: CompetitionRegistrationSkateTestsScreenParams) => {
                context.commit('setActiveCompetition', response.competition);
                context.commit('skate_test_history/setActiveSkateTestHistory', response.skate_test_history, {root: true});
                resolve();
                return;
            }).catch(() => {
                reject();
            })
        });
    },
    /**
     * Fetch data needed to power the Partner Events page
     */
    fetchPartnerEventsScreenData: function (context) {
        return new Promise((resolve, reject) => {
            CompetitionRegistrationService.fetchPartnerEventsScreenData().then((response: CompetitionRegistrationPartnerEventsScreenParams) => {
                context.commit('setActiveCompetition', response.competition);
                context.commit('setPartnerEvents', response.selected_events);
                resolve();
            }).catch(() => {
                reject();
            });
        });
    },
    /**
     * Fetch data needed to power the Partner Identification page
     */
    fetchPartnerIdentificationScreenData: function (context) {
        return new Promise((resolve, reject) => {
            CompetitionRegistrationService.fetchPartnerIdentificationScreenData().then((response: CompetitionRegistrationPartnerIdentificationScreenParams) => {
                context.commit('setActiveCompetition', response.competition);
                context.commit('setPartnerIdentification', response.partner_categories);
                context.commit('member_search/setStateOptions', response.state_form_options, {root: true});
                context.commit('user/setUserProfile', response.user_profile, {root: true});
                resolve();
                return;
            }).catch(() => {
                reject();
            })
        });
    },
    /**
     * Fetch data needed to power the Event Selection page
     */
    fetchEventSelectionScreenData: function (context): Promise<void> {
        return new Promise((resolve, reject) => {
            CompetitionRegistrationService.fetchEventSelectionScreenData().then((response: CompetitionRegistrationEventSelectionScreenParams) => {
                let {available_events, partner_skate_test_summary, selected_partner_events} = response;
                context.commit('setActiveCompetition', response.competition);
                context.commit('setEventSelectionEvents', available_events);
                context.commit('setPartnerSkateTestSummary', partner_skate_test_summary);
                context.commit('setPartnerEvents', selected_partner_events);
                resolve();
                return;
            }).catch(() => {
                reject();
            })
        });
    },
    /**
     * Fetch data needed to power the Coach Identification page
     */
    fetchCoachIdentificationScreenData: function (context) {
        return new Promise((resolve, reject) => {
            CompetitionRegistrationService.fetchCoachIdentificationScreenData().then((response: CompetitionRegistrationCoachIdentificationScreenParams) => {
                context.commit('setActiveCompetition', response.competition);
                context.commit('setCoachIdentification', response.event_categories);
                context.commit('member_search/setStateOptions', response.state_form_options, {root: true});
                resolve();
                return;
            }).catch(() => {
                reject();
            })
        });
    },
    /**
     * Fetch data needed to power the Waivers page
     */
    fetchWaiversScreenData: function (context) {
        return new Promise((resolve, reject) => {
            CompetitionRegistrationService.fetchWaiversScreenData().then((response: CompetitionRegistrationWaiversScreenParams) => {
                context.commit('setActiveCompetition', response.competition);
                context.commit('form_options/setWaiverRelationships', response.relationships, {root: true});
                context.commit('user/setUserWaivers', response.user_waivers, {root: true});
                resolve();
            }).catch(() => {
                reject();
            })
        });
    },
    /**
     * Fetch the list of available competitions for registration
     */
    fetchCompetitions: function (context) {
        return new Promise(function (resolve, reject) {
            CompetitionRegistrationService.fetchRegistrationCompetitions().then(function (competitions: RegistrationListCompetition[]) {
                context.commit('setAvailableCompetitions', competitions);
                resolve();
            }).catch(function () {
                reject();
            })
        });
    },
    /**
     * @deprecated (unused, subsumed)
     */
    fetchActiveCompetition: function (context) {
        return new Promise(function (resolve, reject) {
            CompetitionRegistrationService.fetchActiveCompetition().then(function (competition: CompetitionRegistrationActiveCompetition) {
                context.commit('setActiveCompetition', competition);
                resolve();
            }).catch(function () {
                reject();
            })
        });
    },
    /**
     * Submit representation selection
     */
    selectRepresentation: function (context, representation: RepresentationSelection) {
        return new Promise(function (resolve, reject) {
            CompetitionRegistrationService.postRepresentation(representation).then(function () {
                context.commit('setActiveRegistrationRepresentation', representation);
                resolve();
            }).catch(function (error_message) {
                reject(error_message);
            })
        });
    },
    /**
     * Submit partner events selection
     */
    selectPartnerEvents: function (context, partner_event_selections: FormOptionValue[]) {
        return new Promise(function (resolve, reject) {
            CompetitionRegistrationService.selectPartnerEvents(partner_event_selections).then(function () {
                context.commit('setPartnerEvents', partner_event_selections);
                resolve();
            }).catch(function (error_message) {
                reject(error_message);
            })
        });
    },
    /**
     * Add a partner for a category
     */
    addCategoryPartner: function (context, payload: AddPartnerPayload) {
        return new Promise((resolve, reject) => {
            CompetitionRegistrationService.addCategoryPartner(payload).then((partner_categories: PartnerIdentificationCategory[]) => {
                context.commit('setPartnerIdentification', partner_categories);
                resolve();
            }).catch((error_message: string) => {
                reject(error_message);
            })
        });
    },
    /**
     * Remove a partner from a category
     */
    removeCategoryPartner: function (context, payload: RemovePartnerPayload) {
        return new Promise((resolve, reject) => {
            CompetitionRegistrationService.removeCategoryPartner(payload).then((partner_categories: PartnerIdentificationCategory[]) => {
                context.commit('setPartnerIdentification', partner_categories);
                resolve();
            }).catch((error_message: string) => {
                reject(error_message);
            })
        });
    },
    /**
     * Select an event for registration
     */
    addEvent: function (context, event: EventSelectionEvent) {
        return new Promise((resolve, reject) => {
            CompetitionRegistrationService.addEvent(event).then((response: EventSelectionResponse) => {
                let {available_events, partner_skate_test_summary} = response;
                context.commit('setEventSelectionEvents', available_events);
                context.commit('setPartnerSkateTestSummary', partner_skate_test_summary);
                resolve();
            }).catch((error) => {
                reject(error);
            })
        });
    },
    /**
     * Remove a selected event from registration
     */
    removeEvent: function (context, event: EventSelectionEvent) {
        return new Promise((resolve, reject) => {
            CompetitionRegistrationService.removeEvent(event).then((response: EventSelectionResponse) => {
                let {available_events, partner_skate_test_summary} = response;
                context.commit('setEventSelectionEvents', available_events);
                context.commit('setPartnerSkateTestSummary', partner_skate_test_summary);
                resolve();
                return;

            }).catch((error) => {
                reject(error);
            })
        });
    },
    /**
     * Remove a partner skate test
     */
    removePartnerSkateTest: function (context, payload: PartnerSkateTestRemoveAppPayload): Promise<void> {
        return new Promise((resolve, reject) => {
            CompetitionRegistrationService.removePartnerSkateTest(payload).then((result: PartnerSkateTestRemoveResult) => {
                context.commit('skate_test_history/setActiveSkateTestHistory', result.skate_test_history, {root: true});
                context.commit('setPartnerSkateTestSummary', result.partner_skate_test_summary);
                resolve();
            }).catch((error_message: string) => {
                reject(error_message);
            });

        });
    },
    /**
     * Add a partner skate test
     */
    addPartnerSkateTest: function (context, payload: PartnerSkateTestAddAppPayload): Promise<void> {
        return new Promise((resolve, reject) => {
            CompetitionRegistrationService.addPartnerSkateTest(payload).then((result: PartnerSkateTestAddResult) => {
                context.commit('skate_test_history/setActiveSkateTestHistory', result.skate_test_history, {root: true});
                context.commit('setPartnerSkateTestSummary', result.partner_skate_test_summary);
                resolve();
            }).catch((error_message: string) => {
                reject(error_message);
            });
        });
    },
    /**
     * Add a coach for a category
     */
    addCategoryCoach: function (context, payload: CompRegAddCoachPayload) {
        return new Promise((resolve, reject) => {
            CompetitionRegistrationService.addCategoryCoach(payload).then((event_categories: SkaterCoachedEventCategory[]) => {
                context.commit('setCoachIdentification', event_categories);
                resolve();
            }).catch((error_message: string) => {
                reject(error_message);
            })
        });
    },
    /**
     * Replace a coach for a category
     */
    replaceCategoryCoach: function (context, payload: CompRegReplaceCoachPayload) {
        return new Promise((resolve, reject) => {
            CompetitionRegistrationService.replaceCategoryCoach(payload).then((event_categories: SkaterCoachedEventCategory[]) => {
                context.commit('setCoachIdentification', event_categories);
                resolve();
            }).catch((error_message: string) => {
                reject(error_message);
            })
        });
    },
    /**
     * Remove a coach for a category
     */
    removeCategoryCoach: function (context, payload: CompRegRemoveCoachPayload) {
        return new Promise((resolve, reject) => {
            CompetitionRegistrationService.removeCategoryCoach(payload).then((event_categories: SkaterCoachedEventCategory[]) => {
                context.commit('setCoachIdentification', event_categories);
                resolve();
            }).catch((error_message: string) => {
                reject(error_message);
            })
        });
    },
};

const getters = <GetterTree<State, any>>{
    competition_list: function (state): RegistrationListCompetition[] {
        return state.available_competitions;
    },
    active_competition: function (state): CompetitionRegistrationActiveCompetition | null {
        return state.active_competition;
    },
    active_prices: function (state): CompetitionPrices | null {
        return state.active_competition_prices;
    },
    selected_representation: function (state): RepresentationSelection | null {
        return state.representation_selection;
    },
    event_selection_events: function (state): EventSelectionEvent[] {
        return state.event_selection_events;
    },
    partner_skate_test_summary: function (state): PartnerSkateTestSummary[] {
        return state.partner_skate_test_summary;
    },
    partner_identification: function (state): PartnerIdentificationCategory[] {
        return state.partner_identification;
    },
    coach_identification: function (state): SkaterCoachedEventCategory[] {
        return state.coach_identification;
    },
    representation_selection_required: function (state): boolean {
        return state.representation_selection_required;
    }
};

const mutations = <MutationTree<State>>{
    setAvailableCompetitions: function (state, competitions: RegistrationListCompetition[]) {
        state.available_competitions = competitions;
    },
    setActiveCompetition: function (state, competition: CompetitionRegistrationActiveCompetition) {
        state.active_competition = competition;
    },
    setActiveCompetitionPrices: function (state, prices: CompetitionPrices) {
        state.active_competition_prices = prices;
    },
    setActiveRegistrationRepresentation: function (state, representation: RepresentationSelection | null) {
        state.representation_selection = representation;
    },
    setPartnerEvents: function (state, partner_events: FormOptionValue[]) {
        state.selected_partner_events = partner_events;
    },
    setPartnerIdentification: function (state, partner_identification: PartnerIdentificationCategory[]) {
        state.partner_identification = partner_identification;
    },
    setEventSelectionEvents: function (state, events: EventSelectionEvent[]) {
        state.event_selection_events = events;
    },
    setPartnerSkateTestSummary: function (state, summary: PartnerSkateTestSummary[]) {
        state.partner_skate_test_summary = summary;
    },
    setCoachIdentification: function (state, coach_identification: SkaterCoachedEventCategory[]) {
        state.coach_identification = coach_identification;
    },
    setRepresentationSelectionRequired: function (state, is_required: boolean) {
        state.representation_selection_required = is_required;
    }
};


export const CompetitionRegistrationState = {
    namespaced: true,
    state: new State(),
    actions: actions,
    getters: getters,
    mutations: mutations
};