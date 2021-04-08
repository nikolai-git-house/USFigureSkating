<template>
    <div class="my-volunteer-schedule-shift-card shift-card ada-text"
         :title="has_compliance_alert ? 'This shift requires compliance and your compliance is not complete.' : null"
         :class="{
             'my-volunteer-schedule-shift-card--compliance-incomplete': has_compliance_alert,
             'my-volunteer-schedule-shift-card--scheduled': shift.is_approved,
             'my-volunteer-schedule-shift-card--pending': shift.is_pending,
         }">
        <div class="my-volunteer-schedule-shift-card__content">
            <div class="shift-card__row">
                <div class="shift-card__column shift-card__column--fill">
                    <p class="shift-card__datum">
                        {{shift.start_time_formatted}} - {{shift.end_time_formatted}}
                    </p>
                    <p class="my-volunteer-schedule-shift-card__position shift-card__datum shift-card__datum--secondary">
                        <span class="my-volunteer-schedule-shift-card__position-title">{{shift.position_title}}</span>
                    </p>
                    <p class="shift-card__datum shift-card__datum--secondary"
                       v-if="shift.requires_compliance">
                        <button title="View information about compliance"
                                class="shift-card__compliance-flag"
                                :class="`shift-card__compliance-flag--${compliance_flag}`"
                                v-on:click.prevent="$emit('compliance-click')">
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
            <div class="shift-card__row my-volunteer-schedule-shift-card__support">
                <div class="shift-card__column">
                    <p class="shift-card__datum shift-card__datum--tertiary">
                        {{shift.location_name}}
                    </p>
                </div>
                <div class="shift-card__column">
                    <button class="shift-card__remove icon-button icon-button--delete icon-button--pseudo"
                            title="Remove shift"
                            v-on:click.prevent="remove">
                        <span class="sr-only">Remove Shift</span>
                    </button>
                </div>
            </div>
            <div v-if="is_expanded"
                 class="my-volunteer-schedule-shift-card__secondary">
                <p class="shift-card__datum shift-card__datum--tertiary">
                    <span :class="shift.openings_status|status_class">{{shift.open_positions}} Open</span>
                    ({{shift.total_positions}} Total)
                </p>
                <p class="shift-card__datum shift-card__datum--description--small">
                    {{shift.description}}
                </p>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
    import Vue from 'vue';
    import {MyVolunteerScheduleShiftCard} from './_contracts';
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
            }
        },
        props: {
            /**
             * The source shift object
             */
            shift: {
                type: Object as () => MyVolunteerScheduleShiftCard.Shift,
                required: true
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
                is_expanded: false
            };
        },
        computed: {
            /**
             * The compliance flag associated with the shift
             */
            compliance_flag: function (): MyVolunteerScheduleShiftCard.ComplianceFlag | null {
                if (this.shift.requires_compliance) {
                    if (!this.shift.is_approved) {
                        return MyVolunteerScheduleShiftCard.ComplianceFlag.required;
                    }
                    if (this.user_is_compliant) {

                        return MyVolunteerScheduleShiftCard.ComplianceFlag.compliant;
                    }

                    return MyVolunteerScheduleShiftCard.ComplianceFlag.non_compliant;
                }

                return null;
            },
            /**
             * Whether the shift card has a compliance alert
             */
            has_compliance_alert: function (): boolean {
                return this.shift.requires_compliance && this.shift.is_approved && !this.user_is_compliant;
            }
        },
        methods: {
            /**
             * Handle remove button click
             */
            remove: function (): void {
                this.$emit('remove');
            },
            /**
             * Toggle the expand content
             */
            toggle: function (): void {
                this.is_expanded = !this.is_expanded;
            }
        }
    });
</script>