/* eslint-disable jsdoc/require-jsdoc */
import {CheckInEntityOutstandingFee, CheckInEntityTypeKey} from '../../_contracts/CheckInEntityContracts';
import {AbstractCheckInEntity, CheckInEntityBaseParameters} from './AbstractCheckInEntity';

export interface CheckInEntitySkaterParameters extends CheckInEntityBaseParameters {
    coach_count: number;
    events_complete: boolean;
    outstanding_fees: CheckInEntityOutstandingFee[];
    personal_schedule_url: string | null;
    unpaid_events: string[];
}

interface CheckInParameters {
}

export class CheckInEntitySkater extends AbstractCheckInEntity {
    check_in_fetch_required: boolean = false;
    coach_count: number;
    email: string | null = null;
    entity_type_description: string = 'Skater';
    entity_type_key: CheckInEntityTypeKey = 'skater';
    events_complete: boolean;
    is_compliant: boolean = true;
    outstanding_fees: CheckInEntityOutstandingFee[];
    personal_schedule_url: string | null;
    phone: string | null = null;
    roster_count: number = 0;
    skater_count: number = 0;
    team_level: string | null = null;
    team_service_personnel_count: number = 0;
    unpaid_events: string[];

    constructor(parameters: CheckInEntitySkaterParameters) {
        super(parameters);
        const {coach_count, events_complete, outstanding_fees, personal_schedule_url, unpaid_events} = parameters;
        this.coach_count = coach_count;
        this.events_complete = events_complete;
        this.outstanding_fees = outstanding_fees;
        this.personal_schedule_url = personal_schedule_url;
        this.unpaid_events = unpaid_events;
    }

    importCheckInData(params: CheckInParameters): void {
        super.importCheckInData(params);
    }
}