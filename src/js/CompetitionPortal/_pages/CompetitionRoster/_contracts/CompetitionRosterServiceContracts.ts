import {CompetitionPortalService} from '../../../_contracts';
import {CompetitionPortalRosterMember} from '../_models';
import {TeamRosterMember} from '../../../../Teams/CompetitionRegistration/Registration/_models/TeamRosterMember';

export namespace CompetitionRosterService {
    /**
     * Service response when fetching competition roster page
     */
    export interface FetchCompetitionRosterServiceResponse extends CompetitionPortalService.FetchCompetitionPortalCoreServiceResponse {
        competition_roster: CompetitionPortalRosterMember[];
        download_link: string;
        roster_can_be_edited: boolean;
        roster_rules: string[];
        roster_minimum: number | null;
        roster_maximum: number | null;
        page_introduction: string;
    }

    /**
     * Service response when fetching the full team roster for edit
     */
    export interface FetchTeamRosterServiceResponse {
        team_roster: TeamRosterMember[];
    }

    /**
     * Service response when updating competition roster
     */
    export interface UpdateCompetitionRosterServiceResponse {
        competition_roster: CompetitionPortalRosterMember[];
    }
}