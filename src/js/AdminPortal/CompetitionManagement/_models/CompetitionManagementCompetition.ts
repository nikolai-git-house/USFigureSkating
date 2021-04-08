import {CheckInCompetitionInterface} from '../../CheckIn/_contracts/CheckInContracts';
import {
    CompetitionManagementCompetitionIndexLink,
    CompetitionManagementCompetitionInterface
} from '../_contracts/CompetitionManagementContracts';
import {CompetitionManagementCompliancePageCompetitionInterface} from '../CompetitionManagementCompliance/_contracts/CompetitionManagementComplianceContracts';

export interface CompetitionManagementCompetitionParameters {
    announcement_url?: string;
    check_in_report_url: string;
    compliance_report_link: string;
    directions?: {
        location_name: string;
        link: string;
    }[];
    end_date_pretty: string;
    icon: string;
    id: number;
    index_links: CompetitionManagementCompetitionIndexLink[];
    location: {
        city: string;
        state: string;
    };
    manage_link: string;
    name: string;
    start_date_pretty: string;
    team_roster_can_be_edited: boolean;
    website_url?: string;

}

export class CompetitionManagementCompetition implements CompetitionManagementCompliancePageCompetitionInterface, CompetitionManagementCompetitionInterface, CheckInCompetitionInterface {
    public announcement_url: string | null;
    public check_in_report_url: string;
    public compliance_report_link: string;
    public directions: { location_name: string; link: string; }[];
    public end_date_pretty: string;
    public icon: string;
    public id: number;
    public index_links: CompetitionManagementCompetitionIndexLink[];
    public location: { city: string; state: string; };
    public manage_link: string;
    public name: string;
    public start_date_pretty: string;
    public team_roster_can_be_edited: boolean;
    public website_url: string | null;

    /**
     * Create a new instance
     */
    constructor(parameters: CompetitionManagementCompetitionParameters) {
        this.announcement_url = parameters.announcement_url || null;
        this.directions = parameters.directions || [];
        this.end_date_pretty = parameters.end_date_pretty;
        this.icon = parameters.icon;
        this.id = parameters.id;
        this.location = parameters.location;
        this.manage_link = parameters.manage_link;
        this.name = parameters.name;
        this.start_date_pretty = parameters.start_date_pretty;
        this.website_url = parameters.website_url || null;
        this.compliance_report_link = parameters.compliance_report_link;
        this.index_links = parameters.index_links;
        this.check_in_report_url = parameters.check_in_report_url;
        this.team_roster_can_be_edited = parameters.team_roster_can_be_edited;
    }
}