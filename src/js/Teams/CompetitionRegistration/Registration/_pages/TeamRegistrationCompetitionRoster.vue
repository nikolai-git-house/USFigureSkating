<template>
    <page :header="page_header"
          class="team-registration-personnel-page team-registration-competition-roster"
          :class="{'page--accent':component_loaded && roster_exists}">
        <team-registration-header slot="pre-header"></team-registration-header>
        <div slot="header-content">
            <team-registration-progress-bar></team-registration-progress-bar>
            <div v-if="component_loaded">
                <p v-if="!roster_exists"
                   class="team-registration__page-lead">
                    Click “Add Skaters” to select skaters from the Main Roster who will be attending this competition.
                    Only skaters listed on the competition roster will receive a credential at the competition.
                </p>
                <div v-else
                     class="team-registration__page-information">
                    <page-alert slot="information"
                                class="page-alert page-alert--notice page-alert--medium">
                        <div slot="trigger_text">
                            Information
                        </div>
                        <div slot="expand_content">
                            Click “Edit Roster” to select skaters from the Main Roster who will be attending this
                            competition. Only skaters listed on the competition roster will receive a credential at the
                            competition.
                        </div>
                    </page-alert>
                </div>
            </div>
        </div>
        <component-loader v-if="!component_loaded"
                          :container="true"
                          :source="this"
                          error_message="Error loading competition roster."></component-loader>
        <div v-else
             class="team-registration-personnel-page__content">
            <div class="grid-container">
                <div v-if="!roster_exists"
                     class="team-registration-personnel-page__new">
                    <div class="team-registration-personnel-page__editor-cta">
                        <button class="labeled-action-button labeled-action-button--add"
                                v-on:click.prevent="edit_active=true">
                            Add Skaters
                        </button>
                    </div>
                </div>
                <div v-else
                     class="team-registration-personnel-page__review">
                    <div class="team-registration-personnel-page__editor-cta">
                        <button class="labeled-action-button labeled-action-button--edit"
                                v-on:click.prevent="edit_active=true">
                            Edit Roster
                        </button>
                    </div>
                    <team-registration-roster-summary v-bind="summary_binding"></team-registration-roster-summary>
                    <team-registration-roster-review-list :entity_list="competition_roster"
                                                          :include_numbering="true">
                        <template slot="card_secondary"
                                  slot-scope="{entity}">
                            Age: {{entity.age}}
                        </template>
                    </team-registration-roster-review-list>
                </div>
                <div class="team-registration__terms">
                    <div class="team-registration__terms__confirm">
                        <label for="terms_confirm"
                               class="usfsa-checkbox">
                            <input id="terms_confirm"
                                   v-model="confirmed"
                                   type="checkbox">
                            <span class="usfsa-checkbox__text">I have verified the competition roster is accurate.</span>
                        </label>
                    </div>
                </div>
                <team-registration-page-navigation :retreat="retreat"
                                                   :advance="advance"
                                                   :advance_disabled="advance_disabled"
                                                   :hide_retreat="hide_retreat">
                    <total-member-cost v-if="per_skater_fee && roster_exists"
                                       slot="pre"
                                       label="Skater"
                                       :per_member_fee="per_skater_fee"
                                       :current_roster_size="current_roster_ids.length"></total-member-cost>
                </team-registration-page-navigation>
            </div>
            <site-takeover v-if="edit_active"
                           v-on:close="edit_active=false">
                <team-registration-roster-edit v-bind="edit_binding"
                                               v-on:roster-confirmed="edit_active=false">
                    <page-alert slot="information"
                                class="page-alert page-alert--notice page-alert--medium">
                        <div slot="trigger_text">
                            Information
                        </div>
                        <div slot="expand_content">
                            Select skaters to be listed on the Competition Roster. The skaters listed below are
                            those currently on the team’s Main Roster. If a skater is not on the Main Roster, they
                            will need to be added through the Team Profile in Members Only.
                        </div>
                    </page-alert>
                </team-registration-roster-edit>
            </site-takeover>
        </div>
    </page>
</template>
<script lang="ts">
    import TeamRegistrationSubpageMixin from '../_mixins/TeamRegistrationSubpageMixin';
    import mixins from 'vue-typed-mixins';
    import TeamRegistrationRosterEdit from '../_components/TeamRegistrationRosterEdit.vue';
    import {TeamRegistration} from '../_contracts';
    import HasDataDependencies from '../../../../mixins/HasDataDependencies';
    import ValidatesTeamRegistrationRosters from '../_mixins/ValidatesTeamRegistrationRosters';
    import TeamRegistrationPersonnelPageMixin from '../_mixins/TeamRegistrationPersonnelPageMixin';
    import {TeamRegistrationCompetitionRosterState} from '../_store/TeamRegistrationCompetitionRosterState';

    const vueClass = mixins(TeamRegistrationSubpageMixin, HasDataDependencies, ValidatesTeamRegistrationRosters, TeamRegistrationPersonnelPageMixin);
    // @vue/component
    export default vueClass.extend({
        components: {
            TeamRegistrationRosterEdit
        },
        /**
         * Reactive data
         */
        data: function () {
            return {
                confirmed: false,
                page_title: 'Competition Roster',
                state_key: 'competition_roster',
                state_module: TeamRegistrationCompetitionRosterState
            };
        },
        computed: {
            /**
             * Whether the advance button should be disabled
             */
            advance_disabled: function (): boolean {
                return this.invalid || this.incomplete || !this.confirmed;
            },
            /**
             * The currently selected roster
             */
            competition_roster: function (): TeamRegistration.RosterPageMember[] {
                return this.active_entity_list as TeamRegistration.RosterPageMember[];
            },
            /**
             * Unique overrides for edit binding
             */
            edit_binding_override: function () {
                return {
                    confirm_label: 'Confirm Roster',
                    title: 'Edit Roster',
                    roster_rules: this.$store.state.team_registration.competition_roster.roster_rules
                };
            },
            /**
             * The per skater fee for the competition
             */
            per_skater_fee: function (): number | null {
                return this.$store.state.team_registration.competition_roster.per_skater_fee;
            },
            /**
             * Unique overrides for summary binding
             */
            summary_binding_override: function () {
                return {
                    member_type_descriptor: {
                        singular: 'Skater',
                        plural: 'Skaters'
                    },
                    minimum_size: this._minimum_roster_size,
                    per_member_fee: this.per_skater_fee,
                    summary_label: 'Competition Roster'
                };
            },
            /**
             * The active minimum roster size
             */
            _minimum_roster_size: function (): number | null {
                return this.$store.state.team_registration.competition_roster.roster_minimum;
            }
        },
        methods: {
            /**
             * Perform the action to confirm/save the current selections
             */
            confirmRoster: function (ids: string[]): Promise<void> {
                this.confirmed = false;
                return this.$store.dispatch(`team_registration/${this.state_key}/update`, ids);
            }
        }
    });
</script>