<script lang="ts">
	import Vue from "vue";
	import {BillingPaymentFormValidator} from "../../models/BillingPaymentFormValidator";
	import {BillingPaymentState} from "../../models/BillingPaymentState";
	import {YearOptions, MonthOptions} from "./credit-card-options";
	import {CreditCard} from "../../models/CreditCard";

	interface CreditCardInput extends Vue {
		reset: Function
	}

	export default Vue.extend({
		props: {
			source_card: {
				type: CreditCard,
				required: false
			}
		},
		created: function () {
			if (this.source_card) {
				this.form_data = new BillingPaymentState(this.source_card.extract_state());
				return;
			}
			this.form_data = new BillingPaymentState();
		},
		computed: {
			valid: function () {
				return Object.keys(this.errors).length === 0;
			},
			errors: function () {
				let validation_result = new BillingPaymentFormValidator(this.form_data).validate();
				return validation_result.errors;
			},
			messages: function (): { [key: string]: string[] } {
				let validation_result = new BillingPaymentFormValidator(this.form_data).validate();
				return validation_result.messages;
			}

		},
		data: function () {
			return {
				submit_attempt: false,
				form_data: new BillingPaymentState(),
				years: YearOptions(),
				months: MonthOptions,
			}
		},
		methods: {
			updateCreditCardInfo: function (val: { [key: string]: string; number: string, formatted: string, type: string, type_formatted: string }) {
				this.form_data.card_number = parseInt(val.number);
				this.form_data.number_formatted = val.formatted;
				this.form_data.type = val.type;
				this.form_data.type_formatted = val.type_formatted;
			},
			fieldClass: function (field_name: string) {
				if (!this.submit_attempt) {
					return;
				}
				if (field_name in this.errors) {
					return "has-error";
				}
				if (this.form_data[field_name]) {
					return "has-success";
				}
			},
			fieldMessage: function (field_name: string) {
				if (!this.submit_attempt) {
					return;
				}
				// don't show expiration date message if expiration fields already have errors
				if (field_name === 'expiration_date' && (this.messages.expiration_month || this.messages.expiration_year)) {
					return;
				}
				if (field_name in this.messages) {
					return this.messages[field_name][0];
				}
			},
			cancel: function () {
				this.form_data = new BillingPaymentState();
				this.submit_attempt = false;
				(this.$refs.credit_card_input as CreditCardInput).reset();
			},
			complete: function () {
				this.submit_attempt = true;
				if (!this.valid) {
					return;
				}
				this.$emit('payment_completed', CreditCard.createFromBillingState(this.form_data));
			},
		}
	})
</script>