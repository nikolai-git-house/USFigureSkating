<template>
    <div class="competition-tile">
        <slot name="banners"></slot>
        <div class="competition-tile__content">
            <div class="competition-tile__image">
                <img :src="competition.icon" :alt="competition.name+' logo'">
            </div>
            <div class="competition-tile__description">
                <p class="competition-tile__text competition-tile__text--primary">
                    {{competition.name}}
                </p>
                <p class="competition-tile__text competition-tile__text--secondary">
                    {{competition.start_date}} - {{competition.end_date}}
                </p>
                <p class="competition-tile__text competition-tile__text--secondary">
                    {{competition.city}}, {{competition.state}}
                </p>
                <p class="competition-tile__text competition-tile__text--secondary">
                    {{competition.club}}
                </p>
                <p v-if="competition.series" class="competition-tile__text competition-tile__text--series">
                    <span v-for="(series,index) in competition.series"
                          :key="index"
                          class="competition-tile__series">{{series.name}}</span>
                </p>
            </div>
        </div>
        <slot name="drawer"></slot>
    </div>
</template>
<script lang="ts">
    import Vue from 'vue';
    import {CompetitionTileCompetition} from './CompetitionTileContracts';

    export default Vue.extend({
        props: {
            /**
             * The competition to populate the tile
             */
            competition: {
                required: true,
                type: Object as () => CompetitionTileCompetition
            }
        }
    });
</script>