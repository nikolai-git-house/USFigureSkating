<script lang="ts">
    import {
        CategorizedVolunteerOpportunityEvents,
        VolunteerOpportunityEvent
    } from '../contracts/app/VolunteerOpportunitiesContracts';
    import VolunteerEventTile, {VolunteerEventTileContract} from '../components/VolunteerOpportunities/VolunteerEventTile.vue';
    import HasDataDependencies from '../mixins/HasDataDependencies';
    import ScrollHelpers from '../helpers/scroll';
    import {TabsContract} from '../components/Tabs.vue';
    import VolunteerOpportunitiesRequest from '../components/VolunteerOpportunities/VolunteerOpportunitiesRequest.vue';
    import VolunteerOpportunitiesSearch from '../components/VolunteerOpportunities/VolunteerOpportunitiesSearch.vue';
    import {VolunteerOpportunitiesState} from '../store/Modules/VolunteerOpportunitiesState';
    import Vue from 'vue';
    import mixins from 'vue-typed-mixins';

    Vue.component('volunteer-event-tile', VolunteerEventTile);

    type OpportunityListRefKey = 'local_tiles' | 'requested_tiles' | 'usfs_tiles';

    interface OpportunityUILocation {
        ref_key: OpportunityListRefKey;
        tab_index: 1 | 0;
    }

    const extendedVue = mixins(HasDataDependencies);
    export default extendedVue.extend({
        components: {
            VolunteerOpportunitiesRequest,
            VolunteerOpportunitiesSearch
        },
        /**
         * Reactive data on the component
         */
        data: function () {
            return {
                dependencies: {
                    page_data: false
                }
            };
        },
        computed: {
            /**
             * Whether the opportunity request component is active
             */
            request_active: {
                /**
                 * Get value
                 */
                get: function (): boolean {
                    return this.$store.state.volunteer_opportunities.request_active;
                },
                /**
                 * Set value
                 */
                set: function (is_active: boolean): void {
                    return this.$store.commit('volunteer_opportunities/setRequestActive', is_active);
                }
            },
            /**
             * Opportunities to show in the requested tab
             */
            requested_volunteer_events: function (): VolunteerOpportunityEvent[] {
                return this.$store.getters['volunteer_opportunities/requested_volunteer_events'];
            },
            /**
             * Whether the opportunity request search component is active
             */
            search_active: {
                /**
                 * Get value
                 */
                get: function (): boolean {
                    return this.$store.state.volunteer_opportunities.search_active;
                },
                /**
                 * Set value
                 */
                set: function (is_active: boolean): void {
                    return this.$store.commit('volunteer_opportunities/setSearchActive', is_active);
                }
            },
            /**
             * Opportunities to show in the local section of the upcoming tab
             */
            upcoming_local: function (): VolunteerOpportunityEvent[] {
                return this.upcoming_volunteer_events.local;
            },
            /**
             * Opportunities to show in the usfsa section of the upcoming tab
             */
            upcoming_usfs: function (): VolunteerOpportunityEvent[] {
                return this.upcoming_volunteer_events.usfs;
            },
            /**
             * Opportunities to show in the upcoming tab
             */
            upcoming_volunteer_events: function (): CategorizedVolunteerOpportunityEvents {
                return this.$store.getters['volunteer_opportunities/upcoming_volunteer_events'];
            }
        },
        methods: {
            /**
             * Initiate a request against an opportunity
             */
            beginRequest: function (event: VolunteerOpportunityEvent): void {
                this.$store.dispatch('volunteer_opportunities/beginRequest', event.competition_id);
            },
            /**
             * Close the overlay
             */
            closeOverlay: function (): void {
                /**
                 * Request could result from a search. If request is active, close it, falling into search if needed
                 */
                if (this.request_active) {
                    this.$store.dispatch('volunteer_opportunities/exitRequest');

                    return;
                }
                this.$store.dispatch('volunteer_opportunities/exitSearch');
            },
            /**
             * Find the VolunteerEventTile component for a given target competition within a certain ref list
             */
            findOpportunityTileComponent: function (target_competition_id: number, ref_key: OpportunityListRefKey): VolunteerEventTileContract | null {
                const volunteerEventTiles = this.$refs[ref_key] as VolunteerEventTileContract[];
                // Find event tile component
                for (let i = 0; i < volunteerEventTiles.length; i++) {
                    const tilesElement = volunteerEventTiles[i];
                    const competition_id = tilesElement.volunteer_event.competition_id;
                    if (competition_id === target_competition_id) {
                        return tilesElement;
                    }
                }

                return null;
            },
            /**
             * Get the tab and list location of a competition by id
             */
            getOpportunityLocation: function (target_competition_id: number): null | OpportunityUILocation {
                for (let i = 0; i < this.requested_volunteer_events.length; i++) {

                    const requestedVolunteerEvent = this.requested_volunteer_events[i];
                    if (requestedVolunteerEvent.competition_id === target_competition_id) {
                        return {
                            ref_key: 'requested_tiles',
                            tab_index: 1
                        };
                    }
                }
                for (let i = 0; i < this.upcoming_local.length; i++) {
                    const requestedVolunteerEvent = this.upcoming_local[i];
                    if (requestedVolunteerEvent.competition_id === target_competition_id) {
                        return {
                            ref_key: 'local_tiles',
                            tab_index: 0
                        };
                    }
                }
                for (let i = 0; i < this.upcoming_usfs.length; i++) {
                    const requestedVolunteerEvent = this.upcoming_usfs[i];
                    if (requestedVolunteerEvent.competition_id === target_competition_id) {
                        return {
                            ref_key: 'usfs_tiles',
                            tab_index: 0
                        };
                    }
                }

                return null;
            },
            /**
             * Handle the completion event in which we remain on screen
             *
             * Close all submodules
             * Show the requested opportunity on screen
             */
            handleCompleteLocal: function () {
                const active_competition_id = this.$store.state.volunteer_opportunities.active_competition_id;
                this.$store.dispatch('volunteer_opportunities/exitAll');

                this.showRequestedOpportunity(active_competition_id);
            },
            /**
             * Load data needed for component to function
             */
            loadData: function () {
                return new Promise((resolve, reject) => {
                    const promises: Promise<void>[] = [
                        this.$store.dispatch('volunteer_opportunities/fetchVolunteerOpportunitiesPageData')
                            .then(() => {
                                this.dependencies.page_data = true;
                            })
                            .catch(() => {
                                reject();
                            })
                    ];
                    Promise.all(promises)
                        .then(() => {
                            resolve();
                        });
                });
            },
            /**
             * Open the opportunity search
             */
            openSearch: function () {
                this.search_active = true;
            },
            /**
             * Whether the overlay is active
             */
            overlayActive: function (): boolean {
                return this.search_active || this.request_active;
            },
            /**
             * Action to take prior to data load attempt
             * 1. Register volunteer opportunities model
             */
            preDataLoad: function () {
                return new Promise((resolve) => {
                    this.$store.registerModule('volunteer_opportunities', VolunteerOpportunitiesState);
                    resolve();
                });
            },
            /**
             * Open the proper tab, scroll the indicated opportunity as high in the viewport as possible, and flash
             * a status display
             */
            showRequestedOpportunity: function (target_competition_id: number) {
                const tabsChild = this.$refs.tabs as TabsContract;
                const tab_location: OpportunityUILocation | null = this.getOpportunityLocation(target_competition_id);
                if (tab_location === null) {
                    console.warn('Opportunity not present in lists.');

                    return;
                }

                const {ref_key, tab_index} = tab_location;
                tabsChild.setActive(tab_index);

                this.$nextTick(() => {
                    const targetVolunteerEventTile = this.findOpportunityTileComponent(target_competition_id, ref_key);
                    if (!targetVolunteerEventTile) {
                        return;
                    }
                    // Scroll tile to topmost possible position
                    ScrollHelpers.scrollToOffset(targetVolunteerEventTile.$el.offsetTop - 80);
                    // Flash status on tile
                    targetVolunteerEventTile.flashStatus('success');
                });
            }
        }
    });
</script>