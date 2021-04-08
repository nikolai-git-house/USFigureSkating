import {ActionTree, GetterTree, MutationTree} from 'vuex';
import {SeriesRegistrationAPIService} from '../_services/SeriesRegistrationAPIService';
import {SeriesRegistration, SeriesRegistrationIndexSeries} from '../_contracts/SeriesRegistrationContracts';
import {
    FetchSeriesRegistrationSeriesListServiceResponse,
    FetchSeriesTeamSelectServiceResponse
} from '../_contracts/SeriesRegistrationServiceContracts';
import {SeriesApplicationState} from '../SeriesApplication/_store/SeriesApplicationState';
import {SeriesOverview, SeriesOverviewService} from '../SeriesOverview/_contracts';
import {SeriesManagedTeam} from '../_models';

export class State {
    series_list: SeriesRegistrationIndexSeries[] = [];
    overview_series: SeriesOverview.Series | null = null;
    series_summary: SeriesRegistration.SubpageSeriesSummary | null = null;
    selectable_teams: SeriesManagedTeam[] = [];
}

const actions = <ActionTree<State, any>>{
    /**
     * Fetch the series index list
     */
    fetchSeriesList: function (context): Promise<void> {
        return new Promise((resolve, reject) => {
            SeriesRegistrationAPIService.fetchSeriesList()
                .then((result: FetchSeriesRegistrationSeriesListServiceResponse) => {
                    context.commit('setSeriesList', result.series);
                    resolve();
                })
                .catch(() => {
                    reject();
                });
        });
    },
    /**
     * Fetch the series overview series
     */
    fetchSeriesOverview: function (context): Promise<void> {
        return new Promise((resolve, reject) => {
            SeriesRegistrationAPIService.fetchSeriesOverview()
                .then((result: SeriesOverviewService.FetchSeriesOverviewServiceResponse) => {
                    context.commit('setSeriesOverview', result.series);
                    if (result.user_application) {
                        context.commit('application/setUserApplication', result.user_application);
                    }
                    if (result.applied_teams) {
                        context.commit('application/setAppliedTeams', result.applied_teams);
                    }
                    resolve();
                })
                .catch(() => {
                    reject();
                });
        });
    },
    /**
     * Fetch the series overview series
     */
    fetchSeriesTeamSelect: function (context): Promise<void> {
        return new Promise((resolve, reject) => {
            SeriesRegistrationAPIService.fetchSeriesTeamSelect()
                .then((result: FetchSeriesTeamSelectServiceResponse) => {
                    context.commit('setSeriesSummary', result.series);
                    context.commit('setSelectableTeams', result.teams);
                    resolve();
                })
                .catch(() => {
                    reject();
                });
        });
    }
};

const getters = <GetterTree<State, any>>{
    /**
     * Get a discipline resource document from a discipline id
     */
    overview_discipline_document: function (state): (discipline_id: number) => SeriesOverview.SeriesDisciplineResourceDocument | null {
        return function (discipline_id: number): SeriesOverview.SeriesDisciplineResourceDocument | null {
            if (state.overview_series) {
                for (let i = 0; i < state.overview_series.resource_documents.length; i++) {
                    const document = state.overview_series.resource_documents[i];
                    if (document.discipline_id === discipline_id) {
                        return document;
                    }
                }
            }

            return null;
        };
    }
};

const mutations = <MutationTree<State>>{
    /**
     * Set the selectable teams in state
     */
    setSelectableTeams: function (state, payload: SeriesManagedTeam[]) {
        state.selectable_teams = payload;
    },
    /**
     * Set the series list in state
     */
    setSeriesList: function (state, payload: SeriesRegistrationIndexSeries[]) {
        state.series_list = payload;
    },
    /**
     * Set the overview series in state
     */
    setSeriesOverview: function (state, payload: SeriesOverview.Series) {
        state.overview_series = payload;
    },
    /**
     * Set series summary in state
     */
    setSeriesSummary: function (state, payload: SeriesRegistration.SubpageSeriesSummary) {
        state.series_summary = payload;
    }
};

export const SeriesRegistrationState = {
    namespaced: true,
    state: new State(),
    actions: actions,
    getters: getters,
    mutations: mutations,
    modules: {
        'application': SeriesApplicationState
    }
};