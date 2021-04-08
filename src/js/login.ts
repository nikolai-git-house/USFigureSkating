import 'es6-promise/auto';
import "./vendor/modernizr.custom";
import Vue from "vue";
import PasswordReset from "./components/PasswordReset.vue"
import SiteOverlay from "./components/SiteOverlay.vue"
import LoginForm from "./components/LoginForm.vue"
import axios from "axios";

Vue.component('password-reset', PasswordReset);
Vue.component('site-overlay', SiteOverlay);
Vue.component('login-form', LoginForm);
axios.defaults.headers.common = {
    "X-Requested-With": "XMLHttpRequest",
};

new Vue({
    el: "#app"
});