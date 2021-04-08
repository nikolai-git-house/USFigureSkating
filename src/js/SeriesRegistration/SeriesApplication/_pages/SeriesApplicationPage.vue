<template>
    <div class="series-registration-application-page">
        <page :header="page_header"
              :class="{'page--accent':component_loaded}">
            <series-page-header v-if="component_loaded"
                                slot="pre-header"
                                :series="series"></series-page-header>
            <component-loader v-if="!component_loaded"
                              slot="loader"
                              :container="true"
                              :source="this"
                              error_message="Error loading series application."></component-loader>
            <div v-else
                 class="series-registration-application-page__content">
                <div class="series-registration-application-page__tabs page--accent__standard-content">
                    <div class="tabs tabs--justified tabs--equal tabs--reduced">
                        <div class="tabs__triggers">
                            <ul class="tabs__list">
                                <li class="tabs__item">
                                    <a href="#series-registration-application-page-tab-body"
                                       class="tabs__trigger"
                                       :class="{'active':active_view==='profile'}"
                                       v-on:click.prevent="selectActiveView('profile')">
                                        Profile
                                    </a>
                                </li>
                                <li class="tabs__item">
                                    <a href="#series-registration-application-page-tab-body"
                                       class="tabs__trigger"
                                       :class="{'active':active_view==='levels'}"
                                       v-on:click.prevent="selectActiveView('levels')">
                                        Levels
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div id="series-registration-application-page-tab-body"
                     class="page__accent-content">
                    <div class="grid-container">
                        <component :is="profile_component"
                                   v-if="isActiveView('profile')"></component>
                        <div v-if="isActiveView('profile')"
                             class="series-registration-application-page__continue">
                            <button class="button button--primary button--block button--large"
                                    v-on:click.prevent="selectActiveView('levels', true)">
                                Continue
                            </button>
                        </div>
                        <application v-if="isActiveView('levels')"></application>
                    </div>
                </div>
            </div>
        </page>
    </div>
</template>
<script lang="ts">
    import mixins from 'vue-typed-mixins';
    import HasDataDependencies from '../../../mixins/HasDataDependencies';
    import {
        AppNoticeStatePayload,
        AppRootInterface,
        PageComponentHeaderConfiguration
    } from '../../../contracts/AppContracts';
    import {SeriesRegistrationState} from '../../_store/SeriesRegistrationState';
    import Application from './_partials/SeriesApplicationApplication.vue';
    import Profile from './_partials/SeriesApplicationProfile.vue';
    import TeamProfile from './_partials/SeriesApplicationTeamProfile.vue';
    import {SkateTestHistoryState} from '../../../store/Modules/SkateTestHistoryState';
    import {SaveSkateTestActionPayload, SkateTestRemoveAppPayload} from '../../../contracts/app/SkateTestContracts';
    import {SeriesApplication} from '../_contracts';
    import SeriesApplicationCitizenshipNotice from '../_components/SeriesApplicationCitizenshipNotice.vue';

    const vueClass = mixins(HasDataDependencies);
    type SeriesApplicationPageViewKey = 'profile' | 'levels';
    // @vue/component
    export default vueClass.extend({
        components: {
            Application,
            Profile,
            TeamProfile
        },
        /**
         * Reactive Data
         */
        data: function () {
            return {
                /**
                 * The active view on the page
                 */
                active_view: <SeriesApplicationPageViewKey>'profile',
                /**
                 * Data dependencies required for component
                 */
                dependencies: {
                    series: false
                }
            };
        },
        computed: {
            is_team_mode: function (): boolean {
                return this.$store.state.series_registration.application.is_team_series;
            },
            /**
             * The configuration for the page header
             */
            page_header: function (): PageComponentHeaderConfiguration {
                const conf: PageComponentHeaderConfiguration = {
                    title: 'Series Application'
                };
                if (this.series) {
                    conf.back_link = this.series.links.overview;
                    conf.back_link_label = 'Back to Series Overview';
                    if (this.is_team_mode && this.series.links.select_team) {
                        conf.back_link = this.series.links.select_team;
                        conf.back_link_label = 'Back to Select Team';
                    }
                }

                return conf;
            },
            profile_component: function (): string {
                if (this.is_team_mode) {
                    return 'team-profile';
                }

                return 'profile';
            },
            /**
             * The series for the page
             */
            series: function (): SeriesApplication.Series | null {
                return this.$store.getters['series_registration/application/series'];
            },
            /**
             * Whether the active user is ineligible for the series due to their citizenship status
             */
            user_citizenship_ineligible: function (): boolean {
                return this.$store.getters['series_registration/application/user_citizenship_ineligible'];
            }
        },
        /**
         * Before component created, ensure state modules are registered and configured
         */
        beforeCreate: function (): void {
            if (typeof this.$store.state.series_registration === 'undefined') {
                this.$store.registerModule('series_registration', SeriesRegistrationState);
            }
            if (typeof this.$store.state.skate_test_history === 'undefined') {
                this.$store.registerModule('skate_test_history', SkateTestHistoryState);
            }
            this.$store.commit('skate_test_history/setSaveAction', (payload: SaveSkateTestActionPayload) => {
                return this.$store.dispatch('series_registration/application/saveSkateTest', payload);
            });
            this.$store.commit('skate_test_history/setRemoveAction', (payload: SkateTestRemoveAppPayload) => {
                return this.$store.dispatch('series_registration/application/removeSkateTest', payload);
            });
        },
        /**
         * On destruction, reset the skate test history state
         */
        destroyed: function () {
            this.$store.commit('skate_test_history/reset');
        },
        methods: {
            /**
             * Whether a view is active
             */
            isActiveView: function (view: SeriesApplicationPageViewKey): boolean {
                return this.active_view === view;
            },
            /**
             * Load data dependencies
             */
            loadData: function (): Promise<void> {
                return new Promise((resolve, reject) => {
                    this.$store.dispatch('series_registration/application/fetchSeriesApplication')
                        .then(() => {
                            this.dependencies.series = true;
                            if (this.user_citizenship_ineligible) {
                                this.$store.commit('app/setNotice', <AppNoticeStatePayload>{
                                    notice: new SeriesApplicationCitizenshipNotice({
                                        propsData: {
                                            series: this.series
                                        }
                                    }),
                                    dismiss_override: () => {
                                        if (this.series) {
                                            window.location.assign(this.series.links.overview);

                                            return;
                                        }
                                        this.$store.commit('app/setNotice', null);
                                    }
                                });
                            }

                            resolve();
                        })
                        .catch(() => {
                            reject();
                        });
                });
            },
            /**
             * Select the active view for the page
             */
            selectActiveView: function (view: SeriesApplicationPageViewKey, reset_scroll = false): void {
                this.active_view = view;
                if (reset_scroll) {
                    this.$nextTick(() => {
                        const $root: AppRootInterface = this.$root as AppRootInterface;
                        $root.resetScroll();
                    });
                }
            }
        }
    });
</script>