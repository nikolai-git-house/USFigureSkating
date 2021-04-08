<script lang="ts">
	import Vue from "vue";

	export default Vue.extend({
		props: {
			is_credits_active: {
				type: Boolean,
				required: true
			}
		},
		data: function () {
			return {
				cart_attempt: false,

			}
		},
		computed: {
			footer_ready: function () {
				return this.$store.state.skater.credits_loaded && this.$store.state.cart.cart_loaded;
			},
			is_truncated_version: function () {
				return ["selection", "on_site"].indexOf(this.active_sales_window) !== -1;
			},
			disable_view_credits_button: function () {
				return (this.is_truncated_version && !this.$store.getters['skater/has_unscheduled_credits'])
			},
			unscheduled_credits_message: function () {
				if (this.active_sales_window === "open_sales") {
					return "Tap to view credits";
				}
				if (this.$store.getters['skater/has_unscheduled_credits']) {
					return "You have unscheduled credits";
				}
				return "You have no unscheduled credits";
			},
			active_sales_window: function () {
				return this.$store.getters['competitions/active_sales_window'];
			},
			footer_class: function () {
				if (this.is_credits_active) {
					return 'practice-ice-footer--total-only';
				}
				if (this.is_truncated_version) {
					return "practice-ice-footer--credits-only";
				}
			},
			cart: function () {
				return this.$store.state.cart.cart;
			},
			cart_cost: function () {
				return this.cart.total_cost.toFixed(2).replace('.00', '');
			},
			show_credits_button: function () {
				if (this.is_truncated_version) {
					return true;
				}
				return this.$store.getters['credit_purchase_available'] || this.$store.getters['skater/has_unscheduled_credits'];
			},
			footer_credits_button_text: function () {
				if (this.is_truncated_version) {
					return "View Credits";
				}
				return "Credits";
			},
			show_cart_error: function () {
				return this.cart.isEmpty() && this.cart_attempt === true;
			},

		},
		methods: {
			/**
			 * Attempt to access the cart payment pathway.
			 *
			 * If cart is empty, report for error display.
			 *
			 * Remove errors after 2 seconds
			 */
			attemptCart: function (event: MouseEvent) {
				if (this.cart.isEmpty()) {
					event.preventDefault();
				}
				let vm = this;
				vm.cart_attempt = true;
				setTimeout(function () {
					Vue.set(vm, 'cart_attempt', false);
				}, 2000);
			},
			launchCredits: function () {
				this.$emit('show_credits');
			}

		}
	})
</script>