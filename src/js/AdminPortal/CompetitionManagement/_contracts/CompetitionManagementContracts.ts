import {CompetitionHeadingSource} from '../../../contracts/AppContracts';

export interface CompetitionManagementCompetitionSummaryCompetition {
    end_date_pretty: string;
    icon: string;
    location: {
        city: string;
        state: string;
    };
    name: string;
    start_date_pretty: string;
}

export interface CompetitionManagementIndexCompetition extends CompetitionManagementCompetitionSummaryCompetition {
    id: number;
    manage_link: string;
}

export type CompetitionManagementCompetitionTypeKey = 'upcoming' | 'past';

export interface NamedDateTime {
    date_time_formatted: string;
    name: string;
}

export interface NamedDateTimeWithOptionalCost {
    date_time_formatted: string;
    name: string;
    cost?: {
        label: string;
        value: number;
    };
}

export type NamedDateTimeWindow = {
    name: string;
    begin_date_time_formatted: string;
    end_date_time_formatted: string;
};

/**
 * A key to load a competition management component
 */
export type CompetitionManagementComponentKey =
    'competition-information'
    | 'compliance'
    | 'competition-contacts'
    | 'check-in';

/**
 * A link for a competition's management index links
 */
export interface CompetitionManagementCompetitionIndexLink {
    component_link?: CompetitionManagementComponentKey;
    is_external?: boolean;
    is_new_tab?: boolean;
    label: string;
    url: string;
}

/**
 * Interface for competition for competition management
 */
export interface CompetitionManagementCompetitionInterface extends CompetitionHeadingSource {
    index_links: CompetitionManagementCompetitionIndexLink[];
}