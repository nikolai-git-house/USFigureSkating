<script lang="ts">
	import Vue from "vue";
	import {PaginationOption} from "../../contracts/AppContracts";

	export default Vue.extend({
		computed: {
			paginated_results: function () {
				return this.$store.getters['coach_search/paginated_results'];
			},
			active_page_index: function () {
				return this.$store.state.coach_search.active_page_index;
			},
			previous_disabled: function () {
				return this.active_page_index === 0;
			},
			next_disabled: function () {
				return this.active_page_index === this.paginated_results.length - 1;
			},
			pagination_options: function (): PaginationOption[] {
				return this.$store.getters['coach_search/pagination_options'];
			}
		},
		methods: {
			/**
			 * Set the active page within the paged result set
			 */
			setActivePage: function (page_index: number) {
				if (page_index >= this.paginated_results.length || page_index < 0) {
					return;
				}
				this.$store.commit('coach_search/setActivePageIndex', page_index);
			}
		}
	});
</script>