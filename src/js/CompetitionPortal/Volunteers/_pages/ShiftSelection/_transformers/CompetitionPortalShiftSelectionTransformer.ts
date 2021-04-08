import {VolunteerShiftSelection, VolunteerShiftSelectionData} from '../_contracts';
import {VolunteerShiftSelectionLocation, VolunteerShiftSelectionShift} from '../_models';
import {FormOption} from '../../../../../contracts/AppContracts';
import {CompetitionPortalVolunteerApiTransformer} from '../../../_transformers/CompetitionPortalVolunteerApiTransformer';
import {CompetitionPortalVolunteer, CompetitionPortalVolunteerApi} from '../../../_contracts';
import {VOLUNTEER_SHIFT_SELECTION} from './_constants';
import SelectedShiftKey = VolunteerShiftSelection.SelectedShiftKey;

type ShiftsTransformation = {
    shifts: VolunteerShiftSelectionShift[];
    date_filters: FormOption[];
    conflict_windows: VolunteerShiftSelection.ConflictWindow[];
};

type FetchShiftSelectionTransformation = {
    conflict_windows: VolunteerShiftSelection.ConflictWindow[];
    selected_filters: VolunteerShiftSelection.ShiftSelectionSelectedFilters;
    available_filters: VolunteerShiftSelection.ShiftSelectionAvailableFilters;
    shifts: VolunteerShiftSelectionShift[];
    links: CompetitionPortalVolunteer.ShiftSelectionLinks;
    locations: VolunteerShiftSelectionLocation[];
    user_is_compliant: boolean;
    selection_open: boolean;
};

export class CompetitionPortalShiftSelectionTransformer {
    /**
     * Transform the API response when fetching shift selection page data
     */
    static transformFetchVolunteerShiftSelection(response: CompetitionPortalVolunteerApi.FetchShiftSelectionApiResponse): FetchShiftSelectionTransformation {
        const shifts_data = response.schedule ? response.schedule.shifts : [];
        const shift_result: ShiftsTransformation = CompetitionPortalShiftSelectionTransformer.transformShiftsProperties(shifts_data, this.transformSelectedKey(response.selected_shifts));

        return {
            ...this.transformFilters(shift_result.date_filters),
            conflict_windows: shift_result.conflict_windows,
            links: {
                ...response.links
            },
            locations: response.schedule ? response.schedule.locations.map((location_data) => {
                return CompetitionPortalShiftSelectionTransformer.transformLocation(location_data);
            }) : [],
            shifts: shift_result.shifts,
            user_is_compliant: response.user_is_compliant,
            selection_open: response.selection_open
        };
    }

    /**
     * Transform all the dependent properties based on the shift loop
     *
     * 1. Date Filters
     * 1. Conflict Windows
     * 1. Shifts List
     */
    static transformShiftsProperties(shifts_data: VolunteerShiftSelectionData.Shift[], selected_shift_key: VolunteerShiftSelection.SelectedShiftKey): ShiftsTransformation {
        const shifts: VolunteerShiftSelectionShift[] = [];
        const date_filters: FormOption[] = [];
        const unique_dates: number[] = [];
        const conflict_windows: VolunteerShiftSelection.ConflictWindow[] = [];
        for (let i = 0; i < shifts_data.length; i++) {
            const shift_datum = shifts_data[i];
            if (unique_dates.indexOf(shift_datum.date_ts) === -1) {
                unique_dates.push(shift_datum.date_ts);
                date_filters.push({
                    label: shift_datum.date_formatted,
                    value: shift_datum.date_ts
                });
            }
            if (Object.prototype.hasOwnProperty.call(selected_shift_key, shift_datum.id) && selected_shift_key[shift_datum.id] !== 'denied') {
                conflict_windows.push({
                    start_ts: shift_datum.start_datetime_ts,
                    end_ts: shift_datum.end_datetime_ts,
                    shift_id: shift_datum.id
                });
            }
            shifts.push(CompetitionPortalShiftSelectionTransformer.transformShift(shift_datum, selected_shift_key));
        }

        return {
            shifts: shifts,
            date_filters,
            conflict_windows: conflict_windows
        };
    }

    /**
     * Transform a shift selection location
     */
    static transformLocation(location_data: VolunteerShiftSelectionData.Location): VolunteerShiftSelectionLocation {
        return new VolunteerShiftSelectionLocation({
            name: location_data.name,
            id: location_data.id
        });
    }

    /**
     * Transform the key indicating shift selections and their statuses
     */
    private static transformSelectedKey(data?: VolunteerShiftSelectionData.SelectedShiftStatus[]): VolunteerShiftSelection.SelectedShiftKey {
        return data ? data.reduce((carry: VolunteerShiftSelection.SelectedShiftKey, shift: VolunteerShiftSelectionData.SelectedShiftStatus) => {
            carry[shift.shift_id] = VolunteerShiftSelection.ShiftStatus[shift.status];

            return carry;
        }, {}) : {};
    }

    /**
     * Transform a shift
     */
    private static transformShift(shift_data: VolunteerShiftSelectionData.Shift, selected_shift_key: SelectedShiftKey): VolunteerShiftSelectionShift {
        return new VolunteerShiftSelectionShift({
            ...CompetitionPortalVolunteerApiTransformer.transformShiftParams(shift_data),
            date_ts: shift_data.date_ts,
            date_formatted: shift_data.date_formatted,
            location_id: shift_data.location_id,
            start_datetime_ts: shift_data.start_datetime_ts,
            end_datetime_ts: shift_data.end_datetime_ts,
            openings_status: shift_data.openings_status || 'default',
            status: Object.prototype.hasOwnProperty.call(selected_shift_key, shift_data.id) ? selected_shift_key[shift_data.id] : VolunteerShiftSelection.ShiftStatus.new
        });
    }

    /**
     * Transform the filters for the page
     */
    private static transformFilters(date_filters: FormOption[]): { available_filters: VolunteerShiftSelection.ShiftSelectionAvailableFilters; selected_filters: VolunteerShiftSelection.ShiftSelectionSelectedFilters; } {
        const filter_options = {
            dates: date_filters,
            statuses: VOLUNTEER_SHIFT_SELECTION.filters.statuses,
            compliance_requirements: VOLUNTEER_SHIFT_SELECTION.filters.compliance_requirements
        };

        const date = new Date();
        const current_date_timestamp = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 0, 0, 0);

        const now_and_future_date_filters = date_filters.filter((date_filer: FormOption) => {
            const date_ts_ms = date_filer.value * 1000;

            return date_ts_ms >= current_date_timestamp;
        });

        return {
            available_filters: {
                dates: {
                    required: true,
                    options: filter_options.dates
                },
                statuses: {
                    required: true,
                    options: filter_options.statuses
                },
                compliance_requirements: {
                    required: true,
                    options: filter_options.compliance_requirements
                }
            },
            selected_filters: {
                ...filter_options,
                dates: now_and_future_date_filters.length ? now_and_future_date_filters : date_filters
            }
        };
    }
}