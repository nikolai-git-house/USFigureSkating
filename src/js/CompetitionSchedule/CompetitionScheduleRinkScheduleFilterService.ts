import {SessionTypeKey} from '../contracts/AppContracts';
import {SessionCollection} from '../models/Collections/SessionCollection';
import {RinkSchedule} from '../models/RinkSchedule/RinkSchedule';
import {
    CompetitionScheduleFilterActiveFilters,
    CompetitionScheduleFilterViewFilter
} from './_contracts/CompetitionScheduleContracts';

export class CompetitionScheduleRinkScheduleFilterService {

    /**
     * Return a SessionCollection from a rink schedule and filters
     */
    static filterRinkScheduleSessions(rink_schedule: RinkSchedule, filters: CompetitionScheduleFilterActiveFilters): SessionCollection {
        return rink_schedule.session_collection
            .filterDate(filters.date.value)
            .filterType(this.transformFiltersToSessionTypeKeys(filters));
    }

    /**
     * Transform CompetitionScheduleFilterActiveFilters into an array of SessionTypeKey items for use by the SessionCollection.filterType method
     */
    private static transformFiltersToSessionTypeKeys(filters: CompetitionScheduleFilterActiveFilters): SessionTypeKey[] {
        const filter_session_type_map: { [key: string]: SessionTypeKey[]; } = {
            practice_ice: ['practice_ice', 'warm_up'],
            event: ['event'],
            other: ['resurface']
        };

        return filters.views.reduce((carry: SessionTypeKey[], item: CompetitionScheduleFilterViewFilter) => {
            if (Object.prototype.hasOwnProperty.call(filter_session_type_map, item.value)) {
                carry = carry.concat(filter_session_type_map[item.value]);
            }

            return carry;
        }, []);
    }
}