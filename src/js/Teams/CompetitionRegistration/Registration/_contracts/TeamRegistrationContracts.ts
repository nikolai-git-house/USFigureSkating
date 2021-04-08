import {CompetitionHeadingSource, ComponentLoaderStatusSource, MemberNumber} from '../../../../contracts/AppContracts';
import {EventSelectionEvent} from '../../../../contracts/app/CompetitionRegistrationContracts';

export namespace TeamRegistration {
    /**
     * Source data for registration workflow page header
     */
    export type RegistrationHeaderSource = {
        competition: CompetitionHeadingSource | null;
        team: string | null;
    }

    /**
     * A valid component for a workflow step
     */
    export type StepComponent =
        'team-registration-team-verification' |
        'team-registration-registration-overview' |
        'team-registration-event-selection' |
        'team-registration-competition-roster' |
        'team-registration-coaches' |
        'team-registration-team-service-personnel' |
        'team-registration-prop-crew'

    /**
     * A valid key indicating a workflow step
     */
    export type StepKey =
        'team_verification' |
        'overview' |
        'event_selection' |
        'roster' |
        'coaches' |
        'team_service_personnel' |
        'prop_crew';

    /**
     * Object to configure steps keys and components
     */
    export type StepsConfiguration = {
        [key: string]: StepComponent;
    }

    export type RegistrationPageTransitionName = 'team-registration-advance' | 'team-registration-retreat';

    export type RegistrationSubpageBackLinkConfig = {
        back_link?: string;
        back_link_label?: string;
        back_link_handler?: () => void;
    }

    /**
     * Team information required by Team Verification page
     */
    export interface TeamVerificationTeamInformation {
        id: string;
        member_number: MemberNumber;
        level: string;
        name: string;
        club: string;
        section: string | null;
        membership_end_date: string;
        membership_expired: boolean;
    }

    export interface PricingRow {
        label: string;
        values: (number | null)[];
    }

    export interface PricingTableConfiguration {
        title: string;
        column_names: string[];
        null_row_message: string;
    }

    export interface PricingTableBinding {
        config: PricingTableConfiguration;
        rows: PricingRow[];
    }

    export interface TeamRegistrationEventCardEvent {
        is_registered_for: boolean;
        is_selected: boolean;
        name: string;
        judging_system: string;
        additional_data: string[];
    }

    export interface EventSelectionPageEvent extends TeamRegistrationEventCardEvent, EventSelectionEvent {
    }

    export interface RosterEditMember {
        id: string;
        supporting_information: string;
        can_be_added_to_roster: boolean;
        last_name: string;
        first_name: string;
        cannot_be_added_to_roster_reason?: string;
    }

    /**
     * Entity for display in review list
     */
    export interface ReviewListEntity {
        id: string;
        last_name: string;
        first_name: string;
        member_number: MemberNumber;
        can_be_added_to_roster: boolean;
        cannot_be_added_to_roster_reason?: string;
    }

    export interface AbstractRosterPageMember extends RosterEditMember, ReviewListEntity {
    }

    export interface RosterPageMember extends AbstractRosterPageMember {
        age: number;
    }

    export interface RosterConfirmMethod extends FunctionConstructor {
        (ids: string[]): Promise<void>;
    }

    /**
     * Binding for reactive attributes on Team Roster Edit Component.  Includes Summary Binding
     */
    export interface TeamRegistrationRosterEditConfig extends TeamRegistrationRosterSummaryBinding {
        confirm_label: string;
        confirm_method: TeamRegistration.RosterConfirmMethod;
        roster_rules?: string[];
        subtitle?: string | null;
        title: string;
        loading_state?: ComponentLoaderStatusSource;
    }

    /**
     * Binding for reactive attributes on Team Roster Summary Component
     */
    export interface TeamRegistrationRosterSummaryBinding {
        available_roster: TeamRegistration.RosterEditMember[];
        maximum_size: number | null;
        member_type_descriptor: { singular: string; plural: string; };
        minimum_size: number | null;
        per_member_fee: number | null;
        selected_roster_ids: string[];
        show_secondary_messaging?: boolean;
        summary_label: string;
    }

    export interface CoachesPageMember extends AbstractRosterPageMember {

    }

    export interface TeamServicePersonnelPageMember extends AbstractRosterPageMember {

    }

    export interface PropCrewPageMember extends AbstractRosterPageMember {

    }
}