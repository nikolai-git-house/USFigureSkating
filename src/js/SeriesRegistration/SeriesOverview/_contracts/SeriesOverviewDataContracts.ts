import {SeriesRegistrationSeriesCoreData} from '../../_contracts/SeriesRegistrationDataContracts';
import {SeriesApplicationData} from '../../SeriesApplication/_contracts';
import {StatusMessageData} from '../../../contracts/data/DataContracts';

export namespace SeriesOverviewData {
    /**
     * Represents data related to a series for the Series Overview page
     */
    export interface SeriesData extends SeriesRegistrationSeriesCoreData {
        application_configuration: SeriesApplicationData.ApplicationConfigurationData;    // The application configuration for the series
        application_deadline_formatted: {
            date: string;                                               // The formatted application deadline date
            time?: string;                                              // The formatted application deadline time
        };
        contact_email_address: string;                                  // The email address users should contact with questions
        links: {                                                        // Links for the series
            application: string;                                           // Link to series application page
            checkout: string;                                              // Link to check out for the application
            standings: string;                                             // Link to series standings page
            series_list: string;                                           // Link to series list page
        };
        status: {                                                       // Status information for the series
            message?: StatusMessageData;                                // Status message to display in the header of the page
            applications_open: boolean;                                 // Whether the series application window is open
            standings_available: boolean;                               // Whether standings are available for the series
        };
        refund_email_address: string;                                   // Email address users should contact for refund inquiries
        reports?: SeriesRegistrationSeriesReportData[] | null;          // [Optional] Report links (application and results reports) to display on the Series Overview page. If falsy, no report links will show.  Should be empty for non-admin users
        resource_documents: SeriesDisciplineResourceDocumentData[];     // Resource documents to display on the page. Correspond with disciplines available for the series
        statement: string;                                              // Series statement text content
    }

    /**
     * Represents a resource (handbook) document for a series discipline.
     */
    export type SeriesDisciplineResourceDocumentData = {
        discipline_id: number;      // The ID of the discipline the document applies to
        link: string;               // The URL for the document
        name: string;               // The display name of the document
    }

    /**
     * Represents a report link for a Series
     */
    type SeriesRegistrationSeriesReportData = {
        link: string;    // The URL for the report
        name: string;   // The name of the report
    }

    /**
     * Tracks teams that have been applied for a series
     */
    export interface SeriesAppliedTeamsData {
        teams: SeriesAppliedTeamData[];     // The list of applied teams for the series
    }

    /**
     * Represents a team that has been applied to a series
     */
    export interface SeriesAppliedTeamData {
        id: string;                                                                 // Unique identifier for the team
        name: string;                                                               // Name of the team
        level: string;                                                              // Team level name
        levels: SeriesApplicationData.SavedUserApplicationDisciplineLevelData[];    // The levels within the team's application
        handbook?: {                                                          // Series team handbook, if applicables
            url: string;                                                      // URL to the series handbook for the team
            name: string;                                                     // Name of the handbook document to display on the page
        };
    }
}