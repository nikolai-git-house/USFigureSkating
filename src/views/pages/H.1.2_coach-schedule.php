<my-schedule inline-template
             v-cloak
             :coach_mode="true"
             :expand_first_expandable="true">
    <page class="page  page-my-schedule"
          :class="{
            'page--accent':component_loaded
          }"
          :header="page_header">
        <competition-portal-page-heading v-if="competition_portal_heading_binding"
                                         slot="pre-header"
                                         v-bind="competition_portal_heading_binding"></competition-portal-page-heading>
        <component-loader v-if="!component_loaded"
                          slot="loader"
                          :container="true"
                          :source="this"
                          error_message="Error loading schedule."></component-loader>
        <div slot="content"
             class="page__content">
            <p v-if="status_message">
                {{status_message}}
            </p>
            <div v-else>
                <div class="download-schedule">
                    <a asp-route="Competition_Personal_Schedule_Download" asp-route-competitionId="@Model.CompetitionId" class="page--my-schedule__download-link standard-link">My Schedule</a> |
                    <a asp-route="Competition_Full_Schedule_Download" asp-route-competitionId="@Model.CompetitionId" class="standard-link noswipe">Competition Schedule</a>
                </div>
                <div class="page-my-schedule__schedule">
                    <div class="schedule-card" v-for="day in schedule.days">
                        <h3 class="schedule-card__heading">{{day.pretty_date}}</h3>
                        <div class="schedule-card__content">
                            <div class="session-list">
                                <extended-session v-for="(scheduled_session,index) in day.sessions" :session="scheduled_session.session" :key="index" ref="sessions">
                                    <div class="session-skater-list" v-if="session_skaters(scheduled_session.session).length">
                                        <div class="session-skater-list__label">
                                            My Skaters:
                                        </div>
                                        <div class="session-skater-list__value">
                                            <span class="session-skater-list__skater" v-for="(skater,index) in session_skaters(scheduled_session.session)">{{skater}}<span v-if="index < session_skaters(scheduled_session.session).length-1">,&nbsp;</span></span>
                                        </div>
                                    </div>
                                </extended-session>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </page>
</my-schedule>
