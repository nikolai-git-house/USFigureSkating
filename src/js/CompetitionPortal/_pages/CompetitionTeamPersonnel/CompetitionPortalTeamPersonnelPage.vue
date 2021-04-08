<template>
    <page :header="page_header"
          class="competition-team-personnel-page"
          :class="{'page--accent':component_loaded}">
        <competition-portal-page-heading v-if="competition_portal_heading_binding"
                                         slot="competition-heading"
                                         v-bind="competition_portal_heading_binding"></competition-portal-page-heading>
        <component-loader v-if="!component_loaded"
                          slot="loader"
                          :container="true"
                          :source="this"
                          error_message="Error loading team personnel."></component-loader>
        <p slot="header-content"
           class="page-heading__intro">
            Team Personnel listed below should be those attending the competition with the team and must be
            compliant in order to receive a credential for the competition.
        </p>
        <div slot="content"
             :class="{'page__accent-content':!show_global_warning}">
            <div class="grid-container">
                <p v-if="show_global_warning"
                   class="competition-team-personnel-page__global-warning warning-notice warning-notice--aligned text--alert">
                    <i class="inline-icon icon-danger-alt">&nbsp;</i>
                    Please edit to remote ineligible Team Personnel
                </p>
                <competition-team-personnel-accordion :personnel="active_competition_team_personnel.coaches"
                                                      personnel_descriptor="Coaches"
                                                      v-on:edit="openEdit('coaches')"></competition-team-personnel-accordion>
                <competition-team-personnel-accordion :personnel="active_competition_team_personnel.team_service_personnel"
                                                      personnel_descriptor="Team Service Personnel"
                                                      v-on:edit="openEdit('team_service_personnel')"></competition-team-personnel-accordion>
                <competition-team-personnel-accordion v-if="prop_crew_available"
                                                      :personnel="active_competition_team_personnel.prop_crew"
                                                      personnel_descriptor="Prop Crew"
                                                      v-on:edit="openEdit('prop_crew')"></competition-team-personnel-accordion>
            </div>
        </div>
        <site-takeover v-if="is_edit_active"
                       v-on:close="closeEdit">
            <team-registration-roster-edit v-bind="edit_binding"
                                           v-on:roster-confirmed="closeEdit">
                <p slot="information">
                    {{edit_intro}}
                </p>
            </team-registration-roster-edit>
        </site-takeover>
    </page>
</template>
<script lang="ts">
    import HasDataDependencies from '../../../mixins/HasDataDependencies';
    import mixins from 'vue-typed-mixins';
    import {CompetitionPortalPageMixin} from '../../_mixins';
    import {CompetitionTeamPersonnelAccordion} from './_components';
    import {CompetitionTeamPersonnel, CompetitionTeamPersonnelPage} from './_contracts';
    import {TeamRegistration} from '../../../Teams/CompetitionRegistration/Registration/_contracts';
    import TeamRegistrationRosterEdit
        from '../../../Teams/CompetitionRegistration/Registration/_components/TeamRegistrationRosterEdit.vue';
    import {CompetitionPortalTeamPersonnelState} from './_store/CompetitionPortalTeamPersonnelState';

    const TEAM_PERSONNEL_EDIT_INTRODUCTIONS = {
        coaches: 'Select the coach(es) attending the competition with the team. The coaches listed below are those currently listed in the Team Profile. If a coach is not listed, they will need to be added through the Team Profile in Members Only.',
        team_service_personnel: 'Select the Team Service Personnel attending the competition with the team. The persons listed below are those currently listed in the Team Profile as a Team Manager or Team Service Personnel. If a person is not listed, they will need to be added through the Team Profile in Members Only.',
        prop_crew: 'Select the Prop Crew attending the competition with the team. The Prop Crew listed below are those currently listed in the Team Profile. If a Prop Crew member is not listed, they will need to be added through the Team Profile in Members Only.'
    };

    const extendedVue = mixins(HasDataDependencies, CompetitionPortalPageMixin);

    // @vue/component
    export default extendedVue.extend({
        components: {
            CompetitionTeamPersonnelAccordion,
            TeamRegistrationRosterEdit
        },
        /**
         * Reactive data
         */
        data: function () {
            return {
                /**
                 * Data dependencies for component to load
                 */
                dependencies: {
                    team_personnel: false
                },
                /**
                 * Title to display for the page in the header block
                 */
                page_title: 'Competition Team Personnel'
            };
        },
        computed: {
            /**
             * The full set of team personnel selected for the competition
             */
            active_competition_team_personnel: function (): CompetitionTeamPersonnelPage.CompetitionTeamPersonnel {
                return this.$store.state.competition_portal.team_personnel.active_rosters;
            },
            /**
             * The group (coaches, TSP, PC) actively being edited
             */
            active_edit_type: function (): CompetitionTeamPersonnel.CompetitionPersonnelTypeKey | null {
                return this.$store.state.competition_portal.team_personnel.active_edit_type;
            },

            /**
             * Attribute binding for roster edit component
             */
            edit_binding: function (): TeamRegistration.TeamRegistrationRosterEditConfig | null {
                return this.$store.getters['competition_portal/team_personnel/edit_binding'];
            },
            /**
             * The introduction text for the edit screen
             */
            edit_intro: function (): string | null {
                if (!this.active_edit_type) {
                    return null;
                }

                return TEAM_PERSONNEL_EDIT_INTRODUCTIONS[this.active_edit_type];
            },
            /**
             * Whether roster edit screen is active
             */
            is_edit_active: function (): boolean {
                return this.active_edit_type !== null;
            },
            /**
             * Whether prop crew is accessible to the current team
             */
            prop_crew_available: function (): boolean {
                return this.$store.state.competition_portal.team_personnel.has_prop_crew;
            },
            /**
             * Whether to show the global warning that invalid personnel are selected
             */
            show_global_warning: function (): boolean {
                for (const i in this.active_competition_team_personnel) {
                    if (Object.prototype.hasOwnProperty.call(this.active_competition_team_personnel, i)) {
                        const personnel_list = this.active_competition_team_personnel[i];
                        for (let i = 0; i < personnel_list.length; i++) {
                            const team_person = personnel_list[i];
                            if (team_person.is_ineligible) {
                                return true;
                            }
                        }
                    }
                }

                return false;
            }

        },
        /**
         * Before component created, ensure the team personnel state sub-module is registered
         */
        beforeCreate: function () {
            if (!this.$store.state.competition_portal.team_personnel) {
                this.$store.registerModule(['competition_portal', 'team_personnel'], CompetitionPortalTeamPersonnelState);
            }
        },
        methods: {
            /**
             * Close the edit component
             */
            closeEdit: function (): void {
                this.$store.commit('competition_portal/team_personnel/setActiveEditType', null);
            },
            /**
             * Load data dependencies for component
             */
            loadData: function (): Promise<void> {
                return new Promise((resolve, reject) => {
                    this.$store.dispatch('competition_portal/fetchCompetitionTeamPersonnel')
                        .then(() => {
                            this.dependencies.team_personnel = true;
                            resolve();
                        })
                        .catch(() => {
                            reject();
                        });
                });
            },
            /**
             * Open the edit overlay for a subset of the team personnel
             */
            openEdit: function (type_key: CompetitionTeamPersonnel.CompetitionPersonnelTypeKey) {
                this.$store.dispatch('competition_portal/team_personnel/openEdit', type_key);
            }
        }
    });
</script>