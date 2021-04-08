import {ActionTree, GetterTree, MutationTree} from 'vuex';
import {CompetitionPortalApiService, CompetitionPortalAppService} from '../_services';
import {CompetitionPortalService} from '../_contracts';
import {ManagedTeam} from '../../Teams/_models';
import {
    ActiveCompetitionSummary,
    ActiveEntitySummary,
    CompetitionPortalCompetitionInformation,
    CompetitionSelectableEntity
} from '../_models';
import {ActionCompetitionDocument, CompetitionDocuments} from '../../contracts/app/CompetitionDocumentsContracts';
import {CompetitionPortalPageHeadingBinding} from '../_components/_contracts';
import {CompetitionContact} from '../../contracts/AppContracts';

export class State {
    active_competition_summary: ActiveCompetitionSummary | null = null;
    /**
     * Summary information about the active entity
     */
    active_entity_summary: ActiveEntitySummary | null = null;
    /**
     * The competition documents for the current competition
     */
    competition_documents: CompetitionDocuments = {
        reference_documents: [],
        action_documents: []
    };

    /**
     * Competition contacts for the competition
     */
    competition_contacts: CompetitionContact[] = [];
    /**
     * Teams managed by the current user registered for the active competition
     */
    competition_managed_teams: ManagedTeam[] = [];
    /**
     * Information for the Competition Information page
     */
    competition_information: CompetitionPortalCompetitionInformation | null = null;

    competition_selectable_entities: CompetitionSelectableEntity[] = [];

    is_team_view: boolean = !!CompetitionPortalAppService.getActiveCompetitionPortalTeamId();

    multiple_competition_views_available: boolean = false;
}

