/* eslint-disable jsdoc/require-jsdoc */
import {CheckInEntityOutstandingFee, CheckInEntityTypeKey} from '../../_contracts/CheckInEntityContracts';
import {AbstractCheckInEntity, CheckInEntityBaseParameters} from './AbstractCheckInEntity';

export interface CheckInEntityCoachParameters extends CheckInEntityBaseParameters {
    email: string | null;
    personal_schedule_url: string | null;
    phone: string | null;
    skater_count: number;
}

interface CheckInParameters {
    is_compliant: boolean;
}

export class CheckInEntityCoach extends AbstractCheckInEntity {
    check_in_fetch_required: boolean = true;
    coach_count: number = 0;
    email: string | null;
    entity_type_description: string = 'Coach';
    entity_type_key: CheckInEntityTypeKey = 'coach';
    events_complete: boolean = true;
    is_compliant: boolean = false;
    outstanding_fees: CheckInEntityOutstandingFee[] = [];
    personal_schedule_url: string | null;
    phone: string | null;
    roster_count: number = 0;
    skater_count: number;
    team_level: string | null = null;
    team_service_personnel_count: number = 0;
    unpaid_events: string[] = [];

    constructor(parameters: CheckInEntityCoachParameters) {
        super(parameters);
        const {email, personal_schedule_url, phone, skater_count} = parameters;
        this.email = email;
        this.personal_schedule_url = personal_schedule_url;
        this.phone = phone;
        this.skater_count = skater_count;
    }

    importCheckInData(params: CheckInParameters): void {
        super.importCheckInData(params);
        this.is_compliant = params.is_compliant;
    }
}