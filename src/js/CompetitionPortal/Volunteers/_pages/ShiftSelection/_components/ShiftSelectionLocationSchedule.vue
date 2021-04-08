<template>
    <div class="shift-selection-location-schedule">
        <div class="grid-container">
            <div v-if="!shifts.length"
                 class="shift-selection-location-schedule__no-shifts">
                No shifts match your current filters.
            </div>
            <ul v-else
                class="volunteer-shift-selection-page__shifts-list">
                <template v-for="(shift,index) in shifts">
                    <li v-if="showDateHeading(shift,index)"
                        :key="`${shift.id}_${index}`"
                        class="volunteer-shift-selection-page__shifts-list__date-separator">
                        <h2 class="volunteer-shift-selection-page__shifts-list__date-separator__text">
                            {{shift.date_formatted}}
                        </h2>
                    </li>
                    <li :key="shift.id"
                        class="volunteer-shift-selection-page__shifts-list__item">
                        <shift-selection-shift-card class="noswipe"
                                                    :shift="shift"
                                                    :disable_interactions="disable_interactions"
                                                    :shift_has_conflict="shift_has_conflict(shift)"
                                                    :user_is_compliant="user_is_compliant"
                                                    :selection_available="selection_available"
                                                    v-on:compliance-flag-click="$emit('compliance-click')"
                                                    v-on:remove="$emit('shift-remove',shift)"
                                                    v-on:select="$emit('shift-select',shift)"
                                                    v-on:toggle="$emit('shift-toggle')"></shift-selection-shift-card>
                    </li>
                </template>
            </ul>
        </div>
    </div>
</template>
<script lang="ts">
    import Vue from 'vue';
    import {ShiftSelectionShiftCard} from './index';
    import {VolunteerShiftSelectionPage} from '../_contracts';

    export default Vue.extend({
        components: {
            ShiftSelectionShiftCard
        },
        props: {
            /**
             * Whether to disable interactions on shifts
             */
            disable_interactions: {
                type: Boolean,
                default: false
            },
            /**
             * The location the shift schedule is for
             */
            location: {
                type: Object as () => VolunteerShiftSelectionPage.Location,
                required: true
            },
            /**
             * Whether the user is compliance complete
             */
            user_is_compliant: {
                type: Boolean,
                required: true
            }
        },
        computed: {
            /**
             * Whether shift selection is available
             */
            selection_available: function (): boolean {
                return this.$store.state.competition_portal.volunteer.shift_selection.selection_open;
            },
            /**
             * The shifts to display in the list
             */
            shifts: function (): VolunteerShiftSelectionPage.Shift[] {
                return this.$store.getters['competition_portal/volunteer/shift_selection/shifts_location_display'](this.location.id);
            }
        },
        methods: {
            /**
             * Whether a shift has a conflict
             */
            shift_has_conflict: function (shift: VolunteerShiftSelectionPage.Shift[]): boolean {
                return this.$store.getters['competition_portal/volunteer/shift_selection/shift_has_conflict'](shift);
            },
            /**
             * Whether to show the date heading above a shift
             */
            showDateHeading: function (shift: VolunteerShiftSelectionPage.Shift, index: number): boolean {
                const previous_shift: VolunteerShiftSelectionPage.Shift | undefined = this.shifts[index - 1];

                return !previous_shift || previous_shift.date_formatted !== shift.date_formatted;
            }
        }
    });
</script>