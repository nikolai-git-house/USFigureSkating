import {FormOption} from '../../contracts/AppContracts';
import {DateInputCompleteValue} from '../DateInputExtended/DateInputExtendedContracts';

/**
 * Key for a field a competition can be filtered by
 * Aligns with fields in competition object
 */
export type CompetitionFilterCompetitionFieldKey = 'name' | 'city' | 'state' | 'date' | 'club';

/**
 * A form option for selecting a field to filter a competition by
 */
export interface CompetitionFilterFieldOption extends FormOption {
    type: CompetitionFilterType;
    value: CompetitionFilterCompetitionFieldKey;
}

/**
 * The term value for the competition filter entered by the user
 */
export type CompetitionFilterTermValue = [CompetitionFilterTermValueSegment, CompetitionFilterTermValueSegment];

/**
 * A sub-segment of the cCompetitionFilterTermValue
 */
export type CompetitionFilterTermValueSegment = DateInputCompleteValue | string | null;

/**
 * A date filter value parsed from a CompetitionFilterTermValue for use in the CompetitionFilterService
 */
export type CompetitionFilterServiceDateFilter = [Date | null, Date | null];

/**
 * Parameters for initializing the filter class
 */
export type CompetitionFilterServiceParams = {
    field: CompetitionFilterCompetitionFieldKey;
    type: CompetitionFilterType;
    value: CompetitionFilterTermValue;
};

/**
 * The type for a CompetitionFilterFieldOption
 */
export type CompetitionFilterType = 'text' | 'date_range' | 'state';

/**
 * A competition that can be filtered
 */
export interface FilterableCompetition {
    city: string;
    club: string;
    end_date_ts: number; // Timestamp for 00:00:00 UTC on end date
    name: string;
    start_date_ts: number; // Timestamp for 00:00:00 UTC on start date
    state: string;

    [key: string]: any;
}