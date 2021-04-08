import {PracticeIceConfig} from "../../config/AppConfig";
import {DateFilterContract} from "../../contracts/RinkScheduleFiltersContracts";

/**
 * Filters for any set of dates
 */
export class ScheduleFilters {
    date_filters: DateFilterContract[] = [];
    view_filters = [
        {
            value: 'available_practice_ice',
            label: 'Available Practice Ice'
        },
        {
            value: 'my_schedule',
            label: 'My Schedule'
        },
        {
            value: 'event_schedule',
            label: 'Event Schedule'
        }
    ];
    default_date_filter: DateFilterContract;

    constructor(dates: Date[]) {
        this.date_filters = this._parseDateFilters(dates);
        this.default_date_filter = this.initialDateFilter();
    }

    private _parseDateFilters(dates: Date[]) {
        let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        let result: { label: string, value: (number | null) }[] = [];
        dates.forEach(function (date: Date) {
            let date_label = days[date.getDay()] + " " + months[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear();
            result.push({
                label: date_label,
                value: date.getTime()
            })
        });
        result.sort(function (a, b) {
            if (a.value === null) {
                return -1;
            }
            if (b.value === null) {
                return 1;
            }
            if (a.value < b.value) {
                return -1;
            }
            if (b.value < a.value) {
                return 1;
            }
            return 0;
        });
        if (PracticeIceConfig.allow_all_dates_filter) {
            result.unshift({
                label: "All Dates",
                value: null
            });
        }
        return result;
    }

    private initialDateFilter() {
        let initial_index = PracticeIceConfig.allow_all_dates_filter ? 1 : 0;

        return this.date_filters[initial_index];
    }
}