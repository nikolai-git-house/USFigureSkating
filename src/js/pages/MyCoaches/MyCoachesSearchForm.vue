<script lang="ts">
	import Vue from "vue";

	import {MyCoachesSearchParameters, FormOption, CoachResult} from "../../contracts/AppContracts";

	export default Vue.extend({
		data: function () {
			let form_data: MyCoachesSearchParameters = {
				member_number: null,
				first_name: null,
				last_name: null,
				state: null,
			};
			return {
				formData: form_data,
				error: {
					visible: false,
					message: ""
				},
				searching: {
					display: false,
					logic: false,
					timeout: 0
				}
			}
		},
		computed: {
			/**
			 * Options for state form input
			 */
			state_options: function (): FormOption[] {
				let local_options:FormOption[] = <FormOption[]>[...this.$store.getters['coach_search/state_options']];
				local_options.unshift({
					label: "Any",
					value: null
				});
				return local_options;
			},
			/**
			 * Text for search button
			 */
			search_button_text: function () {
				if (this.searching.display) {
					return "Searching";
				}
				return "Search"
			},
			/**
			 * Whether search form controls are disabled
			 */
			inputs_disabled: function () {
				return this.searching.display;
			},
			/**
			 * Whether the form has any values present
			 */
			form_value_present: function (): boolean {
				for (let i in this.formData) {
					if (this.formData[i]) {
						return true;
					}
				}
				return false;
			}
		},
		methods: {
			/**
			 * Display the supplied error message below the form
			 *
			 * If a timeout is provided, error will disappear in that many milliseconds
			 */
			setError: function (message: string, timeout?: number) {
				this.error.message = message;
				this.error.visible = true;
				if (timeout) {
					let vm = this;
					setTimeout(function () {
						vm.clearError();
					}, timeout)
				}
			},
			/**
			 * Clear errors
			 */
			clearError: function () {
				this.error.message = "";
				this.error.visible = false;
			},
			/**
			 * Set that the search is currently running
			 */
			setSearching: function () {
				this.searching.logic = true;
				let vm = this;
				vm.searching.timeout = window.setTimeout(function () {
					vm.searching.display = true;
				}, 100)
			},
			/**
			 * Set that the search is no longer running
			 */
			clearSearching: function () {
				if (this.searching.timeout) {
					clearTimeout(this.searching.timeout);
				}
				this.searching.logic = false;
				this.searching.display = false;
			},
			/**
			 * Clear all form inputs
			 */
			clearForm: function () {
				for (let i in this.formData) {
					this.formData[i] = null;
				}
			},
			/**
			 * Run the search
			 *
			 * Display error on no results or server error
			 *
			 * Emit success event upon results
			 */
			doSearch: function () {
				if (this.searching.logic) {
					return;
				}
				this.setSearching();
				this.clearError();
				if (!this.form_value_present) {
					this.setError("Please enter search criteria.");
					this.clearSearching();
					return;
				}
				let vm = this;
				this.$store.dispatch('coach_search/coachSearch', this.formData).then(function (results: CoachResult[]) {
					vm.clearSearching();
					if (results.length) {
						vm.$emit('search-success');
						return;
					}
					vm.setError("No results found.");
				}).catch(function () {
					vm.clearSearching();
					vm.setError("Search error. Please try again.", 2000);
				});
			}
		},
		created: function () {
			/**
			 * When form data changes, clear any errors on the form
			 */
			this.$watch('formData', function () {
				this.clearError();
			}, {
				deep: true
			});
		}
	});
</script>