<template>
    <div class="series-application-application">
        <div v-if="show_refund_information"
             class="series-application-application__refund-information">
            To request a refund contact
            <br>
            <a :href="`mailto:${series.refund_email_address}`"
               class="standard-link">{{series.refund_email_address}}
            </a>
        </div>
        <div v-if="levels_information"
             class="series-application-application__information">
            <page-alert class="page-alert page-alert--notice page-alert--medium">
                <div slot="trigger_text">
                    Important Information
                </div>
                <div slot="expand_content">
                    {{levels_information}}
                </div>
            </page-alert>
        </div>
        <discipline v-for="discipline in disciplines"
                    :key="discipline.id"
                    class="card"
                    :discipline="discipline"></discipline>
        <member-search-takeover v-if="memberSearchIsActive()"
                                v-on:close="memberSearchClose()"></member-search-takeover>
        <div class="series-application-application__footer">
            <div class="grid-container">
                <div class="series-application-application__footer__information">
                    <div class="series-application-application__footer__information__price">
                        <span class="cost-display">
                            <span class="cost-display__label">Total:</span>
                            <span class="cost-display__value">${{total_cost}}</span>
                        </span>
                    </div>
                </div>
                <div class="series-application-application__footer__cta">
                    <div class="series-application-application__footer__cta__element">
                        <button :disabled="disable_save"
                                class="button button--large button--info button--block"
                                v-on:click.prevent="saveApplication(false)">
                            {{save_button_text}}
                        </button>
                    </div>
                    <div class="series-application-application__footer__cta__element">
                        <button :disabled="disable_pay"
                                class="button button--large button--action button--block"
                                v-on:click.prevent="handlePayClick">
                            Pay Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <site-overlay transition_name="fade"
                      :open_fn="overlayIsActive"
                      class="site-overlay--faded"
                      :show_header="false"
                      :lock_scroll="false">
            <div class="confirmation-overlay">
                <div class="confirmation-overlay__content">
                    <series-registration-eligibility-confirmation v-if="eligibility_confirmation_active"
                                                                  :eligibility_documents="series.application_configuration.eligibility_documents"
                                                                  v-on:continue="handleEligibilityConfirm"></series-registration-eligibility-confirmation>
                    <div v-else-if="is_saving"
                         class="confirmation-overlay__dialog">
                        <div class="confirmation-overlay__dialog__icon">
                            <animated-saving-icon></animated-saving-icon>
                        </div>
                        <div class="confirmation-overlay__dialog__message confirmation-overlay__dialog__message--large">
                            Please wait while we save your information
                        </div>
                    </div>
                    <div v-else-if="save_error"
                         class="confirmation-overlay__dialog">
                        <div class="confirmation-overlay__dialog__icon">
                            <i class="icon-danger">&nbsp;</i>
                        </div>
                        <div class="text--error confirmation-overlay__dialog__message">
                            {{save_error}}
                        </div>
                        <div>
                            <button class="button button--small"
                                    v-on:click="closeConfirmationOverlay">
                                OK
                            </button>
                        </div>
                    </div>
                    <div v-else
                         class="confirmation-overlay__dialog">
                        <div class="confirmation-overlay__dialog__icon">
                            <animated-check-icon ref="check"></animated-check-icon>
                        </div>
                        <div class="confirmation-overlay__dialog__message confirmation-overlay__dialog__message--large">
                            {{confirmation_message}}
                        </div>
                        <div>
                            <a v-if="cart_link"
                               :href="cart_link"
                               class="button button--small">Continue to Cart
                            </a>
                            <button v-else
                                    class="button button--small"
                                    v-on:click="closeConfirmationOverlay">
                                OK
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </site-overlay>
    </div>
