<script lang="ts">
    import Vue from "vue";
    import {RinkSchedule} from "../../models/RinkSchedule/RinkSchedule";
    import {RinkScheduleActiveFilters} from "../../contracts/RinkScheduleFiltersContracts";
    import {SkaterSchedule} from "../../models/Schedule/SkaterSchedule";
    import {Session} from "../../models/Sessions/Session";
    import {SessionCollection} from "../../models/Collections/SessionCollection";
    import {SelectedSessionState} from "./SelectedSessionState";
    import {SecondaryActionState} from "./SecondaryActionState";
    import {RinkSessionFilterer} from "../../models/RinkFilter";
    import {
        SelectedSessionOutcome,
        SessionSelectionActionRequired,
        IndexedSessionMessages
    } from "../../contracts/AppContracts";
    import SecondarySessionSelectionActionComponent from "./SecondarySessionSelectionAction.vue";
    import {StandardSessionComponent} from "../../components/StandardSession.vue";

    export default Vue.extend({
        /**
         * Data passed by parent to power component
         * 1. rink_schedule - the schedule for the rink instance consisting of sessions
         * 2. skater_schedule - the active user's schedule
         */
        props: {
            /**
             * Inherit the active filters from parent
             */
            active_filters: {
                type: RinkScheduleActiveFilters,
                required: true
            },
            /**
             * Rink schedule data to power component
             */
            rink_schedule: {
                type: RinkSchedule,
                required: true
            },
            /**
             * Skater schedule to determine whether sessions are scheduled
             */
            skater_schedule: {
                type: SkaterSchedule,
                required: false
            },
            coach_mode: {
                type: Boolean,
                default: false,
            },
            coached_sessions: {
                type: SessionCollection,
                required: false
            },
            expand_first_expandable: {
                type: Boolean,
                default: false
            },
            selections_blocked: {
                type: Boolean,
                default: false
            }
        },
        /**
         * Reactive data for the component.
         * 1. session_messages - Indexed set of messages for sessions. Tied to the sessions index in session list array
         * 2. selected_session - the state of the currently selected session. Used to track user input for secondary actions
         * 3. secondary_action - The state to track data related to any active secondary action
         * 4. actions_locked - Whether user interaction is locked. Sessions won't be clickable and rinks won't be swipable when true
         */
        data: function () {
            let default_session_messages: IndexedSessionMessages = {};
            return {
                session_messages: default_session_messages,
                selected_session: new SelectedSessionState(),
                secondary_action: new SecondaryActionState(),
                actions_locked: false,
                session_list_bottom_pad: "0"
            }
        },
        /**
         * Reactive component properties computed on data change
         */
        computed: {
            /**
             * The list of sessions based on active filters
             */
            filtered_sessions: function () {
                return RinkSessionFilterer.filter(
                    this.active_filters,
                    this.rink_schedule.session_collection,
                    {
                        competition_information: this.$store.state.competitions.competition_information,
                        skater: this.$store.state.skater.skater,
                        active_sales_window: this.$store.getters['competitions/active_sales_window']
                    }
                ).sessions;
            },
            cart: function () {
                return this.$store.state.cart.cart;
            }
        },
        methods: {
            /**
             * Compute class to append to session items based on the session's state
             */
            sessionClass: function (session: Session) {
                if (this.coach_mode) {
                    if (this.coached_sessions && this.coached_sessions.contains(session)) {
                        return "session--scheduled";
                    }
                    return;
                }
                if (this.skater_schedule && this.skater_schedule.contains(session)) {
                    return "session--scheduled";
                }
                if (this.cart.contains(session)) {
                    return "session--in-cart";
                }
                return false;
            },
            /**
             * Prevent user interaction when session feedback or secondary actions are active
             */
            lockActions() {
                this.actions_locked = true;
                this.$emit('lock');
            },
            /**
             * Unlock previously locked user interactions
             */
            unlockActions() {
                this.actions_locked = false;
                this.$emit('unlock');
            },
            /**
             * Handle user clicking a session.
             */
            selectSession: function (index: number, session: Session) {
                if (this.selections_blocked) {
                    return;
                }

                if (this.actions_locked) {
                    return;
                }
                this.lockActions();
                if (this.selected_session.session && session.id !== this.selected_session.session.id) {
                    this.selected_session.reset();
                }
                this.selected_session.session = session;
                this.selected_session.index = index;

                let vm = this;
                this.$store.dispatch('session/select', vm.selected_session).then(function (result: (SelectedSessionOutcome | SessionSelectionActionRequired)) {

                    if (result.secondary_action) {
                        Vue.set(vm.session_messages, String(index), null);
                        Vue.set(vm.secondary_action, 'active_index', index);
                        Vue.set(vm.secondary_action, 'action_key', result.secondary_action);
                        Vue.set(vm.secondary_action, 'action_arguments', result.secondary_action_args);
                        return
                    }
                    vm.displaySessionMessage(index, result.type, result.message, result.resolution_function);
                    vm.secondary_action.reset();
                    vm.clearSelectedSession();
                }).catch(function (error) {
                    vm.displaySessionMessage(index, 'error', error);
                    vm.secondary_action.reset();
                    vm.clearSelectedSession();
                });
            },
            /**
             * Display a message on a session.  After a set amount of time, remove the message
             *
             * Additionally, unlock actions if they're locked.
             *
             * If a resolution function is provided, run it after the session message timer has elapsed
             */
            displaySessionMessage: function (session_index: number, message_type: string, message: string, resolution_function?: Function) {
                Vue.set(this.session_messages, String(session_index), {
                    type: message_type,
                    message: message
                });
                let vm = this;

                setTimeout(function () {
                    Vue.set(vm.session_messages, String(session_index), null);
                    if (resolution_function) {
                        resolution_function();
                    }
                    vm.unlockActions();
                }, 2500)
            },

            /**
             * Reset the selected session state
             */
            clearSelectedSession: function () {
                this.selected_session.reset();
            },
            /**
             * Reselect a session after providing secondary action feedback
             */
            reselectSession() {
                if (this.selected_session.session) {
                    this.unlockActions();
                    this.selectSession(this.selected_session.index, this.selected_session.session);
                }
            },
            /**
             * Determine whether to show a secondary action for a session
             */
            showSecondaryAction: function (index: number): boolean {
                return this.secondary_action.active_index === index;
            },
            /**
             * Handle the event where a user closes a secondary action.
             * Unlock actions, and report to parents that actions are unlocked
             */
            handleClosedSecondary: function () {
                this.actions_locked = false;
                this.$emit('unlock');
            },
            /**
             * If final session has feedback active in the form of a secondary action, pad the bottom of the session list
             * to accommodate the feedback height
             *
             * Otherwise, clear the bottom padding of the session list
             */
            padSessionListForFeedback: function () {
                let vm = this;
                let pad_amount = 0;
                let session_items: Vue[] = vm.$refs.session_items as Vue[];
                if (session_items && session_items.length) {
                    let last_session_element = <HTMLElement>session_items[session_items.length - 1].$el;
                    let last_session_element_height: number = last_session_element.offsetHeight;
                    let feedback_item = last_session_element.querySelector('.session-feedback') as HTMLElement;
                    if (feedback_item) {
                        pad_amount = (feedback_item.offsetHeight - last_session_element_height) / 2;
                    }
                }

                this.session_list_bottom_pad = pad_amount ? pad_amount + "px" : "0";

                this.$emit('feedback-change', !!pad_amount);
            },
            /**
             * Get the skaters the active user coaches for a session
             *
             * Used when a subcomponent of the Competition Schedule
             */
            session_skaters: function (session: Session): string[] {
                return this.$store.getters['coach/session_skaters'](session.id);
            },
            /**
             * Get whether a session has any skaters coached by the active user.
             *
             * Used when a subcomponent of the Competition Schedule
             */
            session_has_coached_skaters: function (session: Session): boolean {
                let session_skaters = this.session_skaters(session);
                return !!(session_skaters && session_skaters.length > 0);

            }
        },
        /**
         * When component is mounted, expand the first expandable session if associated component property is set
         */
        mounted: function (): void {
            if (this.expand_first_expandable) {
                let session_components: StandardSessionComponent[] = this.$refs.session_items as StandardSessionComponent[];
                if (session_components && session_components.length) {
                    for (let i = 0; i < session_components.length; i++) {
                        let ref = session_components[i];
                        if (ref.$props.expandable) {
                            ref.toggleExpand();
                            return;
                        }
                    }
                }
            }
        },
        watch: {
            "secondary_action.active_index": function (value: number) {
                let vm = this;
                return Vue.nextTick(function () {
                    vm.padSessionListForFeedback();
                });
            }
        },
        /**
         * Child components of this component.
         * 1. SecondarySessionSelectionAction - secondary action input controls and display.
         */
        components: {
            'secondary-session-selection-action': SecondarySessionSelectionActionComponent
        }
    });
</script>
