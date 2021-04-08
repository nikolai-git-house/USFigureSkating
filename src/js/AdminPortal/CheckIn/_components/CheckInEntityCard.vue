<template>
    <div class="check-in-entity-card">
        <div class="check-in-entity-card__content">
            <div class="check-in-entity-card__primary">
                <div class="check-in-entity-card__primary__info">
                    <p class="check-in-entity-card__name">
                        {{entity.name}}
                        <span class="text--muted">({{entity.member_number}})</span>
                    </p>
                    <p class="check-in-entity-card__role">
                        {{entity.entity_type_description}}
                    </p>
                    <ul v-if="show_checkin_details" class="check-in-entity-card__checkin-details text--muted">
                        <li v-if="entity.checked_in_date_time_formatted">
                            Checked-In: {{entity.checked_in_date_time_formatted}}
                        </li>
                        <li v-if="entity.checked_in_by">
                            Checked-In by: {{entity.checked_in_by}}
                        </li>
                    </ul>
                </div>
                <div class="check-in-entity-card__primary__comments">
                    <button class="check-in-entity-card__comments-button" v-on:click.prevent="$emit('view-comments')">
                        <i class="inline-icon icon-comments"></i>
                        <span v-if="entity.comment_count" class="count-badge count-badge--red">
                            <span class="count-badge__content">{{entity.comment_count}}</span>
                        </span>
                    </button>
                </div>
            </div>
            <div class="check-in-entity-card__actions">
                <button v-if="entity.checked_in"
                        class="button button--block"
                        :class="entity.eligible?'button--info':'button--action-ghosted'"
                        v-on:click.prevent="undoCheckIn">
                    Undo Check-In
                </button>
                <button v-else-if="entity.eligible"
                        class="button button--block"
                        v-on:click.prevent="checkIn">
                    Check-In
                </button>
                <p v-if="!entity.eligible" class="check-in-entity-card__notice">
                    <span v-if="!entity.checked_in">
                        This person is not eligible to participate in the competition and cannot check-in or receive a credential.
                    </span>
                    <span v-else>
                        Person is ineligible to participate. Receive the credential from this person, undo the check-in and notify the Chief Referee.
                    </span>
                </p>
            </div>
        </div>
        <transition name="fade">
            <div v-if="confirmation_active" class="card-overlay">
                <p class="card-overlay__text">
                    Are you sure you want to
                    <br>
                    undo check-in?
                </p>
                <div class="card-overlay__controls">
                    <div class="card-overlay__controls__control">
                        <button class="button button--info button--block"
                                :disabled="confirmation_controls_disabled"
                                v-on:click.prevent="closeConfirmation">
                            Cancel
                        </button>
                    </div>
                    <div class="card-overlay__controls__control">
                        <button class="button button--primary button--block"
                                :disabled="confirmation_controls_disabled"
                                v-on:click.prevent="undoCheckIn">
                            Ok
                        </button>
                    </div>
                </div>
                <p v-if="confirmation_error" class="card-overlay__error">
                    {{confirmation_error}}
                </p>
            </div>
        </transition>
    </div>
</template>
<script lang="ts">
    import Vue from 'vue';
    import {CheckInEntityCardEntity} from '../_contracts/CheckInEntityContracts';

    export default Vue.extend({
        props: {
            entity: {
                type: Object as () => CheckInEntityCardEntity,
                required: true
            }
        },
        /**
         * Reactive data
         */
        data: function () {
            return {
                /**
                 * Whether the confirmation overlay is active
                 */
                confirmation_active: false,
                /**
                 * Whether controls in the confirmation should be disabled
                 */
                confirmation_controls_disabled: false,
                /**
                 * Whether the confirmation overlay should display an error
                 */
                confirmation_error: <string | false>false
            };
        },
        computed: {
            /**
             * Whether to show check-in details section
             */
            show_checkin_details: function (): boolean {
                return !!this.entity.checked_in_by || !!this.entity.checked_in_date_time_formatted;
            }
        },
        methods: {
            /**
             * Initiate the check-in for the entity
             */
            checkIn: function () {
                this.$emit('check-in', this.entity.id);
            },
            /**
             * Close the confirmation overlay
             */
            closeConfirmation: function () {
                this.confirmation_active = false;
                this.confirmation_error = false;
            },
            /**
             * Initiate the undo check-in for the entity
             *
             * If user hasn't confirmed action, display confirmation overlay, otherwise do the undo
             */
            undoCheckIn: function () {
                if (!this.confirmation_active) {
                    this.confirmation_active = true;

                    return;
                }
                this.confirmation_error = false;
                this.confirmation_controls_disabled = true;
                this.$store.dispatch('checkin/undoEntityCheckIn', this.entity)
                    .then(() => {
                        this.confirmation_active = false;
                        this.confirmation_controls_disabled = false;
                    })
                    .catch((message: string) => {
                        this.confirmation_error = message;
                        this.confirmation_controls_disabled = false;
                    });
            }
        }
    });
</script>