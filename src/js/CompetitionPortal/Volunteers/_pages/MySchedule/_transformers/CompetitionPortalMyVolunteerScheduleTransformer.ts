import {MyVolunteerScheduleDay, MyVolunteerScheduleShift} from '../_models';
import {MyVolunteerScheduleData} from '../_contracts';
import {CompetitionPortalVolunteerApiTransformer} from '../../../_transformers/CompetitionPortalVolunteerApiTransformer';
import {CompetitionPortalVolunteerApi} from '../../../_contracts';

export class CompetitionPortalMyVolunteerScheduleTransformer {

    /**
     * Transform page-specific API response data when fetching my volunteer schedule page
     */
    static transformFetchMyVolunteerSchedule(response: CompetitionPortalVolunteerApi.FetchMyVolunteerScheduleApiResponse) {
        return {
            links: {
                ...response.links
            },
            schedule: CompetitionPortalMyVolunteerScheduleTransformer.transformMyVolunteerSchedule(response.schedule),
            user_is_compliant: response.user_is_compliant
        };
    }

    /**
     * Transform my volunteer schedule data
     */
    static transformMyVolunteerSchedule(schedule: MyVolunteerScheduleData.MyVolunteerScheduleDay[]): MyVolunteerScheduleDay[] {
        let current_day_id = 1;

        return schedule.map((day_data) => {
            const day_id = current_day_id++;

            return new MyVolunteerScheduleDay({
                id: day_id,
                date_formatted: day_data.date_formatted,
                shifts: day_data.shifts.map((shift_data: MyVolunteerScheduleData.MyVolunteerScheduleShift) => {
                    return this.transformShift(shift_data, day_id);
                })
            });
        });
    }

    /**
     * Transform a my volunteer schedule shift
     */
    private static transformShift(shift_data: MyVolunteerScheduleData.MyVolunteerScheduleShift, day_id: number): MyVolunteerScheduleShift {
        return new MyVolunteerScheduleShift({
            ...CompetitionPortalVolunteerApiTransformer.transformShiftParams(shift_data),
            schedule_day_id: day_id,
            is_approved: shift_data.is_approved,
            is_pending: shift_data.is_pending
        });
    }
}