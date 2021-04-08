<template>
    <div class="entity-check-in-roster check-in-roster-page">
        <div v-if="edit_available" class="entity-check-in-subpage__content-header">
            <div class="grid-container">
                <div class="entity-check-in-roster__header-content">
                    <p class="entity-check-in-subpage__lead">
                        Tap the Edit Roster button to add or remove skaters from the Roster.
                    </p>
                </div>
            </div>
        </div>
        <div class="entity-check-in-subpage__content-container">
            <transition name="fade">
                <div v-if="show_confirmation" class="check-in-roster-page__confirmation">
                    <div class="session-feedback session-feedback--success">
                        <div class="session-feedback__content">
                            <div class="session-feedback__text">
                                Roster Updated
                            </div>
                        </div>
                    </div>
                </div>
            </transition>
            <div v-if="!component_loaded" class="entity-check-in-subpage__notice">
                <div class="grid-container">
                    <p v-if="load_error" class="text--alert">
                        Error loading roster.
                    </p>
                    <p v-else-if="!loaded && loading_timeout">
                        Loading...
                    </p>
                </div>
            </div>
            <div v-else class="check-in-roster-page__content">
                <p v-if="!roster.length" class="text--alert">
                    There are no skaters in the competition roster.
                </p>
                <status-entity-card
                    v-for="(skater,index) in roster"
                    v-else
                    :key="skater.id"
                    class="status-entity-card--centered-actions"
                    :is_success="skater.is_checkin_complete">
                    <div slot="primary-content">
                        {{index+1}}. {{skater.last_name}}, {{skater.first_name}}
                        <span class="text--muted">({{skater.member_number}})</span>
                    </div>
                    <span slot="secondary-content" class="text--muted">Age: {{skater.age}}</span>
                    <button slot="actions"
                            title="Open Skater Info"
                            class="icon-button icon-button--lg icon-button--info icon-button--pseudo"
                            v-on:click.prevent="skaterInfoOverlayOpen(skater)">
                        <span class="sr-only">Open Skater Info</span>
                    </button>
                </status-entity-card>
            </div>
            <div v-if="edit_available" class="entity-check-in-subpage__footer">
                <div class="entity-check-in-subpage__footer__content">
                    <button class="button button--large button--primary button--block"
                            :disabled="!component_loaded"
                            v-on:click.prevent="edit_active = !edit_active">
                        Edit Roster
                    </button>
                </div>
            </div>
        </div>
        <site-takeover v-if="editRosterOverlayIsActive()" v-on:close="editRosterOverlayClose()">
            <entity-check-in-roster-edit v-on:roster-confirmed="editRosterOverlayClose(true)"></entity-check-in-roster-edit>
        </site-takeover>
        <site-takeover v-if="skaterInfoOverlayIsActive()"
                       :return_to_scroll_location="true"
                       v-on:close="skaterInfoOverlayClose()">
            <entity-check-in-roster-skater-info :skater="active_skater" v-on:close="skaterInfoOverlayClose()"></entity-check-in-roster-skater-info>
        </site-takeover>
    </div>
</template>
<script lang="ts">
    import mixins from 'vue-typed-mixins';
    import HasDataDependencies from '../../../../../mixins/HasDataDependencies';
    import {CheckInSubEntitySkater} from '../../_models/CheckInSubEntitySkater';
    import EntityCheckInRosterEdit from './_components/EntityCheckInRosterEdit.vue';
    import EntityCheckInRosterSkaterInfo from './_components/EntityCheckInRosterSkaterInfo.vue';

    const vueClass = mixins(HasDataDependencies);
    // @vue/component
    export default vueClass.extend({
        components: {
            EntityCheckInRosterEdit,
            EntityCheckInRosterSkaterInfo
        },
        /**
         * Reactive data
         */
        data: function () {
            return {
                /**
                 * The active skater for the component (for information overlay)
                 */
                active_skater: <CheckInSubEntitySkater | null>null,
                /**
                 * Data dependencies for the component
                 */
                dependencies: {
                    roster: false
                },
                /**
                 * Whether the edit roster screen is active;
                 */
                edit_active: false,
                /**
                 * Whether the roster updated confirmation should show
                 */
                show_confirmation: false
            };
        },
        computed: {
            /**
             * Whether the roster can be edited
             */
            edit_available: function (): boolean {
                return this.$store.state.checkin.active_competition && this.$store.state.checkin.active_competition.team_roster_can_be_edited;
            },
            /**
             * The active team roster
             */
            roster: function (): CheckInSubEntitySkater[] {
                return this.$store.getters['checkin/roster/competition_roster'];
            }
        },
        methods: {

            /**
             * Close the edit roster screen
             */
            editRosterOverlayClose: function (is_change: boolean = false) {
                this.edit_active = false;
                if (is_change) {
                    this.show_confirmation = true;
                    setTimeout(() => {
                        this.show_confirmation = false;
                    }, 1500);
                }
            },
            /**
             * Whether the edit roster screen is active
             */
            editRosterOverlayIsActive: function () {
                return this.edit_active;
            },
            /**
             * Load component data
             */
            loadData: function () {
                return new Promise((resolve, reject) => {
                    this.$store.dispatch('checkin/roster/fetchRosterInformation')
                        .then(() => {
                            this.dependencies.roster = true;
                            resolve();
                        })
                        .catch(() => {
                            reject();
                        });
                });
            },
            /**
             * Close the skater info screen
             */
            skaterInfoOverlayClose: function () {
                this.active_skater = null;
            },
            /**
             * Whether the skater info screen is active
             */
            skaterInfoOverlayIsActive: function (): boolean {
                return !!this.active_skater;
            },
            /**
             * Open the skater info overlay
             */
            skaterInfoOverlayOpen: function (skater: CheckInSubEntitySkater): void {
                this.active_skater = skater;
            }
        }
    });
</script>