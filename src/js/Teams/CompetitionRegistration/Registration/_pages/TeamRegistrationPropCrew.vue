<template>
    <page :header="page_header"
          class="team-registration-personnel-page team-registration-prop-crew"
          :class="{'page--accent':component_loaded && roster_exists}">
        <team-registration-header slot="pre-header"></team-registration-header>
        <div slot="header-content">
            <team-registration-progress-bar></team-registration-progress-bar>
            <div v-if="component_loaded">
                <p class="team-registration__page-lead">
                    Click "{{current_action}} Prop Crew" to select the Prop Crew who will be
                    attending this competition with the team. Only Prop Crew listed in EMS will receive a
                    credential at the competition.
                </p>
            </div>
        </div>
        <component-loader v-if="!component_loaded"
                          :container="true"
                          :source="this"
                          error_message="Error loading prop crew."></component-loader>
        <div v-else
             class="team-registration-personnel-page__content">
            <div class="grid-container">
                <div v-if="!roster_exists"
                     class="team-registration-personnel-page__new team-registration-personnel-page__new--alt">
                    <div class="team-registration-personnel-page__editor-cta">
                        <button class="labeled-action-button labeled-action-button--add"
                                v-on:click.prevent="edit_active=true">
                            Add Prop Crew
                        </button>
                        <p class="warning-notice team-registration-personnel-page__no-personnel-notice">
                            <i class="inline-icon icon-warning-alt">&nbsp;</i>
                            There are no prop crew identified as
                            <br>
                            attending the competition.
                        </p>
                    </div>
                </div>
                <div v-else
                     class="team-registration-personnel-page__review team-registration-personnel-page__review--alt">
                    <div class="team-registration-personnel-page__editor-cta">
                        <button class="labeled-action-button labeled-action-button--edit"
                                v-on:click.prevent="edit_active=true">
                            Edit Prop Crew
                        </button>
                    </div>
                    <team-registration-roster-summary v-bind="summary_binding"></team-registration-roster-summary>
                    <team-registration-roster-review-list :entity_list="active_prop_crew"></team-registration-roster-review-list>
                </div>
                <team-registration-page-navigation :retreat="retreat"
                                                   :advance="advance"
                                                   :advance_disabled="advance_disabled"
                                                   :hide_retreat="hide_retreat"></team-registration-page-navigation>
            </div>
            <site-takeover v-if="edit_active"
                           v-on:close="edit_active=false">
                <team-registration-roster-edit v-bind="edit_binding"
                                               v-on:roster-confirmed="edit_active=false">
                    <p slot="information">
                        Select the Prop Crew attending the competition with the team. The Prop Crew listed below are
                        those currently listed in the Team Profile. If a Prop Crew member is not listed, they will need
                        to be added through the Team Profile in Members Only.
                    </p>
                </team-registration-roster-edit>
            </site-takeover>
        </div>
    </page>
</template>
<script lang="ts">
    import mixins from 'vue-typed-mixins';
    import {TeamRegistrationCompetitionPropCrewState} from '../_store/TeamRegistrationCompetitionPropCrewState';
    import TeamRegistrationPersonnelPageMixin from '../_mixins/TeamRegistrationPersonnelPageMixin';
    import TeamRegistrationSubpageMixin from '../_mixins/TeamRegistrationSubpageMixin';
    import HasDataDependencies from '../../../../mixins/HasDataDependencies';
    import ValidatesTeamRegistrationRosters from '../_mixins/ValidatesTeamRegistrationRosters';
    import {TeamRegistration} from '../_contracts';

    const vueClass = mixins(TeamRegistrationSubpageMixin, HasDataDependencies, ValidatesTeamRegistrationRosters, TeamRegistrationPersonnelPageMixin);
    // @vue/component
    export default vueClass.extend({
        /**
         * Reactive data
         */
        data: function () {
            return {
                /**
                 * Content to display in title block of page
                 */
                page_title: 'Prop Crew',
                state_key: 'competition_prop_crew',
                state_module: TeamRegistrationCompetitionPropCrewState
            };
        },
        computed: {
            /**
             * The active prop_crew currently set
             */
            active_prop_crew: function (): TeamRegistration.PropCrewPageMember[] {
                return this.active_entity_list;
            },
            /**
             * Whether the advance button should be disabled
             */
            advance_disabled: function (): boolean {
                return this.invalid;
            },
            /**
             * Unique overrides for edit binding
             */
            edit_binding_override: function () {
                return {
                    confirm_label: 'Confirm Prop Crew',
                    title: `${this.current_action} Prop Crew`
                };
            },

            /**
             * Unique overrides for summary binding
             */
            summary_binding_override: function () {
                return {
                    member_type_descriptor: {
                        singular: 'Prop Crew',
                        plural: 'Prop Crew'
                    },
                    summary_label: 'Prop Crew'
                };
            }
        }
    });
</script>