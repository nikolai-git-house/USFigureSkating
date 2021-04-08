import {TeamRegistration} from '../_contracts';
import {AbstractTeamEntity} from './AbstractTeamEntity';

export class TeamServicePerson extends AbstractTeamEntity implements TeamRegistration.TeamServicePersonnelPageMember {

    get supporting_information(): string {
        return `(${this.member_number})`;
    }
}