/* eslint-disable jsdoc/require-jsdoc */
import {MemberNumber} from '../../../../contracts/AppContracts';
import {
    CompetitionManagementContactPosition,
    CompetitionManagementContactsIndexEntityInterface
} from '../_contracts/CompetitionManagementContactsContracts';

interface CompetitionManagementContactParameters {
    email_address: string;
    first_name: string;
    id: number;
    is_compliant: boolean;
    is_display: boolean;
    last_name: string;
    member_number: MemberNumber;
    phone_number: string;
    position: CompetitionManagementContactPosition;
}

export class CompetitionManagementContact implements CompetitionManagementContactsIndexEntityInterface {
    email_address: string;
    first_name: string;
    id: number;
    is_compliant: boolean;
    is_display: boolean;
    last_name: string;
    member_number: MemberNumber;
    phone_number: string;
    position: CompetitionManagementContactPosition;

    constructor(parameters: CompetitionManagementContactParameters) {
        const {email_address, first_name, id, is_compliant, is_display, last_name, member_number, phone_number, position} = parameters;
        this.email_address = email_address;
        this.first_name = first_name;
        this.id = id;
        this.is_compliant = is_compliant;
        this.is_display = is_display;
        this.last_name = last_name;
        this.member_number = member_number;
        this.phone_number = phone_number;
        this.position = position;
    }

    get full_name(): string {
        return [this.first_name, this.last_name].join(' ');
    }

    get positions(): CompetitionManagementContactPosition[] {
        return [this.position];
    }
}