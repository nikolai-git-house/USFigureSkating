<template>
    <div v-if="source"
         class="team-registration-header">
        <competition-heading v-if="source.competition"
                             :always_show="true"
                             :competition_override="source.competition"></competition-heading>
        <page-entity-header v-if="source.team"
                            :entity_name="source.team"></page-entity-header>
    </div>
</template>
<script lang="ts">
    import Vue from 'vue';
    import {TeamRegistration} from '../_contracts';

    export default Vue.extend({
        computed: {
            /**
             * Source data for the heading
             */
            source: function (): TeamRegistration.RegistrationHeaderSource | null {
                return this.$store.getters['team_registration/registration_heading_source'];
            }
        }
    });
</script>