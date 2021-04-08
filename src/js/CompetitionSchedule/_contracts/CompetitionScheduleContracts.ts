import {FormOption} from '../../contracts/AppContracts';
import {CompetitionSchedule} from '../../models/Competition/CompetitionSchedule';

/**
 * A date filter option for Competition Schedule
 */
export interface CompetitionScheduleFilterDateFilter extends FormOption {
    value: number | null; // Timestamp for date
}

/**
 * A view filter option for Competition Schedule
 */
export interface CompetitionScheduleFilterViewFilter extends FormOption {
    value: 'practice_ice' | 'event' | 'other';
}

/**
 * Object containing filter options for use on Competition Schedule filter
 */
export interface CompetitionScheduleFilterOptions {
    dates: CompetitionScheduleFilterDateFilter[];
    views: CompetitionScheduleFilterViewFilter[];
}

/**
 * Active filter set for Competition Schedule filter
 */
export interface CompetitionScheduleFilterActiveFilters {
    date: CompetitionScheduleFilterDateFilter;
    views: CompetitionScheduleFilterViewFilter[];
}

/**
 * Abbreviation item in Competition Schedule Legend
 */
export type CompetitionScheduleLegendAbbreviation = {
    label: string;
    value: string;
}

/**
 * Color key item in Competition Schedule Legend
 */
export type CompetitionScheduleLegendColorKeyItem = {
    label: string;
    color: string;
}

/**
 * Legend for a Competition Schedule
 */
export type CompetitionScheduleLegend = {
    abbreviations: CompetitionScheduleLegendAbbreviation[];
    color_key: CompetitionScheduleLegendColorKeyItem[];
}

/**
 * Links associated with a competition schedule
 */
export type CompetitionScheduleLinks = {
    download_schedule?: string;
    competition_portal?: string;
    admin_edit?: string;
}

/**
 * Service response when fetching schedule for a competition
 */
export interface FetchCompetitionScheduleServiceResponse {
    schedule?: CompetitionSchedule;
    schedule_available: boolean;
}