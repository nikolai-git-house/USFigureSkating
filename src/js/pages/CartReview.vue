<script lang="ts">
    import Vue from "vue";

    export default Vue.extend({
        props: {
            checkout_url: {
                type: String,
                default: "/pages/checkout"
            }
        },
		created: function () {
			this.$store.commit('app/hideCartStatus');
		},
		data: function () {
			return {
				cart_error: false
			}
		},
		computed: {
			items_in_cart: function () {
				return !this.$store.state.cart.cart.isEmpty()
			}
		},
		methods: {
			proceedToCheckout: function () {
				let vm = this;

                if (vm.items_in_cart) {
                    location.assign(this.checkout_url);
                    return;
                }
				vm.cart_error = true;
				setTimeout(function () {
					vm.cart_error = false;
				}, 1000)
			}
		}
	});
</script>