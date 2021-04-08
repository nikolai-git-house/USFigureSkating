<template>
    <div class="shift-selection-shift-card shift-card ada-text">
        <div class="shift-card__row">
            <div class="shift-card__column shift-selection-shift-card__status-action-column">
                <button v-if="show_selection_button"
                        :disabled="disable_interactions"
                        class="button button--block button--small"
                        v-on:click.prevent="select">
                    Select
                </button>
                <span v-else-if="show_status_flag"
                      class="shift-selection-shift-card__status"
                      :class="`shift-selection-shift-card__status--${status}`">
                    {{status | status_display}}
                </span>
            </div>
            <div class="shift-card__column shift-card__column--fill">
                <p class="shift-card__datum">
                    {{shift.start_time_formatted}} - {{shift.end_time_formatted}}
                </p>
                <p class="shift-card__datum shift-card__datum--tertiary">
                    {{shift.date_formatted}}
                </p>
                <p v-if="debug_mode"
                   class="shift-card__datum shift-card__datum--secondary">
                    Date TS:{{shift.date_ts}}
                </p>
                <p v-if="debug_mode"
                   class="shift-card__datum shift-card__datum--secondary">
                    Start ts:{{shift.start_datetime_ts}}
                    <br>
                    End ts: {{shift.end_datetime_ts}}
                </p>
                <p class="shift-card__datum shift-card__datum--secondary">
                    {{shift.position_title}}
                </p>
                <p v-if="compliance_required"
                   class="shift-card__datum">
                    <button title="View information about compliance"
                            class="shift-card__compliance-flag"
                            :class="`shift-card__compliance-flag--${compliance_flag}`"
                            v-on:click.prevent="$emit('compliance-flag-click')">
                        {{compliance_flag | display_key}}
                    </button>
                </p>
            </div>
            <div class="shift-card__column shift-card__column--top">
                <button title="Open Additional Shift Information"
                        class="shift-card__toggle icon-button icon-button--sm icon-button--pseudo"
                        :class="`icon-button--${is_expanded ? 'up' : 'down'}`"
                        v-on:click.prevent="toggle">
                    <span class="sr-only">Expand</span>
                </button>
            </div>
        </div>
        <div v-if="is_expanded"
             class="shift-selection-shift-card__secondary">
            <div class="shift-card__row">
                <div class="shift-card__column">
                    <p v-if="status_description"
                       class="shift-card__datum">
                        {{status_description}}
                    </p>
                    <p class="shift-card__datum shift-card__datum--secondary">
                        {{shift.location_name}}
                    </p>
                    <p class="shift-card__datum shift-card__datum--tertiary">
                        <span :class="shift.openings_status|status_class">{{shift.open_positions}} Open</span>
                        ({{shift.total_positions}} Total)
                    </p>
                </div>
                <div v-if="show_remove"
                     class="shift-card__column">
                    <button class="shift-card__remove icon-button icon-button--delete icon-button--pseudo"
                            title="Remove shift"
                            :disabled="disable_interactions"
                            v-on:click.prevent="remove">
                        <span class="sr-only">Remove Shift</span>
                    </button>
                </div>
            </div>
            <p class="shift-card__datum shift-card__datum--description">
                {{shift.description}}
            </p>
        </div>
    </div>
