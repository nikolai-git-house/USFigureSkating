import 'es6-promise/auto';
import "./vendor/modernizr.custom";
import Vue from "vue";
import CreateAccountComponent from "./pages/CreateAccount/CreateAccount.vue";
import StepsIndicator from "./components/StepsIndicator.vue";
import Popup from "./components/PopUp.vue";
import DateInput from "./components/DateInput.vue"
import axios from "axios";
import store from './store/CreateAccount';

Vue.component('popup', Popup);
Vue.component('date-input', DateInput);
Vue.component('steps-indicator', StepsIndicator);

axios.defaults.headers.common = {
    "X-Requested-With": "XMLHttpRequest",
};

new Vue({
    el: "#app",
    store,
    components: {
        'create-account': CreateAccountComponent,
    }
});