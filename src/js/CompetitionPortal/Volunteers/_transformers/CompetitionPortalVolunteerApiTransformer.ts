import {CompetitionPortalApiTransformer} from '../../_transformers/CompetitionPortalApiTransformer';
import {
    CompetitionPortalVolunteer,
    CompetitionPortalVolunteerApi,
    CompetitionPortalVolunteerData,
    CompetitionPortalVolunteerService
} from '../_contracts';
import {CompetitionPortalMyVolunteerScheduleTransformer} from '../_pages/MySchedule/_transformers/CompetitionPortalMyVolunteerScheduleTransformer';
import {CompetitionPortalShiftSelectionTransformer} from '../_pages/ShiftSelection/_transformers/CompetitionPortalShiftSelectionTransformer';
import {VolunteerShiftSelection} from '../_pages/ShiftSelection/_contracts';
import {CompetitionContactDataAdaptor} from '../../../adaptors/CompetitionContactDataAdaptor';

export class CompetitionPortalVolunteerApiTransformer extends CompetitionPortalApiTransformer {
    /**
     * Transform base shift data into shift params
     */
    static transformShiftParams(data: CompetitionPortalVolunteerData.VolunteerShift): CompetitionPortalVolunteer.ShiftParams {
        return {
            id: data.id,
            description: data.description,
            end_time_formatted: data.end_time_formatted,
            start_time_formatted: data.start_time_formatted,
            requires_compliance: data.requires_compliance,
            location_name: data.location_name,
            open_positions: data.open_positions,
            openings_status: data.openings_status || 'default',
            position_title: data.position_title,
            total_positions: data.total_positions
        };
    }

    /**
     * Transform API response when fetching my volunteer schedule page
     */
    static transformFetchMyVolunteerSchedule(response: CompetitionPortalVolunteerApi.FetchMyVolunteerScheduleApiResponse): CompetitionPortalVolunteerService.FetchMyVolunteerScheduleServiceResponse {
        return {
            ...this.transformFetchCompetitionPortalCore(response),
            ...CompetitionPortalMyVolunteerScheduleTransformer.transformFetchMyVolunteerSchedule(response),
            contacts: CompetitionContactDataAdaptor.adaptArray(response.volunteer_contacts)
        };
    }

    /**
     * Transform the API response when fetching shift selection page data
     */
    static transformFetchVolunteerShiftSelection(response: CompetitionPortalVolunteerApi.FetchShiftSelectionApiResponse): CompetitionPortalVolunteerService.FetchShiftSelectionServiceResponse {
        return {
            ...this.transformFetchCompetitionPortalCore(response),
            ...CompetitionPortalShiftSelectionTransformer.transformFetchVolunteerShiftSelection(response),
            links: {
                ...response.links
            }
        };
    }

    /**
     * Transform the API response when selecting a shift
     */
    static transformSelectVolunteerShiftApiResponse(response: CompetitionPortalVolunteerApi.SelectVolunteerShiftApiResponse): CompetitionPortalVolunteerService.SelectVolunteerShiftServiceResponse {
        return {
            open_positions: response.result.open_positions,
            openings_status: response.result.openings_status || 'default',
            shift_status: VolunteerShiftSelection.ShiftStatus[response.result.selection_result]
        };
    }

    /**
     * Transform the API response when removing a shift
     */
    static transformRemoveVolunteerShiftApiResponse(response: CompetitionPortalVolunteerApi.RemoveVolunteerShiftApiResponse): CompetitionPortalVolunteerService.RemoveVolunteerShiftServiceResponse {
        return {
            open_positions: response.result.open_positions,
            openings_status: response.result.openings_status || 'default'
        };
    }
}