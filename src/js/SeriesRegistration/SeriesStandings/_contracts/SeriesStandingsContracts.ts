import {SeriesRegistrationPageHeadingSeries} from '../../_contracts/SeriesRegistrationContracts';
import {FormOption} from '../../../contracts/AppContracts';

export namespace SeriesStandings {
    /**
     * A series compatible with the standings page
     */
    export interface Series extends SeriesRegistrationPageHeadingSeries {
        links: {
            overview: string;
        };
        resource_documents: ResourceDocument[];
    }

    export type ResourceDocument = {
        link: string;
        name: string;
    }

    /**
     * Series standings information
     */
    export interface Standings {
        meta: {
            last_updated_datetime_formatted: string;
        };
        events: StandingsEvent[];
    }

    /**
     * An event within series standings
     */
    export interface StandingsEvent {
        uid: number;
        name: string;
        discipline_name: string;
        level_name: string;
        standings: StandingsRow[];
    }

    /**
     * A standings row within an event
     */
    export interface StandingsRow {
        id: number;
        participant_name: string;
        home_club: string;
        competition_earned: string | null;
        highest_score: string | null;
        section_key: SeriesSectionKey;
        sectional_rank: string | null;
        national_rank: string | null;
    }

    /**
     * Key indicating a section applicable to a standings row
     */
    export type SeriesSectionKey = 'midwestern' | 'eastern' | 'pacific';

    /**
     * A standings filter set via the granular filter component
     */
    export interface StandingsGranularFilter {
        term: StandingsGranularFilterTerm;
        field: StandingsGranularFilterFieldOption | null;
    }

    /**
     * Granular filter term value entered by the user
     */
    export type StandingsGranularFilterTerm = [string | null, string | null];

    /**
     * Field for the granular filter
     */
    export type StandingsGranularFilterFieldOption = {
        label: string;
        value: StandingsGranularFilterField;
        type: 'text' | 'number_range';
    }

    /**
     * Valid field for the granular filter
     */
    type StandingsGranularFilterField = 'skater_name'
        | 'club_name'
        | 'competition_earned'
        | 'national_rank';

    /**
     * A complete granular filter that can be used for filtering
     */
    export interface StandingsGranularFilterActionable extends StandingsGranularFilter {
        field: StandingsGranularFilterFieldOption;
    }

    /**
     * Set of global filter options
     */
    export interface StandingsGlobalFilterSet {
        sections: SectionFilterFormOption[];
        disciplines: FormOption[];
        levels: FormOption[];
    }

    /**
     * Form option for global section filter
     */
    export interface SectionFilterFormOption extends FormOption {
        value: SeriesSectionKey;
    }

    /**
     * Granular filter service filtering method
     */
    export type GranularFilterServiceFilterMethod = (standing_row: SeriesStandings.StandingsRow, filter_term: SeriesStandings.StandingsGranularFilterTerm) => boolean;
}