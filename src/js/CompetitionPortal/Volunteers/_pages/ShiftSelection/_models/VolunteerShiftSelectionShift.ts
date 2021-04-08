import {VolunteerShiftSelection, VolunteerShiftSelectionPage} from '../_contracts';
import {CompetitionPortalVolunteer, CompetitionPortalVolunteerService} from '../../../_contracts';
import {VolunteerShift} from '../../../_models';
import {StatusMessageTypeKey} from '../../../../../contracts/AppContracts';

interface VolunteerShiftSelectionShiftParams extends CompetitionPortalVolunteer.ShiftParams {
    date_ts: number;
    date_formatted: string;
    location_id: string;
    status: VolunteerShiftSelection.ShiftStatusModel;
    start_datetime_ts: number;
    end_datetime_ts: number;
}

type PostInteractionResult = {
    open_positions: number;
    openings_status: StatusMessageTypeKey;
    shift_status: VolunteerShiftSelection.ShiftStatusModel;
}

export class VolunteerShiftSelectionShift extends VolunteerShift implements VolunteerShiftSelectionPage.Shift, CompetitionPortalVolunteerService.Shift, VolunteerShiftSelection.FilterableShift {
    date_ts: number;
    date_formatted: string;
    location_id: string;
    start_datetime_ts: number;
    end_datetime_ts: number;
    _status: VolunteerShiftSelection.ShiftStatusModel;

    /**
     * Create a new instance
     */
    constructor(params: VolunteerShiftSelectionShiftParams) {
        super(params);
        this.date_ts = params.date_ts;
        this.date_formatted = params.date_formatted;
        this.location_id = params.location_id;
        this.start_datetime_ts = params.start_datetime_ts;
        this.end_datetime_ts = params.end_datetime_ts;
        this._status = params.status;
    }

    /**
     * Get the status
     */
    get status(): VolunteerShiftSelection.ShiftStatusModel {
        if (this._status === 'new' && this.open_positions === 0) {
            return VolunteerShiftSelection.ShiftStatus.no_availability;
        }

        return this._status;
    }

    /**
     * Set the status
     */
    set status(value: VolunteerShiftSelection.ShiftStatusModel) {
        this._status = value;
    }

    /**
     * Whether the shift can enter the 'conflict' status state
     */
    get can_conflict(): boolean {
        return this.status === 'new';
    }

    /**
     * Update shift following its selection or removal
     */
    updatePostInteraction(result: PostInteractionResult): void {
        this.open_positions = result.open_positions;
        this.openings_status = result.openings_status;
        this.status = result.shift_status;
    }
}