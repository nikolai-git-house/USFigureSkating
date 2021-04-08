import {CompetitionVolunteerCtaConfiguration} from '../../components/CompetitionVolunteerCTA/CompetitionVolunteerCtaContracts';
import {CompetitionRegistrationCtaConfiguration} from '../../contracts/app/CompetitionRegistrationContracts';
import {CompetitionHeadingSource} from '../../contracts/AppContracts';
import {DataNavigationLink} from '../../CompetitionPortal/_models';

type ViewCompetitionLinks = {
    select_competition_entity: string;                                                     // Link to the "Select Competition Entity" page for the competition
};
export type ViewCompetitionCompetitionParameters = {
    announcement_url: string | null;
    directions: { location_name: string; link: string; }[];
    end_date_pretty: string;
    icon: string;
    id: number;
    is_ems: boolean;
    name: string;
    registration_cta_configuration?: CompetitionRegistrationCtaConfiguration;
    team_registration_cta_configuration?: CompetitionRegistrationCtaConfiguration;
    start_date_pretty: string;
    user_navigation: DataNavigationLink[];
    volunteer_cta_configuration?: CompetitionVolunteerCtaConfiguration;
    website_url: string | null;
    links: ViewCompetitionLinks;
}

export class ViewCompetitionCompetition implements CompetitionHeadingSource {
    announcement_url: string | null;
    directions: { location_name: string; link: string; }[];
    end_date_pretty: string;
    icon: string;
    id: number;
    is_ems: boolean;
    name: string;
    registration_cta_configuration?: CompetitionRegistrationCtaConfiguration;
    team_registration_cta_configuration?: CompetitionRegistrationCtaConfiguration;
    volunteer_cta_configuration?: CompetitionVolunteerCtaConfiguration;
    start_date_pretty: string;
    user_navigation: DataNavigationLink[];
    website_url: string | null;
    links: ViewCompetitionLinks;

    /**
     * Create new ViewCompetitionCompetition instance
     */
    constructor(parameters: ViewCompetitionCompetitionParameters) {
        const {announcement_url, directions, end_date_pretty, icon, id, is_ems, name, registration_cta_configuration, start_date_pretty, user_navigation, website_url, volunteer_cta_configuration, team_registration_cta_configuration, links} = parameters;
        this.announcement_url = announcement_url;
        this.directions = directions;
        this.end_date_pretty = end_date_pretty;
        this.icon = icon;
        this.id = id;
        this.is_ems = is_ems;
        this.name = name;
        this.start_date_pretty = start_date_pretty;
        this.user_navigation = user_navigation;
        this.website_url = website_url;
        if (registration_cta_configuration) {
            this.registration_cta_configuration = registration_cta_configuration;
        }
        if (volunteer_cta_configuration) {
            this.volunteer_cta_configuration = volunteer_cta_configuration;
        }
        if (team_registration_cta_configuration) {
            this.team_registration_cta_configuration = team_registration_cta_configuration;
        }
        this.links = links;
    }
}