/* eslint-disable */
import 'es6-promise/auto';
import "./vendor/modernizr.custom";

import Vue from "vue";
import Tab from "./components/Tab.vue"
import Tabs from "./components/Tabs.vue"
import Accordion from "./components/Accordion.vue"
import AccordionStatusTrigger from "./components/AccordionStatusTrigger.vue"
import PageAlert from "./components/PageAlert.vue"
import PopUp from "./components/PopUp.vue"
import IncrementInput from "./components/IncrementInput.vue"
import DateInputExtended from "./components/DateInputExtended/DateInputExtended.vue"
import {NumberInput} from "./directives/NumberInput"
import "./directives/SiteTakeover"
import CreditCartInput from "./components/CreditCardInput.vue"
import MusicPlayer from "./components/MusicPlayer.vue"
import SiteOverlay from "./components/SiteOverlay.vue"
import SiteTakeover from "./components/SiteTakeover.vue"
import CompetitionList from "./components/CompetitionList.vue"
import CompetitionDetail from "./components/CompetitionDetail.vue"
import CartItemComponent from "./components/CartItemComponent.vue"
import Pagination from "./components/Pagination.vue"
import AnimatedCheckIcon from './components/AnimatedIcons/AnimatedCheckIcon.vue';
import AnimatedSavingIcon from './components/AnimatedIcons/AnimatedSavingIcon.vue';
import CheckoutPage from "./pages/Checkout/CheckoutPage.vue"
import CartReview from "./pages/CartReview.vue"
import MyCoaches from "./pages/MyCoaches/MyCoaches.vue"
import PracticeIceSchedule from "./pages/PracticeIce/PracticeIceSchedule.vue"
import CoachCompetitionSchedule from "./pages/CoachCompetitionSchedule.vue"
import SearchCompetitions from "./pages/SearchCompetitions/SearchCompetitions.vue";
import ViewCompetition from "./pages/ViewCompetition/ViewCompetition.vue";
import CompetitionSchedule from './CompetitionSchedule/CompetitionSchedule.vue';
import PracticeIceCredits from "./components/PracticeIceCredits.vue"
import PracticeIceFooter from "./components/PracticeIceFooter.vue";
import StandardSession from "./components/StandardSession.vue";
import ExtendedSession from "./components/ExtendedSession.vue";
import CartOverview from "./components/CartOverview.vue";
import CartSummary from "./components/CartSummary.vue";
import CartStatus from "./components/CartStatus.vue";
import CompetitionHeading from "./components/CompetitionHeading.vue";
import PageEntityHeader from "./components/PageEntityHeader.vue";
import PracticeIcePrePurchase from "./pages/PracticeIce/PracticeIcePrePurchase.vue";
import MusicAndPPC from "./pages/MusicAndPPC.vue";
import EMSHome from "./pages/EMSHome.vue";
import EMSSupport from "./pages/EMSSupport.vue";
import SupportDocuments from "./pages/SupportDocuments.vue";
import VolunteerOpportunities from "./pages/VolunteerOpportunities.vue";
import {MyCompetitionsTeamsPage} from './Teams/_pages';
import MemberCategoryAssignment from "./components/MemberCategoryAssignment.vue";
import MemberSearch from "./components/MemberSearch/MemberSearch.vue";
import CompetitionFilter from "./components/CompetitionFilter/CompetitionFilter.vue";
import CompetitionRegistrationCta
    from './components/CompetitionRegistration/CompetitionRegistrationRegistrationCta.vue';
import ComponentLoader
    from './components/ComponentLoader.vue';
import ParentedCheckboxGroup from './components/ParentedCheckboxGroup.vue';
import Carousel from './components/Carousel.vue';
import CompetitionUserNavigation from './components/CompetitionUserNavigation/CompetitionUserNavigation.vue';
import AddressFormFields from './components/Forms/partials/AddressFormFields.vue';
import CompetitionTile from "./components/CompetitionTile/CompetitionTile.vue";
import Page from "./components/Page.vue";
import ConfirmActionOverlay from './components/ConfirmActionOverlay.vue';
import AppNotice from './components/AppNotice.vue';
import SavingConfirmationOverlay from './components/SavingConfirmationOverlay.vue';
import StatusSummary from './components/StatusSummary.vue';
import StatusEntityCard from './components/StatusEntityCard.vue';
import Waivers from './components/Waivers.vue';
import FilterTakeover from './components/FilterTakeover/FilterTakeover.vue';
import AccordionMultiselect from './components/AccordionMultiselect/AccordionMultiselect.vue';
import StatusClassFilter from './filters/StatusClassFilter';
import LinkFilters from './filters/LinkFilters';
import axios from "axios";

