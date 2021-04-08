<template>
	<div class="steps-indicator">
		<ul class="steps-indicator__list">
			<li class="steps-indicator__item" v-for="step_number in available_step_count" :class="{'complete': active_step_number > step_number, 'active': active_step_number === step_number}">
				<span class="steps-indicator__step">{{step_number}}</span>
			</li>
		</ul>
		<div class="steps-indicator__progress">
			<div class="steps-indicator__progress__bar">
				<span :style="{'width':completed_progress+'%'}" class="steps-indicator__progress__bar__indicator steps-indicator__progress__bar__indicator--complete">&nbsp;</span>
				<span :style="{'width':next_progress+'%'}" class="steps-indicator__progress__bar__indicator steps-indicator__progress__bar__indicator--next">&nbsp;</span>
			</div>
		</div>
	</div>
</template>
<script lang="ts">
    import Vue from "vue";

    export default Vue.extend({
        props: {
            /**
             * The number of total steps
             */
            available_step_count: {
                type: Number,
                required: true,
            },
            /**
             * The current step number
             */
            active_step_number: {
                type: Number,
                required: true,
            },
        },
        computed: {
            /**
             * The percentage of progress to show for completed steps
             */
            completed_progress: function (): number {
                return (this.active_step_number - 1) / (this.available_step_count - 1) * 100;
            },
            /**
             * The percentage of progress to show for next steps
             */
            next_progress: function (): number {
                return (this.active_step_number) / (this.available_step_count - 1) * 100;
            }
        }
    });
</script>