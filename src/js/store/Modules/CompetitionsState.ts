import {ActionTree, GetterTree, MutationTree} from 'vuex';
import {FetchCompetitionScheduleServiceResponse} from '../../CompetitionSchedule/_contracts/CompetitionScheduleContracts';
import {CompetitionVolunteerCtaConfiguration} from '../../components/CompetitionVolunteerCTA/CompetitionVolunteerCtaContracts';
import {ActionCompetitionDocument} from '../../contracts/app/CompetitionDocumentsContracts';
import {
    CompetitionContact,
    CompetitionHeadingSource,
    CompetitionScheduleStateArgs,
    FetchCompetitionContactsServiceResponse,
    NullableSalesWindowKey,
    SessionType
} from '../../contracts/AppContracts';
import {Competition} from '../../models/Competition/Competition';
import {CompetitionInformation} from '../../models/Competition/CompetitionInformation';
import {CompetitionSchedule} from '../../models/Competition/CompetitionSchedule';
import {SkatingEvent} from '../../models/SkatingEvent';
import {SearchCompetitionsCompetition} from '../../pages/SearchCompetitions/SearchCompetitionsContracts';
import {ViewCompetitionCompetition} from '../../pages/ViewCompetition/ViewCompetitionCompetition';
import CompetitionService from '../../services/CompetitionService';
import {DataNavigationLink} from '../../CompetitionPortal/_models';

/**
 * The reactive state of competitions
 */
export class State {
    active_competition_id: number = -1;
    active_competition_page_heading: CompetitionHeadingSource | null = null;
    /**
     * Override to supersede whether active competition schedule is available.
     *
     * Used to determine schedule availability for competitions outside of competitions in user competition list
     */
    /* eslint-disable-next-line */
    active_competition_schedule_available_override: boolean | undefined = undefined;
    /**
     * 2020-07-29
     */
    /* eslint-disable-next-line */
    active_competition_my_schedule_available_override: boolean | undefined = undefined;
    competition_list: Competition[] = [];
    competition_list_search: SearchCompetitionsCompetition[] = [];
    competitions_loaded: boolean = false;
    schedule_loaded: boolean = false;
    active_schedule: CompetitionSchedule = new CompetitionSchedule([], [], []);
    active_competition_events: SkatingEvent[] = [];
    competition_information: CompetitionInformation = CompetitionInformation.blank();
    /**
     * @deprecated 2020-07-01; see: CompetitionPortalState
     */
    competition_contacts: CompetitionContact[] = [];
    view_competition_competition: ViewCompetitionCompetition | null = null;
}

/**
 * Accessors for computed competition state properties
 */
const getters = <GetterTree<State, any>>{
    /**
     * Get the active competition
     */
    active_competition: function (state) {
        for (let i = 0; i < state.competition_list.length; i++) {
            const competition = state.competition_list[i];
            if (competition.id == state.active_competition_id) {
                return competition;
            }
        }

        return {};
    },
    /**
     * The active source for the competition page heading.
     *
     * Precedence order:
     *
     * 1. Active Competition in State
     * 2. Specifically Fetched Heading Data
     * 3. Null
     */
    active_competition_heading: function (state, getters): CompetitionHeadingSource | null {
        const state_active_competition = getters.active_competition;
        if (state_active_competition && state_active_competition.id) {
            return state_active_competition;
        }
        if (state.active_competition_page_heading) {
            return state.active_competition_page_heading;
        }

        return null;
    },
    /**
     * The action documents for the active competition
     *
     * @deprecated - 2020-06-17
     */
    active_competition_action_documents: function (getters) {
        const competition_information = getters.competition_information;
        if (!competition_information) {
            return [];
        }

        return competition_information.competition_documents.action_documents;
    },
    /**
     * The reference documents for the active competition
     *
     * @deprecated - 2020-06-17
     */
    active_competition_reference_documents: function (getters) {
        const competition_information = getters.competition_information;
        if (!competition_information) {
            return [];
        }

        return competition_information.competition_documents.reference_documents;
    },
    /**
     * Whether the schedule for the active competition is available
     *
     * 1. If active competition in state, use its property
     * 2. If override set in state, use it.
     * 3. Default to true.
     */
    active_competition_schedule_available: function (state, getters): boolean {
        const active_competition = getters.active_competition;
        if (typeof active_competition.schedule_available !== 'undefined') {
            return active_competition.schedule_available;
        }

        if (typeof state.active_competition_schedule_available_override !== 'undefined') {
            return state.active_competition_schedule_available_override;
        }

        return true;
    },
    /**
     * Get the active PI sales window
     */
    active_sales_window: function (state, getters, rootState): NullableSalesWindowKey | undefined {
        if (rootState.competition_portal.practice_ice && rootState.competition_portal.practice_ice.active_sales_window) {
            return rootState.competition_portal.practice_ice.active_sales_window;
        }
        const active_competition = getters.active_competition;
        if (active_competition) {
            return active_competition._active_sales_window;
        }

        return 'none';
    },
    /**
     * Determine if a Competition is active based on its id
     */
    isActiveCompetition: function (state) {
        return function (id: number) {
            return state.active_competition_id == id;
        };
    },

    /**
     * Get the types of credits that can be purchased.
     */
    purchasable_credit_types: function (state, getters) {
        const active_sales_window = getters.active_sales_window;
        if (active_sales_window === 'pre_purchase') {
            return ['upi', 'opi', 'wu'];
        }

        return getters.non_selectable_session_types;

    },
    /**
     * Get the selectable session types for the current competition
     */
    selectable_session_types: function (state) {
        return state.competition_information.schedulable_session_types;
    },
    /**
     * Get the non-selectable session types for the current competition
     */
    non_selectable_session_types: function (state) {
        const all_types: SessionType[] = ['wu', 'opi', 'upi'];
        const schedulable_types = state.competition_information.schedulable_session_types;

        return all_types.filter(function (type: SessionType) {
            return schedulable_types.indexOf(type) === -1;
        });
    },
    /**
     * Get the competition information
     */
    competition_information: function (state) {
        return state.competition_information;
    },
    /**
     * Get music and PPC information
     */
    music_and_ppc_information: function (state) {
        return state.competition_information.music_and_ppc_information;
    }
};

