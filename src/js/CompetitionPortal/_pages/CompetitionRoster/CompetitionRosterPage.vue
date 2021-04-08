<template>
    <page :header="page_header"
          class="competition-roster-page"
          :class="{'page--accent':component_loaded}">
        <competition-portal-page-heading v-if="competition_portal_heading_binding"
                                         slot="competition-heading"
                                         v-bind="competition_portal_heading_binding"></competition-portal-page-heading>
        <component-loader v-if="!component_loaded"
                          slot="loader"
                          :container="true"
                          :source="this"
                          error_message="Error loading competition roster."></component-loader>
        <div slot="header-content"
             class="page-heading__intro">
            <p>
                {{intro_text}}
            </p>
            <transition name="fade">
                <div v-if="show_confirmation"
                     class="competition-roster-page__confirmation">
                    <div class="session-feedback session-feedback--success">
                        <div class="session-feedback__content">
                            <div class="session-feedback__text">
                                Roster Updated
                            </div>
                        </div>
                    </div>
                </div>
            </transition>
        </div>
        <div slot="content"
             class="page__content--bleed">
            <div class="page--accent__standard-content">
                <div class="grid-container">
                    <div class="competition-roster-page__key">
                        <page-alert slot="information"
                                    class="page-alert page-alert--notice page-alert--medium">
                            <div slot="trigger_text">
                                Key for Compliance
                            </div>
                            <div slot="expand_content">
                                <div class="competition-roster-page-key">
                                    <p>
                                        Compliance is evaluated and displayed for each individual skater as applicable.
                                    </p>
                                    <ul class="competition-roster-page-key__list">
                                        <li class="competition-roster-page-key__list__item competition-roster-page-key__list__item--complete">
                                            Complete: Skater is at least 18 and is compliant while other team members
                                            are
                                            under 18.
                                        </li>
                                        <li class="competition-roster-page-key__list__item competition-roster-page-key__list__item--incomplete">
                                            Not Complete: Skater is at least 18 and not compliant while other team
                                            members
                                            are under 18.
                                        </li>
                                        <li class="competition-roster-page-key__list__item competition-roster-page-key__list__item--ineligible">
                                            Ineligible to Participate: The person selected is prohibited from
                                            participating,
                                            in any capacity, in any activity or competition authorized by, organized by
                                            U.S.
                                            Figure Skating and/or Local Affiliated Organization of U.S. Figure Skating
                                            (club).
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </page-alert>
                    </div>
                    <div class="competition-roster-page__summary">
                        <team-registration-roster-summary v-bind="summary_binding"></team-registration-roster-summary>
                    </div>
                </div>
            </div>
            <div class="grid-container">
                <div v-if="download_link"
                     class="competition-roster-page__download">
                    <a :href="download_link"
                       target="_blank"
                       rel="noreferrer noopener"
                       class="icon-link icon-link--download">Download Roster
                    </a>
                </div>
                <div class="competition-roster-page__roster">
                    <div v-if="competition_roster.length"
                         class="competition-roster-page__roster__list">
                        <status-entity-card v-for="(member,index) in competition_roster"
                                            :key="member.id"
                                            class="status-entity-card--centered"
                                            :is_success="member.is_compliant"
                                            :is_invalid="member.is_ineligible">
                            <div slot="primary-content">
                                {{index+1}}. {{member.last_name}}, {{member.first_name}}
                                <span class="text--muted">({{member.member_number}})</span>
                            </div>
                            <div slot="secondary-content"
                                 class="text--muted">
                                Age: {{member.age}}
                            </div>
                            <div slot="expand-content">
                                <div class="competition-roster-page__member-compliance">
                                    <div v-for="(section,sindex) in member.compliance_requirements_summary"
                                         :key="sindex"
                                         class="competition-roster-page__member-compliance__section">
                                        <h4 class="competition-roster-page__member-compliance__section__heading"
                                            :class="`competition-roster-page__member-compliance__section__heading--${section.is_complete?'complete':'incomplete'}`">
                                            {{section.name}}
                                        </h4>
                                        <status-summary class="status-summary--standard-text"
                                                        :status_items="section.items">
                                            <template v-if="item.is_membership && item.membership_expiration_date_formatted"
                                                      slot="name_support"
                                                      slot-scope="{item}">
                                                <span>:</span>
                                                <span :class="item.complete ? 'text--success' : 'text--alert'">
                                                    ({{item.membership_expiration_date_formatted}})
                                                </span>
                                            </template>
                                            <template v-if="item.is_age_verification && !item.complete"
                                                      slot="additional_content"
                                                      slot-scope="{item}">
                                                <p class="competition-roster-page__member-compliance__age-notice text--muted">
                                                    To verify skater age Contact Member Services:
                                                    <a class="standard-link"
                                                       href="mailto:ProductSupport@usfigureskating.org">
                                                        ProductSupport@usfigureskating.org
                                                    </a>
                                                </p>
                                            </template>
                                        </status-summary>
                                    </div>
                                </div>
                            </div>
                        </status-entity-card>
                    </div>
                    <p v-else
                       class="text--alert">
                        There are no skaters currently in the competition roster.
                    </p>
                </div>
            </div>
            <div class="competition-roster-page__footer">
                <div class="grid-container">
                    <button :disabled="disable_roster_edit"
                            class="button button--large button--block"
                            v-on:click.prevent="openEdit">
                        Edit Roster
                    </button>
                </div>
            </div>
        </div>
        <site-takeover v-if="is_edit_active"
                       v-on:close="closeEdit">
            <team-registration-roster-edit v-bind="edit_binding"
                                           v-on:roster-confirmed="closeEdit(true)">
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
    </page>
