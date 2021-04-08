import Vue from 'vue';
import {EventSelectionEvent} from '../contracts/app/CompetitionRegistrationContracts';
import {PaginationComponent} from '../components/Pagination.vue';
import {PaginatedList, PaginationService} from '../services/PaginationService';

const CONFIG = {
    feedback_in_duration: 250,
    feedback_show_duration: 600,
    error_show_duration: 850,
    my_event_change_duration: 600,
    results_per_page: 4
};
export default Vue.extend({
    props: {
        state_available_events: {
            type: Array as () => EventSelectionEvent[]
        }
    },
    /**
     * Reactive data
     */
    // eslint-disable-next-line max-lines-per-function
    data: function () {
        return {
            /**
             * The active type of events to show
             */
            active_type: null,
            /**
             * The active page index of paginated event results
             */
            active_page_index: 0,
            /**
             * Whether an event was recently added.  For my events state transition
             */
            element_added: false,
            /**
             * Whether an event was recently removed.  For my events state transition
             */
            element_removed: false,
            /**
             * The ID of the current event being added or removed.  Used for error message location on event failure
             * events in "my events" are identified with a negative id
             */
            active_event_tracking_id: <number | null>null,
            /**
             * The message for the latest event submission interaction
             */
            active_event_message: <string | null>null,
            /**
             * The type of message for the latest submission interaction.
             * Determines the class styling of the feedback element
             */
            active_event_status: <'error' | 'success' | null>'success',
            /**
             * Whether actions on event cards should be disabled. True when an event action is being submitted
             * Disables action buttons on event cards, but not referenced within component methods
             */
            disable_event_selection: false,
            /**
             * Whether data needed for component to function has been loaded
             */
            dependencies: {
                screen: false,
                competition: false
            },
            /**
             * The list of available events, local to the component
             */
            available_events: <EventSelectionEvent[]>[],
            /**
             * Buffer for active events.  Allows component to update display without direct binding to state
             */
            available_events_buffer: [],
            /**
             * Display of amount of "my events"
             */
            my_events_count: 0,
            /**
             * Buffer for my events count.  Allows component to update display without direct binding to state
             */
            my_events_count_buffer: 0
        };
    },
    computed: {
        /**
         * The types that the event list can be filtered by.
         * Populate the list with each event type/category unique value
         */
        event_type_options: function (): string[] {
            return this.available_events.reduce((carry: string[], event: EventSelectionEvent) => {
                if (carry.indexOf(event.category) === -1) {
                    carry.push(event.category);
                }

                return carry;
            }, <string[]>[]);
        },
        /**
         * The events that have been selected by the user
         */
        selected_events: function (): EventSelectionEvent[] {
            return this.available_events.filter((event: EventSelectionEvent) => {
                return event.is_selected;
            });
        },
        /**
         * Events to show in "My Events" tray
         * Selected and registered events
         */
        my_events: function (): EventSelectionEvent[] {
            return this.available_events.filter((event: EventSelectionEvent) => {
                return event.is_registered_for || event.is_selected;
            });
        },
        /**
         * List of events for display in the available event area
         */
        display_events: function (): EventSelectionEvent[] {
            const type_filter = this.active_type;
            if (!type_filter) {
                return this.available_events;
            }

            return this.available_events.filter((event: EventSelectionEvent) => {
                return event.category === type_filter;
            });
        },
        /**
         * The paginated list of display events
         */
        paginated_events: function (): PaginatedList<EventSelectionEvent> {
            return PaginationService.paginate(this.display_events, CONFIG.results_per_page);
        },
        /**
         * The events from the active page of the pagination
         */
        visible_events: function (): EventSelectionEvent[] {
            return this.paginated_events[this.active_page_index];
        },
        /**
         * Whether to show the pagination
         */
        show_pagination: function (): boolean {
            return this.visible_events.length > 0;
        }

    },
    watch: {
        /**
         * When active type filter changes, go to first page of paginated results
         */
        active_type: function () {
            this.active_page_index = 0;
            const pagination_component = this.$refs.pagination ? this.$refs.pagination as PaginationComponent : null;
            if (pagination_component) {
                pagination_component.setActivePage(0);
            }
        },
        /**
         * Watch available events from state and update the buffer on change
         */
        state_available_events: function (value) {
            this.available_events_buffer = value;
        },
        /**
         * Watch change to my events length and update my events count buffer
         */
        'my_events.length': function (value) {
            this.my_events_count_buffer = value;
        }
    },
    /**
     * On creation, set the initial state of available events and my events count
     */
    created: function () {
        this.available_events = this.state_available_events.slice();
        this.$nextTick(() => {
            this.my_events_count = this.my_events.length;
        });
    },
    methods: {
        /**
         * Update local state values following an update to state
         * 1. Find the new page within the pagination of the active event
         * 2. Assign the active page and the events list to local state
         * 3. Update pagination component to display proper page
         */
        updateAvailableEvents: function () {
            const new_events: EventSelectionEvent[] = this.available_events_buffer.slice();
            let new_page_index = 0;
            // If the event was added/removed from the available area, find what its new page would be and preload it
            let index = 0;
            if (this.active_event_tracking_id && this.active_event_tracking_id > 0) {
                for (let i = 0; i < new_events.length; i++) {
                    const newEvent = new_events[i];
                    // if there's an active type filter and the event doesn't match, it won't factor into pagination
                    if (this.active_type && newEvent.category !== this.active_type) {
                        // eslint-disable-next-line no-continue
                        continue;
                    }

                    if (newEvent.id === this.active_event_tracking_id) {
                        new_page_index = Math.floor(index / CONFIG.results_per_page);
                        break;
                    }
                    index++;
                }
            }
            this.available_events = new_events;
            this.active_page_index = new_page_index;
            this.$nextTick(() => {
                const pagination_component = this.$refs.pagination ? this.$refs.pagination as PaginationComponent : null;
                if (pagination_component) {
                    pagination_component.setActivePage(new_page_index);
                }
            });
        },
        /**
         * Animate changes to "My Events" section
         */
        animateMyEventsChange: function (prop: 'element_added' | 'element_removed') {
            this[prop] = true;
            setTimeout(() => {
                this[prop] = false;
            }, CONFIG.my_event_change_duration);
            setTimeout(() => {
                this.my_events_count = this.my_events_count_buffer;
            }, CONFIG.my_event_change_duration / 2);
        },
        /**
         * Handle component flows following a change to state values
         * 1. Trigger local events state update.
         * 2. Trigger My Events animation change
         * 3. Clear the active item messaging
         */
        postEventsChange: function (change_type: 'element_added' | 'element_removed') {
            this.disable_event_selection = false;
            this.updateAvailableEvents();
            this.animateMyEventsChange(change_type);
            setTimeout(() => {
                this.clearActiveMessage();
            }, CONFIG.feedback_show_duration / 2);
        },
        /**
         * Handle component flows following a submission error
         * 1. Display error message, then clear it
         */
        postEventError: function (error_message: string) {
            this.displayMessage(error_message, 'error');
            setTimeout(() => {
                this.clearActiveMessage();
                this.disable_event_selection = false;
            }, CONFIG.error_show_duration);
        },
        /**
         * Handle the add event fired on an event tile.
         * Start add data submission process and respond with success or error messaging
         */
        addEvent: function (event: EventSelectionEvent, event_tracking_id: number) {
            this.active_event_tracking_id = event_tracking_id;
            this.active_event_message = null;
            this.disable_event_selection = true;
            this.addEventAction(event)
                .then(() => {
                    this.displayMessage('Event added', 'success');
                    setTimeout(() => {
                        this.postEventsChange('element_added');
                    }, CONFIG.feedback_in_duration + (CONFIG.feedback_show_duration / 2));
                })
                .catch((error_message) => {
                    this.postEventError(error_message);
                });
        },
        /**
         * Action to perform add event
         */
        addEventAction: function (event: EventSelectionEvent): Promise<void> {
            return new Promise((resolve, reject) => {
                reject(`Add event action not configured for ${event.name}`);
            });
        },
        /**
         * Handle the remove event fired on an event tile.
         * Start remove data submission process and respond with success or error messaging
         */
        removeEvent: function (event: EventSelectionEvent, tracking_id: number) {
            this.active_event_tracking_id = tracking_id;
            this.active_event_message = null;
            this.disable_event_selection = true;
            const my_events_section_removal_flag = tracking_id < 0;
            this.removeEventAction(event)
                .then(() => {
                    /**
                     * If removing from my events, don't display a message and just fire the post message display event
                     */
                    if (my_events_section_removal_flag) {
                        this.postEventsChange('element_removed');

                        return;
                    }
                    /**
                     * Otherwise, follow standard change flow
                     */
                    this.displayMessage('Event removed', 'error');
                    setTimeout(() => {
                        this.postEventsChange('element_removed');
                    }, CONFIG.feedback_in_duration + (CONFIG.feedback_show_duration / 2));
                })
                .catch((error_message) => {
                    this.postEventError(error_message);
                });
        },
        /**
         * Action to perform remove event
         */
        removeEventAction: function (event: EventSelectionEvent): Promise<void> {
            return new Promise((resolve, reject) => {
                reject(`Remove event action not configured for ${event.name}`);
            });
        },
        /**
         * Set the current display message for the active event tile
         */
        displayMessage: function (message: string, status: 'error' | 'success') {
            this.active_event_message = message;
            this.active_event_status = status;
        },
        /**
         * Clear the current active messaging component properties
         * Clear the message and reset the active event index
         */
        clearActiveMessage: function () {
            this.active_event_message = null;
            this.active_event_status = null;
            this.active_event_tracking_id = null;
        },
        /**
         * Handle the event where a user clicks the close button on an event error message
         * Clear the current timeout that would hide the message, and reset component error-related properties
         */
        closeEventError: function () {
            this.clearActiveMessage();
            this.disable_event_selection = false;
        },
        /**
         * Get the active error message for a event tile index.
         * Returns false if no error message active on the tile
         */
        eventMessage: function (index: number): boolean | string {
            if (!this.active_event_message) {
                return false;
            }
            if (index === this.active_event_tracking_id) {
                return this.active_event_message;
            }

            return false;
        },
        /**
         * Handle the active page change on the pagination
         */
        updateActivePage: function (page_index: number) {
            this.active_page_index = page_index;
        }
    }
});