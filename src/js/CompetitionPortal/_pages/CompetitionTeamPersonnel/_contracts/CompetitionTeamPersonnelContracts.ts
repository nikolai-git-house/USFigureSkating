import {CompetitionPortalTeamPerson} from '../_models';
import {
    AbstractTeamEntity,
    PropCrewMember,
    TeamCoach,
    TeamServicePerson
} from '../../../../Teams/CompetitionRegistration/Registration/_models';

export namespace CompetitionTeamPersonnel {
    /**
     * Identifies a certain type of team personnel
     */
    export type CompetitionPersonnelTypeKey = 'coaches' | 'team_service_personnel' | 'prop_crew';

    /**
     * The lists of team personnel selected for a competition. Used in main screen
     */
    export type CompetitionTeamPersonnel = {
        coaches: CompetitionPortalTeamPerson[];
        team_service_personnel: CompetitionPortalTeamPerson[];
        prop_crew: CompetitionPortalTeamPerson[];
    }

    /**
     * The full lists of team personnel associated with a team.  Used for edit screens.
     */
    export type FullTeamPersonnel = {
        coaches?: TeamCoach[];
        team_service_personnel?: TeamServicePerson[];
        prop_crew?: PropCrewMember[];
    }

    /**
     * Roster rule configs for team personnel
     */
    export type CompetitionPersonnelRosterConfig = {
        min?: number;
        max?: number;
    }

    /**
     * CompetitionPersonnelRosterConfig with all properties defined
     */
    export type CompetitionPersonnelRosterConfigDefined = {
        min: number | null;
        max: number | null;
    }

    /**
     * Full set of roster configs for all team personnel types
     */
    export type CompetitionTeamPersonnelRosterConfigs = {
        coaches?: CompetitionPersonnelRosterConfig;
        team_service_personnel?: CompetitionPersonnelRosterConfig;
        prop_crew?: CompetitionPersonnelRosterConfig;
    }

    /**
     * State payload when setting an active competition roster
     */
    export type CommitActiveRosterPayload = {
        type: CompetitionTeamPersonnel.CompetitionPersonnelTypeKey;
        roster: CompetitionPortalTeamPerson[];
    };

    /**
     * Status of loading the edit screen for a personnel type
     */
    export type EditLoadStatus = {
        error: boolean;
        is_loading: boolean;
    };

    /**
     * State payload when setting a full team roster of a certain type
     */
    export type CommitFullRosterPayload = {
        roster: AbstractTeamEntity[];
        type: CompetitionTeamPersonnel.CompetitionPersonnelTypeKey;
    };

    /**
     * State payload when setting roster configs in state
     */
    export type CommitRosterConfigPayload = {
        config: CompetitionTeamPersonnel.CompetitionPersonnelRosterConfig;
        type: CompetitionTeamPersonnel.CompetitionPersonnelTypeKey;
    };
}