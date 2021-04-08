<template>
    <div class="competition-management-competition">
        <div v-if="!component_loaded" class="competition-management-competition__loading">
            <p v-if="load_error" class="text--alert">
                Error loading competition.
            </p>
            <p v-else-if="!loaded && loading_timeout">
                Loading...
            </p>
        </div>
        <div v-else class="competition-management-competition__content">
            <div class="competition-management-competition__container subpage-parent slide-parent slide-parent--fixed">
                <transition name="slide-left" v-on:afterEnter="$root.resetScroll()">
                    <competition-management-competition-index v-if="!active_component"
                                                              :competition="competition"
                                                              class="subpage"
                                                              :style="{'min-height':min_content_height+'px'}"
                                                              v-on:component-link="openComponent"></competition-management-competition-index>
                </transition>
                <transition name="slide-right" v-on:afterEnter="$root.resetScroll()">
                    <component :is="active_component"
                               v-if="active_component"
                               class="subpage"
                               :is_child="true"
                               :style="{'min-height':min_content_height+'px'}"
                               v-on:back="active_component=false"></component>
                </transition>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
    import mixins from 'vue-typed-mixins';
    import HasDataDependencies from '../../../mixins/HasDataDependencies';
    import {
        CompetitionManagementCompetitionInterface,
        CompetitionManagementComponentKey
    } from '../_contracts/CompetitionManagementContracts';

    const vueClass = mixins(HasDataDependencies);
    // @vue/component
    export default vueClass.extend({
        /**
         * Reactive data
         */
        data: function () {
            return {
                /**
                 * The identifier for the active component, if present
                 */
                active_component: <false | string>false,
                /**
                 * Data dependencies
                 */
                dependencies: {
                    competition: false
                },
                /**
                 * Minimum height on the content section
                 */
                min_content_height: 0
            };
        },
        computed: {
            /**
             * The active competition
             */
            competition: function (): CompetitionManagementCompetitionInterface {
                return this.$store.state.competition_management.active_competition;
            }
        },
        methods: {
            /**
             * Open a component from a key
             */
            openComponent: function (component_key: CompetitionManagementComponentKey) {
                let component_name: string = component_key as string;
                if (component_key !== 'check-in') {
                    component_name = `competition-management-${component_key}`;
                }
                this.active_component = component_name;
            },
            /**
             * Update the min height on the content area
             */
            updateContentHeight: function () {
                const app_root = document.getElementById('app');
                let site_header_offset = 0;
                if (app_root) {
                    const app_top_pad = getComputedStyle(app_root).paddingTop;
                    if (app_top_pad) {
                        site_header_offset = parseInt(app_top_pad);
                    }
                }
                this.min_content_height = window.innerHeight - site_header_offset;
            },
            /**
             * Load data for the component
             */
            loadData: function () {
                return new Promise((resolve, reject) => {
                    this.$store.dispatch('competition_management/fetchActiveCompetition')
                        .then(() => {
                            this.dependencies.competition = true;
                            this.$nextTick(() => {
                                this.updateContentHeight();
                                let window_debounce: number | undefined;
                                window.addEventListener('resize', () => {
                                    if (window_debounce) {
                                        clearTimeout(window_debounce);
                                    }
                                    window_debounce = window.setTimeout(() => {
                                        this.updateContentHeight();
                                    }, 200);
                                });
                            });
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