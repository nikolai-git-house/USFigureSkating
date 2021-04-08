<volunteer-opportunities inline-template v-cloak>
    <div class="volunteer-opportunities">
        <div class="page page--accent">
            <div class="page__heading">
                <div class="grid-container">
                    <h1 class="page__title">
                        Volunteer Opportunities
                    </h1>
                    <p class="page__lead">
                        Thank you for your interest in volunteering at a U.S. Figure Skating sanctioned event.
                    </p>
                </div>
            </div>
            <div class="page__content page__content--bleed">
                <div class="grid-container" v-if="!component_loaded">
                    <p v-if="load_error" class="text--alert">Error loading volunteer opportunities.</p>
                    <p v-else-if="!loaded && loading_timeout">Loading...</p>
                </div>
                <div v-else class="volunteer-opportunities__content">
                    <tabs ref="tabs" class="tabs--justified tabs--reduced-more" :triggers_classes="[ 'tabs__triggers--opaque' ]">
                        <tab name="Upcoming" :selected="true" :body_class="['tabs__tab-body--no-pad']">
                            <div class="grid-container">
                                <div class="volunteer-opportunities__tab-body">
                                    <div class="volunteer-opportunities__search-link">
                                        <a class="icon-link icon-link--search icon-link--underline" v-on:click.prevent="openSearch" href="#">
                                            Search
                                        </a>
                                    </div>
                                    <div class="volunteer-opportunities__event-category">
                                        <h4 class="volunteer-opportunities__category-heading">
                                            Local Events
                                        </h4>
                                        <div class="volunteer-opportunities__event-list" v-if="upcoming_local.length">
                                            <volunteer-event-tile ref="local_tiles" v-on:request="beginRequest(event)" v-for="event in upcoming_local" :key="event.competition_id" :volunteer_event="event"></volunteer-event-tile>
                                        </div>
                                        <div v-else class="volunteer-opportunities__no-events-notice">
                                            There are no local events currently looking for volunteers. Check back
                                            later.
                                        </div>
                                    </div>
                                    <div class="volunteer-opportunities__event-category">
                                        <h4 class="volunteer-opportunities__category-heading">
                                            U.S. Figure Skating Events
                                        </h4>
                                        <div class="volunteer-opportunities__event-list" v-if="upcoming_usfs.length">
                                            <volunteer-event-tile ref="usfs_tiles" v-on:request="beginRequest(event)" v-for="event in upcoming_usfs" :key="event.competition_id" :volunteer_event="event"></volunteer-event-tile>
                                        </div>
                                        <div v-else class="volunteer-opportunities__no-events-notice">
                                            There are no U.S. Figure Skating events currently looking for volunteers.
                                            Check back later.
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </tab>
                        <tab name="Requested" :body_class="['tabs__tab-body--no-pad']">
                            <div class="grid-container">
                                <div class="volunteer-opportunities__event-category volunteer-opportunities__event-category--requested">
                                    <div class="volunteer-opportunities__event-list" v-if="requested_volunteer_events.length">
                                        <volunteer-event-tile ref="requested_tiles" v-on:request="beginRequest(event)" v-for="event in requested_volunteer_events" :key="event.competition_id" :volunteer_event="event"></volunteer-event-tile>
                                    </div>
                                    <div v-else class="volunteer-opportunities__no-events-notice">
                                        You do not have any volunteer requests at this time. Click Upcoming tab to
                                        request to volunteer.
                                    </div>
                                </div>
                            </div>
                        </tab>
                    </tabs>
                </div>
            </div>
            <site-overlay :open_fn="overlayActive" v-on:close-overlay="closeOverlay" :content_class="['site-overlay__content--no-top-pad']">
                <volunteer-opportunities-search v-if="search_active" inline-template>
                    <?php include __DIR__ . "/partials/volunteer-opportunities/M.2_volunteer-opportunities-search.php"; ?>
                </volunteer-opportunities-search>
                <!--@integration - 2020-01-07
                   the `M.3_volunteer-opportunities-request.php` template partial in use below has been deprecated.
                   Its continued use will not pose any issues, but the <volunteer-opportunities-request> element below
                   can be updated to use the template defined in the single-file component by removing the `inline-template`
                   attribute and the template include.

                   Update 2020-08-25: The following needs to be moved away from the inline template as noted above to support the addition of the waivers screen

               -->
                <volunteer-opportunities-request v-else-if="request_active"
                                                 v-on:complete-local="handleCompleteLocal"></volunteer-opportunities-request>
            </site-overlay>
        </div>
    </div>
</volunteer-opportunities>