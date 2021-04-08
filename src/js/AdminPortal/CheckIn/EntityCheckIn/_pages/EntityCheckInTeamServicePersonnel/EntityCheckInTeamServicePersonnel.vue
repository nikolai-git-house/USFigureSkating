<template>
    <div class="entity-check-in-team-service-personnel check-in-roster-page">
        <div class="entity-check-in-subpage__content-container">
            <transition name="fade">
                <div v-if="show_confirmation" class="check-in-roster-page__confirmation">
                    <div class="session-feedback session-feedback--success">
                        <div class="session-feedback__content">
                            <div class="session-feedback__text">
                                Team Service Personnel Updated
                            </div>
                        </div>
                    </div>
                </div>
            </transition>
            <div v-if="!component_loaded" class="entity-check-in-subpage__notice">
                <p v-if="load_error" class="text--alert">
                    Error loading team service personnel.
                </p>
                <p v-else-if="!loaded && loading_timeout">
                    Loading...
                </p>
            </div>
            <div v-else class="check-in-roster-page__content">
                <p v-if="!entities.length">
                    {{active_entity_name}} does not have any team service personnel attending this competition.
                </p>
                <status-entity-card v-for="entity in entities"
                                    v-else
                                    :key="entity.id"
                                    :is_success="entity.is_checkin_complete">
                    <div slot="primary-content">
                        {{entity.last_name}}, {{entity.first_name}}
                        <span class="text--muted">({{entity.member_number}})</span>
                    </div>
                    <div slot="secondary-content">
                        <p class="status-entity-card__secondary status-entity-card__secondary--highlight">
                            {{entity.team_role}}
                        </p>
                        <ul class="status-entity-card__secondary-list">
                            <li>
                                <a class="standard-link" :href="'mailto:'+entity.email_address">
                                    {{entity.email_address}}
                                </a>
                            </li>
                            <li>
                                <a class="standard-link" :href="'tel:'+entity.phone_number">
                                    {{entity.phone_number}}
                                </a>
                            </li>
                        </ul>
                    </div>
                    <entity-compliance-requirements-summary slot="expand-content"
                                                            class="entity-compliance-requirements-summary--small"
                                                            :compliance_items="entity.compliance_summary"
                                                            :override_permitted="false"></entity-compliance-requirements-summary>
                </status-entity-card>
            </div>
            <div v-if="edit_available" class="entity-check-in-subpage__footer">
                <div class="entity-check-in-subpage__footer__content">
                    <button class="button button--large button--primary button--block" v-on:click.prevent="edit_active = !edit_active">
                        Edit Team Service Personnel
                    </button>
                </div>
            </div>
        </div>
        <site-takeover v-if="editEntitiesOverlayIsActive()" v-on:close="editEntitiesOverlayClose()">
            <entity-check-in-team-service-personnel-edit v-on:roster-confirmed="editEntitiesOverlayClose(true)"></entity-check-in-team-service-personnel-edit>
        </site-takeover>
    </div>
</template>
<script lang="ts">
    import mixins from 'vue-typed-mixins';
    import HasDataDependencies from '../../../../../mixins/HasDataDependencies';
    import {CheckInSubEntityTeamServicePersonnel} from '../../_models/CheckInSubEntityTeamServicePersonnel';
    import EntityCheckInTeamServicePersonnelEdit from './_components/EntityCheckInTeamServicePersonnelEdit.vue';

    const vueClass = mixins(HasDataDependencies);
    // @vue/component
    export default vueClass.extend({
        components: {
            EntityCheckInTeamServicePersonnelEdit
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
                    team_service_personnel: false
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
             * The currently assigned TSP to the competition
             */
            entities: function (): CheckInSubEntityTeamServicePersonnel[] {
                return this.$store.getters['checkin/team_service_personnel/active_competition_team_service_personnel'];
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
            editEntitiesOverlayClose: function (is_change: boolean = false) {
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
            editEntitiesOverlayIsActive: function () {
                return this.edit_active;
            },
            /**
             * Load component data
             */
            loadData: function () {
                return new Promise((resolve, reject) => {
                    this.$store.dispatch('checkin/team_service_personnel/fetchInformation')
                        .then(() => {
                            this.dependencies.team_service_personnel = true;
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