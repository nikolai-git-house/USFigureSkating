import Vue from 'vue';
import store from '../../store/index';
import CompetitionManagementCompetitionSummary from './_components/CompetitionManagementCompetitionSummary.vue';
import CompetitionManagementCompliancePositionFilters
    from './_components/CompetitionManagementCompliancePositionFilters.vue';
import CompetitionManagementCompetition from './_pages/CompetitionManagementCompetition.vue';
import CompetitionManagementCompetitionIndex from './_pages/CompetitionManagementCompetitionIndex.vue';
import CompetitionManagementCompetitionInformation from './_pages/CompetitionManagementCompetitionInformation.vue';
import CompetitionManagementIndex from './_pages/CompetitionManagementIndex.vue';
import {CompetitionManagementState} from './_store/CompetitionManagementState';
import CompetitionManagementCompliance
    from './CompetitionManagementCompliance/_pages/CompetitionManagementCompliance.vue';
import CompetitionManagementContacts from './CompetitionManagementContacts/_pages/CompetitionManagementContacts.vue';

Vue.component('competition-management-competition-contacts', CompetitionManagementContacts);
Vue.component('competition-management-competition-index', CompetitionManagementCompetitionIndex);
Vue.component('competition-management-competition', CompetitionManagementCompetition);
Vue.component('competition-management-competition-information', CompetitionManagementCompetitionInformation);
Vue.component('competition-management-competition-summary', CompetitionManagementCompetitionSummary);
Vue.component('competition-management-compliance', CompetitionManagementCompliance);
Vue.component('competition-management-compliance-position-filters', CompetitionManagementCompliancePositionFilters);
Vue.component('competition-management-index', CompetitionManagementIndex);

store.registerModule('competition_management', CompetitionManagementState);