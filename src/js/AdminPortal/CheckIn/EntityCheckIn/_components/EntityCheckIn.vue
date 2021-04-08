<template>
    <div class="entity-check-in">
        <div class="subpage-parent slide-parent slide-parent--fixed">
            <transition name="slide-left" v-on:after-enter="$root.resetScroll()">
                <div v-if="isActivePage('index')" class="subpage">
                    <div class="entity-check-in-subpage">
                        <div class="entity-check-in-subpage__header">
                            <a href="#"
                               class="icon-link icon-link--back"
                               v-on:click.prevent="close(false)">Back to Check-in
                            </a>
                            <h2 class="entity-check-in-subpage__header__title"
                                :class="{
                                    'entity-check-in-subpage__header__title--constrained': entity.entity_type_key==='team_personnel',
                                    'entity-check-in-subpage__header__title--expanded': entity.entity_type_key==='competition_contact'
                                }">
                                {{entity.check_in_index_heading}}
                            </h2>
                        </div>
                        <div v-if="!component_loaded"
                             class="entity-check-in-subpage__notice">
                            <div class="grid-container">
                                <p v-if="load_error"
                                   class="text--alert">
                                    Error loading check-in.
                                </p>
                                <p v-else-if="!loaded && loading_timeout">
                                    Loading...
                                </p>
                            </div>
                        </div>
                        <div v-else
                             class="entity-check-in-subpage__content">
                            <entity-check-in-index v-on:page-selected="openPage"
                                                   v-on:back="close"></entity-check-in-index>
                        </div>
                    </div>
                </div>
            </transition>
            <transition name="slide-right" v-on:after-enter="$root.resetScroll()">
                <div v-if="!isActivePage('index')" class="subpage">
                    <div class="entity-check-in-subpage"
                         :class="{'entity-check-in-subpage--accent':is_accent_page}">
                        <div class="entity-check-in-subpage__header entity-check-in-subpage__header--bleed">
                            <div class="grid-container">
                                <a href="#"
                                   class="icon-link icon-link--back"
                                   v-on:click.prevent="interiorBack">{{interior_back_link_text}}
                                </a>
                                <h2 class="entity-check-in-subpage__header__title">
                                    {{active_page_name}}
                                </h2>
                                <h3 v-if="active_page_subtitle" class="entity-check-in-subpage__header__subtitle">
                                    {{active_page_subtitle}}
                                </h3>
                            </div>
                        </div>
                        <div class="entity-check-in-subpage__content">
                            <component :is="active_component"></component>
                        </div>
                    </div>
                </div>
            </transition>
        </div>
    </div>
