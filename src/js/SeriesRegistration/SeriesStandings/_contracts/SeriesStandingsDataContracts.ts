import {SeriesRegistrationSeriesCoreData} from '../../_contracts/SeriesRegistrationDataContracts';

export namespace SeriesStandingsData {
    /**
     * Represents Series data required by the "Series Standings" page
     */
    export interface SeriesData extends SeriesRegistrationSeriesCoreData {
        application_deadline_formatted: {
            date: string;                                           // The formatted application deadline date
            time?: string;                                          // The formatted application deadline time
        };
        links: {                                                    // Links for the series
            overview: string;                                       // Link to series overview page
        };
        resource_documents: ResourceDocumentData[];                 // List of resource documents to display on standings page
    }

    /**
     * Represents a resource document for the series
     */
    export type ResourceDocumentData = {
        link: string;       // The URL for the document
        name: string;       // The display name of the document
    }

    /**
     * Represents Series Standings information
     */
    export interface StandingsData {
        meta: {                                         // Metadata about standings
            last_updated_datetime_formatted: string;        // Formatted string for the last update datetime
            available_filters: {                            // Available filters for the standings
                section_keys: SeriesSectionKeyData[];           // List of unique StandingsRowData section_key values, in desired filter display order
                discipline_names: string[];                     // List of unique StandingsEventData discipline_name values, in desired filter display order
                level_names: string[];                          // List of unique StandingsEventData level_name values, in desired filter display order
            };
        };
        events: StandingsEventData[];                   // List of standings events in desired display order
    }

    /**
     * Represents an event within standings.  Contains standings rows
     */
    export interface StandingsEventData {
        name: string;                       // The name of the event
        discipline_name: string;            // The name of the associated discipline
        level_name: string;                 // The name of the associated level
        standings: StandingsRowData[];      // The list of standings entries for the event in the desired display order
    }

    /**
     * Represents an entry in a list of standings entries for an event
     */
    export interface StandingsRowData {
        id: number;                             // Unique identifier for the item
        competition_earned: string | null;      // Competition earned for the row
        highest_score: string | null;           // Highest score for the row
        home_club: string;                      // Home club associated with the participant.  ASTERISKS SHOULD BE INCLUDED IN APPROPRIATE CASES.
        national_rank: string | null;           // National rank for the row
        participant_name: string;               // Name of the participant for the row
        section_key: SeriesSectionKeyData;      // Key indicating section associated with the row
        sectional_rank: string | null;          // Sectional rank for the row
    }

    /**
     * Ket to identify a section associated with a standings row
     */
    type SeriesSectionKeyData = 'midwestern' | 'eastern' | 'pacific';
}