const actions = <ActionTree<State, any>>{
    fetchCoachCompetitionSchedule: function (context): Promise<void> {
        return new Promise((resolve, reject) => {
            CompetitionPortalApiService.fetchCoachCompetitionSchedule()
                .then((response: CompetitionPortalService.FetchCoachCompetitionScheduleServiceResponse) => {
                    context.dispatch('setCompetitionPortalCore', response);
                    const schedule_response = response.competition_schedule;
                    if (schedule_response.schedule) {
                        context.commit('competitions/setCompetitionSchedule', {
                            result: schedule_response.schedule
                        }, {root: true});
                    }
                    context.commit('competitions/setCompetitionScheduleAvailableOverride', schedule_response.schedule_available, {root: true});
                    context.commit('competitions/setCompetitionInformation', {
                        result: response.competition_information
                    }, {root: true});
                    context.commit('coach/setCompetitionSkaterSchedule', response.coached_skater_schedule, {root: true});
                    resolve();
                })
                .catch(() => {
                    reject();
                });
        });
    },
    /**
     * Fetch information for the Competition Portal "Competition Contacts" page
     */
    fetchCompetitionContacts: function (context): Promise<void> {
        return new Promise((resolve, reject) => {
            CompetitionPortalApiService.fetchCompetitionContacts()
                .then((response: CompetitionPortalService.FetchCompetitionContactsServiceResponse) => {
                    context.dispatch('setCompetitionPortalCore', response);
                    context.commit('setCompetitionContacts', response.contacts);
                    resolve();
                })
                .catch(() => {
                    reject();
                });
        });
    },
    /**
     * Fetch information for the Competition Portal Competition Information page
     */
    fetchCompetitionInformation: function (context): Promise<void> {
        return new Promise((resolve, reject) => {
            CompetitionPortalApiService.fetchCompetitionInformation()
                .then((response: CompetitionPortalService.FetchCompetitionInformationServiceResponse) => {
                    context.dispatch('setCompetitionPortalCore', response);
                    context.commit('setCompetitionInformation', response.competition_information);
                    resolve();
                })
                .catch(() => {
                    reject();
                });
        });
    },
    /**
     * Fetch information for the Competition Portal Main page
     */
    fetchCompetitionMain: function (context): Promise<void> {
        return new Promise((resolve, reject) => {
            CompetitionPortalApiService.fetchCompetitionMain()
                .then((response: CompetitionPortalService.FetchCompetitionMainServiceResponse) => {
                    context.commit('competitions/setViewCompetitionCompetition', response.view_competition, {root: true});
                    context.commit('setMultipleViewsAvailable', response.user_manages_competition_eligible_teams);
                    context.dispatch('setCompetitionPortalCore', response);
                    resolve();
                })
                .catch(() => {
                    reject();
                });
        });
    },
    /**
     * Fetch information needed by the Competition Documents page
     */
    fetchCompetitionDocuments: function (context): Promise<void> {
        return new Promise((resolve, reject) => {
            CompetitionPortalApiService.fetchCompetitionDocuments()
                .then((response: CompetitionPortalService.FetchCompetitionDocumentsServiceResponse) => {
                    context.commit('setCompetitionDocuments', response.competition_documents);
                    context.dispatch('setCompetitionPortalCore', response);
                    resolve();
                })
                .catch(() => {
                    reject();
                });
        });
    },
    /**
     * Fetch information for the Competition Entity Select page
     */
    fetchCompetitionEntitySelect: function (context): Promise<void> {
        return new Promise((resolve, reject) => {
            CompetitionPortalApiService.fetchEntitySelect()
                .then((response: CompetitionPortalService.FetchEntitySelectServiceResponse) => {
                    context.commit('setCompetitionSelectableEntities', response.entities);
                    context.dispatch('setCompetitionPortalCore', response);
                    resolve();
                })
                .catch(() => {
                    reject();
                });
        });
    },
    /**
     * Fetch information needed by the Competition Roster page
     */
    fetchCompetitionRoster: function (context): Promise<void> {
        return new Promise((resolve, reject) => {
            context.dispatch('roster/fetch')
                .then(() => {
                    resolve();
                })
                .catch(() => {
                    reject();
                });
        });
    },
    /**
     * Fetch information for the Competition Schedule page
     */
    fetchCompetitionSchedule: function (context): Promise<void> {
        return new Promise((resolve, reject) => {
            CompetitionPortalApiService.fetchCompetitionSchedule()
                .then((response: CompetitionPortalService.FetchCompetitionPortalCompetitionScheduleServiceResponse) => {
                    context.dispatch('setCompetitionPortalCore', response);
                    const schedule_response = response.competition_schedule;
                    if (schedule_response.schedule) {
                        context.commit('competitions/setCompetitionSchedule', {
                            result: schedule_response.schedule
                        }, {root: true});
                    }
                    context.commit('competitions/setCompetitionScheduleAvailableOverride', schedule_response.schedule_available, {root: true});
                    resolve();
                })
                .catch(() => {
                    reject();
                });
        });
    },
    /**
     * Fetch information needed by the Competition Team Personnel page
     */
    fetchCompetitionTeamPersonnel: function (context): Promise<void> {
        return new Promise((resolve, reject) => {
            context.dispatch('team_personnel/fetch')
                .then(() => {
                    resolve();
                })
                .catch(() => {
                    reject();
                });
        });
    },
    /**
     * Fetch information for the Music & PPC page
     */
    fetchMusicAndPpc: function (context): Promise<number> {
        return new Promise((resolve, reject) => {
            CompetitionPortalApiService.fetchMusicAndPpc()
                .then((response: CompetitionPortalService.FetchMusicAndPpcServiceResponse) => {
                    context.dispatch('setCompetitionPortalCore', response);
                    context.commit('competitions/setCompetitionInformation', {
                        result: response.competition_information
                    }, {root: true});
                    context.commit('skater/setActiveSkatingEventSegments', response.entity_event_segments, {root: true});
                    resolve(CompetitionPortalAppService.getActiveCompetitionPortalCompetitionId());
                })
                .catch(() => {
                    reject();
                });
        });
    },
    /**
     * Fetch information needed by the My Coaches page
     */
    fetchMyCoaches: function (context): Promise<void> {
        return new Promise((resolve, reject) => {
            CompetitionPortalApiService.fetchMyCoaches()
                .then((response: CompetitionPortalService.FetchMyCoachesServiceResponse) => {
                    context.dispatch('setCompetitionPortalCore', response);
                    context.commit('skater/setCompetitionEventCoaches', response.event_categories, {root: true});
                    resolve();
                })
                .catch(() => {
                    reject();
                });
        });
    },
    /**
     * Fetch information needed by the My Schedule page
     */
    fetchMySchedule: function (context): Promise<void> {
        return new Promise((resolve, reject) => {
            CompetitionPortalApiService.fetchMyScheduleSkater()
                .then((response: CompetitionPortalService.FetchMyScheduleSkaterServiceResponse) => {
                    context.dispatch('setCompetitionPortalCore', response);
                    if (response.skater_schedule) {
                        context.commit('skater/setActiveSchedule', response.skater_schedule, {root: true});
                    }
                    context.commit('competitions/setCompetitionMyScheduleAvailableOverride', response.schedule_available, {root: true});
                    resolve();
                })
                .catch(() => {
                    reject();
                });
        });
    },
    /**
     * Fetch information needed by the My Schedule (Coach Version) page
     */
    fetchMyScheduleCoach: function (context): Promise<void> {
        return new Promise((resolve, reject) => {
            CompetitionPortalApiService.fetchMyScheduleCoach()
                .then((response: CompetitionPortalService.FetchMyScheduleCoachServiceResponse) => {
                    context.dispatch('setCompetitionPortalCore', response);
                    if (response.coach_schedule) {
                        context.commit('coach/setCompetitionSkaterSchedule', response.coach_schedule, {root: true});
                    }
                    context.commit('competitions/setCompetitionMyScheduleAvailableOverride', response.schedule_available, {root: true});
                    resolve();
                })
                .catch(() => {
                    reject();
                });

        });
    },
    /**
     * Fetch information needed by the My Skaters page
     */
    fetchMySkaters: function (context): Promise<void> {
        return new Promise((resolve, reject) => {
            CompetitionPortalApiService.fetchMySkaters()
                .then((response: CompetitionPortalService.FetchMySkatersServiceResponse) => {
                    context.dispatch('setCompetitionPortalCore', response);
                    context.commit('coach/setCompetitionSkaters', response.coach_skaters, {root: true});
                    resolve();
                })
                .catch(() => {
                    reject();
                });
        });
    },
    /**
     * Fetch information needed by the My Teams page
     */
    fetchMyTeams: function (context): Promise<void> {
        return new Promise((resolve, reject) => {
            CompetitionPortalApiService.fetchMyTeams()
                .then((response: CompetitionPortalService.FetchMyTeamsServiceResponse) => {
                    context.dispatch('setCompetitionPortalCore', response);
                    context.commit('setCompetitionManagedTeams', response.teams);
                    resolve();
                })
                .catch(() => {
                    reject();
                });
        });
    },
    /**
     * Set core competition portal properties from a FetchCompetitionPortalCoreServiceResponse
     */
    setCompetitionPortalCore: function ({commit}, payload: CompetitionPortalService.FetchCompetitionPortalCoreServiceResponse) {
        commit('setActiveCompetitionSummary', payload.competition_summary);
        commit('app/setActivePageBackLink', payload.back_link, {root: true});
        commit('setActiveEntitySummary', payload.entity_summary);
    },
    /**
     * Toggle the completion state on an action competition document
     */
    toggleActionCompetitionDocument: function (context, document: ActionCompetitionDocument): Promise<void> {
        return new Promise((resolve, reject) => {
            CompetitionPortalApiService.updateCompetitionDocumentCompletion(document)
                .then(() => {
                    context.commit('toggleCompetitionDocument', document);
                    resolve();
                })
                .catch((e: string) => {
                    reject(e);
                });
        });
    }
};

