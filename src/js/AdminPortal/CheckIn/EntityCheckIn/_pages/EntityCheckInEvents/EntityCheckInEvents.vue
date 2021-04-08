<template>
    <div class="entity-check-in-events">
        <div class="entity-check-in-subpage__content-container  entity-check-in-subpage__content-container--pad-sm">
            <div v-if="!component_loaded" class="entity-check-in-subpage__notice">
                <p v-if="load_error" class="text--alert">
                    Error loading events.
                </p>
                <p v-else-if="!loaded && loading_timeout">
                    Loading...
                </p>
            </div>
            <div v-else-if="events.length===0" class="entity-check-in-subpage__notice">
                <p class="text--alert">
                    {{active_entity_name}} is not registered for any events in this competition.
                </p>
            </div>
            <div v-else class="entity-check-in-events__content">
                <div v-for="(event) in events"
                     :key="event.id"
                     class="entity-check-in-events__event-type">
                    <h4 class="entity-check-in-events__event-type__name">
                        {{event.name}}
                    </h4>
                    <div class="entity-check-in-events__event-type__events">
                        <div class="accordion-group accordion-group--up-down">
                            <accordion v-for="(segment) in event.segments"
                                       :key="segment.id"
                                       class="accordion--larger-trigger"
                                       :init_expanded="!segmentComplete(segment)">
                                <span slot="trigger_text"
                                      class="accordion-status-trigger"
                                      :class="'accordion-status-trigger--' + (segmentComplete(segment) ? 'yes' : 'no')">{{segment.name}}</span>
                                <div slot="expand_content">
                                    <entity-check-in-events-music-ppc-status :segment="segment"></entity-check-in-events-music-ppc-status>
                                </div>
                            </accordion>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
    import mixins from 'vue-typed-mixins';
    import HasDataDependencies from '../../../../../mixins/HasDataDependencies';
    import {CheckInEvent, CheckInEventSegment} from '../../../_contracts/CheckInContracts';
    import EntityCheckInEventsMusicPpcStatus from './_components/EntityCheckInEventsMusicPpcStatus.vue';

    const vueClass = mixins(HasDataDependencies);
    // @vue/component
    export default vueClass.extend({
        components: {
            EntityCheckInEventsMusicPpcStatus
        },
        /**
         * Reactive data
         */
        data: function () {
            return {
                /**
                 * Data dependencies for component
                 */
                dependencies: {
                    events: false
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
             * List of events for the active check-in entity
             */
            events: function (): CheckInEvent[] {
                return this.$store.getters['checkin/events/events'];
            }
        },
        methods: {
            /**
             * Load component data
             */
            loadData: function () {
                return new Promise((resolve, reject) => {
                    this.$store.dispatch('checkin/events/fetchEvents')
                        .then(() => {
                            this.dependencies.events = true;
                            resolve();
                        })
                        .catch(() => {
                            reject();
                        });
                });
            },
            /**
             * Whether a given CheckInEventSegment is PPC and Music complete
             */
            segmentComplete: function (segment: CheckInEventSegment): boolean {
                return this.$store.getters['checkin/events/segmentCheckInComplete'](segment);
            }
        }
    });
</script>