<my-coaches inline-template
            v-cloak>
    <page class="page page-my-coaches"
          :header="page_header">
        <competition-portal-page-heading v-if="competition_portal_heading_binding"
                                         slot="pre-header"
                                         v-bind="competition_portal_heading_binding"></competition-portal-page-heading>
        <component-loader v-if="!component_loaded"
                          slot="loader"
                          :container="true"
                          :source="this"
                          error_message="Error loading coach information."></component-loader>
        <div slot="header-content"
             class="page-heading__intro">
            Confirm the coach(es) attending the competition with you below.
            Refer to the competition website for information about credentials and coach compliance.
        </div>
        <page-alert slot="pre-header" v-if="component_loaded && !search_active && ineligible_coach"
                    class="page-alert--bleed">
            <div slot="trigger_text">
                Selected coach is ineligible. lean more.
            </div>
            <div slot="trigger_text_expanded">Coach Ineligible</div>
            <p class="alert"
               slot="expand_content">
                One of the coaches selected is now prohibited from participating, in any capacity, in any activity
                or competition authorized by, organizied by U.S. Figure Skating and/ or Local Affiliated
                Organization of U.S. Figure Skating (dub).
            </p>
            <p slot="expand_content">
                Please remove the coach and select another who will be attending with you.
            </p>
        </page-alert>
        <div slot="content"
             class="page__content page__content--no-top-pad">
            <div class="my-coaches-list"
                 v-if="!search_active">
                <p v-if="!event_categories.length"
                   class="alert my-coaches-list__notice">
                    No coach selections available.
                </p>
                <div v-else
                     class="my-coaches-category"
                     v-for="(event_category, category_index) in event_categories"
                     :key="event_category.id">
                    <h2 class="my-coaches-category__title">{{event_category.name}}</h2>
                    <div class="my-coaches-category__content">
                        <div class="my-coaches-coach"
                             v-for="(coach, coach_index) in event_category.coaches"
                             :key="coach.id">
                            <p class="my-coaches-coach__name coach-name">
                                <span class="coach-name__position">
                                    {{ordinal(coach_index)}} Coach:
                                </span>
                                <span class="coach-name__name">
                                    {{coach.first_name}} {{coach.last_name}}
                                </span>
                                <span class="coach-name__status text--alert"
                                      v-if="coach.ineligible">(Ineligible)</span>
                            </p>
                            <div class="my-coaches-coach__cta">
                                <div class="my-coaches-coach__cta-element">
                                    <button class="button button--medium button--block"
                                            :class="changeButtonClass(coach)"
                                            type="button"
                                            v-on:click="editCoach(category_index,coach,event_category.id)">Change
                                    </button>
                                </div>
                                <div class="my-coaches-coach__cta-element"
                                     v-if="showRemove(coach_index, category_index)">
                                    <button class="button button--medium button--block button--info"
                                            type="button"
                                            v-on:click="removeCoach(event_category.id,coach)"
                                            :disabled="isRemoveActive(event_category.id,coach.id)">Remove
                                    </button>
                                </div>
                            </div>
                            <p class="input-error my-coaches__cta-error"
                               v-if="showCTAError(event_category.id,coach.id)">
                                {{cta_state.error_message}}
                            </p>
                        </div>
                        <div class="my-coaches-category__cta"
                             v-if="showAddButton(event_category)">
                            <button class="my-coaches-category__add-coach add-link"
                                    type="button"
                                    v-on:click="addCoach(event_category.id)">Add
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <site-overlay :open_fn="searchActive"
                      v-on:close-overlay="closeSearch()">
            <!-- @integration - to facilitate development, both environment imports are below.
            @{ await Html.RenderPartialAsync("_MyCoachesSearch"); }
            -->
            <?php include( __DIR__ . '/partials/my-coaches-search.php' ); ?>
        </site-overlay>
    </page>
</my-coaches>
