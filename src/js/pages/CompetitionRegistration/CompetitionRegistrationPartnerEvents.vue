<script lang="ts">
    import {FormOption, FormOptionValue} from "../../contracts/AppContracts";
    import {CompetitionRegistrationActiveCompetition} from "../../contracts/app/CompetitionRegistrationContracts";
    import HasCompetition from "../../mixins/HasCompetitionRegistrationCompetitionMixin";
    import HasDataDependencies from "../../mixins/HasDataDependencies";
    import mixins from "vue-typed-mixins";

    export default mixins(HasCompetition, HasDataDependencies).extend({
        data: function () {
            return {
                /**
                 * data needed for component to function
                 */
                dependencies: {
                    competition: false
                },
                /**
                 * In-component tracking for selected events
                 */
                selected_events: <FormOptionValue[]>[],
                /**
                 * Whether the selection is currently being saved
                 */
                saving: false,
                /**
                 * Error resulting from the save submission
                 */
                save_error: <string | null>null
            }
        },
        methods: {
            /**
             * Load data needed for component to function
             */
            loadData: function () {
                return new Promise((resolve, reject) => {
                    this.$store.dispatch('competition_registration/fetchPartnerEventsScreenData').then(() => {
                        this.dependencies.competition = true;
                        this.selected_events = this.$store.state.competition_registration.selected_partner_events;
                        resolve();
                    }).catch(() => {
                        reject();
                    })
                });
            },
            retreat: function () {
                location.assign(this.competition.registration_links.skate_test);
            },
            /**
             * Save the selections and advance if successful.
             *    - Advance location dependent on whether partner events are selected or not
             * Display error if submission error.
             *
             */
            advance: function () {
                if (this.disable_continue) {
                    return;
                }
                this.saving = true;
                this.save_error = null;
                this.$store.dispatch('competition_registration/selectPartnerEvents', this.selected_events)
                    .then(() => {
                        if (this.selected_events.length) {
                            location.assign(this.competition.registration_links.partner_identification);
                            return
                        }
                        location.assign(this.competition.registration_links.event_selection);
                    })
                    .catch((error_message: string) => {
                        this.saving = false;
                        this.save_error = error_message;
                    })
            }
        },
        computed: {
            active_competition: function (): CompetitionRegistrationActiveCompetition {
                return this.$store.getters['competition_registration/active_competition'];
            },
            /**
             * The options for the user to select from
             */
            partner_event_options: function (): FormOption[] {
                if (!this.active_competition) {
                    return [];
                }
                return this.active_competition.available_partner_events;
            },
            /**
             * Whether continue button should be disabled (functionally speaking.  visual state does not change)
             */
            disable_continue: function () {
                return this.saving;
            }
        }
    });
</script>