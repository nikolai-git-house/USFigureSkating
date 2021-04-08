<template>
    <div class="series-overview-application-discipline series-application-discipline">
        <div class="series-application-discipline__header">
            <h3 class="series-application-discipline__name">
                {{team.name}} - {{team.level}}
            </h3>
            <a v-if="document"
               :href="document.url"
               class="series-application-discipline__document-link icon-link icon-link--download"
               rel="noopener noreferrer"
               target="_blank">
                {{document.name}}
            </a>
        </div>
        <div v-if="levels.length"
             class="series-application-discipline__section">
            <ul class="series-application-discipline__element-list">
                <li v-for="level in levels"
                    :key="level.id">
                    <div class="series-application-discipline__element">
                        <div class="series-application-discipline__element__label">
                            {{level.name}}
                        </div>
                        <div :class="level|level_class"
                             class="series-application-discipline__element__payment-status">
                            <span class="series-application-discipline__element__payment-status__text">
                                {{level.is_paid ? 'Paid' : 'Unpaid'}}
                            </span>
                            <i :class="level|level_icon_class"
                               class="series-application-discipline__element__payment-status__icon">&nbsp;
                            </i>
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
            team: {
                type: Object as () => SeriesApplication.AppliedTeam,
                required: true
            }
        },
        computed: {
            /**
             * The document associated with the discipline
             */
            document: function (): { url: string; name: string; } | null {
                return this.team.handbook;
            },
            /**
             * The currently added levels
             */
            levels: function (): SeriesApplication.ApplicationDisciplineLevelSelected[] {
                return this.team.levels;
            }
        }
    });
</script>