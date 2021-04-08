<template>
    <div class="series-registration-index-page">
        <page :header="page_header">
            <component-loader v-if="!component_loaded"
                              slot="loader"
                              :container="true"
                              :source="this"
                              error_message="Error loading series information."></component-loader>
            <div v-else
                 class="series-registration-index-page__content">
                <div class="grid-container">
                    <div v-if="series_list.length"
                         class="panel-link-group">
                        <a v-for="series in series_list"
                           :key="series.id"
                           :href="series.overview_link"
                           class="panel-link">
                            <div class="panel-link__content">
                                <div class="series-summary">
                                    <div class="series-summary__icon">
                                        <img :alt="`Series icon for ${series.name}`"
                                             :src="series.icon">
                                    </div>
                                    <div class="series-summary__details">
                                        <p class="series-summary__primary">{{series.name}}</p>
                                        <p class="series-summary__secondary">
                                            Application Deadline: {{series.application_deadline_date_formatted}}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </a>
                    </div>
                    <p v-else
                       class="alert">
                        No series are available at this time.
                    </p>
                </div>
            </div>
        </page>
    </div>
</template>
<script lang="ts">
    import mixins from 'vue-typed-mixins';
    import HasDataDependencies from '../../mixins/HasDataDependencies';
    import {PageComponentHeaderConfiguration} from '../../contracts/AppContracts';
    import {SeriesRegistrationState} from '../_store/SeriesRegistrationState';
    import {SeriesRegistrationIndexSeries} from '../_contracts/SeriesRegistrationContracts';

    const vueClass = mixins(HasDataDependencies);
    // @vue/component
    export default vueClass.extend({
        props: {
            /**
             * The back link url to display in the page header
             */
            back_link: {
                type: String,
                required: false
            },
            /**
             * The label for the back link in the page header
             */
            back_link_label: {
                type: String,
                required: false
            }
        },
        /**
         * Reactive Data
         */
        data: function () {
            return {
                /**
                 * Data dependencies required for component
                 */
                dependencies: {
                    series_list: false
                }
            };
        },
        computed: {
            /**
             * The configuration for the page header
             */
            page_header: function (): PageComponentHeaderConfiguration {
                const title = 'Series Information';

                return {
                    title,
                    back_link: this.back_link,
                    back_link_label: this.back_link_label
                };
            },
            /**
             * The list of series items to display in the page
             */
            series_list: function (): SeriesRegistrationIndexSeries[] {
                return this.$store.state.series_registration.series_list;
            }
        },
        /**
         * Before component created, ensure skater series state module is registered
         */
        beforeCreate: function (): void {
            if (typeof this.$store.state.series_registration === 'undefined') {
                this.$store.registerModule('series_registration', SeriesRegistrationState);
            }
        },
        methods: {
            /**
             * Load data dependencies
             */
            loadData: function () {
                return new Promise((resolve, reject) => {
                    this.$store.dispatch('series_registration/fetchSeriesList')
                        .then(() => {
                            this.dependencies.series_list = true;
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