import 'es6-promise/auto';
import Vue from "vue";
/**
 * Page Components
 */
import CompetitionRegistrationIndex from "./pages/CompetitionRegistration/CompetitionRegistrationIndex.vue";
import CompetitionRegistrationOverview from "./pages/CompetitionRegistration/CompetitionRegistrationOverview.vue";
import CompetitionRegistrationSkaterProfile
    from "./pages/CompetitionRegistration/CompetitionRegistrationSkaterProfile.vue";
import CompetitionRegistrationSkateTests from "./pages/CompetitionRegistration/CompetitionRegistrationSkateTests.vue";
import CompetitionRegistrationPartnerEvents
    from "./pages/CompetitionRegistration/CompetitionRegistrationPartnerEvents.vue";
import CompetitionRegistrationPartnerIdentification
    from "./pages/CompetitionRegistration/CompetitionRegistrationPartnerIdentification.vue";
import CompetitionRegistrationEventSelection
    from "./pages/CompetitionRegistration/CompetitionRegistrationEventSelection.vue";
import CompetitionRegistrationCoachInformation
    from "./pages/CompetitionRegistration/CompetitionRegistrationCoachInformation.vue";
import CompetitionRegistrationWaivers from "./pages/CompetitionRegistration/CompetitionRegistrationWaivers.vue";
/**
 * Abstract Components
 */
import SkateTestHistory from "./components/SkateTestHistory/SkateTestHistory.vue";
import DateInput from "./components/DateInput.vue";
import CompetitionRegistrationProgress from "./components/CompetitionRegistration/CompetitionRegistrationProgress.vue";
import SkateTestDisciplineForm from "./components/SkateTestEquivalency/DisciplineForm.vue";
import EventRequirementsOverlay from "./components/CompetitionRegistration/EventRequirementsOverlay.vue";
/**
 * State Management
 */
import store from "./store";
import {CompetitionRegistrationState} from "./store/CompetitionRegistration/CompetitionRegistrationState";
import {FormOptionsState} from "./store/Modules/FormOptionsState";

/**
 * Pages
 */
Vue.component('competition-registration-index', CompetitionRegistrationIndex);
Vue.component('competition-registration-overview', CompetitionRegistrationOverview);
Vue.component('competition-registration-skater-profile', CompetitionRegistrationSkaterProfile);
Vue.component('competition-registration-skate-tests', CompetitionRegistrationSkateTests);
Vue.component('competition-registration-partner-events', CompetitionRegistrationPartnerEvents);
Vue.component('competition-registration-partner-identification', CompetitionRegistrationPartnerIdentification);
Vue.component('competition-registration-event-selection', CompetitionRegistrationEventSelection);
Vue.component('competition-registration-coach-information', CompetitionRegistrationCoachInformation);
Vue.component('competition-registration-waivers', CompetitionRegistrationWaivers);

/**
 * Components
 */
Vue.component('skate-test-history', SkateTestHistory);
Vue.component('date-input', DateInput);
Vue.component('competition-registration-progress', CompetitionRegistrationProgress);

Vue.component('skate-test-discipline-form', SkateTestDisciplineForm);
Vue.component('event-requirements-overlay', EventRequirementsOverlay);
/**
 * State
 */
store.registerModule('competition_registration', CompetitionRegistrationState);
store.registerModule('form_options', FormOptionsState);