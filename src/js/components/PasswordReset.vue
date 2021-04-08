<script lang="ts">
	import Vue from "vue";

	export default Vue.extend({
		data: function () {
			return {
				account_select_active: false,
				email: "",
				done: false,
				account: "",
				email_not_found: false,
				account_select_error: false
			}
		},
		watch: {
			email: function () {
				this.email_not_found = false;
			},
			account: function () {
				this.account_select_error = false;
			}
		},
		methods: {
			showAccountSelect: function (): void {
				this.account_select_active = true;
			},
			/**
			 * Process form submission
			 */
			submit: function (): void {
				/*Stub for multiple accounts*/
				if (this.email === "multiple" && !this.account) {
					if (this.account_select_active) {
						this.account_select_error = true;
						return;
					}
					this.showAccountSelect();
					return;
				}
				/*Stub for no account for email */
				if (this.email === "error" && !this.account) {
					this.email_not_found = true;
					return;
				}
				this.account_select_active = false;
				this.done = true;
				this.email = "";
			},
			showOverlay: function (): boolean {
				return this.account_select_active || this.done
			},
			handleOverlayClose: function () {
				if (this.done) {
					// user closed confirmation overlay
					return location.assign('/');
				}
				if (this.account_select_active) {
					//user closed account select overlay
					return location.assign('/');
				}
			}

		}
	});
</script>