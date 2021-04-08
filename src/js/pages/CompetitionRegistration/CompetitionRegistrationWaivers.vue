<script lang="ts">
    import mixins from 'vue-typed-mixins'
    import HasDataDependencies from "../../mixins/HasDataDependencies"
    import HasCompetitionRegistrationCompetitionMixin from "../../mixins/HasCompetitionRegistrationCompetitionMixin"
    import {UserWaiver} from "../../contracts/app/CompetitionRegistrationContracts";

    export default mixins(HasCompetitionRegistrationCompetitionMixin, HasDataDependencies).extend({
        data: function () {
            return {
                /**
                 * data needed for component to function
                 */
                dependencies: {
                    competition: false,
                    screen_config: false
                },
                /**
                 * Local tracking of waivers information
                 */
                waivers: <UserWaiver[]>[],
                /**
                 * Whether the waivers have been changed
                 */
                waivers_changed: false,
                /**
                 * Whether the waivers are in the process of saving
                 */
                saving: false,
                /**
                 * If saving waivers resulted in an error
                 */
                save_error: <string | null>null
            }
        },
        /**
         * On creation, set local waivers data to state waivers
         */
        created: function () {
            this.waivers = [...this.user_waivers];
        },
        methods: {
            /**
             * Load data needed for component to function
             */
            loadData: function () {
                return new Promise((resolve, reject) => {
                    let promises: Promise<void>[] = [
                        this.$store.dispatch('competition_registration/fetchWaiversScreenData').then(() => {
                            this.dependencies.screen_config = true;
                            this.dependencies.competition = true;
                        }).catch(() => {
                            reject();
                        })
                    ];
                    Promise.all(promises).then(() => {
                        resolve();
                    })
                });
            },
            /**
             * Whether a waiver is complete
             */
            isComplete: function (waiver: UserWaiver): boolean {
                return !!waiver.status.name && !!waiver.status.relationship;
            },
            /**
             * Save the active waiver data
             */
            saveWaiversData: function (): Promise<void> {
                this.saving = true;
                return new Promise((resolve, reject) => {
                    this.$store.dispatch('user/saveWaivers', this.waivers).then(() => {
                        resolve();
                    }).catch((error_message: string) => {
                        this.saving = false;
                        this.save_error = error_message;
                    })
                });
            },
            /**
             * Handle the continue button click. Save waiver data if it's changed and direct to next page
             */
            advance: function () {
                if (this.block_continue) {
                    return;
                }
                if (!this.waivers_changed) {
                    location.assign(this.competition.registration_links.cart);
                    return;
                }
                this.saveWaiversData().then(() => {
                    location.assign(this.competition.registration_links.cart);
                });
            },
            /**
             * Handle the "back" button click
             */
            retreat: function () {
                location.assign(this.competition.registration_links.coach_information);
            },
        },
        computed: {
            /**
             * Whether the waivers are complete
             */
            waivers_complete: function (): boolean {
                for (let i in this.waivers) {
                    let waiver = this.waivers[i];
                    if (!waiver.status.name || !waiver.status.relationship) {
                        return false;
                    }
                }
                return true;
            },
            /**
             * Whether continue button should be disabled and continuing blocked
             */
            block_continue: function () {
                if (this.saving) {
                    return true;
                }
                return !this.waivers_complete;
            },
            /**
             * State-based waiver data
             */
            user_waivers: function (): UserWaiver[] {
                return this.$store.getters['user/waivers'];
            },
            /**
             * Form options for relationship inputs
             */
            relationship_form_options: function () {
                return this.$store.getters['form_options/waiver_relationships']
            },
            /**
             * The active step in the competition registration process.  Depends on whether the competition supports partner events
             */
            active_step_number: function () {
                if (this.active_competition && !this.competition.has_partner_events) {
                    return 5;
                }
                return 7;
            }
        },
        watch: {
            /**
             * When waivers data changes, clear errors and log that data needs to be saved
             */
            waivers: {
                handler: function () {
                    this.waivers_changed = true;
                    this.save_error = null;
                }, deep: true
            },
            /**
             * When state based waivers change, update local state
             */
            user_waivers: function (value: UserWaiver[]) {
                this.waivers = [...value];
                this.$nextTick(() => {
                    this.waivers_changed = false;
                });
            }
        }
    });
</script>