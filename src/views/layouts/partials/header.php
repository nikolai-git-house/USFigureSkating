<site-header inline-template v-cloak>
    <header class="site-header">
        <div class="site-header__navbar">
            <div class="grid-container">
                <div class="navbar" :class="{'menu-open':menu_open,'navbar--no-border':hide_nav_border}">
                    <button type="button" v-on:click.prevent="toggleNav" class="nav-toggle navbar__toggle" :class="{'active':menu_open,'hidden':hide_menu}">
                        <span class="nav-toggle__line nav-toggle__line--top"></span>
                        <span class="nav-toggle__line nav-toggle__line--middle"></span>
                        <span class="nav-toggle__line nav-toggle__line--bottom"></span>
                    </button>
                    <a class="navbar__brand" href="/Members/MemberHome">
                        <img class="navbar__logo" src="/images/usfsa_logo.png" srcset="/images/usfsa_logo@2x.png 2x,/images/usfsa_logo@3x.png 3x " alt="US Figure Skating Logo"/>
                    </a>
                    <cart-status inline-template v-cloak :class="{'hidden':!show_cart_status}">
                        <a href="/pages/cart" class="navbar__cart cart-status">
                            {{cart_count}}
                        </a>
                    </cart-status>
                </div>
            </div>
        </div>
        <transition>
            <nav class="site-header__menu" v-cloak v-if="menu_open">
                <div class="site-menu">
                    <div class="site-menu__content">
                        <div class="site-menu__tabs">
                            <tabs>
                                <tab name="Main Menu" :selected="true">
                                    <ul class="site-menu__links nav-list">
                                        <li>
                                            <a href="/Members/MemberHome">Home</a>
                                        </li>
                                        <!-- @integration: the following link needs a target -->
                                        <li>
                                            <a href="#">Members Only (Desktop View)</a>
                                        </li>
                                        <!-- @integration: the following link needs a target -->
                                        <li>
                                            <a href="/pages/ems">EMS Home</a>
                                        </li>
                                        <li>
                                            <a href="/pages/my-competitions">My Competitions</a>
                                        </li>
                                        <!-- @integration: the following link needs a target -->
                                        <li>
                                            <a href="/pages/my-competitions-teams">My Competitions - Teams</a>
                                        </li>
                                        <li>
                                            <a href="/pages/search-competitions">Search Competitions</a>
                                        </li>
                                        <li>
                                            <a href="/pages/help-and-resources">Help &amp; Resources</a>
                                        </li>
                                        <li>
                                            <a href="/pages/ems-support">Contact Product Support</a>
                                        </li>
                                        <li>
                                            <a href="/pages/competition-management">Competition Management</a>
                                        </li>
                                        <li>
                                            <a href="/Account/LogOff">Sign Out</a>
                                        </li>
                                    </ul>
                                </tab>
                                <tab name="Competitions">
                                    <div class="site-menu__competitions">
                                        <competition-list inline-template>
                                            <div class="accordion-group accordion-group--no-bottom" v-if="competitions.length">
                                                <accordion :init_expanded="isActive(competition)" v-for="competition in competitions" :key="competition.id" :trigger_link="competition.detail_link">
                                                    <span slot="trigger_text">{{competition.name}}</span>
                                                    <div slot="expand_content">
                                                        <ul class="nav-list nav-list--small">
                                                            <li v-if="is_skater">
                                                                <a v-on:click.prevent="openSchedule(competition)" :href="competition.schedule_link">
                                                                    My Schedule
                                                                </a>
                                                                <p class="nav-list__error" v-if="schedule_error">The
                                                                    schedule has not been posted yet.
                                                                </p>
                                                            </li>
                                                            <li v-if="is_coach">
                                                                <a v-on:click.prevent="openCoachCompetitionSchedule(competition)" :href="competition.coach_competition_schedule_link">
                                                                    Competition Schedule (Coach)
                                                                </a>
                                                                <p class="nav-list__error" v-if="coach_competition_schedule_error">
                                                                    The schedule has not been posted yet.
                                                                </p>
                                                            </li>
                                                            <li v-if="is_coach">
                                                                <a v-on:click.prevent="openCoachSchedule(competition)" :href="competition.coach_schedule_link">
                                                                    Coach Schedule
                                                                </a>
                                                                <p class="nav-list__error" v-if="coach_schedule_error">
                                                                    The schedule has not been posted yet.
                                                                </p>
                                                            </li>
                                                            <li>
                                                                <a :href="competition.information_link">Competition
                                                                    Information
                                                                </a>
                                                            </li>
                                                            <li v-if="is_skater">
                                                                <a v-on:click.prevent="openPracticeIce(competition)" :href="competition.practice_ice_link">
                                                                    Practice Ice / Schedule
                                                                </a>
                                                                <p class="nav-list__error" v-if="practice_ice_error">
                                                                    Practice Ice sales have not started
                                                                    yet.
                                                                </p>
                                                            </li>
                                                            <li v-if="is_skater">
                                                                <a :href="competition.music_and_ppc_link">Music &amp;
                                                                    PPC
                                                                </a>
                                                            </li>
                                                            <li v-if="is_skater">
                                                                <a :href="competition.my_coaches_link">My Coaches</a>
                                                            </li>
                                                            <li v-if="is_coach">
                                                                <a :href="competition.my_skaters_link">My Skaters</a>
                                                            </li>
                                                            <li>
                                                                <a :href="competition.contacts_link">Competition
                                                                    Contacts
                                                                </a>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </accordion>
                                            </div>
                                            <div v-else-if="!loaded">Loading...</div>
                                            <div v-else>
                                                <p>You are not registered for any competitions at this time.</p>
                                                <a href="#" class="standard-link" target="_blank" rel="noopener">
                                                    Register on EMS Desktop Site
                                                </a>
                                            </div>
                                        </competition-list>
                                    </div>
                                </tab>
                            </tabs>
                        </div>
                        <div class="site-menu__footer">
                            <!-- @integration - this will need to be replaced with a similar call in the proper backend framework.  Alternatively, the contents from the linked file can be pasted here. -->
                            <?php include( __DIR__ . '/footer.php' ); ?>
                        </div>
                    </div>
                </div>
            </nav>
        </transition>
    </header>
</site-header>