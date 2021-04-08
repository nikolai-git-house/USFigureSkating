import {FilterableCompetition} from '../../components/CompetitionFilter/CompetitionFilterContracts';
import {CompetitionSeries, CompetitionTileCompetition} from '../../components/CompetitionTile/CompetitionTileContracts';
import {UserCompetitionRegistrationStatusKey} from '../../contracts/app/CompetitionRegistrationContracts';

/**
 * Competition for use in Search Competitions page
 */
export interface SearchCompetitionsCompetition extends FilterableCompetition, CompetitionTileCompetition {
    city: string;
    club: string;
    end_date: string;
    end_date_ts: number;
    has_registration_deadline_warning: boolean;
    icon: string;
    id: number;
    name: string;
    registration_deadline?: string;
    series: CompetitionSeries[] | null;
    start_date: string;
    start_date_ts: number;
    state: string;
    user_registration_status: UserCompetitionRegistrationStatusKey;
    view_competition_link: string;

    [key: string]: string | number | boolean | Array<any> | null | undefined;
}