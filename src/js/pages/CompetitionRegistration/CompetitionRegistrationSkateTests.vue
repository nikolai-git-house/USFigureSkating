<script lang="ts">
    import {SkateTestHistoryState} from "../../store/Modules/SkateTestHistoryState";
    import {
        SkateTestFormData,
        SkateTestFormOption,
        SkateTestHistoryDiscipline
    } from "../../contracts/app/SkateTestContracts";
    import mixins from 'vue-typed-mixins'
    import HasDataDependencies from "../../mixins/HasDataDependencies"
    import HasCompetitionRegistrationCompetitionMixin from "../../mixins/HasCompetitionRegistrationCompetitionMixin"

    export default mixins(HasDataDependencies, HasCompetitionRegistrationCompetitionMixin).extend({
        data: function () {
            return {
                /**
                 * Error message resulting from a submission
                 */
                test_submit_error: <string | null>null,
                /**
                 * Whether a test is in the process of being submitted
                 */
                submitting_test: false,
                /**
                 * data needed for component to function
                 */
                dependencies: {
                    skate_test: false,
                    competition: false
                }
            }
        },
        created: function () {
            this.$store.registerModule('skate_test_history', SkateTestHistoryState);
        },
        methods: {
            /**
             * Load data needed for component to function
             */
            loadData: function () {
                return new Promise((resolve, reject) => {
                    let promises: Promise<void>[] = [
                        this.$store.dispatch('competition_registration/fetchSkateTestsScreenData').then(() => {
                            this.dependencies.skate_test = true;
                            this.dependencies.competition = true;
                        }).catch(() => {
                            reject();
                        })
                    ];
                    Promise.all(promises).then(() => {
                        resolve();
                    });
                });
            },
            /**
             * Whether the skate test form overlay should be active
             */
            skateTestActive: function (): boolean {
                return !!this.active_discipline;
            },
            /**
             * Close the skate test form overlay
             */
            closeSkateTest: function (): void {
                if (this.submitting_test) {
                    return;
                }
                this.test_submit_error = null;
                this.$store.commit('skate_test_history/setActiveDiscipline', null);
            },
            /**
             * Respond to completion event on skate test discipline form.
             *  - Submit information
             *  - Close form
             *  Log error on submission failure
             */
            completeSkateTest: function (test_data: SkateTestFormData): void {
                this.submitting_test = true;
                this.test_submit_error = null;
                this.$store.dispatch('skate_test_history/saveTest', test_data).then(() => {
                    this.$store.commit('skate_test_history/setActiveDiscipline', null);
                    this.submitting_test = false;
                }).catch((error_message) => {
                    this.submitting_test = false;
                    this.test_submit_error = error_message;
                })
            },
            retreat: function () {
                location.assign(this.competition.registration_links.profile);
            },
            advance: function () {
                if (this.block_continue) {
                    return;
                }
                //if competition has partner events
                if (this.competition.has_partner_events) {
                    location.assign(this.competition.registration_links.partner_events);
                    return;
                }
                location.assign(this.competition.registration_links.event_selection);
            },

        },
        computed: {
            /**
             * The title of the skate test overlay
             */
            takeover_title: function (): string {
                if (this.active_discipline) {
                    return "Add " + this.active_discipline.label;
                }
                return "";
            },
            /**
             * The currently active discipline on state
             */
            active_discipline: function () {
                return this.$store.getters['skate_test_history/active_discipline'];
            },
            /**
             * List of disciplines with self-reported tests
             */
            self_reported_test_disciplines: function (): SkateTestHistoryDiscipline[] {
                return this.$store.getters['skate_test_history/user_self_reported_test_disciplines'];
            },
            /**
             * Form options for test for the active form instance
             */
            active_test_options: function (): SkateTestFormOption[] {
                return this.$store.getters['skate_test_history/active_discipline_test_options'];
            },
            /**
             * Whether continuing should be blocked
             */
            block_continue: function (): boolean {
                return false;
            }
        }
    });
</script>