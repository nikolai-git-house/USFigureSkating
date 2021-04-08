import Vue from 'vue';
import TeamRegistration from './TeamRegistration.vue';
import {
    TeamRegistrationHeader,
    TeamRegistrationPageNavigation,
    TeamRegistrationProgressBar,
    TeamRegistrationRosterReviewList,
    TeamRegistrationRosterSummary,
    TotalMemberCost
} from './_components';

Vue.component('team-registration', TeamRegistration);
Vue.component('team-registration-header', TeamRegistrationHeader);
Vue.component('team-registration-progress-bar', TeamRegistrationProgressBar);
Vue.component('team-registration-page-navigation', TeamRegistrationPageNavigation);
Vue.component('team-registration-roster-summary', TeamRegistrationRosterSummary);
Vue.component('total-member-cost', TotalMemberCost);
Vue.component('team-registration-roster-review-list', TeamRegistrationRosterReviewList);