<script lang="ts">
	import Vue from "vue";
	import {RinkScheduleActiveFilters} from "../../contracts/RinkScheduleFiltersContracts";
	import RinkScheduleViewSelect from "./RinkScheduleViewSelect.vue";

	export default Vue.extend({
		props: {
			active_filters: {
				type: RinkScheduleActiveFilters,
				required: true
			},
			available_filters: {
				type: Object,
				required: true
			}
		},
		data: function () {
			return {
				view_select_active: false
			}
		},
		methods: {
			/**
			 * Event handler when child accordion component is toggled
			 */
			accordionToggle: function () {
				this.view_select_active = !this.view_select_active;
			},
			/**
			 * Handle child event of view filter selection.
			 * 1. Update active filters.
			 * 2. Close view selection accordion.
			 * 3. Report a filter change.
			 */
			handleViewFilterChange: function (payload: string[]) {
				Vue.set(this.active_filters, 'view', payload);
				this.view_select_active = false;
				this.reportFilterChange();
			},
			/**
			 * Notify parent components that a filter has changed.
			 * Currently used to update the auto height of swiper slides
			 */
			reportFilterChange: function () {
				this.$emit('filter_changed');
			},
		},
		computed: {
			/**
			 * The label for the currently selected view
			 */
			active_view_label: function () {
				if (this.view_select_active) {
					return "Select Schedule View";
				}
				let active_labels: string[] = [];
				for (let i = 0; i < this.available_filters.views.length; i++) {
					let view_conf = this.available_filters.views[i];
					if (this.active_filters.view.indexOf(view_conf.value) !== -1) {
						let label = view_conf.label;
						if (label === "Available Practice Ice") {
							label = "Available";
						}
						active_labels.push(label);
					}
				}
				return active_labels.join(' + ');
			}
		},
		components: {
			'rink-schedule-view-select': RinkScheduleViewSelect,
		}
	});
</script>