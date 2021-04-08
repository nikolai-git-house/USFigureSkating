<ems-home inline-template v-cloak>
<div class="page page-ems">
    <div class="page__heading">
        <h1 class="page__title">Event Management System</h1>
    </div>
    <div class="page__content">
        <component-loader v-if="!component_loaded"
                          slot="loader"
                          :container="true"
                          :source="this"
                          error_message="Error loading series information."></component-loader>
        <div v-else class="panel-link-group">
            <!--
                @integration:
                The following links have their targets implemented to work within the demo site.
                They will likely need to be updated to direct users to the appropriate pages within your system.

                For links that should open in a new tab, add `target="_blank" rel="noopener"` attributes to the panel-link
                anchor element
            -->
            <a href="/pages/search-competitions" class="panel-link panel-link--simple">
                <div class="panel-link__content">
                    <div class="panel-link__text">
                        Search Competitions
                    </div>
                </div>
            </a>
            <a href="/pages/my-competitions" class="panel-link panel-link--simple">
                <div class="panel-link__content">
                    <div class="panel-link__text">
                        My Competitions
                    </div>
                </div>
            </a>
            <a href="/pages/my-competitions-teams" class="panel-link panel-link--simple">
                <div class="panel-link__content">
                    <div class="panel-link__text">My Competitions - Teams</div>
                </div>
            </a>
            <a href="/pages/competition-registration" class="panel-link panel-link--simple">
                <div class="panel-link__content">
                    <div class="panel-link__text">Competition Registration</div>
                </div>
            </a>
            <a href="/pages/competition-registration-teams/select-team"
               v-on:click="handleTeamRegistrationClick"
               class="panel-link panel-link--simple">
                <div class="panel-link__content">
                    <div class="panel-link__text">
                        Competition Registration - Teams
                        <transition name="fade">
                            <p v-if="show_team_registration_error"
                               class="panel-link__error panel-link__error--sm">
                                You must be a team coach or team manager to register a team
                            </p>
                        </transition>
                    </div>
                </div>
            </a>
            <a href="/pages/competition-management" class="panel-link panel-link--simple">
                <div class="panel-link__content">
                    <div class="panel-link__text">Competition Management</div>
                </div>
            </a>
            <a href="/pages/series-registration" class="panel-link panel-link--simple">
                <div class="panel-link__content">
                    <div class="panel-link__text">Series Information</div>
                </div>
            </a>
            <a href="/pages/volunteer-opportunities" class="panel-link panel-link--simple">
                <div class="panel-link__content">
                    <div class="panel-link__text">Volunteer Opportunities</div>
                </div>
            </a>
            <a href="#" class="panel-link panel-link--simple">
                <div class="panel-link__content">
                    <div class="panel-link__text">Club: Sanctions, Applications &amp; Bids</div>
                </div>
            </a>
        </div>
    </div>
</div>
</ems-home>