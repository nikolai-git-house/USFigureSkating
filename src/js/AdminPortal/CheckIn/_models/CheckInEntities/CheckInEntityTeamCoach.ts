/* eslint-disable jsdoc/require-jsdoc */
import {CheckInEntityOutstandingFee, CheckInEntityTypeKey} from '../../_contracts/CheckInEntityContracts';
import {AbstractCheckInEntity, CheckInEntityBaseParameters} from './AbstractCheckInEntity';

export interface CheckInEntityTeamCoachParameters extends CheckInEntityBaseParameters {
    email: string | null;
    personal_schedule_url: string | null;
    phone: string | null;
}

interface CheckInParameters {
    is_compliant: boolean;
}

export class CheckInEntityTeamCoach extends AbstractCheckInEntity {
    check_in_fetch_required: boolean = true;
    coach_count: number = 0;
    email: string | null;
    entity_type_description: string = 'Team Coach';
    entity_type_key: CheckInEntityTypeKey = 'team_coach';
    events_complete: boolean = true;
    is_compliant: boolean = false;
    outstanding_fees: CheckInEntityOutstandingFee[] = [];
    personal_schedule_url: string | null;
    phone: string | null;
    roster_count: number = 0;
    skater_count: number = 0;
    team_level: string | null = null;
    team_service_personnel_count: number = 0;
    unpaid_events: string[] = [];

    constructor(parameters: CheckInEntityTeamCoachParameters) {
        super(parameters);
        const {email, personal_schedule_url, phone} = parameters;
        this.email = email;
        this.personal_schedule_url = personal_schedule_url;
        this.phone = phone;
    }

    importCheckInData(params: CheckInParameters): void {
        super.importCheckInData(params);
        this.is_compliant = params.is_compliant;
    }
}