import Vue from 'vue';
import {
    BackLinkConfiguration,
    PageComponentHeaderBackLinkConfiguration,
    PageComponentHeaderConfiguration
} from '../../contracts/AppContracts';
import {CompetitionPortalPageHeadingBinding} from '../_components/_contracts';

export default Vue.extend({
    /**
     * Reactive data
     */
    data: function () {
        return {
            /**
             * Title to display for the page in the header block
             */
            page_title: ''
        };
    },
    computed: {
        /**
         * The configuration for the back link in the header
         */
        back_link: function (): PageComponentHeaderBackLinkConfiguration {
            const back_link_configuration: BackLinkConfiguration | null = this.$store.state.app.active_page_back_link;
            if (back_link_configuration) {
                return {
                    back_link: back_link_configuration.url,
                    back_link_label: back_link_configuration.label
                };
            }

            return {};
        },
        /**
         * Binding for portal page header
         */
        competition_portal_heading_binding: function (): CompetitionPortalPageHeadingBinding | null {
            return this.$store.getters['competition_portal/competition_portal_heading_binding'];
        },
        /**
         * Configuration for page header sub-component
         */
        page_header: function (): PageComponentHeaderConfiguration {
            return {
                ...this.back_link,
                title: this.page_title
            };
        }
    }
});