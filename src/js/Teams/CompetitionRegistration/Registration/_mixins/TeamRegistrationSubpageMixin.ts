import Vue from 'vue';
import {PageComponentHeaderConfiguration} from '../../../../contracts/AppContracts';
import {TeamRegistration} from '../_contracts';

export default Vue.extend({
    props: {
        /**
         * Configuration for the back link
         */
        back_link_config: {
            type: Object as () => TeamRegistration.RegistrationSubpageBackLinkConfig,
            required: true
        },
        hide_retreat: {
            type: Boolean,
            default: false
        }
    },
    /**
     * Reactive data
     */
    data: function () {
        return {
            page_title: ''
        };
    },
    computed: {
        /**
         * Whether the advance button should be disabled
         */
        advance_disabled: function (): boolean {
            return false;
        },
        /**
         * Configuration for the page header
         */
        page_header: function (): PageComponentHeaderConfiguration {
            return {
                title: this.page_title,
                ...this.back_link_config
            };
        }
    },
    methods: {
        /**
         * Advance in the process
         */
        advance: function (): void {
            if (this.advance_disabled) {
                return;
            }
            this.$emit('advance');
        },
        /**
         * Retreat in the process
         */
        retreat: function (): void {
            this.$emit('retreat');
        }
    }
});