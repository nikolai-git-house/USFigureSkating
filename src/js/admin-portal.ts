import 'es6-promise/auto';
import Vue from 'vue';
import AnimatedEmailIcon from './AdminPortal/_components/AnimatedEmailIcon.vue';
import FileSelect from './AdminPortal/_components/FileSelect.vue';
import EntityComplianceRequirementsSummary from './AdminPortal/_components/EntityComplianceRequirementsSummary.vue';
/**
 * Load and Register Check-In
 */
import './AdminPortal/CheckIn/check-in';
import './AdminPortal/CompetitionManagement/competition-management';

import EmailForm from './AdminPortal/EmailForm/EmailForm.vue';
import EmailOverlay from './AdminPortal/_components/EmailOverlay.vue';

/**
 * Global Components
 */
Vue.component('animated-email-icon', AnimatedEmailIcon);
Vue.component('email-form', EmailForm);
Vue.component('email-overlay', EmailOverlay);
Vue.component('file-select', FileSelect);
Vue.component('entity-compliance-requirements-summary', EntityComplianceRequirementsSummary);