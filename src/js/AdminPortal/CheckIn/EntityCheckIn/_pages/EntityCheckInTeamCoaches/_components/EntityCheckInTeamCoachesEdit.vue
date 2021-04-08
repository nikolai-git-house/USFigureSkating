<template>
    <div class="entity-check-in-roster-edit">
        <div class="entity-check-in-subpage__header entity-check-in-subpage__header--overlay">
            <h2 class="entity-check-in-subpage__header__title">
                Edit Coaches
            </h2>
            <h3 class="entity-check-in-subpage__header__subtitle">
                {{entity.summary_name}}
            </h3>
        </div>
        <div class="entity-check-in-subpage__content-container">
            <div class="entity-check-in-roster-edit__content" :style="{'padding-bottom':content_pad+'px'}">
                <div class="entity-check-in-roster-edit__information">
                    <page-alert class="page-alert page-alert--notice page-alert--medium">
                        <div slot="trigger_text">
                            Information
                        </div>
                        <div slot="expand_content">
                            Click “Confirm Coaches” to select coaches from the team who will be attending this
                            competition. If a coach is not listed on the Main Roster, they will need to be added through
                            the Team Profile in Members Only. Check to make sure all coaches who will attend this
                            competition are listed on the competition roster.
                        </div>
                    </page-alert>
                </div>
                <div class="entity-check-in-subpage__section">
                    <h4 class="entity-check-in-roster-edit__roster-size">
                        Coaches:
                        <span class="count-badge">
                            <span class="count-badge__content">
                                {{current_roster_size}}
                            </span>
                        </span>
                    </h4>
                    <div class="entity-check-in-roster-edit__roster">
                        <p v-if="!all_available_coaches.length" class="text--alert">
                            {{entity.name}} does not have any available coaches.
                        </p>
                        <ul class="entity-check-in-roster-list">
                            <li v-for="coach in all_available_coaches"
                                :key="coach.id"
                                class="entity-check-in-roster-list__item"
                                :class="{disabled:!coach.can_be_added_to_roster}">
                                <div class="entity-check-in-roster-list__entity">
                                    <div class="entity-check-in-roster-list__entity__description">
                                        <span>{{coach.last_name}}, {{coach.first_name}}</span>
                                    </div>
                                    <div class="entity-check-in-roster-list__entity__status" :class="{'entity-check-in-roster-list__entity__status--error':!coach.can_be_added_to_roster}">
                                        <div v-if="coach.can_be_added_to_roster" class="form-group">
                                            <label :for="'select_to_roster_'+coach.id" class="usfsa-checkbox usfsa-checkbox--unlabeled">
                                                <input :id="'select_to_roster_'+coach.id"
                                                       :checked="coachInActiveCompetitionRoster(coach)"
                                                       type="checkbox"
                                                       v-on:click.prevent="toggleCoach(coach)">
                                                <span class="usfsa-checkbox__text">&nbsp;</span>
                                            </label>
                                        </div>
                                        <div v-else>
                                            {{coach.cannot_be_added_to_roster_reason}}
                                        </div>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <div ref="footer" class="entity-check-in-subpage__footer">
            <div class="entity-check-in-subpage__footer__content">
                <p v-if="submission_error" class="competition-management-entity-check-in-roster-edit__error input-error">
                    {{submission_error}}
                </p>
                <button class="button button--large button--primary button--block" v-on:click.prevent="confirmRoster">
                    Confirm Coaches
                </button>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
    import Vue from 'vue';
    import {AbstractCheckInEntity} from '../../../../_models/CheckInEntities/AbstractCheckInEntity';
    import {CheckInSubEntityTeamCoach} from '../../../_models/CheckInSubEntityTeamCoach';

    export default Vue.extend({
        /**
         * Reactive Data
         */
        data: function () {
            return {
                /**
                 * The amount to pad the content list to prevent overlay issues with sticky footer
                 */
                content_pad: 0,
                /**
                 * Local tracking of coach IDs included in the current competition roster.
                 * Local copy to enable cancellation of edits without impacting "official" roster
                 */
                selected_competition_coach_ids: this.$store.state.checkin.team_coaches.active_competition_coach_ids.slice(),
                /**
                 * Server error resulting from most recent submission
                 */
                submission_error: ''
            };
        },
        computed: {
            /**
             * The full roster of available coaches for the active entity
             */
            all_available_coaches: function (): CheckInSubEntityTeamCoach[] {
                return this.$store.getters['checkin/team_coaches/all_coaches'];
            },
            /**
             * The size of the selected roster
             */
            current_roster_size: function (): number {
                return this.selected_competition_coach_ids.length;
            },
            /**
             *  The entity being checked in
             */
            entity: function (): AbstractCheckInEntity {
                return this.$store.state.checkin.active_entity;
            }
        },
        watch: {
            /**
             * Watch available skaters for change and clear submission error message
             */
            selected_competition_coach_ids: function () {
                this.submission_error = '';
            },
            /**
             * Watch submission error for change and update content offset
             */
            submission_error: function () {
                this.$nextTick(() => {
                    this.updateContentOffset();
                });
            }
        },
        /**
         * Run processes upon component mount
         */
        mounted() {
            this.$nextTick(() => {
                this.updateContentOffset();
            });
        },
        methods: {
            /**
             * Determine whether a coach is in the currently selected roster or not
             */
            coachInActiveCompetitionRoster: function (coach: CheckInSubEntityTeamCoach): boolean {
                return this.selected_competition_coach_ids.indexOf(coach.id) !== -1;
            },
            /**
             * Confirm submission of the updated roster
             */
            confirmRoster: function (): void {
                this.$store.dispatch('checkin/team_coaches/updateCompetitionCoaches', this.selected_competition_coach_ids)
                    .then(() => {
                        this.$emit('roster-confirmed');
                    })
                    .catch((error_message) => {
                        this.submission_error = error_message;
                    });
            },
            /**
             * Add/remove a coach from the competition roster
             */
            toggleCoach: function (coach: CheckInSubEntityTeamCoach) {
                const coach_index = this.selected_competition_coach_ids.indexOf(coach.id);
                if (coach_index === -1) {
                    this.selected_competition_coach_ids.push(coach.id);

                    return;
                }
                this.selected_competition_coach_ids.splice(coach_index, 1);
            },
            /**
             * Add padding to content to offset sticky footer
             */
            updateContentOffset: function () {
                const footer = this.$refs.footer as HTMLElement;
                const footer_height = footer.offsetHeight;
                this.content_pad = footer_height + 30;
            }
        }
    });
</script>