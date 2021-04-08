<script lang="ts">
	import Vue from "vue";
	import axios from "axios";
	import {URL_CONFIG} from "../config/AppConfig";

	export default Vue.extend({
		data: function () {
			return {
				member_number: "",
				password: "",
				submitting: false,
				server_message: "",
				login_success: false
			}
		},
		watch: {
			password: function (): void {
				this.server_message = "";
			},
			member_number: function (): void {
				this.server_message = "";
			}
		},
		methods: {
			/**
			 * Handle error state following submission
			 */
			_handleSubmissionFailure: function (message: string): void {
				this.submitting = false;
				this.server_message = message;
			},
			/**
			 * Handle successful login submission
			 */
			_handleSubmissionSuccess: function (): void {
				this.login_success = true;
				(this.$refs.secondaryForm as HTMLFormElement).submit();
			},
			/**
			 * Perform form submission actions
			 */
			_doSubmit: function (): void {
				let vm = this;
				axios.post(URL_CONFIG.login, {
					username: this.member_number,
					password: this.password
				}, {
					headers: {
						'Content-Type': 'application/json'
					}
				}).then(function (response) {
					if (response.data.Success === false) {
						return vm._handleSubmissionFailure(response.data.Message);
					}
					return vm._handleSubmissionSuccess();
				}).catch(function (error) {
					vm._handleSubmissionFailure("Login error: " + error.response.status + " " + error.response.data);
				});
				vm.submitting = false;
			},
			/**
			 * Handle user Form Submission action
			 */
			formSubmit: function (): void {
				if (this.submitting) {
					return;
				}
				this.submitting = true;
				this._doSubmit();
			}
		}
	});
</script>