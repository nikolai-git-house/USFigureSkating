import {MyVolunteerScheduleShiftCard} from '../_components/MyVolunteerScheduleShiftCard/_contracts';

export namespace MyVolunteerSchedulePage {
    /**
     * A day compatible with the MVS page
     */
    export interface ScheduleDay {
        id: number;
        date_formatted: string;
        shifts: Shift[];
    }

    /**
     * A shift compatible with the MVS page
     */
    export interface Shift extends MyVolunteerScheduleShiftCard.Shift {
        id: string;
    }
}