/**
 * Perform (potentially async) actions with the state
 */
const actions = <ActionTree<State, any>>{
    /**
     * Get the competition list and store it in state
     */
    fetchCompetitionList: function (context) {
        return new Promise(function (resolve, reject) {
            CompetitionService.getCompetitionList()
                .then(function (result) {
                    context.commit('setCompetitionList', result);
                    resolve();
                })
                .catch(function () {
                    reject();
                });
        });
    },
    /**
     * Get the competition list for competition search and store it in state
     */
    fetchCompetitionListSearch: function (context) {
        return new Promise(function (resolve, reject) {
            CompetitionService.getCompetitionListSearch()
                .then(function (result: SearchCompetitionsCompetition[]) {
                    context.commit('setCompetitionListSearch', result);
                    resolve();
                })
                .catch(function () {
                    reject();
                });
        });
    },
    /**
     * Get competition information and store it in state
     *
     * @deprecated 2020-07-29
     */
    fetchCompetitionInformation: function (context, competition_id) {
        return new Promise(function (resolve, reject) {
            CompetitionService.getCompetitionInformation(competition_id)
                .then(function (result) {
                    context.commit('setCompetitionInformation', {
                        result: result,
                        competition: context.getters.active_competition
                    });
                    resolve();
                })
                .catch(function () {
                    reject();
                });
        });
    },
    /**
     * Get the page heading data for a competition
     */
    fetchCompetitionPageHeading: function (context, competition_id: number): Promise<CompetitionHeadingSource> {
        return new Promise((resolve, reject) => {
            CompetitionService.fetchCompetitionPageHeading(competition_id)
                .then((response: CompetitionHeadingSource) => {
                    context.commit('setActiveCompetitionPageHeading', response);
                    resolve();
                })
                .catch(() => {
                    reject();
                });
        });
    },
    /**
     * Get a competition's schedule and store it in state
     *
     * @deprecated 2020-07-29
     */
    fetchCompetitionSchedule: function (context, competition_id) {
        context.state.schedule_loaded = false;

        return new Promise(function (resolve, reject) {
            CompetitionService.getCompetitionSchedule(competition_id)
                .then((response: FetchCompetitionScheduleServiceResponse) => {
                    if (response.schedule) {
                        const state_args: CompetitionScheduleStateArgs = {
                            result: response.schedule,
                            competition: context.getters.active_competition
                        };
                        context.commit('setCompetitionSchedule', state_args);
                    }
                    context.commit('setCompetitionScheduleAvailableOverride', response.schedule_available);
                    resolve();
                })
                .catch(function () {
                    reject();
                });
        });

    },

    /**
     * Retrieve a competition's contacts and store them in state
     *
     * If a competition heading is provided by the API, use it in the resolution body, but do not store in state
     *
     * @deprecated 2020-07-01; see: CompetitionPortalState.fetchCompetitionContacts
     */
    fetchCompetitionContacts: function (context, competition_id: number): Promise<CompetitionHeadingSource | undefined> {
        return new Promise(function (resolve, reject) {
            CompetitionService.getCompetitionContacts(competition_id)
                .then(function (result: FetchCompetitionContactsServiceResponse) {
                    context.commit('setCompetitionContacts', result.contacts);
                    resolve();
                })
                .catch(function () {
                    reject();
                });
        });
    },
    /**
     * Fetch data for the view competition page for a competition id
     *
     * @deprecated  2020-06-24
     */
    fetchViewCompetitionCompetition: function (context, competition_id: number): Promise<void> {
        return new Promise((resolve, reject) => {
            CompetitionService.fetchViewCompetitionCompetition(competition_id)
                .then((result: ViewCompetitionCompetition) => {
                    context.commit('setViewCompetitionCompetition', result);
                    resolve();
                })
                .catch(() => {
                    reject();
                });
        });
    },
    /**
     * Toggle the completion state on a competition document
     *
     * @deprecated - 2020-06-17
     */
    toggleCompetitionDocumentCompletion: function (context, document: ActionCompetitionDocument): Promise<void> {
        return new Promise((resolve, reject) => {
            CompetitionService.updateCompetitionDocumentCompletionStatus(document, context.state.active_competition_id)
                .then(() => {
                    const action_documents_list = context.getters.active_competition_action_documents;
                    for (let i = 0; i < action_documents_list.length; i++) {
                        const state_document = action_documents_list[i];
                        if (document.id === state_document.id) {
                            context.commit('updateDocumentCompletion', {
                                document: state_document,
                                is_complete: !document.is_complete
                            });
                            break;
                        }
                    }
                    resolve();
                })
                .catch((e: string) => {
                    reject(e);
                });
        });
    }

};

