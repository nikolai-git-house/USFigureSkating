import {SiteOverlayComponent} from './../components/SiteOverlay.vue';
import Vue from 'vue';
/* ===========================================================================================================
*                                              SEARCH MIXIN
* Generic functionality for parent search component that wraps a form and results
* ===========================================================================================================*/
export default Vue.extend({
    /**
     * Reactive data
     */
    data: function () {
        return {
            /**
             * Whether search results are active, localized to component
             */
            local_results_active: false
        };
    },
    computed: {
        /**
         * Whether results are active.
         * Computed property to enable state integration within extending components
         */
        results_active: {
            /**
             * Get the value
             */
            get: function (): boolean {
                return this.local_results_active;
            },
            /**
             * Set the value
             */
            set: function (value: boolean) {
                this.local_results_active = value;
            }
        },
        /**
         * Whether to show the search form
         */
        show_form: function (): boolean {
            return !this.results_active;
        },
        /**
         * Whether to show the results
         */
        show_results: function (): boolean {
            return this.results_active;
        }
    },
    watch: {
        /**
         * When active screen changes, show the new page from the top
         */
        results_active: function () {
            this.scrollParentTop();
        }
    },
    methods: {
        /**
         * Reopen the search form and close the results
         */
        editSearch: function () {
            this.results_active = false;
        },
        /**
         * Handle reported search success event
         */
        handleSearchSuccess: function () {
            this.openResults();
        },
        /**
         * Close form and open search results
         */
        openResults: function () {
            this.results_active = true;
        },
        /**
         * Scroll the page to the top
         */
        scrollParentTop: function () {
            const parent: SiteOverlayComponent = this.$parent as SiteOverlayComponent;
            if (parent && typeof parent.scrollTop === 'function') {
                parent.scrollTop();
            }
        }
    }
});