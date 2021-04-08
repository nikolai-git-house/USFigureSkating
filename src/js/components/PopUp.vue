<template>
	<div class="popup" v-on:click="isolateInteraction($event)" v-on:touchstart="isolateInteraction($event)">
		<div class="popup__header">
			<h3 class="popup__heading">
				<slot name="heading-text">Coach Ineligible</slot>
			</h3>
			<button class="popup__close" v-on:click="close">&nbsp;</button>
		</div>
		<div class="popup__content">
			<slot name="content"></slot>
		</div>
	</div>
</template>
<script lang="ts">
	import Vue from "vue";


	export default Vue.extend({
		props: {
			math_center: {
				type: Boolean,
				default: false
			}
		},
		mounted: function () {
			document.addEventListener('click', this.bodyClick);
			document.addEventListener('touchstart', this.bodyClick);
			if (this.math_center) {
				this.mathCenter();
				window.addEventListener('resize', this.mathCenter);
			}
		},
		destroyed: function () {
			document.removeEventListener('click', this.bodyClick);
			document.removeEventListener('touchstart', this.bodyClick);
			window.removeEventListener('resize', this.mathCenter);
		},
		methods: {
			close: function () {
				this.$emit('close-popup');
			},
			bodyClick: function () {
				this.close();
			},
			isolateInteraction: function (event: Event) {
				event.stopPropagation();
			},
            mathCenter: function() {
                let $el = <HTMLElement>this.$el;
                let top = Math.floor((window.innerHeight - $el.offsetHeight) / 2);
                let left = Math.floor((window.innerWidth - $el.offsetWidth) / 2);
                $el.style.top = top + 'px';
                $el.style.left = left + 'px';
            }
		}
	});
</script>