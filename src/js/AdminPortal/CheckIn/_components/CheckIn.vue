<template>
    <div class="check-in"
         :class="{
             'check-in--loaded': component_loaded,
             'check-in--standalone': !is_child
         }">
        <div v-if="!component_loaded && !is_child" class="grid-container">
            <p v-if="load_error" class="text--alert">
                Error loading check-in.
            </p>
            <p v-else-if="!loaded && loading_timeout">
                Loading...
            </p>
        </div>
        <div v-else class="check-in__content">
            <transition name="slide-right"
                        v-on:after-enter="afterInteriorEnter"
                        v-on:before-leave="beforeInteriorLeave"
                        v-on:before-enter="beforeInteriorEnter">
                <div v-if="entity_check_in_active" class="check-in__interior">
                    <entity-check-in :init_on_comments="entity_check_in_init_on_comments"
                                     v-on:close="closeEntityCheckIn"></entity-check-in>
                </div>
            </transition>
            <div v-show="show_index"
                 class="check-in__index page"
                 :class="{'page--content-height': is_child}">
                <competition-heading v-if="competition"
                                     :always_show="true"
                                     :competition_override="competition"></competition-heading>
                <div class="admin-portal-page-heading page--accent__standard-content">
                    <div class="grid-container">
                        <div class="admin-portal-page-heading__back-link">
                            <a :href="competition.manage_link"
                               class="icon-link icon-link--back"
                               v-on:click="backClick">
                                Back
                            </a>
                        </div>
                        <h1 class="admin-portal-page-heading__page-title">
                            Check-In
                        </h1>
                    </div>
                </div>
                <div v-if="!component_loaded" class="grid-container">
                    <p v-if="load_error" class="text--alert">
                        Error loading check-in
                    </p>
                    <p v-else-if="!loaded && loading_timeout">
                        Loading...
                    </p>
                </div>
                <div v-else class="page__content page__content--bleed page__content--no-top-pad">
                    <check-in-index
                        v-on:open-email-form="emailOverlayOpen"
                        v-on:view-comments="openEntityCheckIn($event, true)"
                        v-on:check-in="openEntityCheckIn($event, false)">
                    </check-in-index>
                </div>
            </div>
        </div>

        <email-overlay v-if="show_email_overlay"
                       ref="email_overlay"
                       v-site-takeover
                       class="check-in__email-overlay"
                       v-on:close="emailOverlayClose"></email-overlay>
    </div>
