<template>
    <div class="entity-check-in-roster-edit">
        <div class="entity-check-in-subpage__header entity-check-in-subpage__header--overlay">
            <h2 class="entity-check-in-subpage__header__title">
                Edit Roster
            </h2>
            <h3 class="entity-check-in-subpage__header__subtitle">
                {{entity.summary_name}}
            </h3>
        </div>
        <div class="entity-check-in-subpage__content-container">
            <div class="entity-check-in-roster-edit__content" :style="{'padding-bottom':content_pad+'px'}">
                <ul class="entity-check-in-roster-edit__rules-list">
                    <li v-for="(rule, index) in roster_rules" :key="index">
                        {{rule}}
                    </li>
                </ul>
                <div class="entity-check-in-roster-edit__information">
                    <page-alert class="page-alert page-alert--notice page-alert--medium">
                        <div slot="trigger_text">
                            Information
                        </div>
                        <div slot="expand_content">
                            Click “Confirm Roster” to select skaters from the team who will be attending this
                            competition. If a skater is not listed on the Main Roster, they will need to be added
                            through the Team Profile in Members Only. Check to make sure all skaters who will attend
                            this competition are listed on the competition roster.
                        </div>
                    </page-alert>
                </div>
                <div class="entity-check-in-subpage__section">
                    <h4 class="entity-check-in-roster-edit__roster-size">
                        Competition Roster Size:
                        <span class="count-badge">
                            <span class="count-badge__content">
                                {{current_roster_size}}
                            </span>
                        </span>
                    </h4>
                    <div class="entity-check-in-roster-edit__roster">
                        <p v-if="!full_team_roster.length" class="text--alert">
                            There are no skaters in the team roster.
                        </p>
                        <ul v-else class="entity-check-in-roster-list">
                            <li v-for="skater in full_team_roster"
                                :key="skater.id"
                                class="entity-check-in-roster-list__item"
                                :class="{disabled:!skater.can_be_added_to_roster}">
                                <div class="entity-check-in-roster-list__entity">
                                    <div class="entity-check-in-roster-list__entity__description">
                                        <span>{{skater.last_name}}, {{skater.first_name}} <span class="text--muted">Age:{{skater.age}}</span></span>
                                    </div>
                                    <div class="entity-check-in-roster-list__entity__status" :class="{'entity-check-in-roster-list__entity__status--error':!skater.can_be_added_to_roster}">
                                        <div v-if="skater.can_be_added_to_roster" class="form-group">
                                            <label :for="'select_to_roster_'+skater.id" class="usfsa-checkbox usfsa-checkbox--unlabeled">
                                                <input :id="'select_to_roster_'+skater.id"
                                                       :checked="skaterInSelectedRoster(skater)"
                                                       type="checkbox"
                                                       v-on:click.prevent="toggleSkater(skater)">
                                                <span class="usfsa-checkbox__text">&nbsp;</span>
                                            </label>
                                        </div>
                                        <div v-else>
                                            {{skater.cannot_be_added_to_roster_reason}}
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
                <p v-if="submission_error" class="entity-check-in-roster-edit__error">
                    {{submission_error}}
                </p>
                <button class="button button--large button--primary button--block" v-on:click.prevent="confirmRoster">
                    Confirm Roster
                </button>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
    import Vue from 'vue';
    import {AbstractCheckInEntity} from '../../../../_models/CheckInEntities/AbstractCheckInEntity';
    import {CheckInSubEntitySkater} from '../../../_models/CheckInSubEntitySkater';

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
                 * Server error resulting from most recent submission
                 */
                submission_error: '',
                /**
                 * Local tracking of skater IDs included in the current competition roster.
                 * Local copy to enable cancellation of edits without impacting "official" roster
                 */
                selected_roster_skater_ids: this.$store.getters['checkin/roster/active_roster_skater_ids'].slice()
            };
        },
        computed: {
            /**
             * The size of the selected roster
             */
            current_roster_size: function (): number {
                return this.selected_roster_skater_ids.length;
            },
            /**
             *  The entity being checked in
             */
            entity: function (): AbstractCheckInEntity {
                return this.$store.state.checkin.active_entity;
            },
            /**
             * The rules for creating a team roster
             */
            roster_rules: function (): string[] {
                return this.$store.getters['checkin/roster/roster_rules'];
            },
            /**
             * The full roster of available skaters for the team
             */
            full_team_roster: function (): CheckInSubEntitySkater[] {
                return this.$store.getters['checkin/roster/full_roster'];
            }
        },
        watch: {
            /**
             * Watch submission error for change and update content offset
             */
            submission_error: function () {
                this.$nextTick(() => {
                    this.updateContentOffset();
                });
            },
            /**
             * Watch available skaters for change and clear submission error message
             */
            selected_roster_skater_ids: function () {
                this.submission_error = '';
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
             * Confirm submission of the updated roster
             */
            confirmRoster: function (): void {
                this.$store.dispatch('checkin/roster/updateCompetitionRoster', this.selected_roster_skater_ids)
                    .then(() => {
                        this.$emit('roster-confirmed');
                    })
                    .catch((error_message) => {
                        this.submission_error = error_message;
                    });
            },
            /**
             * Determine whether a skater is in the currently selected roster or not
             */
            skaterInSelectedRoster: function (skater: CheckInSubEntitySkater): boolean {
                return this.selected_roster_skater_ids.indexOf(skater.id) !== -1;
            },
            /**
             * Add/remove a skater from the competition roster
             */
            toggleSkater: function (skater: CheckInSubEntitySkater) {
                const skater_index = this.selected_roster_skater_ids.indexOf(skater.id);
                if (skater_index === -1) {
                    this.selected_roster_skater_ids.push(skater.id);

                    return;
                }
                this.selected_roster_skater_ids.splice(skater_index, 1);
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