</template>
<script lang="ts">
    import Vue from 'vue';
    import {ShiftSelectionShiftCard} from './_contracts';
    import {StringHelpers} from '../../../../../../helpers/StringHelpers';

    export default Vue.extend({
        filters: {
            /**
             * Format a key value to an output string
             *
             * Replace underscores/hyphens with spaces and output title case
             *
             * ex: not_available => Not Available
             * ex: not-compliant => Not Compliant
             */
            display_key: function (value: string): string {
                if (!value) {
                    return '';
                }

                return StringHelpers.titleCase(value.replace(/[_|-]/g, ' '));
            },
            /**
             * The status key display for a shift based on its status
             */
            status_display: function (value: ShiftSelectionShiftCard.ShiftStatus): string {
                const map = {
                    new: 'Select',
                    approved: 'Approved',
                    pending: 'Pending',
                    conflict: 'Unavailable',
                    denied: 'Unavailable',
                    no_availability: 'Unavailable'
                };

                return map[value];
            }
        },
        props: {
            /**
             * Whether to disable interactions on buttons
             */
            disable_interactions: {
                type: Boolean,
                default: false
            },
            selection_available: {
                type: Boolean,
                default: true
            },
            /**
             * The source shift for the component
             */
            shift: {
                type: Object as () => ShiftSelectionShiftCard.Shift,
                required: true
            },
            /**
             * Whether the shift has a conflict
             */
            shift_has_conflict: {
                type: Boolean,
                required: false
            },
            /**
             * Whether the applicable user is compliant
             */
            user_is_compliant: {
                type: Boolean,
                required: true
            }
        },
        /**
         * Reactive Data
         */
        data: function () {
            return {
                /**
                 * Whether the card is expanded
                 */
                is_expanded: false,
                /**
                 * Debug display mode.  Include additional debug info for the shift
                 */
                debug_mode: false
            };
        },
        computed: {
            /**
             * The compliance flag associated with the shift
             */
            compliance_flag: function (): ShiftSelectionShiftCard.ComplianceFlag | null {
                if (this.compliance_required) {
                    if (['approved'].indexOf(this.status) === -1) {

                        return ShiftSelectionShiftCard.ComplianceFlag.required;
                    }
                    if (this.user_is_compliant) {

                        return ShiftSelectionShiftCard.ComplianceFlag.compliant;
                    }

                    return ShiftSelectionShiftCard.ComplianceFlag.non_compliant;
                }

                return null;
            },
            /**
             * Whether compliance is required for the shift
             */
            compliance_required: function (): boolean {
                return this.shift.requires_compliance;
            },
            /**
             * Whether to show the remove button
             */
            show_remove: function (): boolean {
                return ['approved', 'pending'].indexOf(this.status) !== -1;
            },
            /**
             * Whether to show the selection button
             */
            show_selection_button: function (): boolean {
                return this.selection_available && this.status === 'new';
            },
            /**
             * Whether to show the status flag on the card
             *
             * Shows for all statuses in all cases except for "new" status
             */
            show_status_flag: function (): boolean {
                return this.selection_available || [
                    'approved',
                    'pending',
                    'conflict',
                    'denied',
                    'no_availability'
                ].indexOf(this.status) !== -1;
            },
            /**
             * The status of the shift relative to the user
             */
            status: function (): ShiftSelectionShiftCard.ShiftStatus {
                if (this.shift_has_conflict) {
                    return ShiftSelectionShiftCard.ShiftStatus.conflict;
                }

                return this.shift.status;
            },
            /**
             * The extended status description
             */
            status_description(): string | null {
                const map: { [key: string]: string; } = {
                    conflict: 'Conflicts with existing shift.',
                    denied: 'Your shift was not approved.',
                    no_availability: 'No available positions.'
                };
                const status: ShiftSelectionShiftCard.ShiftStatus = this.status;
                if (Object.prototype.hasOwnProperty.call(map, status)) {
                    return map[status];
                }

                return null;
            }

        },
        methods: {
            /**
             * Handle the remove button click event
             */
            remove: function (): void {
                if (this.disable_interactions) {
                    return;
                }
                this.$emit('remove');
            },
            /**
             * Handle the select button click event
             */
            select: function (): void {
                if (this.disable_interactions) {
                    return;
                }
                this.$emit('select');
            },
            /**
             * Toggle the expand content
             */
            toggle: function (): void {
                this.is_expanded = !this.is_expanded;
                this.$emit('toggle');
            }
        }
    });
</script>