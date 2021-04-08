<template>
    <page :header="page_header"
          class="team-registration-event-selection"
          :class="{'page--accent':component_loaded}">
        <team-registration-header slot="pre-header"></team-registration-header>
        <div slot="header-content">
            <team-registration-progress-bar></team-registration-progress-bar>
            <div v-if="component_loaded"
                 class="team-registration__page-information">
                <page-alert class="page-alert page-alert--notice page-alert--medium">
                    <div slot="trigger_text">
                        Additional Information
                    </div>
                    <div slot="expand_content">
                        <p>
                            Your team is eligible for the events listed below based on level. A blue star indicates that
                            an event has been selected.
                        </p>
                        <p>
                            If events appear incorrect, contact
                            <a class="standard-link"
                               href="mailto:productsupport@usfigureskating.org">productsupport@usfigureskating.org
                            </a>
                        </p>
                    </div>
                </page-alert>
            </div>
        </div>
        <component-loader v-if="!component_loaded"
                          :container="true"
                          :source="this"
                          error_message="Error loading event selection."></component-loader>
        <div v-else
             class="team-registration-event-selection__content">
            <event-selection ref="event_selection"
                             :state_available_events="events"
                             v-on:disable="child_processing=true"
                             v-on:enable="child_processing=false"></event-selection>
            <div class="grid-container">
                <team-registration-page-navigation :retreat="retreat"
                                                   :advance="advance"
                                                   :advance_disabled="advance_disabled"
                                                   :hide_retreat="hide_retreat"></team-registration-page-navigation>
            </div>
        </div>
    </page>
</template>
<script lang="ts">
    import TeamRegistrationSubpageMixin from '../_mixins/TeamRegistrationSubpageMixin';
    import mixins from 'vue-typed-mixins';
    import HasDataDependencies from '../../../../mixins/HasDataDependencies';
    import {EventSelection} from '../_components';
    import {TeamRegistration} from '../_contracts';

    const vueClass = mixins(TeamRegistrationSubpageMixin, HasDataDependencies);
    // @vue/component
    export default vueClass.extend({
        components: {
            EventSelection
        },
        /**
         * Reactive data
         */
        data: function () {
            return {
                /**
                 * Data dependencies for the component
                 */
                dependencies: {
                    page_data: false
                },
                /**
                 * Title to display for page
                 */
                page_title: 'Event Selection',
                child_processing: false
            };
        },
        computed: {
            /**
             * Whether the advance button should be disabled
             */
            advance_disabled: function (): boolean {
                if (this.child_processing) {
                    return true;
                }
                for (let i = 0; i < this.events.length; i++) {
                    if (this.events[i].is_selected) {
                        return false;
                    }
                }

                return true;
            },
            /**
             * All events
             */
            events: function (): TeamRegistration.EventSelectionPageEvent[] {
                return this.$store.state.team_registration.event_selection.events;
            }
        },
        methods: {
            /**
             * Load data for page
             */
            loadData: function () {
                return new Promise((resolve, reject) => {
                    this.$store.dispatch('team_registration/fetchEventSelection')
                        .then(() => {
                            this.dependencies.page_data = true;
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