</template>
<script lang="ts">
    import {StringHelpers} from '../../../../helpers/StringHelpers';
    import {AbstractCheckInEntity} from '../../_models/CheckInEntities/AbstractCheckInEntity';
    import {EntityCheckInPageKey} from '../_contracts/EntityCheckInContracts';
    import EntityCheckInComments from '../_pages/EntityCheckInComments.vue';
    import EntityCheckInCompliance from '../_pages/EntityCheckInCompliance.vue';
    import EntityCheckInEvents from '../_pages/EntityCheckInEvents/EntityCheckInEvents.vue';
    import EntityCheckInIndex from '../_pages/EntityCheckInIndex/EntityCheckInIndex.vue';
    import EntityCheckInRoster from '../_pages/EntityCheckInRoster/EntityCheckInRoster.vue';
    import EntityCheckInSkaterCoaches from '../_pages/EntityCheckInSkaterCoaches.vue';
    import EntityCheckInSkaters from '../_pages/EntityCheckInSkaters.vue';
    import EntityCheckInTeamCoaches from '../_pages/EntityCheckInTeamCoaches/EntityCheckInTeamCoaches.vue';
    import EntityCheckInTeamServicePersonnel
        from '../_pages/EntityCheckInTeamServicePersonnel/EntityCheckInTeamServicePersonnel.vue';
    import mixins from 'vue-typed-mixins';
    import HasDataDependencies from '../../../../mixins/HasDataDependencies';

    const vueClass = mixins(HasDataDependencies);
    // @vue/component
    export default vueClass.extend({
        components: {
            EntityCheckInComments,
            EntityCheckInCompliance,
            EntityCheckInEvents,
            EntityCheckInIndex,
            EntityCheckInRoster,
            EntityCheckInSkaterCoaches,
            EntityCheckInSkaters,
            EntityCheckInTeamCoaches,
            EntityCheckInTeamServicePersonnel
        },
        props: {
            /**
             * Whether to initialize on the comments screen
             */
            init_on_comments: {
                type: Boolean,
                default: false
            }
        },
        /**
         * Reactive Data
         */
        data: function () {
            return {
                /**
                 * The key for the active page
                 */
                active_page_key: <EntityCheckInPageKey>(this.init_on_comments ? 'comments' : 'index'),
                /**
                 * Data dependencies for the component
                 */
                dependencies: {
                    entity: false
                }
            };
        },
        computed: {
            /**
             * Get the registered name of the active component.
             *
             * Determined via active page key
             */
            active_component: function (): string {
                return 'entity-check-in-' + StringHelpers.kebabCaseFromSnakeCase(this.active_page_key);
            },
            /**
             * Get the title of the active page.
             *
             * 1. Replace underscores in the page key
             * 2. return it in title case
             */
            active_page_name: function (): string {
                if (this.active_page_key === 'skaters') {
                    return `${this.entity.name}'s Skaters`;
                }
                const PageConfig: { [key: string]: string; } = {
                    team_coaches: 'Coaches',
                    skater_coaches: 'Coaches'
                };
                if (Object.prototype.hasOwnProperty.call(PageConfig, this.active_page_key)) {
                    return PageConfig[this.active_page_key];
                }

                return StringHelpers.titleCase(this.active_page_key.replace(/_/g, ' '));
            },
            /**
             * The subtitle of the active page
             */
            active_page_subtitle: function (): string | null {
                if (this.active_page_key === 'skaters') {
                    return null;
                }
                if (this.active_page_key === 'skater_coaches') {
                    return `Skater - ${this.entity.summary_name}`;
                }

                return this.entity.summary_name;
            },
            /**
             *  The entity being checked in
             */
            entity: function (): AbstractCheckInEntity {
                return this.$store.state.checkin.active_entity;
            },
            /**
             * Text label for interior page back link
             */
            interior_back_link_text: function (): string {
                const link_text = 'Back to Check-in';
                if (this.init_on_comments) {
                    return link_text;
                }

                return `${link_text} ${this.entity.entity_type_description}`;
            },
            /**
             * Whether the current page should be of the accent variant
             */
            is_accent_page: function (): boolean {
                const accent_pages = ['roster', 'team_coaches', 'team_service_personnel'];

                return accent_pages.indexOf(this.active_page_key) !== -1;
            }
        },
        methods: {
            /**
             * Close the component
             */
            close: function (is_complete_event: boolean): void {
                this.$emit('close', is_complete_event);
            },
            /**
             * Handle click on interior page back link
             */
            interiorBack: function () {
                if (this.init_on_comments) {
                    this.close(false);

                    return;
                }
                this.openPage('index');
            },
            /**
             * Whether a supplied page key is for the active page
             */
            isActivePage: function (page_key: EntityCheckInPageKey): boolean {
                return page_key === this.active_page_key;
            },
            /**
             * Load data to power the component
             */
            loadData: function () {
                return new Promise((resolve, reject) => {
                    this.$store.dispatch('checkin/fetchEntityCheckIn')
                        .then(() => {
                            this.dependencies.entity = true;
                            resolve();
                        })
                        .catch(() => {
                            reject();
                        });
                });
            },
            /**
             * Open a page
             */
            openPage: function (page_key: EntityCheckInPageKey): void {
                this.active_page_key = page_key;
            }
        }
    });
</script>