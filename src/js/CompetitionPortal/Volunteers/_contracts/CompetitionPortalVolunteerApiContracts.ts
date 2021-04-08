import {CompetitionPortalApi} from '../../_contracts';
import {VolunteerShiftSelectionData} from '../_pages/ShiftSelection/_contracts/VolunteerShiftSelectionDataContracts';
import {APISubmissionResponse} from '../../../contracts/release3/api/CommonAPIContracts';
import {MyVolunteerScheduleData} from '../_pages/MySchedule/_contracts';
import {CompetitionContactData} from '../../../contracts/data/DataContracts';

export namespace CompetitionPortalVolunteerApi {

    /**
     * API response when fetching information for the Competition Portal "My Volunteer Schedule" page
     */
    export interface FetchMyVolunteerScheduleApiResponse extends CompetitionPortalApi.FetchCompetitionPortalCoreApiResponse {
        links: {                                                        // Links present on the volunteer schedule page
            download_schedule: string;                                      // Link to download the user's volunteer schedule
            product_support: string;                                        // Link to EMS product support form
            user_compliance: string;                                        // Link to location where user can review/resolve compliance issues
        };
        schedule: MyVolunteerScheduleData.MyVolunteerScheduleDay[];     // The user's schedule
        user_is_compliant: boolean;                                     // Whether the user is compliant
        volunteer_contacts: CompetitionContactData[];                   // Volunteer contacts to display (in desired order)
    }

    /**
     * API response when fetching information for the Competition Portal Volunteer "Shift Selection" page
     */
    export interface FetchShiftSelectionApiResponse extends CompetitionPortalApi.FetchCompetitionPortalCoreApiResponse {
        links: {                                                                // Links for shift selection
            download_schedule: string;                                              // Link to download the full schedule
            user_compliance: string;                                                // Link to location where user can review/resolve compliance issues
        };
        schedule?: {                                                             // Volunteer schedule information.  If not provided, "Shift selection is not currently available" will display
            locations: VolunteerShiftSelectionData.Location[];                      // The locations for the schedule (in desired display order)
            shifts: VolunteerShiftSelectionData.Shift[];                            // The shifts for the schedule. Shifts will be ordered client-side by ascending `start_datetime_ts`
        };
        selected_shifts?: VolunteerShiftSelectionData.SelectedShiftStatus[];    // Key indicating the shifts selected by the users and the corresponding status of each (approved, pending, denied, etc)
        user_is_compliant: boolean;                                             // Whether the user is compliant
        selection_open: boolean;                                                // Whether selection is open
    }

    /**
     * API response when selecting a volunteer shift
     */
    export interface SelectVolunteerShiftApiResponse extends APISubmissionResponse {
        result: VolunteerShiftSelectionData.ShiftSelectionChangeSelectedResponseData;      // Information about the shift following the selection
    }

    /**
     * API response when removing a volunteer shift
     */
    export interface RemoveVolunteerShiftApiResponse extends APISubmissionResponse {
        result: VolunteerShiftSelectionData.ShiftSelectionChangeRemovedResponseData;       // Information about the shift following the removal
    }
}