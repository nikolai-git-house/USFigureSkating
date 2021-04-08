/* eslint-disable jsdoc/require-jsdoc */
import {MyVolunteerSchedulePage} from '../_contracts';
import {CompetitionPortalVolunteer, CompetitionPortalVolunteerService} from '../../../_contracts';
import {VolunteerShift} from '../../../_models';

interface MyVolunteerScheduleShiftParams extends CompetitionPortalVolunteer.ShiftParams {
    is_approved: boolean;
    is_pending: boolean;
    schedule_day_id: number;
}

export class MyVolunteerScheduleShift extends VolunteerShift implements MyVolunteerSchedulePage.Shift, CompetitionPortalVolunteerService.Shift {
    is_approved: boolean;
    is_pending: boolean;
    schedule_day_id: number;

    constructor(params: MyVolunteerScheduleShiftParams) {
        super(params);
        this.is_approved = params.is_approved;
        this.is_pending = params.is_pending;
        this.schedule_day_id = params.schedule_day_id;
    }
}