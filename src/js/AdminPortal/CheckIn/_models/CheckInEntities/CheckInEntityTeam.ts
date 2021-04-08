/* eslint-disable jsdoc/require-jsdoc */
import {CheckInEntityOutstandingFee, CheckInEntityTypeKey} from '../../_contracts/CheckInEntityContracts';
import {AbstractCheckInEntity, CheckInEntityBaseParameters} from './AbstractCheckInEntity';

export interface CheckInEntityTeamParameters extends CheckInEntityBaseParameters {
    coach_count: number;
    events_complete: boolean;
    outstanding_fees: CheckInEntityOutstandingFee[];
    roster_count: number;
    team_level: string;
    team_service_personnel_count: number;
    unpaid_events: string[];
}

interface CheckInParameters {
}

export class CheckInEntityTeam extends AbstractCheckInEntity {
    check_in_fetch_required: boolean = false;
    coach_count: number;
    email: string | null = null;
    entity_type_description: string = 'Team';
    entity_type_key: CheckInEntityTypeKey = 'team';
    events_complete: boolean;
    is_compliant: boolean = true;
    outstanding_fees: CheckInEntityOutstandingFee[];
    personal_schedule_url: string | null = null;
    phone: string | null = null;
    roster_count: number;
    skater_count: number = 0;
    team_level: string;
    team_service_personnel_count: number;
    unpaid_events: string[];

    constructor(parameters: CheckInEntityTeamParameters) {
        super(parameters);
        const {
            coach_count,
            events_complete,
            outstanding_fees,
            roster_count,
            team_level,
            team_service_personnel_count,
            unpaid_events
        } = parameters;
        this.coach_count = coach_count;
        this.events_complete = events_complete;
        this.outstanding_fees = outstanding_fees;
        this.roster_count = roster_count;
        this.team_level = team_level;
        this.team_service_personnel_count = team_service_personnel_count;
        this.unpaid_events = unpaid_events;
    }

    importCheckInData(params: CheckInParameters): void {
        super.importCheckInData(params);
    }
}