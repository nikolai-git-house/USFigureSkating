import {SeriesRegistrationPageHeadingSeries} from '../../_contracts/SeriesRegistrationContracts';
import {SeriesApplication} from '../../SeriesApplication/_contracts';
import {StatusMessage} from '../../../contracts/AppContracts';

export namespace SeriesOverview {
    export interface Series extends SeriesRegistrationPageHeadingSeries, CtaSeries {
        application_deadline_formatted: string;
        application_configuration: SeriesApplication.ApplicationConfiguration;
        contact_email_address: string;
        is_team_series: boolean;
        links: {
            application: string;
            checkout: string;
            standings: string;
            series_list: string;
        };
        statement: string;
        status: {
            message: StatusMessage | null;
            applications_open: boolean;
            standings_available: boolean;
        };
        refund_email_address: string;
        reports: SeriesRegistrationSeriesReport[] | null;
        resource_documents: SeriesDisciplineResourceDocument[];
    }

    export type SeriesDisciplineResourceDocument = {
        discipline_id: number;
        link: string;
        name: string;
    }

    export type SeriesRegistrationSeriesReport = {
        link: string;
        name: string;
    }

    export interface CtaSeries {
        application_deadline_formatted: string;
        links: {
            application: string;
            checkout: string;
            standings: string;
        };
        status: {
            applications_open: boolean;
            standings_available: boolean;
        };
    }
}