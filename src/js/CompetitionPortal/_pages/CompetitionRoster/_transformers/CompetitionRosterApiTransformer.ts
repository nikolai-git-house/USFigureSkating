/* eslint-disable jsdoc/require-jsdoc */
import {CompetitionRosterApi, CompetitionRosterData, CompetitionRosterService} from '../_contracts';
import {CompetitionPortalRosterMember} from '../_models';
import {CompetitionPortalApiTransformer} from '../../../_transformers/CompetitionPortalApiTransformer';
import {TeamRegistrationData} from '../../../../Teams/CompetitionRegistration/Registration/_contracts';
import {TeamRegistrationCompetitionRosterApiTransformer} from '../../../../Teams/CompetitionRegistration/Registration/_transformers/TeamRegistrationCompetitionRosterApiTransformer';

export class CompetitionRosterApiTransformer {

    static transformFetchCompetitionRoster(response: CompetitionRosterApi.FetchCompetitionRosterApiResponse): CompetitionRosterService.FetchCompetitionRosterServiceResponse {
        return {
            ...CompetitionPortalApiTransformer.transformFetchCompetitionPortalCore(response),
            competition_roster: response.competition_roster.map((member_data: CompetitionRosterData.CompetitionRosterMember) => {
                return this.transformCompetitionRosterMember(member_data);
            }),
            download_link: response.download_link,
            roster_rules: response.roster_rules.slice(),
            roster_minimum: response.roster_minimum || null,
            roster_maximum: response.roster_maximum || null,
            roster_can_be_edited: !response.roster_edit_disabled,
            page_introduction: response.page_introduction
        };
    }

    static transformCompetitionRosterMember(member_data: CompetitionRosterData.CompetitionRosterMember) {
        return new CompetitionPortalRosterMember({
            ...member_data
        });
    }

    static transformFetchTeamRoster(response: CompetitionRosterApi.FetchTeamRosterApiResponse): CompetitionRosterService.FetchTeamRosterServiceResponse {
        return {
            team_roster: response.team_roster.map((member_data: TeamRegistrationData.TeamRosterMemberData) => {
                return TeamRegistrationCompetitionRosterApiTransformer.transformRosterMember(member_data);
            })
        };
    }

    static transformUpdateCompetitionRoster(response: CompetitionRosterApi.UpdateCompetitionRosterApiResponse): CompetitionRosterService.UpdateCompetitionRosterServiceResponse {
        return {
            competition_roster: response.competition_roster.map((member_data: CompetitionRosterData.CompetitionRosterMember) => {
                return CompetitionRosterApiTransformer.transformCompetitionRosterMember(member_data);
            })
        };
    }
}