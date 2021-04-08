import {ActionTree, GetterTree, MutationTree} from 'vuex';
import {VolunteerShiftSelectionLocation, VolunteerShiftSelectionShift} from '../_models';
import {VolunteerShiftSelection} from '../_contracts';
import {ShiftSelectionFilterService} from '../_services/ShiftSelectionFilterService';
import {CompetitionPortalVolunteerApiService} from '../../../_services/CompetitionPortalVolunteerApiService';
import {CompetitionPortalVolunteer, CompetitionPortalVolunteerService} from '../../../_contracts';

export class State {
    /**
     * List of windows with conflicting selections in chronological order by window open timestamp
     */
    conflict_windows: VolunteerShiftSelection.ConflictWindow[] = [];

    /**
     * The available filters for the schedule
     */
    filters_available: VolunteerShiftSelection.ShiftSelectionAvailableFilters = {
        dates: {
            required: true,
            options: []
        },
        statuses: {
            required: true,
            options: []
        },
        compliance_requirements: {
            required: true,
            options: []
        }
    };

    /**
     * The selected filters for the schedule
     */
    filters_selected: VolunteerShiftSelection.ShiftSelectionSelectedFilters = {
        dates: [],
        statuses: [],
        compliance_requirements: []
    };

    /**
     * The current free text filter
     */
    free_filter: string | null = null;

    /**
     * Links relevant to shift selection
     */
    links: CompetitionPortalVolunteer.ShiftSelectionLinks = {
        download_schedule: '',
        user_compliance: ''
    };

    /**
     * Locations present in the schedule
     */
    locations: VolunteerShiftSelectionLocation[] = [];

    /**
     * Master collection of shifts present in the schedule in chronological order by start timestamp
     */
    shifts: VolunteerShiftSelectionShift[] = [];

    /**
     * The result from the most recent shift selection
     */
    staged_selection: VolunteerShiftSelection.PendingShiftSelection | null = null;

    /**
     * Whether selection is open
     */
    selection_open: boolean = false;
}

const actions = <ActionTree<State, any>>{
    /**
     * Complete the removal of a shift
     */
    completeShiftRemoval: function (context, payload: VolunteerShiftSelection.PendingShiftRemoval) {
        const {shift, response} = payload;

        shift.updatePostInteraction({
            open_positions: response.open_positions,
            openings_status: response.openings_status,
            shift_status: VolunteerShiftSelection.ShiftStatus.new
        });

        const conflict_windows = context.state.conflict_windows.slice();
        for (let i = 0; i < conflict_windows.length; i++) {
            const conflictWindow = conflict_windows[i];
            if (conflictWindow.shift_id === shift.id) {
                conflict_windows.splice(i, 1);
                break;
            }
        }
        context.commit('setConflictWindows', conflict_windows);
    },
    /**
     * Complete the selection of a shift
     */
    completeShiftSelection: function (context, payload: VolunteerShiftSelection.PendingShiftSelection) {
        const {shift, selection_result} = payload;

        shift.updatePostInteraction({
            open_positions: selection_result.open_positions,
            openings_status: selection_result.openings_status,
            shift_status: selection_result.shift_status
        });

        const conflict_windows = context.state.conflict_windows.slice();
        conflict_windows.push({
            start_ts: shift.start_datetime_ts,
            end_ts: shift.end_datetime_ts,
            shift_id: shift.id
        });
        context.commit('setConflictWindows', conflict_windows);
    },
    /**
     * Fetch information for the shift selection page
     */
    fetch: function (context): Promise<void> {
        return new Promise((resolve, reject) => {
            CompetitionPortalVolunteerApiService.fetchShiftSelection()
                .then((response: CompetitionPortalVolunteerService.FetchShiftSelectionServiceResponse) => {
                    context.dispatch('competition_portal/setCompetitionPortalCore', response, {root: true});
                    context.commit('setLinks', response.links);
                    context.commit('setShifts', response.shifts);
                    context.commit('setLocations', response.locations);
                    context.commit('setFiltersSelected', response.selected_filters);
                    context.commit('setFiltersAvailable', response.available_filters);
                    context.commit('setConflictWindows', response.conflict_windows);
                    context.commit('setSelectionOpen', response.selection_open);
                    context.commit('competition_portal/volunteer/setUserIsCompliant', response.user_is_compliant, {root: true});
                    resolve();
                })
                .catch(() => {
                    reject();
                });
        });
    },
    /**
     * Remove a shift
     */
    removeShift: function (context, shift: VolunteerShiftSelectionShift): Promise<void> {
        return new Promise((resolve, reject) => {
            CompetitionPortalVolunteerApiService.removeShift(shift)
                .then((response: CompetitionPortalVolunteerService.RemoveVolunteerShiftServiceResponse) => {
                    const payload: VolunteerShiftSelection.PendingShiftRemoval = {
                        shift,
                        response
                    };
                    context.dispatch('completeShiftRemoval', payload);
                    resolve();
                })
                .catch((error: string) => {
                    reject(error);
                });
        });
    },
    /**
     * Resolve a staged selection in the UI
     */
    resolveStagedSelection: function (context) {
        const staged_selection = context.state.staged_selection;
        if (staged_selection) {
            context.dispatch('completeShiftSelection', staged_selection);
        }
        context.commit('stageSelection', null);
    },
    /**
     * Select a shift
     */
    selectShift: function (context, shift: VolunteerShiftSelectionShift): Promise<void> {
        return new Promise((resolve, reject) => {
            CompetitionPortalVolunteerApiService.selectShift(shift)
                .then((result: CompetitionPortalVolunteerService.SelectVolunteerShiftServiceResponse) => {
                    const payload: VolunteerShiftSelection.PendingShiftSelection = {
                        selection_result: result,
                        shift
                    };
                    context.commit('stageSelection', payload);
                    resolve();
                })
                .catch((error_message: string) => {
                    reject(error_message);
                });
        });
    }
};

