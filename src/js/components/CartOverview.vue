<template>
	<div class="cart-overview">
		Cart total ({{item_count}} items): <span class="cart-overview__total-cost">${{total_cost}}</span>
	</div>
</template>
<script lang="ts">
	import Vue from "vue";

	export default Vue.extend({
		computed: {
			item_count: function () {
				return this.$store.state.cart.cart.item_count
			},
			total_cost: function () {
				return this.$store.state.cart.cart.total_cost.toFixed(2);
			},
		}
	})
</script>