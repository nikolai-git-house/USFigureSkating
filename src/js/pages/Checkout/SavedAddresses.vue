<script lang="ts">
	import Vue from "vue";
	import {BillingAddress} from "../../models/BillingAddress";

	/**
	 * This component lets a skater select one of their saved addresses for use or editing
	 */
	export default Vue.extend({
		/**
		 * When component loads, if the first address in the list is the default, set the selected index to 0;
		 */
		created: function () {
			if (this.saved_addresses[0].is_default) {
				this.selected_address_index = 0;
			}
		},
		data: function () {

			return {
				/**
				 * Index for the actively selected saved address
				 */
				selected_address_index: -1,

			}
		},
		computed: {
			/**
			 * The active saved address based on the active index
			 */
			active_address: function () {
				return this.saved_addresses[this.selected_address_index];
			},
			saved_address_count: function () {
				return this.$store.state.skater.billing_addresses.length;
			},
			/**
			 * All the saved addresses with the default, if present, first
			 */
			saved_addresses: function () {
				return this.$store.state.skater.billing_addresses.reduce(function (result: BillingAddress[], address: BillingAddress) {
					if (address.is_default) {
						result.unshift(address);
					}
					else {
						result.push(address);
					}
					return result;
				}, [])
			},
		},
		methods: {
			/**
			 * Determine if a address is active by its index
			 */
			isActive: function (index: number) {
				return this.selected_address_index === index;
			},
			/**
			 * Make an address the active one within the component
			 */
			activateSavedAddress: function (index: number) {
				this.selected_address_index = index;
			},
			/**
			 * Select a saved address for use.  Log it within component and report it externally
			 */
			selectSavedAddress: function (index: number) {
				this.selected_address_index = index;
				this.$emit('saved_address_selected', {
					address: this.active_address
				});
			},
			/**
			 * Select a saved address for editing.  Log it within component, and report it externally
			 */
			edit: function (index: number) {
				this.selected_address_index = index;
				this.$emit('edit_address', {
					address: this.active_address
				})
			},
			/**
			 * Report to parent components that user has elected to add a new address
			 */
			addAddress: function () {
				this.$emit('add_address');
			}
		}
	});
</script>