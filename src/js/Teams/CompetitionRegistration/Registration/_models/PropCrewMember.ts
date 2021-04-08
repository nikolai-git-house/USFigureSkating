import {TeamRegistration} from '../_contracts';
import {AbstractTeamEntity} from './AbstractTeamEntity';

export class PropCrewMember extends AbstractTeamEntity implements TeamRegistration.PropCrewPageMember {

    get supporting_information(): string {
        return `(${this.member_number})`;
    }
}