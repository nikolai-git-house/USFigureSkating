import {VolunteerShiftSelection} from '../_contracts';
import {StringHelpers} from '../../../../../helpers/StringHelpers';
import {FormOptionValue} from '../../../../../contracts/AppContracts';

export class ShiftSelectionFilterService {

    /**
     * Whether a shift passes an active filter sets
     */
    static shiftPassesFilters(shift: VolunteerShiftSelection.FilterableShift, filters: VolunteerShiftSelection.CompiledFilters, conflict_shift_ids: string[]): boolean {
        if (filters.free && !this.shiftPassesFreeFilter(shift, filters.free)) {
            return false;
        }
        if (filters.dates && !this.shiftPassesDateFilter(shift, filters.dates)) {
            return false;
        }

        if (filters.compliance_requirements && !this.shiftPassesComplianceFilter(shift, filters.compliance_requirements)) {
            return false;
        }

        if (filters.statuses && !this.shiftPassesStatusFilter(shift, filters.statuses, conflict_shift_ids)) {
            return false;
        }

        return true;
    }

    /**
     * Whether a shift passes the free text filter
     */
    private static shiftPassesFreeFilter(shift: VolunteerShiftSelection.FilterableShift, free_filter: string): boolean {
        return !!shift.position_title.toLowerCase()
            .match(StringHelpers.escapeRegex(free_filter.toLowerCase()));
    }

    /**
     * Whether a shift passes the date filters
     */
    private static shiftPassesDateFilter(shift: VolunteerShiftSelection.FilterableShift, dates: FormOptionValue[]) {
        return dates.indexOf(shift.date_ts) !== -1;
    }

    /**
     * Whether a shift passes the date filters
     */
    private static shiftPassesComplianceFilter(shift: VolunteerShiftSelection.FilterableShift, compliance_requirements: boolean[]) {
        return compliance_requirements.indexOf(shift.requires_compliance) !== -1;
    }

    /**
     * Whether a shift passes the status filters
     */
    private static shiftPassesStatusFilter(shift: VolunteerShiftSelection.FilterableShift, statuses: VolunteerShiftSelection.FilterOptionStatusValue[], conflict_shift_ids: string[]) {
        let status: VolunteerShiftSelection.ShiftStatus = shift.status;
        if (conflict_shift_ids.indexOf(shift.id) !== -1) {
            status = VolunteerShiftSelection.ShiftStatus.conflict;
        }

        return statuses.indexOf(status) !== -1;
    }
}