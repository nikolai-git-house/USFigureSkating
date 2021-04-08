<script lang="ts">
	import Vue from "vue";

	export default Vue.extend({
		computed: {
			cart_count: function () {
				return this.$store.state.cart.cart.item_count;
			}
		}
	});
</script>