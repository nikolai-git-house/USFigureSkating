/* eslint-disable jsdoc/require-jsdoc */
import {MyVolunteerSchedulePage} from '../_contracts';
import {MyVolunteerScheduleShift} from './MyVolunteerScheduleShift';

interface ConstructorParams {
    id: number;
    date_formatted: string;
    shifts: MyVolunteerScheduleShift[];
}

export class MyVolunteerScheduleDay implements MyVolunteerSchedulePage.ScheduleDay {
    id: number;
    date_formatted: string;
    shifts: MyVolunteerScheduleShift[];

    constructor(params: ConstructorParams) {
        this.date_formatted = params.date_formatted;
        this.shifts = params.shifts;
        this.id = params.id;
    }
}