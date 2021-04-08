/* eslint-disable jsdoc/require-jsdoc */
import {StatusMessageTypeKey} from '../../../contracts/AppContracts';
import {CompetitionPortalVolunteer, CompetitionPortalVolunteerService} from '../_contracts';

export class VolunteerShift implements CompetitionPortalVolunteerService.Shift {
    id: string;
    description: string;
    end_time_formatted: string;
    location_name: string;
    open_positions: number;
    openings_status: StatusMessageTypeKey;
    position_title: string;
    requires_compliance: boolean;
    start_time_formatted: string;
    total_positions: number;

    constructor(params: CompetitionPortalVolunteer.ShiftParams) {
        this.id = params.id;
        this.description = params.description;
        this.end_time_formatted = params.end_time_formatted;
        this.start_time_formatted = params.start_time_formatted;
        this.requires_compliance = params.requires_compliance;
        this.location_name = params.location_name;
        this.open_positions = params.open_positions;
        this.openings_status = params.openings_status;
        this.position_title = params.position_title;
        this.total_positions = params.total_positions;
    }
}