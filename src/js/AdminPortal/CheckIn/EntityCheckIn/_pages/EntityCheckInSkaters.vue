<template>
    <div class="entity-check-in-skaters">
        <div class="entity-check-in-subpage__content-container">
            <div v-if="!component_loaded" class="entity-check-in-subpage__notice">
                <p v-if="load_error" class="text--alert">
                    Error loading skaters.
                </p>
                <p v-else-if="!loaded && loading_timeout">
                    Loading...
                </p>
            </div>
            <div v-else-if="skaters.length===0" class="entity-check-in-subpage__notice">
                <p class="text--alert">
                    {{active_entity_name}} is not coaching any skaters for this competition.
                </p>
            </div>
            <div v-else class="entity-check-in-skaters__content">
                <div class="entity-check-in-subpage__section">
                    <ul class="entity-check-in-roster-list">
                        <li v-for="(skater,index) in skaters"
                            :key="index"
                            class="entity-check-in-roster-list__item">
                            <div class="entity-check-in-roster-list__entity">
                                <div class="entity-check-in-roster-list__entity__description">
                                    {{skater.last_name}}, {{skater.first_name}}
                                </div>
                                <div class="entity-check-in-roster-list__entity__status" :class="'entity-check-in-roster-list__entity__status' + checkInStatusClassModifier(skater)">
                                    {{checkInStatus(skater)}}
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
    import mixins from 'vue-typed-mixins';
    import HasDataDependencies from '../../../../mixins/HasDataDependencies';
    import {CheckInEntityCoachedSkater} from '../../_contracts/CheckInContracts';

    const vueClass = mixins(HasDataDependencies);
    // @vue/component
    export default vueClass.extend({
        /**
         * Reactive data
         */
        data: function () {
            return {
                /**
                 * Data dependencies for component
                 */
                dependencies: {
                    skaters: false
                }
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
             * The list of coached skaters
             */
            skaters: function (): CheckInEntityCoachedSkater[] {
                return this.$store.state.checkin.active_entity_coached_skaters;
            }
        },
        methods: {
            /**
             * Check-In status message for a skater
             */
            checkInStatus: function (skater: CheckInEntityCoachedSkater): string {
                return skater.checked_in ? 'Checked-In' : 'Not Checked-In';
            },
            /**
             * Check-In status element class modifier for a skater
             */
            checkInStatusClassModifier: function (skater: CheckInEntityCoachedSkater): string {
                return skater.checked_in ? '--success' : '--error';
            },
            /**
             * Load component data
             */
            loadData: function () {
                return new Promise((resolve, reject) => {
                    this.$store.dispatch('checkin/fetchCoachedSkaters')
                        .then(() => {
                            this.dependencies.skaters = true;
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