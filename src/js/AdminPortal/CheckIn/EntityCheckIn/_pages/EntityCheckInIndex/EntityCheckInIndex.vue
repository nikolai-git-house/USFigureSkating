<template>
    <div class="entity-check-in-index">
        <div class="entity-check-in-subpage__content-container">
            <div class="entity-check-in-index__content">
                <div class="entity-check-in-subpage__section">
                    <div class="entity-check-in-index__entity-summary">
                        <h3 class="entity-check-in-index__entity-summary__name">
                            {{entity.summary_name}}
                        </h3>
                        <ul class="entity-check-in-index__entity-summary__list label-list">
                            <li>
                                <span class="label-list__label">Member:</span>
                                <span class="label-list__value">#{{entity.member_number}}
                                    <span v-if="!entity.membership_status.active" class="text--alert">Expired</span>
                                    <span v-else>(Valid Through: {{entity.membership_status.validity_date_formatted}})</span>
                                </span>
                            </li>
                            <li v-if="entity.club">
                                <span class="label-list__label">Club:</span>
                                <span class="label-list__value">{{entity.club}}</span>
                            </li>
                            <li v-if="entity.lts_summary">
                                <span class="label-list__label">Program Name:</span>
                                <span class="label-list__value">{{entity.lts_summary.description}}
                                    <span v-if="entity.lts_summary.validity_date_formatted">({{entity.lts_summary.validity_date_formatted}})</span>
                                </span>
                            </li>
                            <li v-if="entity.email">
                                <span class="label-list__label">Email:</span>
                                <span class="label-list__value">
                                    <a :href="'mailto:'+entity.email" class="standard-link">{{entity.email}}</a>
                                </span>
                            </li>
                            <li v-if="entity.phone">
                                <span class="label-list__label">Phone:</span>
                                <span class="label-list__value">
                                    <a :href="'tel:'+entity.phone" class="standard-link">{{entity.phone}}</a>
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="entity-check-in-subpage__section">
                    <entity-check-in-index-navigation :debug_mode="debug_mode"
                                                      :entity="entity"
                                                      v-on:page-selected="openSubpage"></entity-check-in-index-navigation>
                </div>
                <div v-if="entity.personal_schedule_url" class="entity-check-in-subpage__section entity-check-in-subpage__section--download-schedule">
                    <a :href="entity.personal_schedule_url"
                       target="_blank"
                       rel="noopener noreferrer"
                       class="icon-link icon-link--lg icon-link--download entity-check-in-index__download">
                        Download Personal Schedule
                    </a>
                </div>
                <div v-if="show_outstanding_fees" class="entity-check-in-subpage__section entity-check-in-subpage__section--outstanding-fees">
                    <div class="entity-check-in-index__outstanding-fees"
                         :class="{'entity-check-in-index__outstanding-fees--no-pad': !outstanding_fees}">
                        <label class="entity-check-in-index__outstanding-fees__heading">
                            Outstanding Fees:
                            <span v-if="!outstanding_fees"> None</span>
                        </label>
                        <div v-if="outstanding_fees">
                            <ul class="entity-check-in-index__outstanding-fees__list">
                                <li v-for="(fee,index) in outstanding_fees" :key="index">
                                    {{fee.name}}: ${{fee.amount}}
                                </li>
                            </ul>
                            <p class="entity-check-in-index__outstanding-fees__description">
                                Note: The {{entity.entity_type_description.toLowerCase()}} must pay this late fee before
                                they can check in. The {{entity.entity_type_description.toLowerCase()}} can log in their
                                Members Only and pay with a credit/debit card, and then check in. Or, if the competition
                                is accepting cash, you can click the “Paid Cash” check box to complete check in.
                            </p>
                            <div class="entity-check-in-index__outstanding-fees__control">
                                <label for="outstanding_fees_received" class="usfsa-checkbox usfsa-checkbox--required">
                                    <input id="outstanding_fees_received"
                                           v-model="outstanding_fees_received"
                                           type="checkbox">
                                    <span class="usfsa-checkbox__text">Paid Cash or Check</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-if="unpaid_events" class="entity-check-in-subpage__section entity-check-in-subpage__section--unpaid-events">
                    <div class="entity-check-in-index__unpaid-events">
                        <label class="entity-check-in-index__unpaid-events__heading">
                            Unpaid Events:
                        </label>
                        <p class="entity-check-in-index__unpaid-events__description">
                            The {{entity.entity_type_description.toLowerCase()}} must pay for the following events
                            before they can check-in:
                        </p>
                        <ul class="entity-check-in-index__unpaid-events__list">
                            <li v-for="(event,index) in unpaid_events" :key="index">
                                {{event}}
                            </li>
                        </ul>
                        <p class="entity-check-in-index__unpaid-events__description">
                            The {{entity.entity_type_description.toLowerCase()}} can log in to Members Only and pay with
                            a credit/debit card, and then check in.
                        </p>
                    </div>
                </div>
                <div class="entity-check-in-subpage__section entity-check-in-subpage__section--confirmations">
                    <div class="entity-check-in-index__confirmations">
                        <label class="entity-check-in-index__confirmations__heading">
                            Check to confirm receipt of credential.
                        </label>
                        <div class="entity-check-in-index__confirmations__controls">
                            <div class="entity-check-in-index__confirmations__controls__control">
                                <label for="credential_provided" class="usfsa-checkbox usfsa-checkbox--required">
                                    <input id="credential_provided"
                                           v-model="credential_provided"
                                           type="checkbox">
                                    <span class="usfsa-checkbox__text">Credential</span>
                                </label>
                            </div>
                            <div v-if="show_gift" class="entity-check-in-index__confirmations__controls__control">
                                <label for="gift_provided" class="usfsa-checkbox usfsa-checkbox--required">
                                    <input id="gift_provided"
                                           v-model="gift_provided"
                                           type="checkbox">
                                    <span class="usfsa-checkbox__text">Gift</span>
                                </label>
                            </div>
                        </div>
                        <p class="entity-check-in-index__confirmations__notice">
                            *Required to check-in
                        </p>
                    </div>
                </div>
                <div class="entity-check-in-subpage__section entity-check-in-subpage__section--submit">
                    <p v-if="!entity.eligible" class="entity-check-in-index__ineligible-notice text--alert">
                        <span v-if="!entity.checked_in">This person is not eligible to participate in the competition and cannot check-in or receive a credential.</span>
                        <span v-else>Person is ineligible to participate. Receive the credential from this person, undo the check-in and notify the Chief Referee.</span>
                    </p>
                    <div v-if="show_undo_checkin" class="entity-check-in-index__submit-block">
                        <p v-if="submission_error" class="input-error">
                            {{submission_error}}
                        </p>
                        <button
                            :disabled="undo_check_in_disabled"
                            class="button button--large button--block button--info"
                            v-on:click.stop.prevent="undoEntityCheckIn">
                            {{submitting?'Undoing Check-In':'Undo Check-In'}}
                        </button>
                    </div>
                    <div v-else class="entity-check-in-index__submit-block">
                        <p v-if="submission_error" class="input-error">
                            {{submission_error}}
                        </p>
                        <button :disabled="!check_in_permitted"
                                class="button button--large button--block"
                                v-on:click.stop.prevent="checkEntityIn">
                            Check-In
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <site-overlay transition_name="fade"
                      :open_fn="confirmationOverlayIsActive"
                      class="site-overlay--faded"
                      :show_header="false"
                      :lock_scroll="false"
                      v-on:entered="dialogEnter">
            <div class="confirmation-overlay">
                <div class="confirmation-overlay__content">
                    <div class="confirmation-overlay__dialog">
                        <div class="confirmation-overlay__dialog__icon">
                            <animated-check-icon ref="check"></animated-check-icon>
                        </div>
                        <div class="confirmation-overlay__dialog__message confirmation-overlay__dialog__message--large">
                            {{confirmation_message}}
                        </div>
                        <div>
                            <button class="button button--small" v-on:click="$emit('back',true)">
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
    import Vue from 'vue';
    import {ENTITY_CHECK_IN_DEBUG} from '../../../../../config/AppConfig';
    import {AnimatedCheckInterface} from '../../../../../components/AnimatedIcons/AnimatedCheckIcon.vue';
    import {CheckEntityInPayload} from '../../../_contracts/CheckInContracts';
    import {CheckInEntityIndexEntity, CheckInEntityOutstandingFee} from '../../../_contracts/CheckInEntityContracts';
    import {EntityCheckInPageKey} from '../../_contracts/EntityCheckInContracts';
    import EntityCheckInIndexNavigation from './_components/EntityCheckInIndexNavigation.vue';

    export default Vue.extend({
        components: {
            EntityCheckInIndexNavigation
        },
        /**
         * Reactive data
         */
        data: function () {
            return {
                /**
                 * Whether the confirmation dialog is active
                 */
                confirmation_active: false,
                /**
                 * Whether the credential provided checkbox has been checked
                 */
                credential_provided: false,
                /**
                 * Whether the gift provided checkbox, if present, has been checked
                 */
                gift_provided: false,
                /**
                 * Whether the outstanding fees checkbox has been checked
                 */
                outstanding_fees_received: false,
                /**
                 * The previous check-in/undo-check-in submission type
                 */
                previous_submission: <'do' | 'undo'>'do',
                /**
                 * Whether submission from the page has been completed
                 */
                submission_complete: false,
                /**
                 * Whether there was an error submitting check-in or undo check-in
                 */
                submission_error: <string | false>false,
                /**
                 * Whether check-in is currently submitting
                 */
                submitting: false,
                /**
                 * Shows all list items regardless of entity type
                 */
                debug_mode: ENTITY_CHECK_IN_DEBUG
            };
        },
        computed: {
            /**
             * Whether the entity can be checked-in in its current state
             */
            check_in_permitted: function (): boolean {
                if (this.submitting || this.submission_complete) {
                    return false;
                }
                if (this.outstanding_fees && !this.outstanding_fees_received) {
                    return false;
                }
                if (this.show_gift && !this.gift_provided) {
                    return false;
                }
                if (!this.credential_provided) {
                    return false;
                }

                return this.entity.check_in_permitted;
            },
            /**
             * The message to display based in conformation based on the action taken
             */
            confirmation_message: function (): string {
                if (this.previous_submission !== 'undo') {
                    return 'The ' + this.entity.entity_type_description + ' has been checked in.';
                }

                return 'The check-in for the ' + this.entity.entity_type_description + ' has been undone.';
            },
            /**
             *  The entity being checked in
             */
            entity: function (): CheckInEntityIndexEntity {
                return this.$store.state.checkin.active_entity;
            },
            /**
             * The outstanding fees for the entity
             */
            outstanding_fees: function (): CheckInEntityOutstandingFee[] | false {
                return this.entity.outstanding_fees.length ? this.entity.outstanding_fees : false;
            },
            /**
             * Whether to show the gift control
             */
            show_gift: function (): boolean {
                return false;
            },
            /**
             * Whether to show the outstanding fees block.
             *
             * Block shows for skaters and teams to show no unpaid fees in empty state
             */
            show_outstanding_fees: function (): boolean {
                if (this.outstanding_fees) {
                    return true;
                }
                const valid_roles = ['skater', 'team'];

                return valid_roles.indexOf(this.entity.entity_type_key) !== -1;
            },
            /**
             * Show the undo check-in button rather than the check-in button
             */
            show_undo_checkin: function (): boolean {
                return false;
            },
            /**
             * Whether the undo check-in button should be disabled
             */
            undo_check_in_disabled: function (): boolean {
                return !!this.submitting;
            },
            /**
             * The entity's unpaid events, if false if there are none
             */
            unpaid_events: function (): string[] | false {
                return this.entity.unpaid_events.length ? this.entity.unpaid_events : false;
            }
        },
        /**
         * Upon creation, assign component values based on entity state
         */
        created: function () {
            this.credential_provided = this.entity.check_in_status.credential_received;
            this.outstanding_fees_received = this.entity.check_in_status.unpaid_fees_received;
        },
        methods: {
            /**
             * Check the entity in
             */
            checkEntityIn: function () {
                if (!this.check_in_permitted || this.submitting) {
                    return;
                }
                this.submitting = true;
                this.submission_error = false;
                this.previous_submission = 'do';
                const payload: CheckEntityInPayload = {
                    credential_provided: this.credential_provided,
                    unpaid_fees_received: this.outstanding_fees_received
                };
                this.$store.dispatch('checkin/checkActiveEntityIn', payload)
                    .then(() => {
                        this.openConfirmation();
                        this.submitting = false;
                        this.submission_complete = true;
                    })
                    .catch((error_message: string) => {
                        this.submission_error = error_message;
                        this.submitting = false;
                    });
            },
            /**
             * Whether the confirmation dialog is active. Used by overlay component
             */
            confirmationOverlayIsActive: function (): boolean {
                return this.confirmation_active;
            },
            /**
             * Action after the confirmation dialog enters
             */
            dialogEnter: function () {
                // eslint-disable-next-line
                (this.$refs['check'] as AnimatedCheckInterface).play();
            },
            /**
             * Open the confirmation window
             */
            openConfirmation: function () {
                this.confirmation_active = true;
            },
            /**
             * Open a Subpage
             */
            openSubpage: function (page_key: EntityCheckInPageKey) {
                this.$emit('page-selected', page_key);
            },
            /**
             * Undo the check-in for the entity
             */
            undoEntityCheckIn: function () {
                if (this.submitting) {
                    return;
                }
                this.submission_error = false;
                this.submitting = true;
                this.previous_submission = 'undo';
                this.$store.dispatch('checkin/undoEntityCheckIn', this.entity)
                    .then(() => {
                        this.openConfirmation();
                        this.submitting = false;
                    })
                    .catch((error_message: string) => {
                        this.submission_error = error_message;
                        this.submitting = false;
                    });
            }
        }
    });
</script>