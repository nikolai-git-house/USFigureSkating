import TeamRegistrationRosterEdit from '../_components/TeamRegistrationRosterEdit.vue';
import {TeamRegistration} from '../_contracts';
import {TeamRegistrationRosterService} from '../_services/TeamRegistrationRosterService';
import {TeamSummary} from '../_models';
import Vue from 'vue';

export default Vue.extend({
    components: {
        TeamRegistrationRosterEdit
    },
    /**
     * Reactive data
     */
    data: function () {
        return {
            /**
             * Data dependencies for the component
             */
            dependencies: {
                entities: false
            },
            /**
             * Whether the edit component is active
             */
            edit_active: false,
            /**
             * Key to access state module
             */
            state_key: '',
            /**
             * State module to register for page component
             */
            state_module: {}
        };
    },
    computed: {
        /**
         * The currently selected list of entities
         */
        active_entity_list: function (): TeamRegistration.AbstractRosterPageMember[] {
            return TeamRegistrationRosterService.rosterFromIds(this.available_entity_list, this.current_roster_ids);
        },
        /**
         * The full list of entities associated with the team
         */
        available_entity_list: function (): TeamRegistration.AbstractRosterPageMember[] {
            return this.$store.state.team_registration[this.state_key].team_roster;
        },
        /**
         * The name of the current action on the list
         */
        current_action: function (): string {
            return this.roster_exists ? 'Edit' : 'Add';
        },
        /**
         * The IDs of the skaters in the current competition roster
         */
        current_roster_ids: function (): string[] {
            return this.$store.state.team_registration[this.state_key].selected_roster_ids;
        },
        /**
         * Attribute binding for roster edit component
         */
        edit_binding: function (): TeamRegistration.TeamRegistrationRosterEditConfig {
            return {
                ...this.summary_binding,
                confirm_label: 'Confirm Team Personnel',
                confirm_method: this.confirmRoster as TeamRegistration.RosterConfirmMethod,
                subtitle: this.team_summary_name,
                title: `${this.current_action} Team Personnel`,
                ...this.edit_binding_override
            };
        },
        /**
         * Unique overrides for edit binding
         */
        edit_binding_override: function () {
            return {};
        },
        /**
         * The maximum roster size for the competition
         */
        maximum_roster_size: function (): number | null {
            return this.$store.state.team_registration[this.state_key].roster_maximum;
        },
        /**
         * Whether a roster has been selected
         */
        roster_exists: function (): boolean {
            return !!this.current_roster_ids.length;
        },
        /**
         * Attribute binding for roster summary component
         */
        summary_binding: function (): TeamRegistration.TeamRegistrationRosterSummaryBinding {
            return {
                available_roster: this.available_entity_list,
                maximum_size: this.maximum_roster_size,
                member_type_descriptor: {
                    singular: 'Team Personnel',
                    plural: 'Team Personnel'
                },
                minimum_size: null,
                per_member_fee: null,
                selected_roster_ids: this.current_roster_ids,
                show_secondary_messaging: false,
                summary_label: 'Team Personnel',
                ...this.summary_binding_override
            };
        },
        /**
         * Unique overrides for summary binding
         */
        summary_binding_override: function () {
            return {};
        },
        /**
         * The summary name for the current team
         */
        team_summary_name: function (): string | null {
            const team_summary: TeamSummary | null = this.$store.state.team_registration.active_team_summary;

            return team_summary ? team_summary.summary_name : null;
        },
        /**
         * The list of selected ids to validate
         */
        _active_roster_ids: function (): string[] {
            return this.current_roster_ids;
        },
        /**
         * The full available roster list
         */
        _available_roster: function (): TeamRegistration.RosterEditMember[] {
            return this.available_entity_list;
        },
        /**
         * The active maximum roster size
         */
        _maximum_roster_size: function (): number | null {
            return this.maximum_roster_size;
        },
        /**
         * The active minimum roster size
         */
        _minimum_roster_size: function (): number | null {
            return null;
        }
    },
    created: function () {
        if (!this.$store.state.team_registration[this.state_key]) {
            this.$store.registerModule(['team_registration', this.state_key], this.state_module);
        }
    },
    methods: {
        /**
         * Perform the action to confirm/save the current selections
         */
        confirmRoster: function (ids: string[]): Promise<void> {
            return this.$store.dispatch(`team_registration/${this.state_key}/update`, ids);
        },
        /**
         * Load data for page
         */
        loadData: function () {
            return new Promise((resolve, reject) => {
                this.$store.dispatch(`team_registration/${this.state_key}/fetch`)
                    .then(() => {
                        this.dependencies.entities = true;
                        resolve();
                    })
                    .catch(() => {
                        reject();
                    });
            });
        }
    }
});