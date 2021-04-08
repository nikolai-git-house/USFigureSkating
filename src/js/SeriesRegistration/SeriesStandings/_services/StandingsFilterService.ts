import {SeriesStandings} from '../_contracts';
import {BaseFilterService} from '../../../services/BaseFilterService';
import {StandingsGranularFilterService} from './StandingsGranularFilterService';
import {FormOption} from '../../../contracts/AppContracts';

export class StandingsFilterService extends BaseFilterService {
    private readonly active_granular_filter: SeriesStandings.StandingsGranularFilterActionable | null;
    private readonly section_filter: SeriesStandings.SeriesSectionKey[] | null;
    private readonly discipline_filter: string[] | null;
    private readonly level_filter: string[] | null;

    /**
     * Create a new filter instance
     */
    constructor(available_global_filters: SeriesStandings.StandingsGlobalFilterSet, active_global_filters: SeriesStandings.StandingsGlobalFilterSet, active_granular_filter: SeriesStandings.StandingsGranularFilter) {
        super();
        this.active_granular_filter = StandingsFilterService.parseGranularFilter(active_granular_filter);
        this.section_filter = StandingsFilterService.parseSectionFilter(available_global_filters, active_global_filters);
        this.discipline_filter = StandingsFilterService.parseGlobalStringFilter('disciplines', available_global_filters, active_global_filters);
        this.level_filter = StandingsFilterService.parseGlobalStringFilter('levels', available_global_filters, active_global_filters);
    }

    /**
     * Parse the active granular filter.  Return null if filter is not complete enough to use for filtering
     */
    private static parseGranularFilter(granular_filter: SeriesStandings.StandingsGranularFilter): SeriesStandings.StandingsGranularFilterActionable | null {
        const field: SeriesStandings.StandingsGranularFilterFieldOption | null = granular_filter.field;
        if (field === null) {
            return null;
        }
        if (granular_filter.term[0] === null && granular_filter.term[1] === null) {
            return null;
        }

        return {
            field,
            term: granular_filter.term
        };
    }

    /**
     * Parse the section filter.
     *
     * Return null if selected section filters match available
     */
    private static parseSectionFilter(available_global_filters: SeriesStandings.StandingsGlobalFilterSet, active_global_filters: SeriesStandings.StandingsGlobalFilterSet): SeriesStandings.SeriesSectionKey[] | null {
        if (available_global_filters.sections.length === active_global_filters.sections.length) {
            return null;
        }

        return active_global_filters.sections.map((filter: SeriesStandings.SectionFilterFormOption) => {
            return filter.value;
        });
    }

    /**
     * Parse a global string filter
     *
     * Return null if selected section filters match available
     */
    private static parseGlobalStringFilter(filter_key: 'disciplines' | 'levels', available_global_filters: SeriesStandings.StandingsGlobalFilterSet, active_global_filters: SeriesStandings.StandingsGlobalFilterSet): string[] | null {
        if (available_global_filters[filter_key].length === active_global_filters[filter_key].length) {
            return null;
        }

        return active_global_filters[filter_key].map((filter: FormOption) => {
            return filter.value;
        });
    }

    /**
     * Perform the global filtering of standings
     */
    filter(events: SeriesStandings.StandingsEvent[]): SeriesStandings.StandingsEvent[] {
        if (this.filteringInactive()) {
            return events;
        }

        return events.reduce((carry: SeriesStandings.StandingsEvent[], event: SeriesStandings.StandingsEvent): SeriesStandings.StandingsEvent[] => {
            if (this.eventPassesGlobalFilters(event)) {
                const event_standings = this.filterEventStandings(event.standings);
                if (event_standings.length) {
                    carry.push({
                        ...event,
                        standings: event_standings
                    });
                }
            }

            return carry;
        }, []);
    }

    /**
     * Filter standings rows within an event
     */
    private filterEventStandings(standings: SeriesStandings.StandingsRow[]): SeriesStandings.StandingsRow[] {
        return standings.filter((standing_row: SeriesStandings.StandingsRow) => {
            if (this.active_granular_filter) {
                const method_map: { [key: string]: SeriesStandings.GranularFilterServiceFilterMethod; } = StandingsGranularFilterService.METHOD_MAP;
                if (!method_map[this.active_granular_filter.field.value](standing_row, this.active_granular_filter.term)) {
                    return false;
                }
            }
            if (this.section_filter) {
                if (!StandingsGranularFilterService.rowPassesSectionFilter(standing_row, this.section_filter)) {
                    return false;
                }
            }

            return true;
        });
    }

    /**
     * Whether current filter set results in filtering being inactive
     */
    private filteringInactive(): boolean {
        return !this.discipline_filter && !this.level_filter && !this.active_granular_filter && !this.section_filter;
    }

    /**
     *  Whether an event passes the active event filters
     */
    private eventPassesGlobalFilters(event: SeriesStandings.StandingsEvent): boolean {
        if (this.discipline_filter && this.discipline_filter.indexOf(event.discipline_name) === -1) {
            return false;
        }

        if (this.level_filter && this.level_filter.indexOf(event.level_name) === -1) {
            return false;
        }

        return true;
    }
}