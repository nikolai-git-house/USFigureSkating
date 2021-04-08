<template>
	<div class="page-alert" :class="{expanded:is_expanded}">
		<div class="page-alert__alert">
			<div class="page-alert__trigger-wrap">
				<button class="page-alert__trigger" @click="toggleExpand" type="button">
					<slot name="trigger_text_expanded" v-if="is_expanded">
						<slot name="trigger_text"></slot>
					</slot>
					<slot name="trigger_text" v-else></slot>
				</button>
			</div>
		</div>

		<div v-if="is_expanded" class="page-alert__content" :aria-expanded="is_expanded ?'true':'false'">
			<div class="page-alert__content-container">
				<slot name="expand_content"></slot>
			</div>
		</div>
	</div>
</template>
<script lang="ts">
	import Vue from "vue";

	const PageAlert = Vue.extend({
		data: function () {
			return {
				expanded: false,
			}
		},
		computed: {
			is_expanded: function (): boolean {
				return this.expanded;
			}
		},
		methods: {
			toggleExpand: function (): void {
				this.expanded = !this.expanded;
				this.$emit('alert_toggle');
			}
		}
	});
	export default PageAlert;
</script>