</template>
<script lang="ts">
    import mixins from 'vue-typed-mixins';
    import {AppRootInterface} from '../../../contracts/AppContracts';
    import HasDataDependencies from '../../../mixins/HasDataDependencies';
    import CompetitionManagementSubComponentMixin
        from '../../CompetitionManagement/_mixins/CompetitionManagementSubComponentMixin';
    import {EmailFormFormState} from '../../EmailForm/_models/EmailFormFormState';
    import {EmailFormState} from '../../EmailForm/_store/EmailFormState';
    import {CheckInCompetitionInterface} from '../_contracts/CheckInContracts';
    import {AbstractCheckInEntity} from '../_models/CheckInEntities/AbstractCheckInEntity';
    import CheckInIndex from '../_pages/CheckInIndex/CheckInIndex.vue';
    import CheckInService from '../_services/CheckInService';
    import {CheckInState} from '../_store/CheckInState';
    import EntityCheckIn from '../EntityCheckIn/_components/EntityCheckIn.vue';

    const vueClass = mixins(HasDataDependencies, CompetitionManagementSubComponentMixin);
    // @vue/component
    export default vueClass.extend({
        components: {
            CheckInIndex,
            EntityCheckIn
        },
        /**
         * Reactive data
         */
        data: function () {
            return {

                /**
                 * Data dependencies
                 */
                dependencies: {
                    competition: false,
                    checkin_entities: false
                },
                /**
                 * Whether entity check-in is active
                 */
                entity_check_in_active: false,
                /**
                 * Whether to initialize entity check-in on the comments page
                 */
                entity_check_in_init_on_comments: false,
                /**
                 * The amount the index has been scrolled prior to loading entity-check-in
                 *
                 * Used to restore scroll position following entity check-in close
                 */
                previous_scroll_top: 0,
                /**
                 * Whether index should be visible
                 *
                 * Index hides following entity check-in transition-in completion, and shows just before
                 * entity check-in transitions out
                 */
                show_index: true,
                /**
                 * Whether to show the email overlay
                 */
                show_email_overlay: false
            };
        },
        computed: {
            /**
             * The active competition
             */
            competition: function (): CheckInCompetitionInterface {
                return this.$store.state.competition_management.active_competition;
            }
        },
        watch: {
            /**
             * When email overlay opens or closes, reset the root scroll
             */
            show_email_overlay: function () {
                // eslint-disable-next-line
                (this.$root as AppRootInterface).resetScroll();
            }
        },
        /**
         * On component destruction, reset email form state
         */
        destroyed: function () {
            this.$store.commit('email_form/resetState');
        },
        /**
         * Upon creation, register checkin module
         *
         */
        created: function () {
            if (typeof this.$store.state.checkin === 'undefined') {
                this.$store.registerModule('checkin', CheckInState);
            }
            if (typeof this.$store.state.email_form === 'undefined') {
                this.$store.registerModule('email_form', EmailFormState);
            }
            this.$store.commit('email_form/setServiceClass', CheckInService);
        },
        methods: {
            /**
             * After the interior component enters...
             * 1. hide the site header
             * 2. scroll the document to the top
             * 3. hide the index content
             */
            afterInteriorEnter: function () {
                this.$root.$el.classList.add('invisible-header');
                // eslint-disable-next-line
                (this.$root as AppRootInterface).resetScroll();
                this.$nextTick(() => {
                    this.show_index = false;
                });
            },
            /**
             * Before the interior component enters...
             * 1. log the document scroll top
             */
            beforeInteriorEnter: function () {
                // eslint-disable-next-line
                this.previous_scroll_top = (this.$root as AppRootInterface).getCurrentScroll();
            },
            /**
             * Before the interior component leaves...
             * 1. show the site header
             * 2. show the index content
             * 3. restore the top scroll
             */
            beforeInteriorLeave: function () {
                this.$root.$el.classList.remove('invisible-header');
                this.show_index = true;
                this.$nextTick(() => {
                    // eslint-disable-next-line
                    (this.$root as AppRootInterface).scrollTo(this.previous_scroll_top);
                    this.previous_scroll_top = 0;
                });
            },
            /**
             * Close entity check-in
             */
            closeEntityCheckIn: function (reset_scroll: boolean): void {
                if (reset_scroll) {
                    this.previous_scroll_top = 0;
                }
                this.$store.commit('checkin/setActiveCheckInEntity', null);
                this.entity_check_in_active = false;
                this.entity_check_in_init_on_comments = false;
            },
            /**
             * Open the email overlay
             */
            emailOverlayOpen: function () {
                this.$nextTick(() => {
                    this.$root.$el.classList.add('invisible-header');
                });
                this.setDefaultEmailState();
                this.show_email_overlay = true;
                this.show_index = false;
            },
            /**
             * Close the email overlay
             */
            emailOverlayClose: function () {
                this.$nextTick(() => {
                    this.$root.$el.classList.remove('invisible-header');
                });
                this.show_email_overlay = false;
                this.show_index = true;
            },
            /**
             * Load data dependencies
             */
            loadData: function () {
                return new Promise((resolve, reject) => {
                    this.$store.dispatch('competition_management/fetchActiveCompetition')
                        .then(() => {
                            this.$store.commit('checkin/setActiveCompetition', this.$store.state.competition_management.active_competition);
                            this.dependencies.competition = true;
                            this.$store.dispatch('checkin/fetchEntities')
                                .then(() => {
                                    this.dependencies.checkin_entities = true;
                                    resolve();
                                })
                                .catch(() => {
                                    reject();
                                });
                        })
                        .catch(() => {
                            reject();
                        });
                });
            },
            /**
             * Open entity check-in
             */
            openEntityCheckIn: function (entity: AbstractCheckInEntity, open_comments: boolean): void {
                this.$store.commit('checkin/setActiveCheckInEntity', entity);
                this.entity_check_in_active = true;
                this.entity_check_in_init_on_comments = open_comments;
            },
            /**
             * Set the email form to its default state
             */
            setDefaultEmailState: function () {
                const form_data = new EmailFormFormState();
                form_data.subject = this.competition ? this.competition.name : '';
                this.$store.commit('email_form/setFormData', form_data);
            }
        }
    });
</script>