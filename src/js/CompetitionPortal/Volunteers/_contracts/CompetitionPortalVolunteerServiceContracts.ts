import {CompetitionPortalService} from '../../_contracts';
import {VolunteerShiftSelectionLocation, VolunteerShiftSelectionShift} from '../_pages/ShiftSelection/_models';
import {VolunteerShiftSelection} from '../_pages/ShiftSelection/_contracts';
import {CompetitionContact, StatusMessageTypeKey} from '../../../contracts/AppContracts';
import {MyVolunteerScheduleDay} from '../_pages/MySchedule/_models';
import {CompetitionPortalVolunteer} from './CompetitionPortalVolunteerContracts';

export namespace CompetitionPortalVolunteerService {

    /**
     * Service response when fetching my volunteer schedule page data
     */
    export interface FetchMyVolunteerScheduleServiceResponse extends CompetitionPortalService.FetchCompetitionPortalCoreServiceResponse {
        links: CompetitionPortalVolunteer.MyVolunteerScheduleLinks;
        schedule: MyVolunteerScheduleDay[];
        user_is_compliant: boolean;
        contacts: CompetitionContact[];
    }

    /**
     * Service response when fetching shift selection page data
     */
    export interface FetchShiftSelectionServiceResponse extends CompetitionPortalService.FetchCompetitionPortalCoreServiceResponse {
        links: CompetitionPortalVolunteer.ShiftSelectionLinks;
        shifts: VolunteerShiftSelectionShift[];
        locations: VolunteerShiftSelectionLocation[];
        selected_filters: VolunteerShiftSelection.ShiftSelectionSelectedFilters;
        available_filters: VolunteerShiftSelection.ShiftSelectionAvailableFilters;
        conflict_windows: VolunteerShiftSelection.ConflictWindow[];
        user_is_compliant: boolean;
        selection_open: boolean;
    }

    /**
     * Service response when selecting a volunteer shift
     */
    export interface SelectVolunteerShiftServiceResponse {
        open_positions: number;
        openings_status: StatusMessageTypeKey;
        shift_status: VolunteerShiftSelection.ShiftStatusPostSelection;
    }

    /**
     * Service response when removing a volunteer shift
     */
    export interface RemoveVolunteerShiftServiceResponse {
        open_positions: number;
        openings_status: StatusMessageTypeKey;
    }

    /**
     * A shift supplied to a service method for API interaction (add/remove)
     */
    export interface Shift {
        id: string;
    }
}