const getters = <GetterTree<State, any>>{
    /**
     * The amount of filter groups with filters active
     *
     * If a filter group has an option selected other than all, increment count
     */
    filters_active_count: function (state): number {
        let count = 0;
        for (const filter in state.filters_available) {
            if (Object.prototype.hasOwnProperty.call(state.filters_available, filter)) {
                const filter_option_count = state.filters_available[filter].options.length;
                if (state.filters_selected[filter].length !== filter_option_count) {
                    count++;
                }
            }
        }

        return count;
    },
    /**
     * The compiled full set of active filters (free filter and selectable option filters)
     *
     * Filter set as null if all options selected within a group
     */
    filters_compiled: function (state): VolunteerShiftSelection.CompiledFilters {
        return {
            free: state.free_filter,
            dates: state.filters_available.dates.options.length === state.filters_selected.dates.length ?
                null :
                state.filters_selected.dates.map((date_option) => {
                    return date_option.value;
                }),
            compliance_requirements: state.filters_available.compliance_requirements.options.length === state.filters_selected.compliance_requirements.length ?
                null :
                state.filters_selected.compliance_requirements.map((compliance_requirement_option) => {
                    return compliance_requirement_option.value;
                }),
            statuses: state.filters_available.statuses.options.length === state.filters_selected.statuses.length ?
                null :
                state.filters_selected.statuses.map((shift_option) => {
                    return shift_option.value;
                })
        };
    },
    /**
     * Whether a shift has a conflict
     */
    shift_has_conflict: function (state, getters): (shift: VolunteerShiftSelectionShift) => boolean {
        return function (shift: VolunteerShiftSelectionShift): boolean {
            return getters.shift_ids_conflict.indexOf(shift.id) !== -1;
        };
    },
    /**
     * The list of shift IDs that have a conflict
     */
    shift_ids_conflict: function (state): string[] {
        const shifts = state.shifts;
        const conflict_windows = state.conflict_windows;
        const result: string[] = [];
        if (conflict_windows.length === 0) {
            return [];
        }
        for (let i = 0; i < shifts.length; i++) {
            const shift = shifts[i];
            /**
             * If the shift starts after the last conflict window ends, it (and all later shifts) cannot land within any conflict windows
             */
            if (shift.start_datetime_ts > conflict_windows[conflict_windows.length - 1].end_ts) {
                break;
            }
            if (shift.can_conflict) {
                /**
                 * Iterate through conflict windows in reverse-chronological order
                 */
                for (let i = conflict_windows.length - 1; i >= 0; i--) {
                    const conflictWindow = conflict_windows[i];
                    /**
                     * If we get to a conflict window that ends before the shift starts, this window and all earlier
                     * cannot be in conflict
                     */
                    if (shift.start_datetime_ts > conflictWindow.end_ts) {
                        break;
                    }
                    /**
                     * If the shift lands within the conflict window, add it to the list
                     */
                    if (shift.end_datetime_ts > conflictWindow.start_ts && shift.start_datetime_ts < conflictWindow.end_ts) {
                        result.push(shift.id);
                    }
                }
            }
        }

        return result;
    },
    /**
     * Shifts that pass filters, indexed by location ID
     */
    location_indexed_shifts_filtered: function (state, getters): VolunteerShiftSelection.LocationIndexedShifts {
        return state.shifts.reduce((carry: VolunteerShiftSelection.LocationIndexedShifts, shift) => {
            if (ShiftSelectionFilterService.shiftPassesFilters(shift, getters.filters_compiled, getters.shift_ids_conflict)) {
                if (!Object.prototype.hasOwnProperty.call(carry, shift.location_id)) {
                    carry[shift.location_id] = [];
                }
                carry[shift.location_id].push(shift);
            }

            return carry;
        }, {});
    },
    /**
     * The total count of shifts that pass the current filter set
     */
    shifts_filtered_count: function (state, getters): number {
        let count = 0;
        const location_indexed_shifts_filtered: VolunteerShiftSelection.LocationIndexedShifts = getters.location_indexed_shifts_filtered;
        for (const i in location_indexed_shifts_filtered) {
            if (Object.prototype.hasOwnProperty.call(location_indexed_shifts_filtered, i)) {
                count += location_indexed_shifts_filtered[i].length;
            }
        }

        return count;
    },
    /**
     * The shifts to display based on state for a given location
     */
    shifts_location_display: function (state, getters): (location_id: string) => VolunteerShiftSelectionShift[] {
        return function (location_id: string) {
            const location_indexed_shifts_filtered: VolunteerShiftSelection.LocationIndexedShifts = getters.location_indexed_shifts_filtered;
            if (Object.prototype.hasOwnProperty.call(location_indexed_shifts_filtered, location_id)) {
                return location_indexed_shifts_filtered[location_id];
            }

            return [];
        };
    }
};

