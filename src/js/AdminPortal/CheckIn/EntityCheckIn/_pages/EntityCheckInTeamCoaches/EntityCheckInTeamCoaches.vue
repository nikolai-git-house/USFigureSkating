<template>
    <div class="entity-check-in-team-coaches check-in-roster-page">
        <div class="entity-check-in-subpage__content-container">
            <transition name="fade">
                <div v-if="show_confirmation" class="check-in-roster-page__confirmation">
                    <div class="session-feedback session-feedback--success">
                        <div class="session-feedback__content">
                            <div class="session-feedback__text">
                                Coaches Updated
                            </div>
                        </div>
                    </div>
                </div>
            </transition>
            <div v-if="!component_loaded" class="entity-check-in-subpage__notice">
                <p v-if="load_error" class="text--alert">
                    Error loading coaches.
                </p>
                <p v-else-if="!loaded && loading_timeout">
                    Loading...
                </p>
            </div>
            <div v-else class="check-in-roster-page__content">
                <p v-if="!coaches.length">
                    {{active_entity_name}} does not have any coaches attending this competition.
                </p>
                <status-entity-card v-for="coach in coaches"
                                    v-else
                                    :key="coach.id"
                                    :is_success="coach.is_checkin_complete">
                    <div slot="primary-content">
                        {{coach.last_name}}, {{coach.first_name}}
                        <span class="text--muted">({{coach.member_number}})</span>
                    </div>
                    <ul slot="secondary-content" class="status-entity-card__secondary-list">
                        <li>
                            <a class="standard-link" :href="'mailto:'+coach.email_address">
                                {{coach.email_address}}
                            </a>
                        </li>
                        <li>
                            <a class="standard-link" :href="'tel:'+coach.phone_number">
                                {{coach.phone_number}}
                            </a>
                        </li>
                    </ul>
                    <entity-compliance-requirements-summary slot="expand-content"
                                                            class="entity-compliance-requirements-summary--small entity-compliance-requirements-summary--with-columns"
                                                            :compliance_items="coach.compliance_summary"
                                                            :override_permitted="false"></entity-compliance-requirements-summary>
                </status-entity-card>
            </div>
            <div v-if="edit_available" class="entity-check-in-subpage__footer">
                <div class="entity-check-in-subpage__footer__content">
                    <button class="button button--large button--primary button--block" v-on:click.prevent="edit_active = !edit_active">
                        Edit Coaches
                    </button>
                </div>
            </div>
        </div>
        <site-takeover v-if="editCoachesOverlayIsActive()" v-on:close="editCoachesOverlayClose()">
            <entity-check-in-team-coaches-edit v-on:roster-confirmed="editCoachesOverlayClose(true)"></entity-check-in-team-coaches-edit>
        </site-takeover>
    </div>
</template>
<script lang="ts">
    import mixins from 'vue-typed-mixins';
    import HasDataDependencies from '../../../../../mixins/HasDataDependencies';
    import {CheckInSubEntityTeamCoach} from '../../_models/CheckInSubEntityTeamCoach';
    import EntityCheckInTeamCoachesEdit from './_components/EntityCheckInTeamCoachesEdit.vue';

    const vueClass = mixins(HasDataDependencies);
    // @vue/component
    export default vueClass.extend({
        components: {
            EntityCheckInTeamCoachesEdit
        },
        /**
         * Reactive data
         */
        data: function () {
            return {
                /**
                 * Whether the edit screen is active
                 */
                edit_active: false,
                /**
                 * Data dependencies
                 */
                dependencies: {
                    coaches: false
                },
                /**
                 * Whether the roster updated confirmation should show
                 */
                show_confirmation: false
            };
        },
        computed: {
            /**
             * The name of the active check-in entity
             */
            active_entity_name: function (): string {
                return this.$store.getters['checkin/active_entity_name'];
            },
            /**
             * The currently assigned coaches to the competition
             */
            coaches: function (): CheckInSubEntityTeamCoach[] {
                return this.$store.getters['checkin/team_coaches/active_competition_coaches'];
            },
            /**
             * Whether the roster can be edited
             */
            edit_available: function (): boolean {
                return true;
            }
        },
        methods: {
            /**
             * Close the edit roster screen
             */
            editCoachesOverlayClose: function (is_change: boolean = false) {
                this.edit_active = false;
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
            editCoachesOverlayIsActive: function () {
                return this.edit_active;
            },
            /**
             * Load component data
             */
            loadData: function () {
                return new Promise((resolve, reject) => {
                    this.$store.dispatch('checkin/team_coaches/fetchCoachInformation')
                        .then(() => {
                            this.dependencies.coaches = true;
                            resolve();
                        })
                        .catch(() => {
                            reject();
                        });
                });
            }
        }
    });
</script>