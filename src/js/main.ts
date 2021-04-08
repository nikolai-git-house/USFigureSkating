/* eslint-disable no-new, no-alert */
import './bootstrap';
import ScrollHelpers from './helpers/scroll';
import SiteHeader from './components/SiteHeader.vue';
import Vue from 'vue';
import store from './store';

new Vue({
    el: '#app',
    store,
    components: {
        SiteHeader
    },
    /**
     * Upon creation...
     * Get competition list
     * Get Cart
     * Parse and set active competition id
     * Get user information
     */
    created: function () {
        this.$store.dispatch('competitions/fetchCompetitionList')
            .catch(function () {
                alert('Error loading competition list');
            });
        this.$store.dispatch('cart/fetchCart')
            .catch(function () {
                alert('Error loading cart');
            });

        /**
         * @integration:
         * currently, the competition service detects the active competition via URL parameters on load.
         *
         * This will need to change.  The ".setActive" method can be called from anywhere
         */
        const url_split = location.href.split('?id=');
        if (url_split.length == 2) {
            this.$store.commit('competitions/setActiveID', url_split[1]);
        }

        this.$store.dispatch('user/fetchUserInfo')
            .catch(function () {
                alert('Error loading user info');
            });
    },
    methods: {
        /**
         * Get the document top scroll position
         */
        getCurrentScroll: function (): number {
            return ScrollHelpers.getRootScrollingElement().scrollTop;
        },
        /**
         * Reset the document scroll position to the top
         */
        resetScroll: function () {
            this.scrollTo(0);
        },
        /**
         * Set the document scroll position
         */
        scrollTo: function (position: number) {
            ScrollHelpers.getRootScrollingElement().scrollTop = position;
        }
    }
});