<script lang="ts">
    import {Session} from '../../models/Sessions/Session';
    import {ExtendedSessionComponent} from '../../components/ExtendedSession.vue';
    import mixins from 'vue-typed-mixins';
    import HasDataDependencies from '../../mixins/HasDataDependencies';
    import {CompetitionPortalPageMixin} from '../_mixins';

    const vueClass = mixins(HasDataDependencies, CompetitionPortalPageMixin);
    // @vue/component
    export default vueClass.extend({
        props: {
            /**
             * Whether the component is operating for a coach user rather than a skater user
             */
            coach_mode: {
                type: Boolean,
                default: false
            },
            /**
             * Whether to automatically expand the first expandable session upon page load
             */
            expand_first_expandable: {
                type: Boolean,
                default: false
            }
        },
        /**
         * Reactive data
         */
        data: function () {
            return {
                /**
                 * Dependencies required for the page to function
                 */
                dependencies: {
                    user_schedule: false
                },
                /**
                 * Title to display in page block
                 */
                page_title: this.coach_mode ? 'Coach Schedule' : 'My Schedule1'
            };
        },
        computed: {
            /**
             * Status message to display in place of the schedule block
             */
            status_message: function () {
                if (!this.schedule_available) {
                    return 'The schedule has not been posted yet.  Try again later.';
                }
                if (this.schedule.days.length === 0) {
                    return 'There are no sessions in your schedule.';
                }

                return false;
            },
            /**
             * Whether the schedule for the competition is available
             */
            schedule_available: function () {
                return this.$store.state.competitions.active_competition_my_schedule_available_override;
            },
            /**
             * The schedule to display on the page
             */
            schedule: function () {
                if (this.coach_mode) {
                    return this.$store.state.coach.active_competition_skater_schedule.schedule;
                }

                return this.$store.state.skater.active_schedule.schedule;
            }
        },
        methods: {
            /**
             * Get the skaters for a session
             *
             * If coach mode isn't active, return empty list
             */
            session_skaters: function (session: Session): string[] {
                if (!this.coach_mode) {
                    return [];
                }

                return this.$store.getters['coach/session_skaters'](session.id);
            },
            /**
             * Expand the first expandable in the schedule list
             */
            expandFirstExpandable: function () {
                const session_components = this.$refs.sessions as ExtendedSessionComponent[];
                if (session_components && session_components.length) {
                    session_components[0].toggleExpand();
                }
            },
            /**
             * Hook after data for the page has loaded
             */
            postDataLoad: function () {
                if (this.expand_first_expandable) {
                    this.$nextTick(() => {
                        this.expandFirstExpandable();
                    });
                }
            },
            /**
             * Load data necessary to load the component
             */
            loadData: function () {
                return new Promise((resolve, reject) => {
                    const state_action = this.coach_mode ? 'competition_portal/fetchMyScheduleCoach' : 'competition_portal/fetchMySchedule';
                    this.$store.dispatch(state_action)
                        .then(() => {
                            this.dependencies.user_schedule = true;
                            this.postDataLoad();
                            resolve();
                        })
                        .catch(() => {
                            reject();
                        });
                });
            }
        }
    });
</script>