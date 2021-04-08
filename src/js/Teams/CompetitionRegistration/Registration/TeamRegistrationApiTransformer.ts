import {TeamRegistrationApi, TeamRegistrationData, TeamRegistrationService} from './_contracts';
import {CompetitionSummary, RegistrationOverview, TeamProfile, TeamSummary} from './_models';

export class TeamRegistrationApiTransformer {
    static transformFetchShellApiResponse(data: TeamRegistrationApi.FetchShellApiResponse): TeamRegistrationService.FetchShellServiceResponse {
        return {
            team: new TeamSummary(data.team),
            competition: new CompetitionSummary(data.competition)
        };
    }

    /**
     * Transform the fetch team verification response
     */
    static transformFetchTeamVerification(data: TeamRegistrationApi.FetchTeamVerificationApiResponse): TeamRegistrationService.FetchTeamVerificationServiceResponse {
        return {
            team_profile: TeamRegistrationApiTransformer.transformTeamProfile(data.team_profile)
        };
    }

    /**
     * Transform registration overview information
     */
    static transformFetchRegistrationOverview(response: TeamRegistrationApi.FetchRegistrationOverviewApiResponse): TeamRegistrationService.FetchRegistrationOverviewServiceResponse {
        const overview_data = response;
        const params = {
            /**
             * Map items to ensure anchors open in a new tab
             */
            registration_information: overview_data.registration_information.map((item: string): string => {
                const div = document.createElement('div');
                div.innerHTML = item;
                const anchors = div.querySelectorAll('a');
                for (let i = 0; i < anchors.length; i++) {
                    const anchor = anchors[i];
                    anchor.setAttribute('target', '_blank');
                    anchor.setAttribute('rel', 'noopener noreferrer');
                }

                return div.innerHTML;
            }),
            rulebook_year: overview_data.rulebook_year,
            pricing_tables: response.price_information.slice()
        };

        return {overview: new RegistrationOverview(params)};
    }

    /**
     * Transform team profile information
     */
    private static transformTeamProfile(team_profile: TeamRegistrationData.TeamProfile): TeamProfile {
        return new TeamProfile({
            id: team_profile.id,
            club: team_profile.club,
            level: team_profile.level,
            member_number: team_profile.member_number,
            membership_end_date: team_profile.membership_status.validity_date_formatted,
            membership_expired: !team_profile.membership_status.active,
            name: team_profile.name,
            section: team_profile.section || null
        });
    }
}