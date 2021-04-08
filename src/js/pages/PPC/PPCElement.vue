<script lang="ts">
	import Vue from "vue";
	import PPCElementForm from "./PPCElementForm.vue";
	import {PPCElement, PPCElementParams} from "../../models/PPC/PPCElement";
	import {ReorderDirection} from "../../contracts/AppContracts";

	export interface PPCElementComponentContract extends Vue {
		toggleDetails: Function;
	}

	type PPCElementData = {
		details_active: boolean;
		form_active: boolean;
	}
	export default Vue.extend({
		props: {
			reorder_active: {
				type: Boolean,
				required: true
			},
			element: {
				required: true,
				type: PPCElement
			},
			item_number: {
				type: Number,
				required: true
			},
			is_first: {
				type: Boolean,
				required: true
			},
			is_last: {
				type: Boolean,
				required: true
			},
			is_disabled: {
				type: Boolean,
				required: true
			},
			is_view_only: {
				type: Boolean,
				required: true
			}
		},
		data: function (): PPCElementData {
			return {
				details_active: false,
				form_active: this.element.is_new
			}
		},
		computed: {
			/**
			 * Whether to hide the summary bar across the top of the element
			 */
			hide_summary: function () {
				return this.element.is_new;
			}
		},
		methods: {
			/**
			 * Respond to completion of the edit form
			 */
			handleUpdate: function (payload: PPCElementParams) {
				this.element.update(payload);
				this.form_active = false;
			},
			/**
			 * Respond to click on the delete icon
			 */
			triggerDelete: function () {
				this.$emit('delete-element');
			},
			/**
			 * Respond to cancel on the add form
			 */
			triggerCancel: function () {
				this.$emit('element-canceled');
			},
			/**
			 * Toggle open/close the details expanded content
			 */
			toggleDetails: function (open?: boolean) {
				if (open !== undefined) {
					this.details_active = open;
					return;
				}
				this.details_active = !this.details_active;
			},
			/**
			 * Toggle the editor form based on requested state
			 */
			toggleForm: function (open: boolean = true) {
				this.form_active = open;
			},
			/**
			 * Respond to user reordering element
			 */
			reorder: function (direction: ReorderDirection = "up") {
				this.$emit('reorder-element', direction);
			}
		},
		components: {
			"ppc-element-form": PPCElementForm
		},
		watch: {
			/**
			 * When opening the form, hide the details if they're active and report the toggle event
			 */
			form_active: function (value) {
				if (value === true) {
					this.details_active = false;
				}
				this.$emit('form-toggle', value);
			}
		}
	});
</script>