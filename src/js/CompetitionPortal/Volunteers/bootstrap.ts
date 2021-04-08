import Vue from 'vue';
import {MyVolunteerSchedulePage, VolunteerShiftSelectionPage} from './_pages';
import VolunteerPageKey from './_pages/_partials/VolunteerPageKey.vue';

Vue.component('volunteer-page-key', VolunteerPageKey);
Vue.component('my-volunteer-schedule-page', MyVolunteerSchedulePage);
Vue.component('volunteer-shift-selection-page', VolunteerShiftSelectionPage);