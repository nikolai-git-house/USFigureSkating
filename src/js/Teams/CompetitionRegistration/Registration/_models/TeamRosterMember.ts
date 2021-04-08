import {TeamRegistration} from '../_contracts';
import {AbstractTeamEntity, AbstractTeamEntityParameters} from './AbstractTeamEntity';
import RosterPageMember = TeamRegistration.RosterPageMember;

interface TeamRosterMemberParams extends AbstractTeamEntityParameters {
    age: number;
}

export class TeamRosterMember extends AbstractTeamEntity implements RosterPageMember {
    age: number;

    constructor(params: TeamRosterMemberParams) {
        super(params);
        this.age = params.age;
    }

    get supporting_information(): string {
        return `(${this.member_number}) Age:${this.age}`;
    }
}