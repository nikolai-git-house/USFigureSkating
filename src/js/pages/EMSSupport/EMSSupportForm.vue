<script lang="ts">
	import Vue from "vue";
	import {EMSSupportFormValidator} from "../../models/EMSSupport/EMSSupportFormValidator";
	import {EMSSupportIssueTypeOption, EMSSupportSubmitResult} from "../../contracts/AppContracts";
	import {FormValidatorResult, FormValidatorErrors, FormValidatorMessages} from "../../models/FormValidator";
	import {EMSSupportFormData} from "../../models/EMSSupport/EMSSupportFormData";
	import {User} from "../../models/User";

	export default Vue.extend({
		data: function (): {
			submit_attempt: boolean,
			formData: EMSSupportFormData,
			submitting: boolean,
			submission_error: string | false
		} {
			return {
				submit_attempt: false,
				formData: new EMSSupportFormData(),
				submitting: false,
				submission_error: false
			}
		},
		computed: {
			/**
			 * Whether the form is valid
			 */
			valid: function (): boolean {
				return Object.keys(this.errors).length === 0;
			},
			/**
			 * The validation result on the form
			 */
			validation_result: function (): FormValidatorResult {
				return new EMSSupportFormValidator(this.formData).validate();
			},
			/**
			 * Validation errors on the form
			 */
			errors: function (): FormValidatorErrors {
				return this.validation_result.errors;
			},
			/**
			 * Validation messages on the form
			 */
			messages: function (): FormValidatorMessages {
				return this.validation_result.messages;
			},
			/**
			 * Whether the subtype input is disabled
			 */
			subtype_disabled: function (): boolean {
				return !this.formData.issue_type || this.available_subtypes.length < 1;
			},
			/**
			 * The placeholder text for the subtype input
			 */
			subtype_placeholder: function (): string {
				if (!this.formData.issue_type || (this.formData.issue_type && this.available_subtypes.length)) {
					return "Select one..."
				}
				return "None"
			},
			/**
			 * The type options for the Issue Type input
			 */
			type_options: function (): EMSSupportIssueTypeOption[] {
				return this.$store.getters['app/ems_support_issue_type_options'];
			},
			/**
			 * The subtype input options
			 */
			available_subtypes: function (): string[] {
				if (!this.formData.issue_type) {
					return [];
				}
				return this.formData.issue_type.subtypes;
			},
			/**
			 * The active user object
			 */
			user: function (): User {
				return this.$store.getters['user/user'];
			}
		},
		/**
		 * Actions once component is mounted
		 *
		 * 1. Set default member number and email on the form
		 * 2. Attach form data listener
		 */
		mounted: function () {
			this.formData.member_number = this.user.member_number;
			this.formData.email = this.user.email;
			this.watchFormData();

		},
		methods: {
			/**
			 * The additional class to add to a field's input
			 */
			fieldClass: function (field_name: string): string | undefined {
				if (!this.submit_attempt) {
					return;
				}
				if (field_name in this.errors) {
					return "has-error";
				}
			},
			/**
			 * The current validation messages for a given field
			 */
			fieldMessage: function (field_name: string): string | undefined {
				if (!this.submit_attempt) {
					return;
				}
				if (field_name in this.messages) {
					return this.messages[field_name][0];
				}
			},
			/**
			 * Perform the form submission
			 */
			submitForm: function (): void {
				let vm = this;
				this.submit_attempt = true;

				if (!this.valid) {
					return;
				}
				this.submitting = true;
				this.$store.dispatch('app/submitEMSSupportForm', this.formData.export()).then(function (result: EMSSupportSubmitResult) {
					vm.submitting = false;
					if (result.success) {
						vm.$emit('submission-success');
						return;
					}
					vm.submission_error = result.error;

				}).catch(function () {
					vm.submitting = false;
					vm.submission_error = "Error submitting form."
				});
			},
			/**
			 * Watch props on form data and attach global watcher to change on each
			 */
			watchFormData: function () {
				let watchable_props = [
					'member_number',
					'email',
					'phone',
					'issue_type',
					'subtype',
					'description',
				];
				for (let i = 0; i < watchable_props.length; i++) {
					let prop = watchable_props[i];
					this.$watch('formData.' + prop, this.formDataChange)
				}
			},
			/**
			 * Respond to change on any element of form data
			 *
			 * 1. Clear form submission error if it exists
			 */
			formDataChange: function () {
				if (this.submission_error) {
					this.submission_error = false;
				}
			}
		},
		watch: {
			/**
			 * When issue type changes, reset the subtype
			 */
			"formData.issue_type": function (): void {
				this.formData.subtype = null;
			}
		},

	});
</script>