import {CompetitionPortalVolunteerData} from '../../../_contracts';

export namespace MyVolunteerScheduleData {
    /**
     * Represents a day in a user's volunteer schedule
     */
    export interface MyVolunteerScheduleDay {
        date_formatted: string;                 // The formatted date of the day in the schedule ("Mon 7/22")
        shifts: MyVolunteerScheduleShift[];     // The shifts in the user's schedule for that day (in order)
    }

    /**
     * A shift in a user's volunteer schedule
     */
    export interface MyVolunteerScheduleShift extends CompetitionPortalVolunteerData.VolunteerShift {
        is_approved: boolean;                   // Whether the shift is approved
        is_pending: boolean;                    // Whether the shift is pending
    }
}