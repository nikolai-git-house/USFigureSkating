import {ActionTree, GetterTree, MutationTree} from 'vuex';
import {CompetitionPortalApiService} from '../_services';
import {CompetitionPortalService} from '../_contracts';
import {NullableSalesWindowKey} from '../../contracts/AppContracts';

export class State {
    active_sales_window: NullableSalesWindowKey | null = null;
}

const actions = <ActionTree<State, any>>{
    /**
     * Fetch practice ice data for the current context
     */
    fetch: function (context): Promise<void> {
        return new Promise((resolve, reject) => {
            CompetitionPortalApiService.fetchPracticeIceSchedule()
                .then((response: CompetitionPortalService.FetchPracticeIceScheduleServiceResponse) => {
                    context.dispatch('competition_portal/setCompetitionPortalCore', response, {root: true});
                    context.commit('competitions/setCompetitionSchedule', {result: response.competition_schedule}, {root: true});
                    context.commit('setActiveSalesWindow', response.active_sales_window);
                    context.commit('skater/setCompetitionCredits', response.entity_credits, {root: true});
                    context.commit('skater/setActiveSchedule', response.skater_schedule_args, {root: true});
                    context.commit('cart/loadCart', response.cart, {root: true});
                    context.commit('skater/setSkaterCart', response.cart, {root: true});
                    context.commit('competitions/setCompetitionInformation', {
                        result: response.competition_information
                    }, {root: true});
                    resolve();
                })
                .catch(() => {
                    reject();
                });
        });
    },
    /**
     * Fetch information for the Practice Ice PrePurchase page
     */
    fetchPrePurchase: function (context): Promise<void> {
        return new Promise((resolve, reject) => {
            CompetitionPortalApiService.fetchPracticeIcePrePurchase()
                .then((response: CompetitionPortalService.FetchPracticeIcePrePurchaseServiceResponse) => {
                    context.dispatch('competition_portal/setCompetitionPortalCore', response, {root: true});
                    context.commit('competitions/setCompetitionInformation', {
                        result: response.competition_information
                    }, {root: true});
                    context.commit('skater/setCompetitionCredits', response.entity_credits, {root: true});
                    context.commit('cart/loadCart', response.cart, {root: true});
                    context.commit('competitions/setCompetitionSchedule', {
                        result: response.competition_schedule
                    }, {root: true});
                    context.commit('skater/setActiveSchedule', response.entity_schedule, {root: true});
                    context.commit('setActiveSalesWindow', response.active_sales_window);
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
     * Set the active standalone sales window in state
     */
    setActiveSalesWindow: function (state, payload: NullableSalesWindowKey) {
        state.active_sales_window = payload;
    }
};

export const CompetitionPortalPracticeIceState = {
    namespaced: true,
    state: new State(),
    actions: actions,
    getters: getters,
    mutations: mutations
};