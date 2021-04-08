<script lang="ts">
	import Vue from "vue";
	import {SkaterEventCategoryCoach} from "../../contracts/AppContracts";
	import SearchResultsHeader from "./MyCoachesSearchResultsHeader.vue"
	import SearchResultsPagination from "./MyCoachesSearchResultsPagination.vue"

	export default Vue.extend({
		data: function () {
			return {
				ineligible_popup_index: -1,
				processing_index: -1,
				selection_index: -1,
				selection_error: ""
			}
		},
		computed: {
			active_category_id: function () {
				return this.$store.state.coach_search.active_category_id;
			},
			active_results: function () {
				return this.$store.getters['coach_search/active_results'];
			},
			dispatch_event: function () {
				let active_action = this.$store.state.coach_search.active_action;
				return active_action === "add" ? "coach_search/addCoach" : "coach_search/replaceCoach";
			},
			pagination_available: function () {
				return this.$store.getters['coach_search/pagination_available'];
			}
		},
		methods: {
			/**
			 * Disable Add buttons when an ineligible popup is active or
			 * the coach is already selected for the active category
			 */
			addButtonDisabled: function (coach_id: number) {
				if (this.ineligible_popup_index !== -1) {
					return true;
				}
				if (this.processing_index !== -1) {
					return true;
				}
				return this.coachAlreadySelected(coach_id);
			},
			/**
			 * Handle coach selection event
			 */
			selectCoach: function (index: number, coach: SkaterEventCategoryCoach) {
				this.selection_index = index;
				this.selection_error = "";
				this.processing_index = index;
				let vm = this;
				this.$store.dispatch(this.dispatch_event, coach).then(function () {
					vm.$store.commit('coach_search/closeSearch');
					vm.processing_index = -1;
				}).catch(function () {
					vm.selection_error = "Error selecting coach.";
					vm.processing_index = -1;
				});
			},
			showSelectionError: function (index: number) {
				return index === this.selection_index && this.selection_error;
			},
			/**
			 * Return whether a coach has already been selected for the active category
			 */
			coachAlreadySelected: function (coach_id: number) {
				return this.$store.getters['skater/categoryCoachSelected'](this.active_category_id, coach_id)
			},
			/**
			 * Whether to show the warning popup when selecting an ineligible coach
			 */
			showIneligiblePopup: function (index: number) {
				return this.ineligible_popup_index === index;
			},
			closeIneligiblePopup: function () {
				this.ineligible_popup_index = -1;
			}
		},
		components: {
			'search-results-header': SearchResultsHeader,
			'search-results-pagination': SearchResultsPagination
		}
	});
</script>