import {MONTH_LENGTHS} from '../../constants/DateConstants';
import {DateFilterer} from '../../helpers/DateFilterer';
import {DateInputParsedValue} from '../DateInputExtended/DateInputExtendedContracts';
import {
    CompetitionFilterCompetitionFieldKey,
    CompetitionFilterServiceDateFilter,
    CompetitionFilterServiceParams,
    CompetitionFilterTermValue,
    CompetitionFilterTermValueSegment,
    FilterableCompetition
} from './CompetitionFilterContracts';
import {StringHelpers} from '../../helpers/StringHelpers';

/**
 * Filter competitions based on filter criteria
 */
export default class CompetitionFilterService {
    /**
     * Create a new instance
     */
    constructor(params: CompetitionFilterServiceParams) {
        this.filter_field = params.field;
        this.do_filter_strings = params.type !== 'date_range';
        this.do_filter_dates = params.type === 'date_range';

        if (params.type === 'date_range') {
            this.date_filter = CompetitionFilterService.parseDateFilterValue(params.value);
        } else {
            this.string_filter = CompetitionFilterService.parseStringFilter(params.value);
        }
    }

    /**
     * The filter for date comparisons
     */
    private date_filter: CompetitionFilterServiceDateFilter = [null, null];
    /**
     * Whether to filter by date values
     */
    private do_filter_dates: boolean;
    /**
     * Whether to filter by string values
     */
    private do_filter_strings: boolean;
    /**
     * The field being filtered against
     */
    private filter_field: CompetitionFilterCompetitionFieldKey;
    /**
     * The filter for string comparisons
     */
    private string_filter: string = '';

    /**
     * Facade to filter a list of competitions
     */
    public static filter(params: CompetitionFilterServiceParams, competitions: FilterableCompetition[]): FilterableCompetition[] {
        return (new CompetitionFilterService(params))
            .filter(competitions);
    }

    /**
     * Get a Date object representing the filter end date, or null if once can't be parsed.
     *
     * If year not present, use the current year.
     * If month not present, use the last month of the year
     * If date not present, use the last possible day of the entered month
     */
    private static getEndDateFromFilter(filter: DateInputParsedValue | null): Date | null {
        if (!filter) {
            return null;
        }
        const currentYear = new Date()
            .getUTCFullYear();
        const year = filter.year || currentYear;
        const month = filter.month ? filter.month : 12;
        const date = filter.day || MONTH_LENGTHS[String(month)];

        return new Date(
            Date.UTC(
                year,
                month - 1,
                date
            )
        );
    }

    /**
     * Get a Date object representing the filter start date, or null if once can't be parsed
     *
     * If year not present, use the current year.
     * If month not present, use the first month of the year
     * If date not present, use the first day of the month (1)
     */
    private static getStartDateFromFilter(filter: DateInputParsedValue | null): Date | null {
        if (!filter || !(filter.day || filter.month || filter.year)) {
            return null;
        }
        const currentYear = new Date()
            .getUTCFullYear();
        const month = filter.month ? filter.month : 1;
        const year = filter.year || currentYear;
        const date = filter.day || 1;

        return new Date(
            Date.UTC(
                year,
                month - 1,
                date
            )
        );
    }

    /**
     * Parse the CompetitionFilterServiceDateFilter from a provided CompetitionFilterTermValue
     */
    private static parseDateFilterValue(value: CompetitionFilterTermValue): CompetitionFilterServiceDateFilter {
        return [
            CompetitionFilterService.getStartDateFromFilter(
                CompetitionFilterService.parseFilterDateValueFromTermSegment(value[0])
            ),
            CompetitionFilterService.getEndDateFromFilter(
                CompetitionFilterService.parseFilterDateValueFromTermSegment(value[1])
            )
        ];
    }

    /**
     * Determine the DateInputParsedValue for a filter term segment
     *
     * Returns null if one cannot be parsed from the provided segment
     */
    private static parseFilterDateValueFromTermSegment(term_segment?: CompetitionFilterTermValueSegment): DateInputParsedValue | null {
        if (term_segment
            && typeof term_segment === 'object'
            && 'value' in term_segment
            && 'month' in term_segment.value
            && 'day' in term_segment.value
            && 'year' in term_segment.value) {
            return term_segment.value;
        }

        return null;
    }

    /**
     * Parse the string filter from a provided term value
     */
    private static parseStringFilter(value: CompetitionFilterTermValue): string {
        const term = value[0];
        if (term && typeof term === 'string') {
            return term.toLowerCase();
        }

        return '';
    }

    /**
     * Filter a list of competitions
     *
     * Only run filters configured on the instance
     */
    public filter(competitions: FilterableCompetition[]): FilterableCompetition[] {
        return competitions.filter((competition: FilterableCompetition) => {
            if (this.do_filter_dates && !this.competitionPassesDateFilter(competition)) {
                return false;
            }
            if (this.do_filter_strings && !this.competitionPassesStringFilter(competition)) {
                return false;
            }

            return true;
        });
    }

    /**
     * Whether a competition passes the date filter
     */
    private competitionPassesDateFilter(competition: FilterableCompetition): boolean {
        return DateFilterer.dateRangeWithinWindow([new Date(competition.start_date_ts), new Date(competition.end_date_ts)], this.date_filter);
    }

    /**
     * Whether a competition passes the string filter
     */
    private competitionPassesStringFilter(competition: FilterableCompetition): boolean {
        if (this.filter_field in competition) {
            const competition_value = competition[this.filter_field];
            if (typeof competition_value === 'string') {
                return !!competition_value.toLowerCase()
                    .match(StringHelpers.escapeRegex(this.string_filter));
            }
        }

        return true;
    }
}