const mutations = <MutationTree<State>>{
    /**
     * Set conflict windows in state
     */
    setConflictWindows: function (state, payload: VolunteerShiftSelection.ConflictWindow[]) {
        state.conflict_windows = payload.sort((a, b) => {
            return a.start_ts - b.start_ts;
        });
    },
    /**
     * Set the free filter in states
     */
    setFreeFilter: function (state, payload: string | null) {
        state.free_filter = payload;
    },
    /**
     * Set the available filters in state
     */
    setFiltersAvailable: function (state, payload: VolunteerShiftSelection.ShiftSelectionAvailableFilters) {
        state.filters_available = payload;
    },
    /**
     * Set the selected filters in state
     */
    setFiltersSelected: function (state, payload: VolunteerShiftSelection.ShiftSelectionSelectedFilters) {
        state.filters_selected = payload;
    },
    /**
     * Set shift selection links in state
     */
    setLinks: function (state, payload: CompetitionPortalVolunteer.ShiftSelectionLinks) {
        state.links = payload;
    },
    /**
     * Set the list of locations in state
     */
    setLocations: function (state, payload: VolunteerShiftSelectionLocation[]) {
        state.locations = payload;
    },
    /**
     * Set whether selection is open in state
     */
    setSelectionOpen: function (state, payload: boolean) {
        state.selection_open = payload;
    },
    /**
     * Set the master shift list in state
     */
    setShifts: function (state, payload: VolunteerShiftSelectionShift[]) {
        state.shifts = payload.sort((a, b) => {
            return a.start_datetime_ts - b.start_datetime_ts;
        });
    },
    /**
     * Stage a shift selection result
     */
    stageSelection: function (state, payload: VolunteerShiftSelection.PendingShiftSelection) {
        state.staged_selection = payload;
    }
};

export const VolunteerShiftSelectionState = {
    namespaced: true,
    state: new State(),
    actions: actions,
    getters: getters,
    mutations: mutations
};