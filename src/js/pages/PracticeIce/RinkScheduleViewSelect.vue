<script lang="ts">
	import Vue from "vue";

	export default Vue.extend({
		/**
		 * Reactive data on the component:
		 * 1. selected_view_filters - the user selected filters that have not yet been applied.
		 * 2. apply_attempt - whether the user has tried to apply the selected view filters yet.
		 */
		data: function () {
			return {
				selected_view_filters: [],
				apply_attempt: false
			}
		},
		/**
		 * Data provided by parent components:
		 * 1. current_views - the currently active view filters.
		 * 2. available_views - the possible options for view filters a user can select.
		 */
		props: {
			current_views: {
				required: true,
				default: function (): string[] {
					return [];
				}
			},
			available_views: {
				required: true,
				default: function (): string[] {
					return [];
				}
			}
		},
		/**
		 * Methods the component can call on runtime.
		 */
		methods: {
			/**
			 * Apply the view filters the user has selected.
			 * 1. Register user has attempted to apply the view filters.
			 * 2. If user selections are valid, report the change to parent components.
			 */
			applyViewSelections: function () {
				this.apply_attempt = true;
				if (this.selected_view_filters.length) {
					this.apply_attempt = false;
					this.$emit('views_changed', this.selected_view_filters);
				}
			}
		},
		/**
		 * Upon creation, set the selected filters to those that are currently active in the parent component
		 */
		created: function () {
			this.selected_view_filters = this.$props.current_views;
		},
		/**
		 * Properties computed on component data change:
		 */
		computed: {
			/**
			 * Whether to show the view selection error.  User must attempt to apply view filters with none selected
			 */
			show_error: function (): boolean {
				return this.apply_attempt && this.selected_view_filters.length < 1;
			}
		}
	});
</script>