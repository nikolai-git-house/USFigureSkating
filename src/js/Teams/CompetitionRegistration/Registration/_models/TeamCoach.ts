import {TeamRegistration} from '../_contracts';
import {AbstractTeamEntity} from './AbstractTeamEntity';

export class TeamCoach extends AbstractTeamEntity implements TeamRegistration.CoachesPageMember {

    get supporting_information(): string {
        return `(${this.member_number})`;
    }
}