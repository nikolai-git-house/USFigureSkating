import {StateFormOptionData} from '../../../contracts/release3/data/CommonDataContracts';
import {MemberSearchResultAPIResponse} from '../../../contracts/release3/api/MemberSearchAPIContracts';
import {
    UserAddSkateTestAPIResponse,
    UserRemoveSkateTestAPIResponse
} from '../../../contracts/release3/api/UserAPIContracts';
import {APISubmissionResponse} from '../../../contracts/release3/api/CommonAPIContracts';
import {SeriesApplicationData} from './SeriesApplicationDataContracts';

export namespace SeriesApplicationApi {

    /**
     * Abstract API response when fetching data for the team or individual application page
     */
    export interface FetchAbstractApplicationApiResponse {
        series: SeriesApplicationData.SeriesData;                                       // Information about the series
        user_application: SeriesApplicationData.SavedSeriesApplicationData | null;         // Saved application for the series, if there is one
        user_application_profile: SeriesApplicationData.UserApplicationProfileData | SeriesApplicationData.TeamApplicationProfileData;     // User/Team's profile relative to the series
    }

    /**
     * Server response when fetching data for the "Series Application" page
     */
    export interface FetchApplicationAPIResponse extends FetchAbstractApplicationApiResponse {
        user_application_profile: SeriesApplicationData.UserApplicationProfileData;     // User's profile relative to the series
        user_application: SeriesApplicationData.SavedUserApplicationData | null;        // User's saved application for the series, if they have one
    }

    /**
     * Server response when fetching data for the "Series Application" page (team)
     */
    export interface FetchTeamApplicationAPIResponse extends FetchAbstractApplicationApiResponse {
        user_application_profile: SeriesApplicationData.TeamApplicationProfileData;     // Team's profile relative to the series
        user_application: SeriesApplicationData.SavedTeamApplicationData | null;        // Team's saved application for the series, if they have one
    }

    /**
     * Server payload when saving a series application
     */
    export interface SaveApplicationAPIPayload {
        disciplines: SeriesApplicationData.SaveApplicationDisciplineData[];  // List of disciplines corresponding to series configuration with user selections
    }

    /**
     * Server payload when saving a series application (team)
     */
    export interface SaveApplicationTeamAPIPayload {
        disciplines: SeriesApplicationData.SaveApplicationDisciplineDataTeam[];  // List of disciplines corresponding to series configuration with user selections
    }

    /**
     * Server response when saving a series application
     *
     * Shared between "save" and "pay" buttons on series application page
     */
    export interface SaveApplicationAPIResponse extends APISubmissionResponse {
        cart_link: string;  // Link to the cart for the saved series application. Only used when "pay" button is clicked
    }

    /**
     * Server payload when updating a user's profile relative to the series application
     */
    export type UpdateProfileAPIPayload = {
        email: string;
    };

    /**
     * Server response when adding a skate test for a user during a series application
     */
    export interface AddSkateTestAPIResponse extends UserAddSkateTestAPIResponse {
        user_discipline_eligibility_update?: SeriesApplicationData.DisciplineLevelEligibilityData[];  // List of disciplines with changed eligibility levels as a result of the submission.
                                                                                                      // Contains complete level eligibility for disciplines with changes
    }

    /**
     * Server response when removing a skate test for a user during a series application
     */
    export interface RemoveSkateTestAPIResponse extends UserRemoveSkateTestAPIResponse {
        user_discipline_eligibility_update?: SeriesApplicationData.DisciplineLevelEligibilityData[];  // List of disciplines with changed eligibility levels as a result of the submission.
                                                                                                      // Contains complete level eligibility for disciplines with changes
    }

    /**
     * Server response when fetching form options for the Series Application Partner Search form
     */
    export interface PartnerSearchFormOptionsAPIResponse {
        states: StateFormOptionData[];
    }

    /**
     * Server response when fetching form options for the Series Application Coach Search form
     */
    export interface CoachSearchFormOptionsAPIResponse {
        states: StateFormOptionData[];
    }

    /**
     * Server response when running the partner search for a Series Application Discipline
     */
    export interface PartnerSearchAPIResponse extends MemberSearchResultAPIResponse {
        results: SeriesApplicationData.PartnerSearchResultData[];
    }

    /**
     * Server response when running the coach search for a Series Application Discipline
     */
    export interface CoachSearchAPIResponse extends MemberSearchResultAPIResponse {
        results: SeriesApplicationData.CoachSearchResultData[];
    }
}