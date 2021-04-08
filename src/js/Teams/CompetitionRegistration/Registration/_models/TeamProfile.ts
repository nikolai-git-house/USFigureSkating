import {TeamRegistration} from '../_contracts';
import {MemberNumber} from '../../../../contracts/AppContracts';

export interface TeamProfileParameters {
    id: string;
    club: string;
    level: string;
    member_number: MemberNumber;
    membership_end_date: string;
    membership_expired: boolean;
    name: string;
    section: string | null;
}

export class TeamProfile implements TeamRegistration.TeamVerificationTeamInformation {
    id: string;
    club: string;
    level: string;
    member_number: MemberNumber;
    membership_end_date: string;
    membership_expired: boolean;
    name: string;
    section: string | null;

    constructor(params: TeamProfileParameters) {
        this.id = params.id;
        this.club = params.club;
        this.level = params.level;
        this.member_number = params.member_number;
        this.membership_end_date = params.membership_end_date;
        this.membership_expired = params.membership_expired;
        this.name = params.name;
        this.section = params.section;
    }
}