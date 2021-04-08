import {ActionTree, GetterTree, MutationTree} from 'vuex';
import {SeriesStandingsApiService} from '../_services/SeriesStandingsApiService';
import {SeriesStandings, SeriesStandingsService} from '../_contracts';
import {StandingsFilterService} from '../_services/StandingsFilterService';

export class State {
    /**
     * The available set of global filters
     */
    available_global_filters: SeriesStandings.StandingsGlobalFilterSet = {
        sections: [],
        disciplines: [],
        levels: []
    };

    /**
     * The active set of global filters
     */
    active_global_filters: SeriesStandings.StandingsGlobalFilterSet = {
        sections: [],
        disciplines: [],
        levels: []
    };

    /**
     * The active granular filter
     */
    active_granular_filter: SeriesStandings.StandingsGranularFilter = {
        term: [null, null],
        field: null
    };

    /**
     * The active series
     */
    series: SeriesStandings.Series | null = null;

    /**
     * The active standing
     */
    standings: SeriesStandings.Standings | null = null;
}

const actions = <ActionTree<State, any>>{
    /**
     * Fetch series standings data
     */
    fetchSeriesStandings: function ({commit}): Promise<void> {
        return new Promise((resolve, reject) => {
            SeriesStandingsApiService.fetchSeriesStandings()
                .then((response: SeriesStandingsService.FetchSeriesStandingsServiceResponse) => {
                    commit('setSeries', response.series);
                    commit('setStandings', response.standings);
                    commit('setAvailableGlobalFilters', response.filters);
                    commit('setActiveGlobalFilters', response.filters);
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
     * List of standings events to display on standings page
     *
     * Events and standings filtered through active filters
     */
    display_events: function (state): SeriesStandings.StandingsEvent[] {
        if (!state.standings) {
            return [];
        }
        const filter = new StandingsFilterService(state.available_global_filters, state.active_global_filters, state.active_granular_filter);

        return filter.filter(state.standings.events);
    },
    /**
     * Formatted string indicating when standings were last updated
     */
    standings_last_updated: function (state): string | null {
        return state.standings ? state.standings.meta.last_updated_datetime_formatted : null;
    }
};

const mutations = <MutationTree<State>>{
    /**
     * Set active global filters
     */
    setActiveGlobalFilters: function (state, payload: SeriesStandings.StandingsGlobalFilterSet) {
        state.active_global_filters = {...payload};
    },
    /**
     * Set the available global filters in state
     */
    setAvailableGlobalFilters: function (state, payload: SeriesStandings.StandingsGlobalFilterSet) {
        state.available_global_filters = {...payload};
    },
    /**
     * Set the series in state
     */
    setSeries: function (state, payload: SeriesStandings.Series) {
        state.series = payload;
    },
    /**
     * Set standings in state
     */
    setStandings: function (state, payload: SeriesStandings.Standings) {
        state.standings = payload;
    },
    /**
     * Update the granular filter
     */
    updateGranularFilter: function (state, payload: SeriesStandings.StandingsGranularFilter) {
        state.active_granular_filter = {...payload};
    }
};

export const SeriesStandingsState = {
    namespaced: true,
    state: new State(),
    actions: actions,
    getters: getters,
    mutations: mutations
};