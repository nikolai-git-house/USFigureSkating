import {
    CompetitionSummary,
    EventSelectionEvent,
    RegistrationOverview,
    TeamCoach,
    TeamProfile,
    TeamServicePerson,
    TeamSummary
} from '../_models';
import {TeamRosterMember} from '../_models/TeamRosterMember';

export namespace TeamRegistrationService {
    /**
     * Service response when fetching registration workflow shell information
     */
    export interface FetchShellServiceResponse {
        competition: CompetitionSummary;
        team: TeamSummary;
    }

    /**
     * Service response when fetching information to power the Team Verification step of the registration process
     */
    export interface FetchTeamVerificationServiceResponse {
        team_profile: TeamProfile;
    }

    /**
     * Service payload when changing team name
     */
    export interface UpdateTeamNameServicePayload {
        team_name: string;
        team_id: string;
    }

    /**
     * Service response when fetching information to power the Registration Overview step of the registration process
     */
    export interface FetchRegistrationOverviewServiceResponse {
        overview: RegistrationOverview;
    }

    export interface FetchEventSelectionServiceResponse {
        events: EventSelectionEvent[];
    }

    export interface RemoveEventServiceResponse {
        events: EventSelectionEvent[];
    }

    export interface AddEventServiceResponse {
        events: EventSelectionEvent[];
    }

    /**
     * Service response when fetching information for the Competition Roster page
     */
    export interface FetchCompetitionRosterServiceResponse {
        team_roster: TeamRosterMember[];
        selected_roster_ids: string[];
        roster_rules: string[];
        per_skater_fee: number | null;
        roster_minimum: number | null;
        roster_maximum: number | null;
    }

    /**
     * Service response when fetching information for the Coaches page
     */
    export interface FetchCoachesServiceResponse {
        team_roster: TeamCoach[];
        selected_roster_ids: string[];
        roster_maximum: number;
    }

    /**
     * Service response when fetching information for the TSP page
     */
    export interface FetchTeamServicePersonnelServiceResponse {
        team_roster: TeamServicePerson[];
        selected_roster_ids: string[];
        roster_maximum: number;
    }

    /**
     * Service response when fetching information for the Prop Crew page
     */
    export interface FetchPropCrewServiceResponse {
        team_roster: TeamServicePerson[];
        selected_roster_ids: string[];
        roster_maximum: number;
    }
}