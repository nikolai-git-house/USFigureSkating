<script lang="ts">
    import {CompetitionPrices, PriceRow} from "../../contracts/app/CompetitionRegistrationContracts";
    import HasDataDependencies from "../../mixins/HasDataDependencies";
    import HasCompetitionRegistrationCompetitionMixin from "../../mixins/HasCompetitionRegistrationCompetitionMixin"
    import mixins from 'vue-typed-mixins'

    export default mixins(HasDataDependencies, HasCompetitionRegistrationCompetitionMixin).extend({
        props: {
            /**
             * Url to return to when user clicks "back" button
             */
            back_url: {
                type: String,
                required: true
            }
        },
        data: function () {
            return {
                /**
                 * data needed for component to function
                 */
                dependencies: {
                    competition: false,
                    prices: false
                },
                screenData: {
                    /**
                     * Whether the user has clicked the confirm checkbox
                     */
                    confirmed: false
                }
            }
        },
        methods: {
            /**
             * Load data needed for component to function
             */
            loadData: function () {
                return new Promise((resolve, reject) => {
                    let promises: Promise<void>[] = [
                        this.$store.dispatch('competition_registration/fetchCompetitionOverviewScreenData').then(() => {
                            this.dependencies.prices = true;
                            this.dependencies.competition = true;
                        }).catch(() => {
                            reject();
                        })
                    ];
                    Promise.all(promises).then(() => {
                        resolve();
                    })
                });
            },
            /**
             * Display formatting for a price
             */
            priceDisplay: function (price: number | null): string {
                if (price == null) {
                    return "";
                }
                return "$" + price;
            },
            /**
             * Whether to show a notice about lack of prices for a particular category
             */
            showPriceNotice: function (price_set: PriceRow): boolean {
                for (let i in price_set) {
                    if (i === 'category') {
                        continue;
                    }
                    if (price_set[i] !== null) {
                        return false;
                    }
                }
                return true;
            },
            advance: function () {
                if (this.block_continue) {
                    return;
                }
                location.assign(this.competition.registration_links.profile);
            },
            retreat: function () {
                location.assign(this.back_url);
            }
        },
        computed: {
            /**
             * Information to show in the information tray
             */
            registration_information: function (): string[] {
                return this.active_competition.information.overview
            },
            /**
             * The prices for display
             */
            prices: function (): CompetitionPrices {
                return this.$store.getters['competition_registration/active_prices'];
            },
            /**
             * Whether advancing should be blocked
             */
            block_continue: function () {
                return !this.screenData.confirmed;
            }
        }
    });
</script>