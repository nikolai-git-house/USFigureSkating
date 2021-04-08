<template>
    <div class="series-page-header">
        <div class="grid-container">
            <div class="series-summary">
                <div class="series-summary__icon">
                    <img :src="series.icon"
                         :alt="`Series icon for ${series.name}`">
                </div>
                <div class="series-summary__details">
                    <p class="series-summary__primary">
                        {{series.name}}
                    </p>
                    <p class="series-summary__secondary">
                        Application Deadline: {{series.application_deadline_formatted}}
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
    import Vue from 'vue';
    import {SeriesRegistrationPageHeadingSeries} from '../_contracts/SeriesRegistrationContracts';

    export default Vue.extend({
        props: {
            series: {
                type: Object as () => SeriesRegistrationPageHeadingSeries,
                required: true
            }
        },
        /**
         * Upon creation, update app navbar state to accommodate header
         */
        created: function () {
            this.$store.commit('app/removeNavBorder');
        }
    });
</script>