<script lang="ts">
	import Vue from "vue";
	import EMSSupportForm from "./EMSSupport/EMSSupportForm.vue";
	import {User} from "../models/User";

	export default Vue.extend({
		created: function () {
			this.initLoadingTimeout();
			this.loadData();
		},
		data: function (): {
			loading_timeout: boolean,
			load_error: boolean,
			dependencies: {
				[key: string]: boolean;
				user_info: boolean,
				form_options: boolean,
			},
			show_confirmation: boolean
		} {
			return {
				loading_timeout: false,
				load_error: false,
				dependencies: {
					user_info: false,
					form_options: false,
				},
				show_confirmation: false
			}
		},
		computed: {
			/**
			 * Whether the component data is fully loaded.
			 */
			loaded: function () {
				for (let i in this.dependencies) {
					if (this.dependencies.hasOwnProperty(i)) {
						let obj = this.dependencies[i];
						if (obj !== true) {
							return false;
						}
					}
				}
				return true;
			},
			/**
			 * The active user object
			 */
			user: function (): User {
				return this.$store.getters['user/user'];
			}
		},
		methods: {
			/**
			 * Load necessary data for the component
			 */
			loadData: function () {
				let vm = this;
				this.$store.dispatch('app/fetchEMSSupportFormOptions').then(function () {
					vm.dependencies.form_options = true;
				}).catch(function () {
					vm.dependencies.form_options = true;
					vm.load_error = true;
				});
				if (this.user.member_number !== -1) {
					vm.dependencies.user_info = true;
				}
			},
			/**
			 * Initialize timeout to determine whether enough time has elapsed to show loading info
			 */
			initLoadingTimeout: function () {
				let vm = this;
				setTimeout(function () {
					vm.loading_timeout = true;
				}, 200);
			},
			/**
			 * Handle successful submission of the form
			 */
			handleSubmissionSuccess: function () {
				this.show_confirmation = true;
			},
			/**
			 * Reset the component
			 */
			reset: function () {
				this.show_confirmation = false;
			}
		},
		components: {
			'ems-support-form': EMSSupportForm
		},
		watch: {
			"user.member_number": function (value: number) {
				if (value !== -1) {
					this.dependencies.user_info = true;
				}
			}
		}
	});
</script>