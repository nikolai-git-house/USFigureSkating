import {UserSkateTestHistory} from '../../../contracts/app/SkateTestContracts';
import {SeriesApplication} from './SeriesApplicationContracts';

export namespace SeriesApplicationService {
    export interface SaveSkateTestServiceResponse {
        skate_test_history: UserSkateTestHistory;
        user_discipline_eligibility_update: SeriesApplication.DisciplineLevelEligibility[];
    }

    export interface RemoveSkateTestServiceResponse {
        skate_test_history: UserSkateTestHistory;
        user_discipline_eligibility_update: SeriesApplication.DisciplineLevelEligibility[];
    }

    export interface SaveApplicationServicePayload extends SeriesApplication.UserApplication {

    }

    export interface SaveApplicationServiceResponse {
        cart_link: string;
    }

    export type FetchApplicationServiceResponse = FetchUserApplicationServiceResponse | FetchTeamApplicationServiceResponse;

    interface AbstractFetchApplicationServiceResponse {
        series: SeriesApplication.Series;
        user_application: SeriesApplication.UserApplication;
        user_application_profile: SeriesApplication.UserApplicationProfile | null;
        team_application_profile: SeriesApplication.TeamApplicationProfile | null;
        saved_application_exists: boolean;
        is_team_series: boolean;
    }

    /**
     * Service response when fetching series application data
     */
    export interface FetchUserApplicationServiceResponse extends AbstractFetchApplicationServiceResponse {
        user_application_profile: SeriesApplication.UserApplicationProfile;
        team_application_profile: null;
        is_team_series: false;
    }

    /**
     * Service response when fetching series application data
     */
    export interface FetchTeamApplicationServiceResponse extends AbstractFetchApplicationServiceResponse {
        team_application_profile: SeriesApplication.TeamApplicationProfile;
        user_application_profile: null;
        is_team_series: true;
    }
}