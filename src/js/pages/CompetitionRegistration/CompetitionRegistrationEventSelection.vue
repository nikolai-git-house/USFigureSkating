<script lang="ts">
    import {
        EventPartner,
        EventSelectionEvent,
        PartnerSkateTestSummary
    } from "../../contracts/app/CompetitionRegistrationContracts";
    import HasCompetitionRegistrationCompetitionMixin from "../../mixins/HasCompetitionRegistrationCompetitionMixin"
    import HasDataDependencies from "../../mixins/HasDataDependencies"
    import mixins from 'vue-typed-mixins'
    import {SkateTestHistoryState} from "../../store/Modules/SkateTestHistoryState";
    import {
        PartnerSkateTestAddAppPayload,
        PartnerSkateTestRemoveAppPayload,
        SavedSkateTest,
        SkateTestFormData,
        SkateTestHistoryDiscipline
    } from "../../contracts/app/SkateTestContracts";
    import {FormOption} from "../../contracts/AppContracts";
    import EventSelection from "../../components/CompetitionRegistration/EventSelection.vue";


    export default mixins(HasCompetitionRegistrationCompetitionMixin, HasDataDependencies).extend({
        data: function () {
            return {
                /**
                 * The active partner for which skate tests are being modified
                 */
                active_partner: <EventPartner | null>null,
                /**
                 * Error resulting from a skate test submission
                 */
                skate_test_submit_error: <string | null>null,
                /**
                 * Whether a skate test is in the process of submitting
                 */
                submitting_skate_test: false,
                /**
                 * Whether an error occurred when loading partner skate test history
                 */
                partner_test_load_error: <string | null>null,
                /**
                 * The list index of the partner for which skate test information is being loaded
                 * Used for location of error if load results in an error
                 */
                loading_skate_test_index: <number | null>null,
                /**
                 * Whether data needed for component to function has been loaded
                 */
                dependencies: {
                    screen: false,
                    competition: false
                },
                /**
                 * The PartnerSkateTestSummary item for which requirements overlay is currently active
                 */
                active_requirements: <PartnerSkateTestSummary | null>null
            }
        },
        /**
         * On component creation, register the skate test history module for partner skate test management
         */
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
                        this.$store.dispatch('competition_registration/fetchEventSelectionScreenData').then(() => {
                            this.dependencies.screen = true;
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
             * Whether the event requirements overlay is active
             */
            eventRequirementsActive: function (): boolean {
                return this.active_requirements !== null;
            },
            /**
             * Start the process for opening a partner skate test history
             */
            openPartnerSkateTest: function (summary_item: PartnerSkateTestSummary, index: number): void {
                this.loading_skate_test_index = index;
                this.$store.dispatch('skate_test_history/fetchSkateTestHistory', summary_item.partner.id).then(() => {
                    this.active_partner = summary_item.partner;
                    this.loading_skate_test_index = null;
                }).catch(() => {
                    this.partner_test_load_error = "Error loading skate test history."
                });
            },
            /**
             * Overlay logic function to determine whether to show the partner skate test takeover
             */
            partnerSkateTestActive: function (): boolean {
                return !!this.active_partner;
            },
            /**
             * Handle the close event on the partner skate test overlay.
             * If a discipline form is active, close it.
             * Otherwise completely close the takeover and show the general section of the main component that launched it
             */
            handlePartnerSkateTestOverlayClose: function (): void {
                if (this.active_test_discipline) {
                    this.closeSkateTestDisciplineForm();
                    return;
                }
                this.active_partner = null;
                this.scrollToPartnerTests();
            },
            /**
             * Handle close/cancel event on the event requirements overlay
             */
            handleEventRequirementsOverlayClose: function (): void {
                this.active_requirements = null;
                this.scrollToPartnerTests();
            },
            /**
             * Scroll to the "Partner Skate Test History" section
             */
            scrollToPartnerTests: function (): void {
                this.$nextTick(() => {
                    let tests_section = this.$refs['partner_tests'];
                    if (tests_section) {
                        (tests_section as HTMLElement).scrollIntoView();
                    }
                });
            },
            /**
             * Handle close/cancel event on the add skate test form
             */
            closeSkateTestDisciplineForm: function () {
                this.$store.commit('skate_test_history/setActiveDiscipline', null);
            },
            /**
             * Handle the complete event on a skate test form.  Begin submission data flow and respond to submission result
             */
            completeSkateTest: function (test_data: SkateTestFormData): void {
                this.skate_test_submit_error = null;
                let active_discipline_key = this.active_test_discipline ? this.active_test_discipline.key : null;
                if (!this.active_partner || !active_discipline_key) {
                    /**
                     * @note: one should never be able to see the complete test UI without an active partner, but this logic
                     * accommodates the potential for active_partner to be null
                     */
                    this.skate_test_submit_error = "Invalid entity.";
                    return;
                }
                this.submitting_skate_test = true;
                this.$store.dispatch('competition_registration/addPartnerSkateTest',
                    <PartnerSkateTestAddAppPayload>{
                        discipline_key: active_discipline_key,
                        test_data,
                        partner_id: this.active_partner.id
                    }
                ).then(() => {
                    this.$store.commit('skate_test_history/setActiveDiscipline', null);
                    this.submitting_skate_test = false;
                }).catch((error_message) => {
                    this.submitting_skate_test = false;
                    this.skate_test_submit_error = error_message;
                });
            },
            /**
             * Handle the remove event on a self-reported skate test.  Begin submission data flow and respond to submission result
             */
            removeSkateTest: function (discipline: SkateTestHistoryDiscipline, test: SavedSkateTest): Promise<void> {
                return new Promise((resolve, reject) => {
                    if (!this.active_partner) {
                        /**
                         * @note: one should never be able to see the remove test UI without an active partner, but this logic
                         * accommodates the potential for active_partner to be null
                         */
                        reject("Invalid entity.");
                        return;
                    }
                    this.$store.dispatch('competition_registration/removePartnerSkateTest',
                        <PartnerSkateTestRemoveAppPayload>{
                            discipline,
                            test,
                            partner_id: this.active_partner.id
                        }
                    ).then(() => {
                        resolve();
                    }).catch((error_message) => {
                        reject(error_message);
                    });
                });
            },
            /**
             * Whether there's error for a particular partner item in loading skate test history
             */
            partnerSkateTestLoadError: function (index: number) {
                return this.partner_test_load_error && index === this.loading_skate_test_index;
            },
            /**
             * Advance in the competition registration process
             */
            advance: function () {
                if (this.block_continue) {
                    return;
                }
                location.assign(this.competition.registration_links.coach_information);
            },
            /**
             * Retreat in the competition registration process
             * If the competition being registered for has partner events, go back to partner identification
             * Otherwise go back to skate tests
             */
            retreat: function () {
                let retreat_path: string = this.competition.registration_links.partner_identification;
                if (!this.$store.state.competition_registration.selected_partner_events.length) {
                    retreat_path = this.competition.registration_links.partner_events;
                }
                if (!this.competition.has_partner_events) {
                    retreat_path = this.competition.registration_links.skate_test;
                }
                location.assign(retreat_path);
            }
        },
        computed: {

            /**
             * The events that are available to display in the component, registered, selected or available
             */
            state_available_events: function (): EventSelectionEvent[] {
                return this.$store.getters['competition_registration/event_selection_events'];
            },
            /**
             * The events that have been selected by the user
             */
            selected_events: function (): EventSelectionEvent[] {
                return this.state_available_events.filter((event: EventSelectionEvent) => {
                    return event.is_selected;
                })
            },
            /**
             * List of partner skate test summary items
             */
            partner_skate_test_summary: function (): PartnerSkateTestSummary[] {
                return this.$store.getters['competition_registration/partner_skate_test_summary'];
            },
            /**
             * Whether to show the partner skate test section of the component
             */
            show_partner_tests: function () {
                return this.partner_skate_test_summary.length > 0;
            },
            /**
             * The active skate test history discipline if there is one.
             * Used by add skate test process
             */
            active_test_discipline: function (): SkateTestHistoryDiscipline | null {
                return this.$store.getters['skate_test_history/active_discipline'];
            },
            /**
             * Partner name for skate test history takeover heading text
             */
            skate_test_takeover_partner_name: function (): string {
                return this.active_partner ? this.active_partner.name : "";
            },
            /**
             * The "test" input form options for the active skate test history discipline form
             */
            active_skate_test_options: function (): FormOption[] {
                return this.$store.getters['skate_test_history/active_discipline_test_options'];
            },
            /**
             * The active step in the competition registration process.  Depends on whether the competition supports partner events
             */
            active_step_number: function () {
                if (this.active_competition && !this.competition.has_partner_events) {
                    return 3;
                }
                return 5;
            },
            /**
             * Whether user should be prevented from continuing
             * 1. If the user has selected no events
             * 2. If any of the assigned partners doesn't meet skate test requirements
             */
            block_continue: function () {
                if (this.selected_events.length === 0) {
                    return true;
                }
                for (let i = 0; i < this.partner_skate_test_summary.length; i++) {
                    let partnerSkateTestSummaryElement = this.partner_skate_test_summary[i];
                    if (!partnerSkateTestSummaryElement.partner.meets_requirements) {
                        return true;
                    }
                }
                return false;
            },
        },
        components: {
            EventSelection
        }
    });
</script>