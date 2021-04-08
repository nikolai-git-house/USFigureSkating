<script lang="ts">
    import mixins from 'vue-typed-mixins';
    import HasDataDependencies from '../../mixins/HasDataDependencies';
    import {CompetitionPortalPageMixin} from '../../CompetitionPortal/_mixins';
    import {PageComponentHeaderConfiguration} from '../../contracts/AppContracts';
    import {CompetitionPortalPracticeIceState} from '../../CompetitionPortal/_store/CompetitionPortalPracticeIceState';

    const vueClass = mixins(HasDataDependencies, CompetitionPortalPageMixin);
    // @vue/component
    export default vueClass.extend({
        /**
         * Reactive data
         */
        data: function () {
            return {
                /**
                 * Data dependencies for component to load
                 */
                dependencies: {
                    screen_data: false
                },
                /**
                 * Title to display for the page in the header block
                 */
                page_title: 'Practice Ice'
            };
        },
        computed: {
            /**
             * Override for page component header binding
             */
            page_header_override: function (): PageComponentHeaderConfiguration {
                return {
                    ...this.page_header,
                    subtitle: 'Pre-Purchase Sales'
                };
            },
            /**
             * Whether practice ice pre-purchase is available
             */
            is_available: function () {
                return this.$store.getters['competitions/active_sales_window'] === 'pre_purchase';
            }
        },
        /**
         * Before component created, register necessary state module
         */
        beforeCreate: function () {
            if (!this.$store.state.competition_portal.practice_ice) {
                this.$store.registerModule(['competition_portal', 'practice_ice'], CompetitionPortalPracticeIceState);
            }
        },
        methods: {
            /**
             * Load data necessary for the page to function
             */
            loadData: function (): Promise<void> {
                return new Promise((resolve, reject) => {
                    this.$store.dispatch('competition_portal/practice_ice/fetchPrePurchase')
                        .then(() => {
                            this.dependencies.screen_data = true;
                            resolve();
                        })
                        .catch(() => {
                            reject();
                        });
                });
            }
        }
    });
</script>