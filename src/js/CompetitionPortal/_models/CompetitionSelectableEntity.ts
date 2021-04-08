/* eslint-disable jsdoc/require-jsdoc */
import {MemberNumber} from '../../contracts/AppContracts';
import {SelectEntityPage} from '../_pages/SelectCompetitionEntity/_contracts';
import {Teams} from '../../Teams/_contracts';

type CompetitionSelectableEntityParameters = {
    id: string;
    level?: string;
    member_number: string | number;
    membership_status: {
        active: boolean;
        validity_date_formatted: string;
    };
    name: string;
    links: CompetitionSelectableEntityLinks;
};

type CompetitionSelectableEntityLinks = { [key: string]: string; competition_portal: string; };

export class CompetitionSelectableEntity implements SelectEntityPage.Entity, Teams.SelectTeamListComponentTeam {
    id: string;
    level: string;
    member_number: MemberNumber;
    name: string;
    links: CompetitionSelectableEntityLinks;

    membership_status: {
        active: boolean;
        validity_date_formatted: string;
    };

    selection_information: {
        is_selectable: boolean;
        is_not_selectable_reason?: string;
        not_selectable_link?: string;
    } = {
        is_selectable: true
    };

    constructor(params: CompetitionSelectableEntityParameters) {
        this.id = params.id;
        this.level = params.level || '';
        this.member_number = params.member_number;
        this.membership_status = {
            ...params.membership_status
        };
        this.name = params.name;
        this.links = {
            ...params.links
        };
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