/**
 * Change reactive data
 */
const mutations = <MutationTree<State>>{
    /**
     * Set the active competition id
     */
    setActiveID: function (state, payload) {
        state.active_competition_id = parseInt(payload);
    },
    /**
     * Set active competition heading in state
     */
    setActiveCompetitionPageHeading: function (state, payload: CompetitionHeadingSource) {
        state.active_competition_page_heading = payload;
    },
    /**
     * Set the stored competition list
     */
    setCompetitionList: function (state, payload: Competition[]) {
        state.competitions_loaded = true;
        state.competition_list = payload;
    },
    /**
     * Set the stored search competition list
     */
    setCompetitionListSearch: function (state, payload: SearchCompetitionsCompetition[]) {
        state.competition_list_search = payload;
    },
    /**
     * Set the stored competition info
     *
     * @refactor: Appending to active competition - determine if used, valuable, or necessary and remove if not - this is used on comp info page
     */
    setCompetitionInformation: function (state, payload) {
        if (payload.competition && 'setInformation' in payload.competition) {
            // eslint-disable-next-line
            (payload.competition as Competition).setInformation(payload.result);
        }
        state.competition_information = payload.result;
        state.active_competition_events = payload.result.events;
    },
    /**
     * Set the stored competition schedule
     *
     * @refactor: Appending to active competition - determine if used, valuable, or necessary and remove if not - this is used on comp info page
     */
    setCompetitionSchedule: function (state, payload: CompetitionScheduleStateArgs) {
        state.active_schedule = payload.result;
        if (payload.competition && 'setSchedule' in payload.competition) {
            // eslint-disable-next-line
            (payload.competition as Competition).setSchedule(payload.result);
        }
        state.schedule_loaded = true;
    },
    /**
     * Set override in state where competition schedule is available for the active competition
     */
    setCompetitionScheduleAvailableOverride: function (state, payload: boolean) {
        state.active_competition_schedule_available_override = payload;
    },
    /**
     * Set override in state where competition schedule is available for the active competition
     */
    setCompetitionMyScheduleAvailableOverride: function (state, payload: boolean) {
        state.active_competition_my_schedule_available_override = payload;
    },
    /**
     * Set the competition contacts in state
     *
     * @deprecated 2020-07-01; see: CompetitionPortalState
     */
    setCompetitionContacts: function (state, competition_contacts: CompetitionContact[]) {
        state.competition_contacts = competition_contacts;
    },
    /**
     * Set view competition competition data in state
     */
    setViewCompetitionCompetition: function (state, competition: ViewCompetitionCompetition) {
        state.view_competition_competition = competition;
    },
    /**
     * Set volunteer information field on view competition
     */
    setViewCompetitionVolunteerCtaConfiguration: function (state, payload: CompetitionVolunteerCtaConfiguration) {
        if (state.view_competition_competition) {
            state.view_competition_competition.volunteer_cta_configuration = payload;
        }
    },
    /**
     * Set user navigation on view competition
     */
    setViewCompetitionUserNavigation: function (state, payload: DataNavigationLink[]) {
        if (state.view_competition_competition) {
            state.view_competition_competition.user_navigation = payload;
        }
    },
    /**
     * Update the completion state on a competition document in state
     *
     * @deprecated 2020-06-17
     */
    updateDocumentCompletion: function (state, payload: { document: ActionCompetitionDocument; is_complete: boolean; }) {
        payload.document.is_complete = payload.is_complete;
    }
};

/**
 * Export the state module
 */
export const CompetitionState = {
    namespaced: true,
    state: new State(),
    getters: getters,
    mutations: mutations,
    actions: actions
};