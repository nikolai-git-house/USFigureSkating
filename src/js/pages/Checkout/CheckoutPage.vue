<script lang="ts">
	import Vue from "vue";
	import CheckoutAddress from "./CheckoutAddress.vue";
	import CheckoutPayment from "./CheckoutPayment.vue"
	import {BillingAddress} from "../../models/BillingAddress";
	import {CreditCard} from "../../models/CreditCard";
	import {CheckoutData, CheckoutDataError, OrderAttemptResponse} from "../../contracts/AppContracts";
	import {CartService} from "../../services/CartService";
	import ScrollHelpers from "./../../helpers/scroll";

    export default Vue.extend({
        props: {
            confirmation_url: {
                type: String,
                default: '/pages/order-confirmation'
            }
        },
		created: function () {
			this.$store.commit('app/setCheckoutActive');
		},
		data: function () {
			let selected_address: BillingAddress | undefined;
			let selected_card: CreditCard | undefined;
			return {
				active_step: 1,
				review_initialized: false,
				payment_initialized: false,
				selected_address: selected_address,
				selected_card: selected_card,
				global_error: ""
			}
		},
		methods: {
			stepActive: function (step_id: number) {
				return step_id === this.active_step;
			},
			advance: function () {
				this.active_step++;
				this.parseSteps();
			},
			parseSteps: function () {
				this.payment_initialized = false;
				this.review_initialized = false;
				if (this.active_step > 1) {
					this.payment_initialized = true;
				}
				if (this.active_step > 2) {
					this.review_initialized = true;
				}
			},
			setActiveStep: function (step_id: number) {
				this.active_step = step_id;
				this.parseSteps();
			},
			completeAddress: function (address: BillingAddress) {
				this.selected_address = address;
				this.advance();
			},
			completePayment: function (card: CreditCard) {
				this.selected_card = card;
				this.advance();
			},

			prepareData: function (): CheckoutData | CheckoutDataError {
				if (!this.selected_address) {
					return {
						error: "Invalid billing address. Check your information and try again."
					}
				}
				if (!this.selected_card) {
					return {
						error: "Invalid credit card. Check your information and try again."
					}
				}
				return {
					payment_info: {
						card: this.selected_card,
						address: this.selected_address
					},
					cart: this.$store.state.cart.cart
				}
			},
			setGlobalError: function (message: string) {
				let vm = this;
				Vue.set(vm, 'global_error', message);
				setTimeout(function () {
					Vue.set(vm, 'global_error', undefined);
				}, 2000);
			},
			completeOrder: function () {
				let checkoutData = this.prepareData();
				let vm = this;
				if ('error' in checkoutData) {
					this.setGlobalError(checkoutData.error);
					return;
				}
				CartService.completeOrder(checkoutData).then(function (response: OrderAttemptResponse) {
					if (response.success === true) {
						location.assign(vm.confirmation_url);
						return;
					}
					vm.setGlobalError(response.message);
				}).catch(function () {
					vm.setGlobalError("Error processing your information.");
				});
			},
			scrollToRef: function (ref: HTMLElement) {
				let navbar = document.querySelector('.navbar');
				let navbar_height = 0;
				let border_width = 0;
				let computedStyle = getComputedStyle(ref);
				let top = ref.offsetTop;

				if (navbar) {
					navbar_height = (navbar as HTMLElement).offsetHeight;
				}
				if (computedStyle.borderTopWidth) {
					border_width = parseInt(computedStyle.borderTopWidth);
				}

				ScrollHelpers.scrollToOffset(top - navbar_height + border_width);
			},
			focusFirstRefInput: function (ref: HTMLElement) {
				let first_input_el = ref.querySelector('input');
				if (first_input_el) {
					first_input_el.focus();
				}
			}

		},
		watch: {
			active_step: function (new_step_id: number) {
				let ref: HTMLElement = this.$refs['step_' + (new_step_id)] as HTMLElement;
				if (ref) {
					let vm = this;
					Vue.nextTick(function () {
						vm.scrollToRef(ref);
						if (new_step_id === 2) {
							vm.focusFirstRefInput(ref);
						}
					});
				}
			}
		},
		components: {
			'checkout-address': CheckoutAddress,
			'checkout-payment': CheckoutPayment
		}
	});

</script>