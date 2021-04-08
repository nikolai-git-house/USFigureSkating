import {MemberNumber} from '../../contracts/AppContracts';

export namespace Teams {
    /**
     * Team compatible with select team page
     */
    export interface SelectTeamPageTeam extends SelectableTeam, SelectTeamListComponentTeam {
        name: string;
        level: string;
        id: string;
        member_number: MemberNumber;
        membership_status: {
            active: boolean;
            validity_date_formatted: string | null;
        };
        is_selectable: boolean;
        not_selectable_reason: string | null;
        not_selectable_link: string | null;
    }

    /**
     * A team that can be used within the select team service/API workflow
     */
    export interface SelectableTeam {
        id: string;
        name: string;
    }

    export type SelectTeamLinks = {
        competition_registration: string;
    }

    export interface TeamsLinks {
        competition_registration?: string;

        [key: string]: string | undefined;
    }

    export interface SelectTeamListComponentTeam {
        name: string;
        level: string;
        id: string;
        member_number: MemberNumber;
        membership_status: {
            active: boolean;
            validity_date_formatted: string | null;
        };
        is_selectable: boolean;
        not_selectable_reason: string | null;
        not_selectable_link: string | null;
    }
}