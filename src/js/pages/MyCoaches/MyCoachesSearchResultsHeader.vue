<script lang="ts">
	import Vue from "vue";

	export default Vue.extend({
		props: {
			edit_handler: {
				required: true,
				type: Function
			}
		},
		mounted: function () {
			this.per_page = this.default_per_page;
		},
		data: function () {
			let per_page: number | "all" = 10;
			return {
				per_page: per_page
			}
		},
		computed: {
			total_count: function (): number {
				return this.$store.getters['coach_search/result_count'];
			},
			current_spread: function () {
				return this.$store.getters['coach_search/current_spread'];
			},
			per_page_options: function () {
				return this.$store.getters['coach_search/per_page_options'];
			},
			default_per_page: function () {
				return this.per_page_options[0].value;
			},
		},
		watch: {
			per_page: function (value) {
				this.$store.commit('coach_search/setPerPage', value);
				this.$store.commit('coach_search/setActivePageIndex', 0);
			}
		}
	});
</script>