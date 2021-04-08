import {Teams} from '../../Teams/_contracts/TeamsContracts';

/**
 * A series compatible with the Series Index page
 */
export interface SeriesRegistrationIndexSeries {
    application_deadline_date_formatted: string;
    icon: string;
    id: number;
    name: string;
    overview_link: string;
}

/**
 * A series compatible with the Series Page Heading Component
 */
export interface SeriesRegistrationPageHeadingSeries {
    name: string;
    icon: string;
    application_deadline_formatted: string;
}

export namespace SeriesRegistration {
    export interface SubpageSeriesSummary extends SeriesRegistrationPageHeadingSeries {
        id: number;
        is_team_series: boolean;
        links: {
            overview: string;
        };
    }

    export interface SelectableTeam extends Teams.SelectTeamListComponentTeam {
        select_button: {
            text: string;
            url: string;
        } | null;
    }
}