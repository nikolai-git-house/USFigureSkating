/* eslint-disable jsdoc/require-jsdoc */
import {CompetitionHeadingSource} from '../../contracts/AppContracts';

interface ActiveCompetitionSummaryParams {
    announcement_url: string | null;
    directions: { location_name: string; link: string; }[];
    end_date_pretty: string;
    icon: string;
    id: number;
    name: string;
    start_date_pretty: string;
    website_url: string | null;
}

export class ActiveCompetitionSummary implements CompetitionHeadingSource {
    announcement_url: string | null;
    directions: { location_name: string; link: string; }[];
    end_date_pretty: string;
    icon: string;
    id: number;
    name: string;
    start_date_pretty: string;
    website_url: string | null;

    constructor(params: ActiveCompetitionSummaryParams) {
        this.announcement_url = params.announcement_url;
        this.directions = params.directions;
        this.end_date_pretty = params.end_date_pretty;
        this.icon = params.icon;
        this.id = params.id;
        this.name = params.name;
        this.start_date_pretty = params.start_date_pretty;
        this.website_url = params.website_url;
    }
}