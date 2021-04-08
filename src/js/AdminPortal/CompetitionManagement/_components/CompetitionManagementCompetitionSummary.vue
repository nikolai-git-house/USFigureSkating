<template>
    <div class="competition-management-competition-summary">
        <div class="competition-management-competition-summary__column--icon">
            <div class="competition-management-competition-summary__icon">
                <img :src="competition.icon" :alt="'Icon for ' + competition.name">
            </div>
        </div>
        <div class="competition-management-competition-summary__column--data">
            <p class="competition-management-competition-summary__competition-name">
                {{competition.name}}
            </p>
            <p class="competition-management-competition-summary__datum">
                {{competition.location.city}}, {{competition.location.state}}
            </p>
            <p class="competition-management-competition-summary__datum">
                Dates: {{competition.start_date_pretty}} - {{competition.end_date_pretty}}
            </p>
        </div>
    </div>
</template>
<script lang="ts">
    import Vue from 'vue';
    import {CompetitionManagementCompetitionSummaryCompetition} from '../_contracts/CompetitionManagementContracts';

    export default Vue.extend({
        props: {
            competition: {
                type: Object as () => CompetitionManagementCompetitionSummaryCompetition,
                required: true
            }
        }
    });
</script>