</template>
<script lang="ts">
    import HasDataDependencies from '../../../mixins/HasDataDependencies';
    import mixins from 'vue-typed-mixins';
    import {CompetitionPortalPageMixin} from '../../_mixins';
    import {CompetitionPortalRosterState} from './_store/CompetitionPortalRosterState';
    import {CompetitionRosterPage} from './_contracts';
    import {TeamRegistration} from '../../../Teams/CompetitionRegistration/Registration/_contracts';
    import TeamRegistrationRosterEdit
        from '../../../Teams/CompetitionRegistration/Registration/_components/TeamRegistrationRosterEdit.vue';

    const extendedVue = mixins(HasDataDependencies, CompetitionPortalPageMixin);

    // @vue/component
    export default extendedVue.extend({
        components: {
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
                    competition_roster: false
                },
                /**
                 * Title to display for the page in the header block
                 */
                page_title: 'Competition Roster',
                /**
                 * Whether the edit screen is active
                 */
                is_edit_active: false,
                /**
                 * Whether to show the roster updates confirmation
                 */
                show_confirmation: false
            };
        },
        computed: {
            /**
             * The selected competition roster
             */
            competition_roster: function (): CompetitionRosterPage.CompetitionRosterMember[] {
                return this.$store.state.competition_portal.roster.competition_roster;
            },
            /**
             * Whether roster editing is disabled
             */
            disable_roster_edit: function (): boolean {
                return !this.$store.state.competition_portal.roster.roster_can_be_edited;
            },
            /**
             * Download link url
             */
            download_link: function (): string {
                return this.$store.state.competition_portal.roster.download_link;
            },
            /**
             * The binding for the edit component
             */
            edit_binding: function (): TeamRegistration.TeamRegistrationRosterEditConfig {
                return {
                    ...this.summary_binding,
                    available_roster: this.$store.state.competition_portal.roster.team_roster || [],
                    confirm_label: 'Confirm Roster',
                    confirm_method: this.confirmRoster as TeamRegistration.RosterConfirmMethod,
                    roster_rules: this.$store.state.competition_portal.roster.roster_rules,
                    subtitle: (this.$store.state.competition_portal.active_entity_summary && this.$store.state.competition_portal.active_entity_summary.name) || null,
                    title: 'Edit Roster',
                    show_secondary_messaging: true,
                    loading_state: {
                        load_error: this.$store.state.competition_portal.roster.edit_load_status.error,
                        loaded: !this.$store.state.competition_portal.roster.edit_load_status.is_loading,
                        loading_timeout: true,
                        error_message: 'Error loading team roster.'
                    }
                };
            },
            /**
             * Page introduction text
             */
            intro_text: function (): string {
                return this.$store.state.competition_portal.roster.page_introduction;
            },
            /**
             * The binding for the summary element
             */
            summary_binding: function (): TeamRegistration.TeamRegistrationRosterSummaryBinding {
                return {
                    available_roster: this.competition_roster,
                    maximum_size: this.$store.state.competition_portal.roster.roster_maximum,
                    member_type_descriptor: {
                        singular: 'Skater',
                        plural: 'Skaters'
                    },
                    minimum_size: this.$store.state.competition_portal.roster.roster_minimum,
                    per_member_fee: null,
                    selected_roster_ids: this.competition_roster.map((item) => {
                        return item.id;
                    }),
                    summary_label: 'Competition Roster',
                    show_secondary_messaging: false
                };
            }
        },
        /**
         * Before component created, ensure the team personnel state sub-module is registered
         */
        beforeCreate: function () {
            if (!this.$store.state.competition_portal.roster) {
                this.$store.registerModule(['competition_portal', 'roster'], CompetitionPortalRosterState);
            }
        },
        methods: {
            /**
             * Close the edit component
             */
            closeEdit: function (is_change?: boolean): void {
                this.is_edit_active = false;
                if (is_change) {
                    this.show_confirmation = true;
                    setTimeout(() => {
                        this.show_confirmation = false;
                    }, 1500);
                }
            },
            /**
             * Confirm changes to the roster
             */
            confirmRoster: function (ids: string[]) {
                return this.$store.dispatch('competition_portal/roster/updateRoster', ids);
            },
            /**
             * Load data dependencies for component
             */
            loadData: function (): Promise<void> {
                return new Promise((resolve, reject) => {
                    this.$store.dispatch('competition_portal/fetchCompetitionRoster')
                        .then(() => {
                            this.dependencies.competition_roster = true;
                            resolve();
                        })
                        .catch(() => {
                            reject();
                        });
                });
            },
            /**
             * Open the edit screen
             */
            openEdit: function () {
                this.is_edit_active = true;
                this.$store.dispatch('competition_portal/roster/openEdit');
            }
        }
    });
</script>