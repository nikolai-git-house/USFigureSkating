import {Teams} from '../_contracts';
import {MemberNumber} from '../../contracts/AppContracts';
import {MyTeamsPage} from '../../CompetitionPortal/_pages/MyTeams/_contracts';
import SelectTeamPageTeam = Teams.SelectTeamPageTeam;
import SelectTeamListComponentTeam = Teams.SelectTeamListComponentTeam;

export interface ManagedTeamParameters {
    id: string;
    level: string;
    member_number: string | number;
    membership_status: {
        active: boolean;
        validity_date_formatted: string;
    };
    name: string;
    selection_information: {
        is_selectable: boolean;
        is_not_selectable_reason?: string;
        not_selectable_link?: string;
    };
}

type ManagedTeamLinks = { [key: string]: string; competition_portal: string; };

export class ManagedTeam implements SelectTeamPageTeam, SelectTeamListComponentTeam, MyTeamsPage.Team {
    id: string;
    level: string;
    member_number: MemberNumber;
    membership_status: {
        active: boolean;
        validity_date_formatted: string;
    };

    name: string;
    selection_information: {
        is_selectable: boolean;
        is_not_selectable_reason?: string;
        not_selectable_link?: string;
    };

    constructor(params: ManagedTeamParameters) {
        this.id = params.id;
        this.level = params.level;
        this.member_number = params.member_number;
        this.membership_status = {
            ...params.membership_status
        };
        this.name = params.name;
        this.selection_information = {
            ...params.selection_information
        };
    }

    private _links: ManagedTeamLinks = {
        competition_portal: ''
    };

    get links(): ManagedTeamLinks {
        return this._links;
    }

    set links(value: ManagedTeamLinks) {
        this._links = value;
    }

    get is_selectable(): boolean {
        return this.selection_information.is_selectable;
    }

    get not_selectable_reason(): string | null {
        if ('is_not_selectable_reason' in this.selection_information && this.selection_information.is_not_selectable_reason) {
            return this.selection_information.is_not_selectable_reason;
        }

        return null;
    }

    get not_selectable_link(): string | null {
        if ('not_selectable_link' in this.selection_information && this.selection_information.not_selectable_link) {
            return this.selection_information.not_selectable_link;
        }

        return null;
    }
}