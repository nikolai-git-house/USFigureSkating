<template>
    <div class="team-registration">
        <component-loader v-if="!component_loaded"
                          :container="true"
                          :source="this"
                          error_message="Error loading registration."></component-loader>
        <div v-else
             class="team-registration-transition-container">
            <transition :name="transition_name"
                        v-on:afterEnter="$root.resetScroll()">
                <keep-alive>
                    <component :is="active_component"
                               :style="{'min-height':min_content_height+'px'}"
                               :back_link_config="back_link_config"
                               :hide_retreat="hide_retreat"
                               v-on:advance="advance"
                               v-on:retreat="retreat"></component>
                </keep-alive>
            </transition>
        </div>
    </div>
</template>
<script lang="ts">

    import HasDataDependencies from '../../../mixins/HasDataDependencies';
    import mixins from 'vue-typed-mixins';
    import {TeamRegistrationState} from './TeamRegistrationState';
    import {TeamRegistration} from './_contracts';
    import {
        TeamRegistrationCoaches,
        TeamRegistrationCompetitionRoster,
        TeamRegistrationEventSelection,
        TeamRegistrationPropCrew,
        TeamRegistrationRegistrationOverview,
        TeamRegistrationTeamServicePersonnel,
        TeamRegistrationTeamVerification
    } from './_pages';

    const extendedVue = mixins(HasDataDependencies);
    // @vue/component
    export default extendedVue.extend({
        components: {
            TeamRegistrationCoaches,
            TeamRegistrationCompetitionRoster,
            TeamRegistrationEventSelection,
            TeamRegistrationPropCrew,
            TeamRegistrationRegistrationOverview,
            TeamRegistrationTeamVerification,
            TeamRegistrationTeamServicePersonnel
        },
        props: {
            /**
             * The URL for the back link on the first step in the process
             */
            back_link: {
                type: String,
                required: false
            },
            /**
             * The label for the back link on the first step in the process
             */
            back_link_label: {
                type: String,
                required: false
            }
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
                    shell: false
                },
                /**
                 * Minimum height on the content section to ensure full height background colors
                 */
                min_content_height: 0,
                /**
                 * The name of the active page transition
                 */
                transition_name: <TeamRegistration.RegistrationPageTransitionName>''
            };
        },
        computed: {
            /**
             * The active screen component
             */
            active_component: function (): TeamRegistration.StepComponent {
                return this.$store.getters['team_registration/active_step_component'];
            },
            /**
             * The index of the active step in the process
             */
            active_step_index: function (): number {
                return this.$store.state.team_registration.active_step_index;
            },
            /**
             * Back link configuration for the active step in the workflow
             */
            back_link_config: function (): TeamRegistration.RegistrationSubpageBackLinkConfig {
                if (this.active_step_index === 0) {
                    return {
                        back_link: this.back_link,
                        back_link_label: this.back_link_label
                    };
                }

                return {
                    back_link_handler: this.retreat
                };
            },
            /**
             * Whether to hide the retreat button in the active step
             */
            hide_retreat: function (): boolean {
                return this.active_step_index === 0 && !this.back_link;
            }
        },
        /**
         * Before component is created, initialize state
         */
        beforeCreate: function () {
            if (!this.$store.state.team_registration) {
                this.$store.registerModule('team_registration', TeamRegistrationState);
            }
        },
        methods: {
            /**
             * Advance to the next screen
             */
            advance: function (): void {
                this.transition_name = 'team-registration-advance';
                this.$store.dispatch('team_registration/advance');
            },
            /**
             * Initialize process for calculating and recalculating calculated content area height
             */
            initializeCalculatedContentHeight: function () {
                let window_debounce: number | undefined;
                this.updateContentHeight();
                window.addEventListener('resize', () => {
                    if (window_debounce) {
                        clearTimeout(window_debounce);
                    }
                    window_debounce = window.setTimeout(() => {
                        this.updateContentHeight();
                    }, 200);
                });
            },
            /**
             * Load data for the component
             */
            loadData: function () {
                return new Promise((resolve, reject) => {
                    this.$store.dispatch('team_registration/loadShell')
                        .then(() => {
                            this.dependencies.shell = true;
                            this.$nextTick(() => {
                                this.initializeCalculatedContentHeight();
                                this.transition_name = 'team-registration-advance';
                            });
                            resolve();
                        })
                        .catch(() => {
                            reject();
                        });
                });
            },
            /**
             * Retreat to the previous screen
             */
            retreat: function (): void {
                if (this.active_step_index === 0) {
                    if (this.back_link) {
                        location.assign(this.back_link);
                    }

                    return;
                }
                this.transition_name = 'team-registration-retreat';
                this.$store.dispatch('team_registration/retreat');
            },
            /**
             * Update the min height on the content area
             */
            updateContentHeight: function () {
                const app_root = document.getElementById('app');
                let site_header_offset = 0;
                if (app_root) {
                    const app_top_pad = getComputedStyle(app_root).paddingTop;
                    if (app_top_pad) {
                        site_header_offset = parseInt(app_top_pad);
                    }
                }
                this.min_content_height = window.innerHeight - site_header_offset;
            }
        }
    });
</script>