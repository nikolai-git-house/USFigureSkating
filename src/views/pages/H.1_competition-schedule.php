<coach-competition-schedule inline-template v-cloak>
    <page class="page page--practice-ice page-coach-competition-schedule page-practice-ice page-practice-ice--competition-schedule"
          :class="{'page--accent':component_loaded}"
          :header="page_header_override">
        <competition-portal-page-heading v-if="competition_portal_heading_binding"
                                         slot="pre-header"
                                         v-bind="competition_portal_heading_binding"></competition-portal-page-heading>
        <component-loader v-if="!component_loaded"
                          slot="loader"
                          :container="true"
                          :source="this"
                          error_message="Error loading schedule."></component-loader>
        <div slot="content" class="page__content page__content--bleed">
            <div v-if="schedule_available">
                <div id="rink-name-carousel" class="swiper-container page-practice-ice__rink-name-carousel practice-ice-rink-name-carousel">
                    <div class="swiper-wrapper">
                        <div class="practice-ice-rink-name-carousel__slide swiper-slide" v-for="(rink_schedule,index) in rink_schedules" v-cloak>
                            <h3 class="rink-name">
                                <span class="rink-name__text">
                                    {{rink_schedule.rink.full_name}}
                                </span>
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
                    <div class="page-practice-ice__filters practice-ice-filters practice-ice-filters">
                        <div class="practice-ice-filter form-group">
                            <label for="date_filter" class="field-label practice-ice-filter__label">Date:</label>
                            <div class="practice-ice-filter__control noswipe">
                                <select name="date_filter" v-on:change="childFilterChanged" v-model="active_filters.date" id="date_filter" class="form-field">
                                    <option v-for="filter in available_filters.dates" :value="filter.value">{{filter.label}}</option>
                                </select>
                            </div>
                        </div>
                        <div class="download-schedule download-schedule--competition-schedule">
                            <a class="info-link noswipe" v-on:click="legend_active=true" href="#">&nbsp;</a>
                            <a asp-route="Competition_Personal_Schedule_Download" asp-route-competitionId="@Model.CompetitionId" class="standard-link noswipe">My Schedule</a> |
                            <a asp-route="Competition_Full_Schedule_Download" asp-route-competitionId="@Model.CompetitionId" class="standard-link noswipe">Competition Schedule</a>
                        </div>
                    </div>
                    <div class="swiper-wrapper">
                        <rink-schedule :active_filters="active_filters" v-cloak inline-template v-for="(rink_schedule,index) in rink_schedules" :rink_schedule="rink_schedule" :key="index" :coached_sessions="coached_sessions" :coach_mode="true" :expand_first_expandable="true">
                            <div class="swiper-slide">
                                <div class="page-practice-ice__sessions" :style="'padding-bottom:'+session_list_bottom_pad">
                                    <div class="session-list">
                                        <standard-session v-for="(session,index) in filtered_sessions" :key="index" :class="sessionClass(session)" :session="session" ref="session_items">
                                            <div slot="additional-content" class="session-skater-list" v-if="session_has_coached_skaters(session)">
                                                <div class="session-skater-list__label">
                                                    My Skaters:
                                                </div>
                                                <div class="session-skater-list__value">
                                                    <span class="session-skater-list__skater" v-for="(skater,index) in session_skaters(session)">{{skater}}<span v-if="index < session_skaters(session).length-1">,&nbsp;</span></span>
                                                </div>
                                            </div>
                                        </standard-session>
                                    </div>
                                    <div v-if="!filtered_sessions.length" class="page-practice-ice__no-sessions">
                                        No sessions match your current filters.
                                    </div>
                                </div>
                            </div>
                        </rink-schedule>
                    </div>
                </div>
            </div>
            <div v-else class="grid-container">
                <p>Schedule is not currently available for this competition.</p>
            </div>
        </div>
        <popup v-cloak class="popup--info popup--competition-schedule-key" v-if="legend_active" v-on:close-popup="legend_active=false" :math_center="true">
            <span slot="heading-text">
                Schedule Details
            </span>
            <div slot="content">
                <p>
                    <i class="inline-icon icon-bookmark">&nbsp;</i>
                    Bookmark indicates sessions/events your skaters are assigned to. To see event details visit the
                    <a asp-route="Competition_Coach_Schedule" asp-route-competitionId="@Model" class="standard-link">Coach Schedule</a> page for more info.
                </p>
            </div>
        </popup>
    </page>
</coach-competition-schedule>
