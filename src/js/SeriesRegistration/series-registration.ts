import SeriesRegistrationIndexPage from './_pages/SeriesRegistrationIndexPage.vue';
import SeriesRegistrationSelectTeamPage from './_pages/SeriesRegistrationSelectTeamPage.vue';
import SeriesApplicationPage from './SeriesApplication/_pages/SeriesApplicationPage.vue';
import SeriesOverviewPage from './SeriesOverview/_pages/SeriesOverviewPage.vue';
import SeriesStandingsPage from './SeriesStandings/_pages/SeriesStandingsPage.vue';
import SeriesRegistrationEligibilityConfirmation from './_components/SeriesRegistrationEligibilityConfirmation.vue';
import SeriesPageHeader from './_components/SeriesPageHeader.vue';
import Vue from 'vue';

/**
 * Components
 */
Vue.component('series-page-header', SeriesPageHeader);
Vue.component('series-registration-eligibility-confirmation', SeriesRegistrationEligibilityConfirmation);
/**
 * Pages
 */
Vue.component('series-registration-index-page', SeriesRegistrationIndexPage);
Vue.component('series-registration-select-team-page', SeriesRegistrationSelectTeamPage);
Vue.component('series-registration-application-page', SeriesApplicationPage);
Vue.component('series-registration-overview-page', SeriesOverviewPage);
Vue.component('series-standings-page', SeriesStandingsPage);