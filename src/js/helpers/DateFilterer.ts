/* eslint-disable */
interface DateSearch {
    month: { value?: string; check?: RegExp };
    date: { value?: string; check?: RegExp };
    year: { value?: string, check?: RegExp }
}

/**
 * @important_note:
 * Edge cases that result in failure:
 * Near-year span with lower end dates (1/2/19-1/1/20)
 * Multi-year spans (1/2/19 - 4/3/21)
 * Given the real-world use cases at this time, leaving as is for competition list filtering
 */
export class DateFilterer {
    private start_month: number;
    private end_month: number;
    private start_date: number;
    private end_date: number;
    private query: DateSearch | false;
    public passed: boolean = false;
    private months_equal: boolean;
    private start_year: string;
    private end_year: string;


    constructor(start_date: Date, end_date: Date, search_term: string) {
        this.start_month = start_date.getUTCMonth() + 1;
        this.end_month = end_date.getUTCMonth() + 1;
        this.start_date = start_date.getUTCDate();
        this.end_date = end_date.getUTCDate();
        this.start_year = String(start_date.getUTCFullYear()).slice(2);
        this.end_year = String(end_date.getUTCFullYear()).slice(2);
        this.months_equal = this.start_month === this.end_month;
        this.query = DateFilterer.sanitizeQuery(search_term);
        this.passed = this.run();
    }

    run() {
        return this.checkMonths();
    }

    /**
     * Determine whether the active date range passes the queried filter
     * For each month between the start and the end month, compare to query.
     * If no month matches, return false.
     *  Otherwise, go deeper and check days
     */
    checkMonths() {
        if (!this.query) {
            return false;
        }
        if (!this.query.month.check) {
            return true;
        }

        let start_month = this.start_month;
        let end_month = this.end_month;
        // For spans across new years, set relative values
        if (start_month > end_month) {
            end_month += 12
        }
        let active_index = start_month;
        while (active_index <= end_month) {
            // The actual month number in play cannot exceed 12
            let month_key = active_index > 12 ? active_index % 12 : active_index;
            if (this.query.month.check.test(String(month_key))) {
                if (this.checkDaysForMonth(month_key)) {
                    return true;
                }
            }
            active_index++;
        }
        return false;
    }

    /**
     * Determine whether the active date range passes the queried filter for days
     * If start and end month are the same, check every date from start to end.
     * Otherwise, check all the days through the end of the month for the start month,
     *  or every day back to the beginning of the month for the end month.
     *
     *  Months in between automatically pass
     */
    checkDaysForMonth(month: number): boolean {
        if (!this.query) {
            return false;
        }
        if (!this.query.date.check) {
            return true;
        }

        let start_date = this.start_date;
        let end_date = this.end_date;
        /**
         * Months are equal.  Check all dates between start and end
         */
        if (this.months_equal) {
            while (start_date <= end_date) {
                if (this.query.date.check.test(String(start_date))) {

                    return this.checkYearForMonth(month);
                }
                start_date++;
            }
            return false;
        }
        /**
         * Month being checked is start month. Check all dates through to the end of the month.
         */
        if (month === this.start_month) {
            while (start_date < 32) {
                if (this.query.date.check.test(String(start_date))) {
                    return this.checkYearForMonth(month);
                }
                start_date++
            }
            return false;
        }
        /**
         * Month is end month. Check every date from 1 to end date
         */
        if (month === this.end_month) {
            let date_index = 1;
            while (date_index <= end_date) {
                if (this.query.date.check.test(String(date_index))) {
                    return this.checkYearForMonth(month);
                }
                date_index++
            }
            return false;
        }
        /**
         * Month lies between start and end months.  All days are valid.  Go deeper
         */
        return this.checkYearForMonth(month);
    }

    /**
     * Given a month, make sure its year is valid
     * If the month is the start month, make sure it matches the start month year
     * If the month is the end month, make sure it matches the end month year
     * If the month is not the start month, and it's larger than the end month, use the start month
     */
    private checkYearForMonth(month: number) {
        if (!this.query) {
            return false;
        }
        if (!this.query.year.check) {
            return true;
        }
        /**
         * If the month is the start month, direct compare
         * If the month is larger than the end month, it must belong to the start year
         */
        if (month === this.start_month || month > this.end_month) {
            return this.query.year.check.test(this.start_year);
        }

        return this.query.year.check.test(this.end_year);
    }

    /**
     * Create a sanitized query from the search term.  Return false if input is bad.
     */
    private static sanitizeQuery(search_term: string): DateSearch | false {
        const split = search_term.split("/");
        // If there's 3 or more slashes, the input date is bad and won't match anything
        if (split.length > 3) {
            return false;
        }
        //Whether the month has been "completed" by the user with a slash
        let month_complete = split.length > 1;
        //Whether the day has been "completed" by the user with a slash
        let date_complete = split.length > 2;


        let month_value = split[0] || undefined;
        let date_value = split[1] || undefined;
        let year_value = split[2];

        if (month_value && !(/[0-9]+/.test(month_value))) {
            return false;
        }
        if (date_value && !(/[0-9]+/.test(date_value))) {
            return false;
        }
        if (year_value && !(/[0-9]+/.test(year_value))) {
            return false;
        }

        //Double slashes invalid
        if (month_complete && !month_value || date_complete && !date_value) {
            return false;
        }

        //If month/date numbers are invalid, return false
        const MONTH_LENGTHS: { [key: string]: number; } = {
            "1": 31,
            "2": 29,
            "3": 31,
            "4": 30,
            "5": 31,
            "6": 30,
            "7": 31,
            "8": 31,
            "9": 30,
            "10": 31,
            "11": 30,
            "12": 31,
        };
        if (month_value) {
            let month_int = parseInt(month_value);
            if (month_int > 12 || month_int < 1) {
                return false;
            }
            if (date_value) {
                let date_int = parseInt(date_value);
                if (date_int > MONTH_LENGTHS[month_value]) {
                    return false;
                }
            }
        }


        // Compile regex testers for available values
        let month_regex;
        if (month_value) {
            let month_query = "^" + month_value;
            if (month_complete) {
                month_query += '$';
            }
            month_regex = new RegExp(month_query);
        }
        let date_regex;
        if (date_value) {
            let date_query = "^" + date_value;
            if (date_complete) {
                date_query += '$';
            }
            date_regex = new RegExp(date_query);
        }
        let year_regex;
        if (year_value) {
            let year_query = "^" + year_value;
            year_regex = new RegExp(year_query);
        }

        return {
            month: {
                value: month_value,
                check: month_regex
            },
            date: {
                value: date_value,
                check: date_regex
            },
            year: {
                value: year_value,
                check: year_regex
            },
        };
    }

    /* eslint-enable */
    /**
     * Determine if a date range lies within a date window
     *
     * @param {[Date,Date]} date_range  - The date range to check
     * @param {[Date|null,Date|null]} window - The window to check against.
     *
     * @return bool - Whether the date range to check has any dates within the window
     */
    static dateRangeWithinWindow(date_range: [Date, Date], window: [Date | null, Date | null]): boolean {
        const window_end = window[1];
        const window_start = window[0];
        const date_range_start = date_range[0];
        const date_range_end = date_range[1];

        // Invalid window - Window start is after window end
        if (window_start && window_end && window_end < window_start) {
            return false;
        }
        // Date range start is after window end
        if (window_end && date_range_start > window_end) {
            return false;
        }
        // Date rage end is before window start
        if (window_start && date_range_end < window_start) {
            return false;
        }

        return true;
    }
}