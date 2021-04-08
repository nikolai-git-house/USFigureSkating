<template>
    <div class="standings-table">
        <div v-if="standings.length"
             class="standings-table__header">
            <div class="labeled-toggle">
                <span class="labeled-toggle__label">
                    Show {{show_expanded_content?'less':'more'}} standings detail
                </span>
                <div class="labeled-toggle__toggle toggle toggle--sm">
                    <input :id="`view-mode-toggle-${uid}`"
                           v-model="show_expanded_content"
                           type="checkbox"
                           class="toggle__input">
                    <label :for="`view-mode-toggle-${uid}`"
                           class="toggle__user-input"></label>
                </div>
            </div>
        </div>
        <ul v-if="standings.length"
            class="standings-table__list">
            <li v-for="standing in standings"
                :key="standing.id"
                class="standings-table__list__item">
                <standings-table-item :standing="standing"
                                      :show_expanded_content="show_expanded_content"></standings-table-item>
            </li>
        </ul>
        <div v-else
             class="standings-table__notice">
            <p class="text--error">
                No standings for {{event_name}} match your current search/filters.
            </p>
        </div>
    </div>
</template>
<script lang="ts">
    import Vue from 'vue';
    import {SeriesStandings} from '../_contracts';
    import StandingsTableItem from './StandingsTableItem.vue';

    let uid = 1;
    export default Vue.extend({
        components: {StandingsTableItem},
        props: {
            event_name: {
                type: String,
                required: true
            },
            standings: {
                type: Array as () => SeriesStandings.StandingsRow[],
                required: true
            }
        },
        /**
         * Reactive data
         */
        data: function () {
            return {
                uid: uid++,
                show_expanded_content: false
            };
        }
    });
</script>