Vue.component('tab', Tab);
Vue.component('page', Page);
Vue.component('tabs', Tabs);
Vue.component('accordion', Accordion);
Vue.component('accordion-status-trigger', AccordionStatusTrigger);
Vue.component('page-alert', PageAlert);
Vue.component('popup', PopUp);
Vue.component('increment-input', IncrementInput);
Vue.component('date-input-extended', DateInputExtended);
Vue.directive('number-input', NumberInput);
Vue.component('credit-card-input', CreditCartInput);
Vue.component('music-player', MusicPlayer);
Vue.component('site-overlay', SiteOverlay);
Vue.component('site-takeover', SiteTakeover);
Vue.component('competition-list', CompetitionList);
Vue.component('competition-detail', CompetitionDetail);
Vue.component('standard-session', StandardSession);
Vue.component('extended-session', ExtendedSession);
Vue.component('practice-ice-schedule', PracticeIceSchedule);
Vue.component('coach-competition-schedule', CoachCompetitionSchedule);
Vue.component('cart-item', CartItemComponent);
Vue.component('cart-overview', CartOverview);
Vue.component('cart-summary', CartSummary);
Vue.component('checkout-page', CheckoutPage);
Vue.component('cart-review', CartReview);
Vue.component('cart-status', CartStatus);
Vue.component('practice-ice-credits', PracticeIceCredits);
Vue.component('practice-ice-footer', PracticeIceFooter);
Vue.component('practice-ice-pre-purchase', PracticeIcePrePurchase);
Vue.component('my-coaches', MyCoaches);
Vue.component('music-and-ppc', MusicAndPPC);
Vue.component('competition-heading', CompetitionHeading);
Vue.component('page-entity-header', PageEntityHeader);
Vue.component('ems-support', EMSSupport);
Vue.component('ems-home', EMSHome);
Vue.component('support-documents', SupportDocuments);
Vue.component('volunteer-opportunities', VolunteerOpportunities);
Vue.component('pagination', Pagination);
Vue.component('member-category-assignment', MemberCategoryAssignment);
Vue.component('member-search', MemberSearch);
Vue.component('search-competitions', SearchCompetitions);
Vue.component('competition-filter', CompetitionFilter);
Vue.component('competition-registration-cta', CompetitionRegistrationCta);
Vue.component('view-competition', ViewCompetition);
Vue.component('component-loader', ComponentLoader);
Vue.component('parented-checkbox-group', ParentedCheckboxGroup);
Vue.component('carousel', Carousel);
Vue.component('competition-schedule', CompetitionSchedule);
Vue.component('competition-user-navigation', CompetitionUserNavigation);
Vue.component('address-form-fields', AddressFormFields);
Vue.component('competition-tile', CompetitionTile);
Vue.component('confirm-action-overlay', ConfirmActionOverlay);
Vue.component('app-notice', AppNotice);
Vue.component('animated-check-icon', AnimatedCheckIcon);
Vue.component('animated-saving-icon', AnimatedSavingIcon);
Vue.component('saving-confirmation-overlay', SavingConfirmationOverlay);
Vue.component('my-competitions-teams-page', MyCompetitionsTeamsPage);
Vue.component('status-summary', StatusSummary);
Vue.component('status-entity-card', StatusEntityCard);
Vue.component('waivers', Waivers);
Vue.component('filter-takeover', FilterTakeover);
Vue.component('accordion-multiselect', AccordionMultiselect);

Vue.filter('status_class', StatusClassFilter);
Vue.filter('link_target', LinkFilters.target);
Vue.filter('link_rel', LinkFilters.rel)

import './CompetitionPortal/bootstrap';

axios.defaults.headers.common = {
    "X-Requested-With": "XMLHttpRequest",
};