import {ActionTree, GetterTree, MutationTree} from 'vuex';
import {CompetitionManagementIndexCompetition} from '../_contracts/CompetitionManagementContracts';
import {
    CompetitionManagementFetchCompetitionListResult,
    FetchActiveCompetitionManagementCompetitionInformationResponse,
    FetchActiveCompetitionManagementCompetitionResponse
} from '../_contracts/CompetitionManagementServiceContracts';
import {CompetitionManagementCompetition} from '../_models/CompetitionManagementCompetition';
import {CompetitionManagementCompetitionInformation} from '../_models/CompetitionManagementCompetitionInformation';
import {CompetitionManagementService} from '../_services/CompetitionManagementService';
import CompetitionManagementComplianceService
    from '../CompetitionManagementCompliance/_services/CompetitionManagementComplianceService';
import CompetitionManagementContactsService
    from '../CompetitionManagementContacts/_services/CompetitionManagementContactsService';

type CompetitionManagementIndexCompetitionLists = {
    past: CompetitionManagementIndexCompetition[];
    upcoming: CompetitionManagementIndexCompetition[];
};

export class State {
    /**
     * Active competition in state
     */
    active_competition: CompetitionManagementCompetition | null = null;
    /**
     * Active competition information in state
     */
    active_competition_information: CompetitionManagementCompetitionInformation | null = null;
    /**
     * Past competition list for index
     */
    past_competitions: CompetitionManagementIndexCompetition[] = [];
    /**
     * Upcoming competition list for index
     */
    upcoming_competitions: CompetitionManagementIndexCompetition[] = [];
}

const actions = <ActionTree<State, any>>{
    /**
     * Fetch the active management competition
     */
    fetchActiveCompetition: function (context): Promise<void> {
        return new Promise((resolve, reject) => {
            /**
             * If competition has already been fetched, do nothing
             */
            if (context.state.active_competition) {
                resolve();

                return;
            }
            CompetitionManagementService.fetchActiveCompetition()
                .then((response: FetchActiveCompetitionManagementCompetitionResponse) => {
                    context.commit('setActiveCompetition', response);
                    CompetitionManagementContactsService.active_competition = response;
                    CompetitionManagementComplianceService.active_competition = response;
                    resolve();
                })
                .catch(() => {
                    reject();
                });
        });
    },
    /**
     * Fetch the active competition information
     */
    fetchActiveCompetitionInformation: function (context): Promise<void> {
        const activeCompetition = context.state.active_competition;
        if (!activeCompetition) {
            throw 'No active competition';
        }

        return new Promise((resolve, reject) => {
            /**
             * If information has already been fetched, do nothing
             */
            if (context.state.active_competition_information) {
                resolve();

                return;
            }
            CompetitionManagementService.fetchCompetitionInformation(activeCompetition)
                .then((response: FetchActiveCompetitionManagementCompetitionInformationResponse) => {
                    context.commit('setActiveCompetitionInformation', response);
                    resolve();
                })
                .catch(() => {
                    reject();
                });
        });
    },
    /**
     * Fetch upcoming and past competitions lists for management
     */
    fetchCompetitionLists: function (context): Promise<void> {
        return new Promise((resolve, reject) => {
            CompetitionManagementService.fetchCompetitionLists()
                .then((result: CompetitionManagementFetchCompetitionListResult) => {
                    context.commit('setIndexList', result);
                    resolve();
                })
                .catch(() => {
                    reject();
                });
        });
    }
};

const getters = <GetterTree<State, any>>{};

const mutations = <MutationTree<State>>{
    /**
     * Set the active competition in state
     */
    setActiveCompetition: function (state, competition: CompetitionManagementCompetition) {
        state.active_competition = competition;
    },
    /**
     * Set the active competition information in state
     */
    setActiveCompetitionInformation: function (state, competition_information: CompetitionManagementCompetitionInformation) {
        state.active_competition_information = competition_information;
    },
    /**
     * Set competitions for index list
     */
    setIndexList: function (state, index_list: CompetitionManagementIndexCompetitionLists) {
        state.upcoming_competitions = index_list.upcoming;
        state.past_competitions = index_list.past;
    }
};

export const CompetitionManagementState = {
    namespaced: true,
    state: new State(),
    actions: actions,
    getters: getters,
    mutations: mutations,
    modules: {}
};