<template>
    <page class="page page-my-skaters"
          :header="page_header">
        <competition-portal-page-heading v-if="competition_portal_heading_binding"
                                         slot="pre-header"
                                         v-bind="competition_portal_heading_binding"></competition-portal-page-heading>
        <component-loader v-if="!component_loaded"
                          slot="loader"
                          :container="true"
                          :source="this"
                          error_message="Error loading skater information."></component-loader>
        <div slot="content"
             class="page__content">
            <div v-if="no_skaters">
                <p>You have no skaters registered for this competition.</p>
            </div>
            <div v-else
                 class="accordion-group accordion-group--no-bottom my-skater-list">
                <accordion v-for="skater in skaters"
                           :key="skater.id">
                    <span slot="trigger_text">{{skater.first_name}} {{skater.last_name}}</span>
                    <div slot="expand_content"
                         class="my-skater-content">
                        <p v-if="skater.federation_letter_status"
                           class="my-skater-content__federation-letter">
                            Federation Letter: {{skater.federation_letter_status}}
                        </p>
                        <div class="my-skater-content__events">
                            <div v-for="(event,index) in skater.events"
                                 :key="index"
                                 class="my-skater-event">
                                <div class="my-skater-event__name">
                                    <p class="my-skater-event__label">
                                        {{event.name}}
                                    </p>
                                    <p class="my-skater-event__value">
                                        {{event.coaching_role}}
                                    </p>
                                </div>
                                <div class="my-skater-event__status">
                                    <div class="my-skater-event__status__music">
                                        <p class="my-skater-event__label">
                                            Music
                                        </p>
                                        <p v-if="event.music_required"
                                           class="my-skater-event__value">
                                            <i class="icon-status"
                                               :class="'icon-status--'+(event.music_complete?'yes':'no')">&nbsp;
                                            </i>
                                        </p>
                                        <p v-else
                                           class="my-skater-event__value">
                                            N/A
                                        </p>
                                    </div>
                                    <div class="my-skater-event__status__ppc">
                                        <p class="my-skater-event__label">
                                            PPC
                                        </p>
                                        <p v-if="event.ppc_required"
                                           class="my-skater-event__value">
                                            <i class="icon-status"
                                               :class="'icon-status--'+(event.ppc_complete?'yes':'no')">&nbsp;
                                            </i>
                                        </p>
                                        <p v-else
                                           class="my-skater-event__value">
                                            N/A
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </accordion>
            </div>
        </div>
    </page>
</template>
<script lang="ts">
    import {CoachSkater} from '../../contracts/AppContracts';
    import mixins from 'vue-typed-mixins';
    import HasDataDependencies from '../../mixins/HasDataDependencies';
    import {CompetitionPortalPageMixin} from '../_mixins';

    const vueClass = mixins(HasDataDependencies, CompetitionPortalPageMixin);
    // @vue/component
    export default vueClass.extend({
        data: function () {
            return {
                dependencies: {
                    skaters: false
                },
                page_title: 'My Skaters'
            };
        },
        computed: {
            no_skaters: function () {
                return this.skaters.length === 0;
            },
            /**
             * Return skaters sorted alphabetically by last name
             *
             * If skaters share a last name, use first name in sort
             */
            skaters: function (): CoachSkater[] {
                return this.$store.state.coach.active_competition_skaters.slice()
                    .sort(function (a: CoachSkater, b: CoachSkater) {
                        const a_compare_name = a.last_name.toLowerCase() + ' ' + a.first_name.toLowerCase();
                        const b_compare_name = b.last_name.toLowerCase() + ' ' + b.first_name.toLowerCase();

                        return a_compare_name.localeCompare(b_compare_name);
                    });
            }
        },
        methods: {
            /**
             * Load data required by component
             */
            loadData: function () {
                return new Promise((resolve, reject) => {
                    this.$store.dispatch('competition_portal/fetchMySkaters')
                        .then(() => {
                            this.dependencies.skaters = true;
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