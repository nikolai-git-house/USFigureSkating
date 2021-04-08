export namespace TeamsCompetitionRegistration {
    /**
     * A competition that contains information about whether it is a qualifying/non-qualifying competition
     */
    export interface CompetitionTypeCompetition {
        is_qualifying: boolean;
    }

    /**
     * Summary information about the active team registering for competitions
     */
    export interface TeamSummary {
        name: string;
        level: string;
    }
}