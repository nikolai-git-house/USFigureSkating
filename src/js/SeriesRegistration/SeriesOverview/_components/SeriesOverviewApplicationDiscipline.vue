<template>
    <div class="series-overview-application-discipline series-application-discipline">
        <div class="series-application-discipline__header">
            <h3 class="series-application-discipline__name">
                {{discipline.name}}
            </h3>
            <a v-if="document"
               target="_blank"
               rel="noopener noreferrer"
               :href="document.link"
               class="series-application-discipline__document-link icon-link icon-link--download">
                {{document.name}}
            </a>
        </div>
        <div v-if="partners.length"
             class="series-application-discipline__section">
            <h4 class="series-application-discipline__section-name">
                Partner
            </h4>
            <ul class="series-application-discipline__element-list">
                <li v-for="partner in partners"
                    :key="partner.id">
                    <div class="series-application-discipline__element">
                        <div class="series-application-discipline__element__label">
                            {{partner.first_name}} {{partner.last_name}}
                            <span v-if="partner.ineligible"
                                  class="text--error">(Ineligible)</span>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
        <div v-if="levels.length"
             class="series-application-discipline__section">
            <h4 class="series-application-discipline__section-name">
                Levels
            </h4>
            <ul class="series-application-discipline__element-list">
                <li v-for="level in levels"
                    :key="level.id">
                    <div class="series-application-discipline__element">
                        <div class="series-application-discipline__element__label">
                            {{level.name}}
                        </div>
                        <div class="series-application-discipline__element__payment-status"
                             :class="level|level_class">
                            <span class="series-application-discipline__element__payment-status__text">
                                {{level.is_paid?'Paid':'Unpaid'}}
                            </span>
                            <i class="series-application-discipline__element__payment-status__icon"
                               :class="level|level_icon_class">&nbsp;
                            </i>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
        <div v-if="coaches.length"
             class="series-application-discipline__section">
            <h4 class="series-application-discipline__section-name">
                Coaches
            </h4>
            <ul v-if="coaches.length"
                class="series-application-discipline__element-list">
                <li v-for="coach in coaches"
                    :key="coach.id">
                    <div class="series-application-discipline__element">
                        <div class="series-application-discipline__element__label">
                            {{coach.first_name}} {{coach.last_name}}
                            <span v-if="coach.ineligible"
                                  class="text--error">(Ineligible)</span>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>
<script lang="ts">
    import Vue from 'vue';
    import {SeriesApplication} from '../../SeriesApplication/_contracts';
    import {SeriesOverview} from '../_contracts';

    export default Vue.extend({
        filters: {
            /**
             * The class to apply to a level based on its payment status
             */
            level_class: function (value: SeriesApplication.ApplicationDisciplineLevelSelected): string {
                const modifier = value.is_paid ? 'paid' : 'unpaid';

                return `series-application-discipline__element__payment-status--${modifier}`;
            },
            /**
             * The class to apply to a level icon based on the level payment status
             */
            level_icon_class: function (value: SeriesApplication.ApplicationDisciplineLevelSelected): string {
                const modifier = value.is_paid ? 'check' : 'x';

                return `icon-status-${modifier}`;
            }
        },
        props: {
            discipline: {
                type: Object as () => SeriesApplication.ApplicationDiscipline,
                required: true
            }
        },
        computed: {
            /**
             * The document associated with the discipline
             */
            document: function (): SeriesOverview.SeriesDisciplineResourceDocument | null {
                return this.$store.getters['series_registration/overview_discipline_document'](this.discipline.id);
            },
            /**
             * The currently added coaches
             */
            coaches: function (): SeriesApplication.ApplicationDisciplineCoach[] {
                return this.discipline.coaches;
            },
            /**
             * The currently added levels
             */
            levels: function (): SeriesApplication.ApplicationDisciplineLevelSelected[] {
                return this.discipline.levels;
            },
            /**
             * The currently added partners
             */
            partners: function (): SeriesApplication.ApplicationDisciplinePartner[] {
                return this.discipline.partners;
            }
        }
    });
</script>