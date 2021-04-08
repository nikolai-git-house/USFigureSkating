import {TeamRegistration} from '../_contracts';
import {MemberNumber} from '../../../../contracts/AppContracts';

export interface AbstractTeamEntityParameters {
    can_be_added_to_roster: boolean;
    cannot_be_added_to_roster_reason?: string;
    first_name: string;
    id: string;
    last_name: string;
    member_number: MemberNumber;
}

export abstract class AbstractTeamEntity implements TeamRegistration.RosterEditMember {
    can_be_added_to_roster: boolean;
    cannot_be_added_to_roster_reason?: string;
    first_name: string;
    id: string;
    last_name: string;
    member_number: MemberNumber;

    constructor(params: AbstractTeamEntityParameters) {
        this.can_be_added_to_roster = params.can_be_added_to_roster;
        this.cannot_be_added_to_roster_reason = params.cannot_be_added_to_roster_reason;
        this.first_name = params.first_name;
        this.id = params.id;
        this.last_name = params.last_name;
        this.member_number = params.member_number;
    }

    abstract get supporting_information(): string;
}