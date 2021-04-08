import {CompetitionPortalPageHeading, DataNavigationLink} from './_components';
import {
    CompetitionContacts,
    CompetitionDocumentsPage,
    CompetitionInformation,
    CompetitionRosterPage,
    CompetitionTeamPersonnelPage,
    MySchedule,
    MySkaters,
    MyTeamsPage,
    SelectCompetitionEntityPage
} from './_pages';
import Vue from 'vue';

Vue.component('competition-portal-page-heading', CompetitionPortalPageHeading);
Vue.component('competition-contacts', CompetitionContacts);
Vue.component('competition-documents-page', CompetitionDocumentsPage);
Vue.component('competition-information', CompetitionInformation);
Vue.component('competition-roster-page', CompetitionRosterPage);
Vue.component('competition-team-personnel-page', CompetitionTeamPersonnelPage);
Vue.component('my-schedule', MySchedule);
Vue.component('my-skaters', MySkaters);
Vue.component('my-teams-page', MyTeamsPage);
Vue.component('select-competition-entity-page', SelectCompetitionEntityPage);
Vue.component('data-navigation-link', DataNavigationLink);

import './Volunteers/bootstrap';