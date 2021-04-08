import {TeamsApi, TeamsData, TeamsService} from './_contracts';
import {ManagedTeam} from './_models/ManagedTeam';
import {MyCompetitionsTeamsCompetition} from './_models';

export class TeamsApiTransformer {
    public static transformFetchManagedTeams(data: TeamsApi.FetchManagedTeamsApiResponse): TeamsService.FetchManagedTeamsServiceResponse {
        return {
            teams: TeamsApiTransformer.transformManagedTeams(data.teams),
            selection_links: {
                ...data.selection_links
            }
        };
    }

    public static transformManagedTeams<I extends TeamsData.ExtendedManagedTeam>(teams_data: I[]): ManagedTeam[] {
        return teams_data.map((team_data: I): ManagedTeam => {
            return this.transformManagedTeam(team_data);
        });
    }

    public static transformManagedTeam<I extends TeamsData.ExtendedManagedTeam>(team_data: I): ManagedTeam {
        const team = new ManagedTeam(team_data);
        if (team_data.links) {
            team.links = {
                competition_portal: '',
                ...team_data.links
            };
        }

        return team;
    }

    static transformFetchManagedTeamCompetitions(response: TeamsApi.FetchManagedTeamCompetitionsApiResponse): TeamsService.FetchManagedTeamCompetitionsServiceResponse {
        return {
            competitions: response.competitions.map((competition_data: TeamsData.MyCompetitionsTeamsCompetitionData): MyCompetitionsTeamsCompetition => {
                return new MyCompetitionsTeamsCompetition(competition_data);
            }),
            back_link: response.back_link || null,
            links: response.links || null
        };
    }
}