</template>
<script lang="ts">
    import Discipline from '../../_components/SeriesApplicationDiscipline.vue';
    import MemberSearchTakeover from '../../../../components/MemberSearch/MemberSearchTakeover.vue';
    import Vue from 'vue';
    import {AnimatedCheckInterface} from '../../../../components/AnimatedIcons/AnimatedCheckIcon.vue';
    import {enforcePromiseResolutionDuration} from '../../../../helpers/PromiseHelpers';
    import {SeriesApplication} from '../../_contracts';
    // @vue/component
    export default Vue.extend({
        components: {
            Discipline,
            MemberSearchTakeover
        },
        /**
         * Reactive data
         */
        data: function () {
            return {
                /**
                 * Link to cart for series application
                 */
                cart_link: '',
                /**
                 * Whether the most recent action has completed successfully
                 */
                confirmation_active: false,
                /**
                 * Message to show in confirmation overlay
                 */
                confirmation_message: '',
                /**
                 * Whether the eligibility confirmation dialog is active
                 */
                eligibility_confirmation_active: false,
                /**
                 * Whether the application is being saved
                 */
                is_saving: false,
                /**
                 * Error resulting from application save
                 */
                save_error: ''
            };
        },
        computed: {
            /**
             * The current user application for the series
             */
            application: function (): SeriesApplication.UserApplication | null {
                return this.$store.getters['series_registration/application/active_application'];
            },
            /**
             * Whether the pay button should be disabled
             */
            disable_pay: function (): boolean {
                return this.user_citizenship_ineligible || this.is_saving || this.total_cost <= 0;
            },
            /**
             * Whether the save button should be disabled
             */
            disable_save: function (): boolean {
                return this.is_saving || this.user_citizenship_ineligible;
            },
            /**
             * The disciplines within the application
             */
            disciplines: function (): SeriesApplication.ApplicationDiscipline[] {
                if (this.application) {
                    return this.application.disciplines;
                }

                return [];
            },
            /**
             * Levels information for the series
             */
            levels_information: function (): string | null {
                return (this.series && this.series.application_configuration.levels_information) || null;
            },
            /**
             * The text for the save button
             */
            save_button_text: function (): string {
                return this.is_saving ? 'Saving' : 'Save';
            },
            /**
             * The series for the page
             */
            series: function (): SeriesApplication.Series | null {
                return this.$store.getters['series_registration/application/series'];
            },
            /**
             * Whether to show the refund information block
             */
            show_refund_information: function (): boolean {
                return this.$store.getters['series_registration/application/paid_level_exists'];
            },
            /**
             * The total cost of the active series application
             */
            total_cost: function (): number {
                return this.$store.getters['series_registration/application/total_cost'];
            },
            /**
             * Whether the active user is ineligible for the series due to their citizenship status
             */
            user_citizenship_ineligible: function (): boolean {
                return this.$store.getters['series_registration/application/user_citizenship_ineligible'];
            }
        },
        watch: {
            /**
             * Watch for confirmation active flag and play the animated check icon
             */
            confirmation_active: function (value: boolean): void {
                if (value) {
                    this.$nextTick(() => {
                        const check_icon: AnimatedCheckInterface = this.$refs.check as AnimatedCheckInterface;
                        if (check_icon) {
                            check_icon.play();
                        }
                    });
                }
            }
        },
        methods: {
            /**
             * Close the confirmation overlay
             */
            closeConfirmationOverlay: function (): void {
                this.confirmation_active = false;
                this.confirmation_message = '';
                this.save_error = '';
                this.cart_link = '';
                this.$store.commit('series_registration/application/setSavedApplicationExists', true);
            },
            /**
             * Handle continue event on eligibility confirmation
             */
            handleEligibilityConfirm: function (): void {
                this.eligibility_confirmation_active = false;
                this.saveApplication(true);
            },
            /**
             * Handle click event on pay now button
             */
            handlePayClick: function (): void {
                if (this.user_citizenship_ineligible) {
                    return;
                }
                if (this.series && this.series.application_configuration.eligibility_documents.length) {
                    this.eligibility_confirmation_active = true;

                    return;
                }
                this.handleEligibilityConfirm();
            },
            /**
             * Close the member search
             */
            memberSearchClose: function (): void {
                this.$store.dispatch('series_registration/application/closeSearch');
            },
            /**
             *  Whether the member search is active
             */
            memberSearchIsActive: function (): boolean {
                return this.$store.getters['series_registration/application/member_search_active'];
            },
            /**
             * Whether the component overlay is active
             *
             * 1. Eligibility Confirmation
             * 2. Saving dialog
             * 3. Saved dialog
             * 4. Error dialog
             */
            overlayIsActive: function (): boolean {
                return this.is_saving || this.confirmation_active || !!this.save_error || this.eligibility_confirmation_active;
            },
            /**
             * Save the current application
             */
            saveApplication: function (is_pay: boolean = false): void {
                if (this.user_citizenship_ineligible) {
                    return;
                }
                this.is_saving = true;
                this.save_error = '';

                enforcePromiseResolutionDuration(2000, this.$store.dispatch, ['series_registration/application/save'])
                    .then((cart_link: string) => {
                        this.is_saving = false;
                        this.confirmation_active = true;
                        this.confirmation_message = 'Your information has been saved';
                        if (is_pay) {
                            this.cart_link = cart_link;
                        }
                    })
                    .catch((error_message: string) => {
                        this.save_error = error_message;
                        this.is_saving = false;
                    });
            }
        }
    });
</script>