<template>
	<div class="progress-bar">
		<div class="progress-bar__bar">
			<span class="progress-bar__track">&nbsp;</span>
			<span class="progress-bar__progress" :style="{'width':completed_progress_percent+'%'}">&nbsp;</span>
		</div>
		<div class="progress-bar__steps">
			{{active_step_number}}/{{available_step_count}}
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
             * Calculated total progress percent
             */
            completed_progress_percent: function (): number {
                return (this.active_step_number) / (this.available_step_count) * 100;
            },
        }
    });
</script>