const getters = <GetterTree<State, any>>{
    /**
     * The binding for the competition portal heading based on current state
     */
    competition_portal_heading_binding: function (state): CompetitionPortalPageHeadingBinding | null {
        const active_competition_summary = state.active_competition_summary;
        if (active_competition_summary) {
            const binding: CompetitionPortalPageHeadingBinding = {
                competition: active_competition_summary
            };
            if (state.active_entity_summary) {
                binding.entity = state.active_entity_summary;
            }

            return binding;
        }

        return null;
    }
};

const mutations = <MutationTree<State>>{
    /**
     * Set the active competition summary in state
     */
    setActiveCompetitionSummary: function (state, payload: ActiveCompetitionSummary): void {
        state.active_competition_summary = payload;
    },
    /**
     * Set the active entity summary in state
     */
    setActiveEntitySummary: function (state, payload: ActiveEntitySummary | null) {
        state.active_entity_summary = payload;
    },
    /**
     * Set the current competition documents in state
     */
    setCompetitionDocuments: function (state, payload: CompetitionDocuments) {
        state.competition_documents = payload;
    },
    /**
     * Set the competition contacts in state
     */
    setCompetitionContacts: function (state, competition_contacts: CompetitionContact[]) {
        state.competition_contacts = competition_contacts;
    },
    /**
     * Set competition information in state
     */
    setCompetitionInformation: function (state, payload: CompetitionPortalCompetitionInformation): void {
        state.competition_information = payload;
    },
    /**
     * Set the list of user managed teams for the current competition in state
     */
    setCompetitionManagedTeams: function (state, payload: ManagedTeam[]): void {
        state.competition_managed_teams = payload;
    },
    /**
     * Toggle the completion status on a competition document
     */
    toggleCompetitionDocument: function (state, document: ActionCompetitionDocument): void {
        document.is_complete = !document.is_complete;
    },
    /**
     * Set selectable entities for the competition in state
     */
    setCompetitionSelectableEntities: function (state, payload: any): void {
        state.competition_selectable_entities = payload;
    },
    /**
     * Set whether multiple competition main views are available
     */
    setMultipleViewsAvailable: function (state, payload: boolean): void {
        state.multiple_competition_views_available = payload;
    }
};

export const CompetitionPortalState = {
    namespaced: true,
    state: new State(),
    actions: actions,
    getters: getters,
    mutations: mutations
};