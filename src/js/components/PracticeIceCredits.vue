<script lang="ts">
	import Vue from "vue";
	import CreditPurchase from "./CreditPurchase.vue"
	import {AvailableEventCredits} from "../contracts/AppContracts";

	export default Vue.extend({
		computed: {
			show_page_title: function () {
				return this.$store.getters['competitions/active_sales_window'] === "pre_purchase";
			},
			credit_purchase_available: function () {
				return this.$store.getters['credit_purchase_available'];
			},
			available_credit_list: function (): AvailableEventCredits[] {
				return this.$store.getters['skater/pruned_available_credit_list'];
			},
			show_unscheduled_credits: function () {
				return this.$store.getters['skater/has_unscheduled_credits'];
			},
			package_purchase_available: function () {
				return this.$store.getters['competitions/active_sales_window'] === "pre_purchase";
			},
			can_purchase_credits: function () {
				return this.credit_purchase_available || this.package_purchase_available;
			}
		},
		data: function () {
			return {
				input_lock: false
			}
		},
		components: {
			'credit-purchase': CreditPurchase,
		}
	});
</script>