<template>
	<progress-bar :style="{visibility:total_registration_steps ? 'visible' : 'hidden'}" :available_step_count="total_registration_steps" :active_step_number="active_step"></progress-bar>
</template>
<script lang="ts">
    import HasCompetitionRegistrationCompetitionMixin from "../../mixins/HasCompetitionRegistrationCompetitionMixin"
    import mixins from 'vue-typed-mixins'
    import ProgressBar from "../ProgressBar.vue";

    export default mixins(HasCompetitionRegistrationCompetitionMixin).extend({
        props: {
            active_step: {
                type: Number,
                required: true
            }
        },
        computed: {
            total_registration_steps: function (): number {
                if (!this.active_competition) {
                    return 0;
                }
                if (this.competition.has_partner_events) {
                    return 7;
                }
                return 5;
            }
        },
        components: {
            ProgressBar
        }
    });
</script>