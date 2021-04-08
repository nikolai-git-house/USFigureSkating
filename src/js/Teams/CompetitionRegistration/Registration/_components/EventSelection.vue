<template>
    <div class="event-selection-component"
         :class="{'event-selection-component--no-pagination':!show_pagination}">
        <div class="event-selection__selected">
            <div class="grid-container">
                <transition name="fade">
                    <div v-if="element_added||element_removed"
                         class="event-selection__my-events-status"
                         :class="{'recent':element_added,'recent--out':element_removed}">
                        &nbsp;
                    </div>
                </transition>
                <accordion class="accordion--blank accordion--up-down">
                    <span slot="trigger_text">
                        My Events: ({{my_events_count}})
                    </span>
                    <div slot="expand_content">
                        <div class="event-selection__event-list">
                            <event-selection-card v-for="event in my_events"
                                                  :key="event.id"
                                                  :disable_actions="disable_event_selection"
                                                  :event="event"
                                                  v-on:remove="removeEvent(event,event.id*-1)">
                                <div v-if="eventMessage(-1 * event.id)"
                                     slot="error"
                                     :class="'session-feedback--'+active_event_status"
                                     class="session-feedback session-feedback--small">
                                    <button v-if="active_event_status==='error'"
                                            type="button"
                                            class="session-feedback__close"
                                            title="Close"
                                            v-on:click.prevent.stop="closeEventError">
                                        &times;
                                    </button>
                                    <div class="session-feedback__content">
                                        <div class="session-feedback__text">
                                            {{eventMessage(-1 * event.id)}}
                                        </div>
                                    </div>
                                </div>
                            </event-selection-card>
                        </div>
                    </div>
                </accordion>
            </div>
        </div>
        <div class="event-selection__available">
            <div class="grid-container">
                <div v-if="event_type_options.length>1"
                     class="event-selection__filters form-group">
                    <label for="type_filter"
                           class="field-label event-selection__filters__label">
                        Available Events:
                    </label>
                    <div class="event-selection__filters__control">
                        <select id="type_filter"
                                v-model="active_type"
                                name="type_filter"
                                class="form-field form-field--reduced-right">
                            <option :value="null">
                                All Events
                            </option>
                            <option v-for="(option,index) in event_type_options"
                                    :key="index"
                                    :value="option">
                                {{option}}
                            </option>
                        </select>
                    </div>
                </div>
                <p v-else
                   class="event-selection__available__heading">
                    Available Events:
                </p>
                <div class="event-selection__event-list">
                    <event-selection-card v-for="event in visible_events"
                                          :key="event.id"
                                          :disable_actions="disable_event_selection"
                                          :event="event"
                                          v-on:remove="removeEvent(event,event.id)"
                                          v-on:add="addEvent(event,event.id)">
                        <transition slot="error"
                                    name="fade">
                            <div v-if="eventMessage(event.id)"
                                 :class="'session-feedback--'+active_event_status"
                                 class="session-feedback session-feedback--small">
                                <button v-if="active_event_status==='error'"
                                        type="button"
                                        class="session-feedback__close"
                                        title="Close"
                                        v-on:click.prevent.stop="closeEventError">
                                    &times;
                                </button>
                                <div class="session-feedback__content">
                                    <div class="session-feedback__text">
                                        {{eventMessage(event.id)}}
                                    </div>
                                </div>
                            </div>
                        </transition>
                    </event-selection-card>
                </div>
                <div v-if="show_pagination"
                     class="event-selection__pagination">
                    <pagination ref="pagination"
                                :paginated_items="paginated_events"
                                v-on:page-changed="updateActivePage"></pagination>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
    import EventSelectionMixin from '../../../../mixins/EventSelectionMixin';
    import TeamRegistrationEventSelectionEventCard from './TeamRegistrationEventSelectionEventCard.vue';
    import mixins from 'vue-typed-mixins';
    import {TeamRegistration} from '../_contracts';

    export default mixins(EventSelectionMixin)
        .extend({
            components: {
                'event-selection-card': TeamRegistrationEventSelectionEventCard
            },
            methods: {
                /**
                 * Action to perform add event
                 */
                addEventAction: function (event: TeamRegistration.EventSelectionPageEvent): Promise<void> {
                    return this.$store.dispatch('team_registration/event_selection/addEvent', event);
                },
                /**
                 * Action to perform remove event
                 */
                removeEventAction: function (event: TeamRegistration.EventSelectionPageEvent): Promise<void> {
                    return this.$store.dispatch('team_registration/event_selection/removeEvent', event);
                }
            },
            computed: {
                /**
                 * Whether to show the pagination
                 */
                show_pagination: function (): boolean {
                    return this.paginated_events.length > 1;
                }
            },
            watch: {
                disable_event_selection: function (value) {
                    if (value) {
                        this.$emit('disable');

                        return;
                    }
                    this.$emit('enable');
                }
            }
        });
</script>