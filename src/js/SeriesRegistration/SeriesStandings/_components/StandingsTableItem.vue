<template>
    <div class="standings-table-item"
         :class="{'standings-table-item--expanded':show_expanded_content}">
        <div class="standings-table-item__badge">
            <div class="standings-item-badge"
                 :class="badge_class">
                <span class="standings-item-badge__primary"
                      :class="{'standings-item-badge__primary--reduced':!standing.national_rank}">
                    {{standing.national_rank|nullable_rank_score}}
                </span>
                <span class="standings-item-badge__secondary"
                      :class="badge_secondary_class">
                    <span>{{standing.section_key[0].toUpperCase()}}</span><span v-if="standing.sectional_rank">-{{standing.sectional_rank}}</span>
                </span>
            </div>
        </div>
        <div class="standings-table-item__description">
            <p class="standings-table-item__description__datum">
                {{standing.participant_name}}
            </p>
            <p v-if="show_expanded_content"
               class="standings-table-item__description__datum text--muted">
                {{standing.home_club}}
            </p>
            <p v-if="show_expanded_content && standing.competition_earned"
               class="standings-table-item__description__datum standings-table-item__description__datum--small text--muted">
                {{standing.competition_earned}}
            </p>
        </div>
        <div class="standings-table-item__score">
            {{standing.highest_score|nullable_rank_score}}
        </div>
    </div>
</template>
<script lang="ts">
    import Vue from 'vue';
    import {SeriesStandings} from '../_contracts';

    export default Vue.extend({
        filters: {
            /**
             * Format a rank/score. If a value is present, return it.  Otherwise return an em-dash
             */
            nullable_rank_score: function (value: string | null): string {
                if (value === null) {
                    return 'N/A';
                }

                return value;
            }
        },
        props: {
            /**
             * Whether to show additional content
             */
            show_expanded_content: {
                type: Boolean,
                required: true
            },
            /**
             * Data for the standings item
             */
            standing: {
                type: Object as () => SeriesStandings.StandingsRow,
                required: true
            }
        },
        computed: {
            /**
             * The class to apply to the badge element
             */
            badge_class: function (): string | null {
                const parsed = parseInt(String(this.standing.sectional_rank));

                if (!isNaN(parsed) && parsed <= 6) {
                    return null;
                }

                return 'standings-item-badge--inverted';
            },
            /**
             * The class to apply to the secondary aspect of the badge
             */
            badge_secondary_class: function (): string {
                const map = {
                    eastern: '--primary',
                    pacific: '--secondary',
                    midwestern: '--tertiary'
                };
                const modifier = map[this.standing.section_key];

                return `standings-item-badge__secondary${modifier}`;
            }
        }
    });
</script>