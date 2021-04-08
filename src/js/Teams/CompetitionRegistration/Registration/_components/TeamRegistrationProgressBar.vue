<template>
    <div class="team-registration__progress-bar">
        <progress-bar :available_step_count="available_steps"
                      :active_step_number="active_step"></progress-bar>
    </div>
</template>
<script lang="ts">
    import Vue from 'vue';
    import ProgressBar from '../../../../components/ProgressBar.vue';

    export default Vue.extend({
        components: {
            ProgressBar
        },
        computed: {
            /**
             * The number of the current step
             */
            active_step: function () {
                return this.$store.state.team_registration.active_step_index + 1;
            },
            /**
             * The total number of steps
             */
            available_steps: function () {
                return this.$store.getters['team_registration/step_components'].length;
            }
        }
    });
</script>