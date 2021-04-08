/* eslint-disable new-cap */
import {
    CompetitionSeries,
    CompetitionTileCompetition
} from '../../../components/CompetitionTile/CompetitionTileContracts';
import {TeamsCompetitionRegistration} from '../_contracts';
import {UTCDateFormatNoYear} from '../../../helpers/time';
import {
    CompetitionRegistrationCtaConfiguration,
    CompetitionRegistrationStatusKey,
    UserCompetitionRegistrationStatusKey
} from '../../../contracts/app/CompetitionRegistrationContracts';
import {FilterableCompetition} from '../../../components/CompetitionFilter/CompetitionFilterContracts';

export type CompetitionListCompetitionParameters = {
    id: number;
    action_blocked_message?: string;
    city: string;
    club: string;
    end_date_ts: number;
    icon: string;
    name: string;
    series: CompetitionSeries[] | null;
    start_date_ts: number;
    state: string;
    is_qualifying: boolean;
    competition_registration_status: CompetitionRegistrationStatusKey;
    has_registration_deadline_warning: boolean;
    registration_deadline: string;
    user_registration_link: string;
    user_registration_status: UserCompetitionRegistrationStatusKey;
};

/**
 * Model for competition in Team Registration Competition List
 */
export class CompetitionListCompetition implements CompetitionTileCompetition, TeamsCompetitionRegistration.CompetitionTypeCompetition, FilterableCompetition, CompetitionRegistrationCtaConfiguration {

    [key: string]: boolean | string | number | CompetitionSeries | object | null | undefined;

    id: number;
    action_blocked_message?: string;
    city: string;
    club: string;
    end_date: string;
    icon: string;
    name: string;
    series: CompetitionSeries[] | null;
    start_date: string;
    state: string;
    is_qualifying: boolean;
    end_date_ts: number;
    start_date_ts: number;
    competition_registration_status: CompetitionRegistrationStatusKey;
    has_registration_deadline_warning: boolean;
    registration_deadline: string;
    user_registration_link: string;
    user_registration_status: UserCompetitionRegistrationStatusKey;

    /**
     * CompetitionListCompetition constructor
     */
    constructor(parameters: CompetitionListCompetitionParameters) {
        this.id = parameters.id;
        if (parameters.action_blocked_message) {
            this.action_blocked_message = parameters.action_blocked_message;
        }
        this.city = parameters.city;
        this.club = parameters.club;
        this.end_date_ts = parameters.end_date_ts;
        this.icon = parameters.icon;
        this.name = parameters.name;
        this.series = parameters.series;
        this.start_date_ts = parameters.start_date_ts;
        this.state = parameters.state;
        this.is_qualifying = parameters.is_qualifying;
        this.start_date = UTCDateFormatNoYear(new Date(parameters.start_date_ts));
        this.end_date = UTCDateFormatNoYear(new Date(parameters.end_date_ts));
        this.competition_registration_status = parameters.competition_registration_status;
        this.has_registration_deadline_warning = parameters.has_registration_deadline_warning;
        this.registration_deadline = parameters.registration_deadline;
        this.user_registration_link = parameters.user_registration_link;
        this.user_registration_status = parameters.user_registration_status;
    }
}