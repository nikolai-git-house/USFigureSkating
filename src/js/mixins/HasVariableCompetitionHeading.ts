import Vue from 'vue';
import {CompetitionHeadingSource} from '../contracts/AppContracts';

/**
 * Mixin for pages with a competition heading, where the competition for the page may not be in the user's competition list
 *
 * Designed to work within context of HasDataDependencies mixin
 */
export default Vue.extend({
    /**
     * Reactive data
     */
    data: function () {
        return {
            /**
             * Whether the load method for the competition heading has been called.
             *
             * Used to prevent multiple calls to load method
             */
            competition_heading_load_called: false,
            /**
             * Add data dependencies to HasDataDependencies mixin configuration
             */
            dependencies: {
                competition_heading: false
            },
            /**
             * Whether there was an error loading component dependencies
             *
             * Local HasDataDependencies mixin property override
             */
            load_error: false
        };
    },
    computed: {
        /**
         * The active competition ID in state
         */
        active_competition_id: function (): number {
            return this.$store.state.competitions.active_competition_id;
        },
        /**
         * Whether app state is ready to load competition heading
         *
         * Once user competition list and active competition ID are set and heading load method hasn't been called
         */
        competition_heading_load_ready: function (): boolean {
            return this.$store.state.competitions.competitions_loaded
                && this.active_competition_id !== -1
                && this.competition_heading_load_called === false;
        },
        /**
         * Data to override Competition Heading
         */
        competition_heading_source: function (): CompetitionHeadingSource | null {
            return this.$store.getters['competitions/active_competition_heading'];
        }
    },
    watch: {
        /**
         * Once competition heading becomes load ready, run load method
         */
        competition_heading_load_ready: function (value: boolean, oldValue: boolean) {
            if (value === true && oldValue === false) {
                this.loadCompetitionHeading();
            }
        }
    },
    methods: {
        /**
         * Load data for competition heading.
         *
         * Runs after User's competition list has loaded.
         *
         * 1. If heading source is present (from competition in user's list), exit early.
         * 2. Otherwise, dispatch action to load competition heading data
         */
        loadCompetitionHeading: function () {
            this.competition_heading_load_called = true;

            return new Promise((resolve, reject) => {
                if (this.competition_heading_source) {
                    this.dependencies.competition_heading = true;
                    resolve();

                    return;
                }
                this.$store.dispatch('competitions/fetchCompetitionPageHeading', this.active_competition_id)
                    .then(() => {
                        this.dependencies.competition_heading = true;
                        resolve();
                    })
                    .catch(() => {
                        this.load_error = true;
                        reject();
                    });
            });
        }
    }
});