<script lang="ts">
	import Vue from "vue";
	import CreditCardForm from "./CreditCardForm.vue"
	import {CreditCard} from "../../models/CreditCard";

	export default Vue.extend({
		props: {
			initial: {
				type: CreditCard,
				required: false
			},
		},
		created: function () {
			if (this.initial) {
				this.selected_card = this.initial;
			}
		},
		data: function () {
			let selected_card!:CreditCard;
			return {
				step_complete: false,
				selected_card: selected_card

			}
		},
		methods: {
			complete: function (credit_card: CreditCard) {
				this.step_complete = true;
				this.selected_card = credit_card;
				this.$emit('step_complete', credit_card);
			},
			reloadStep: function () {
				this.step_complete = false;
				this.$emit('reload');
			}
		},
		components: {
			"credit-card-form": CreditCardForm
		}
	});
</script>