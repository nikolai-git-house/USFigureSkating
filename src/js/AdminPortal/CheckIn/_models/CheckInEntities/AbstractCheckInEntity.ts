import {UserLTSInformationSummary} from '../../../../contracts/app/UserContracts';
import {MemberNumber} from '../../../../contracts/AppContracts';
import {
    CheckInEntityCardEntity,
    CheckInEntityCheckInStatus,
    CheckInEntityIndexEntity,
    CheckInEntityOutstandingFee,
    CheckInEntityStateInterface,
    CheckInEntityTypeKey,
    CheckInIndexEntity
} from '../../_contracts/CheckInEntityContracts';

export interface CheckInEntityBaseParameters {
    check_in_status: CheckInEntityCheckInStatus;
    club: string | null;
    comment_count: number;
    eligible: boolean;
    id: string;
    lts_summary: UserLTSInformationSummary | null;
    member_number: MemberNumber;
    membership_status: {
        active: boolean;
        validity_date_formatted: string | null;
    };
    name: string;
}

export abstract class AbstractCheckInEntity implements CheckInEntityCardEntity, CheckInIndexEntity, CheckInEntityIndexEntity, CheckInEntityStateInterface {
    check_in_status: CheckInEntityCheckInStatus;
    club: string | null;
    comment_count: number;
    eligible: boolean;
    id: string;
    lts_summary: UserLTSInformationSummary | null;
    member_number: MemberNumber;
    membership_status: {
        active: boolean;
        validity_date_formatted: string | null;
    };

    name: string;
    abstract check_in_fetch_required: boolean;
    abstract coach_count: number;
    abstract email: string | null;
    abstract events_complete: boolean;
    abstract is_compliant: boolean;
    abstract outstanding_fees: CheckInEntityOutstandingFee[];
    abstract personal_schedule_url: string | null;
    abstract phone: string | null;
    abstract entity_type_description: string;
    abstract entity_type_key: CheckInEntityTypeKey;
    abstract roster_count: number;
    abstract skater_count: number;
    abstract team_level: string | null;
    abstract team_service_personnel_count: number;
    abstract unpaid_events: string[];

    /**
     * Create a new AbstractCheckInBaseEntity instance
     */
    constructor(parameters: CheckInEntityBaseParameters) {
        const {check_in_status, club, comment_count, eligible, id, lts_summary, member_number, membership_status, name} = parameters;
        this.check_in_status = check_in_status;
        this.club = club;
        this.comment_count = comment_count;
        this.eligible = eligible;
        this.id = id;
        this.member_number = member_number;
        this.membership_status = membership_status;
        this.name = name;
        this.lts_summary = lts_summary;
    }

    /**
     * The check-in index heading for the entity
     */
    get check_in_index_heading(): string {
        if (this.entity_type_key === 'team') {
            return 'Team Check-in';
        }

        return 'Check-in ' + this.entity_type_description;
    }

    /**
     * Whether the entity can check in in its current state
     */
    get check_in_permitted(): boolean {
        return this.entity_check_in_blocked_reason === null;
    }

    /**
     * Accessor for whether the entity is checked-in
     */
    get checked_in(): boolean {
        return this.check_in_status.checked_in;
    }

    /**
     * Accessor for who the entity was checked in by
     */
    get checked_in_by(): string | null {
        return this.check_in_status.checked_in_by;
    }

    /**
     * Accessor for when the entity was checked in
     */
    get checked_in_date_time_formatted(): string | null {
        return this.check_in_status.checked_in_date_time_formatted;
    }

    /**
     * The reason code behind why an entity cannot check in
     */
    get entity_check_in_blocked_reason(): string[] | null {
        const reasons = [];
        if (!this.eligible) {
            reasons.push('ineligible');
        }
        if (this.unpaid_events.length) {
            reasons.push('unpaid_events');
        }
        if (!this.events_complete) {
            reasons.push('events_incomplete');
        }
        if (!this.membership_status.active) {
            reasons.push('inactive_membership');
        }
        if (!this.is_compliant) {
            reasons.push('compliance_incomplete');
        }

        return reasons.length ? reasons : null;
    }

    /**
     * Get the summary name of the entity for
     */
    get summary_name(): string {
        if (this.entity_type_key === 'team') {
            return this.name + ' - ' + this.team_level;
        }

        return this.name;
    }

    /**
     * Import check-in index data
     */
    // eslint-disable-next-line
    importCheckInData(data: { [key: string]: any; }): void {
        this.check_in_fetch_required = false;
    }
}