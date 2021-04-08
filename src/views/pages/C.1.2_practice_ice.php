<practice-ice-schedule inline-template v-cloak>
    <page class="page page--practice-ice page-practice-ice"
          :class="{
            'page-practice-ice--team': selections_blocked,
            'page--accent': component_loaded
          }"
          :header="page_header">
        <competition-portal-page-heading v-if="competition_portal_heading_binding"
                                         slot="competition-heading"
                                         v-bind="competition_portal_heading_binding"></competition-portal-page-heading>
        <div slot="header-content">
            <p class="page__lead" v-if="multiple_sheets">
                Swipe or tap the arrows to move between the ice sheets associated with the schedule.
            </p>
            <!--@integration:
               Currently, if a Practice Ice Schedule only features one sheet of ice, no message will display.
               If you would like to display a message on schedules with only one sheet, uncomment the following
               lines and provide the desired text.

            <p class="page__lead" v-else>
                Single sheet schedule message
            </p>
           -->
        </div>
        <component-loader v-if="!component_loaded"
                          slot="loader"
                          :container="true"
                          :source="this"
                          error_message="Error loading practice ice."></component-loader>
        <div slot="content" class="page__content page__content--bleed">
            <div v-if="practice_ice_available">
                <div id="rink-name-carousel" class="swiper-container page-practice-ice__rink-name-carousel practice-ice-rink-name-carousel">
                    <div class="swiper-wrapper">
                        <div class="practice-ice-rink-name-carousel__slide swiper-slide" v-for="(rink_schedule,index) in rink_schedules" v-cloak>
                            <h3 class="rink-name">
                                <span class="rink-name__text">{{rink_schedule.rink.full_name}}</span>
                            </h3>
                        </div>
                    </div>
                    <div class="practice-ice-rink-name-carousel__navigation" v-if="multiple_sheets">
                        <div class="grid-container">
                            <div id="rink-carousel-next" class="practice-ice-rink-name-carousel__control practice-ice-rink-name-carousel__control--next swiper-no-swiping"></div>
                            <div id="rink-carousel-prev" class="practice-ice-rink-name-carousel__control practice-ice-rink-name-carousel__control--prev swiper-no-swiping"></div>
                        </div>
                    </div>
                </div>
                <div class="swiper-container practice-ice-rink-session-carousel" id="rink-session-carousel">
                    <practice-ice-filters v-cloak v-on:filter_changed="childFilterChanged" :active_filters="active_filters" :available_filters="available_filters" inline-template>
                        <?php include __DIR__ . "/./partials/practice-ice-filters.php" ?>
                    </practice-ice-filters>
                    <div class="swiper-wrapper">
                        <?php include( __DIR__ . '/partials/rink-schedule.php' ); ?>
                    </div>
                </div>
                <site-overlay :open_fn="showCredits" v-on:close-overlay="is_credits_active=false" class="site-overlay--credits" v-cloak>
                    <?php include( __DIR__ . '/partials/practice-ice-credits.php' ); ?>
                </site-overlay>
                <practice-ice-footer inline-template :is_credits_active="is_credits_active" v-on:show_credits="is_credits_active=true" v-if="show_footer">
                    <?php include( __DIR__ . '/partials/practice-ice-footer.php' ); ?>
                </practice-ice-footer>
            </div>
            <div v-else class="grid-container">
                <p>Practice Ice is not currently available for this competition.</p>
            </div>
        </div>
    </page>
</practice-ice-schedule>