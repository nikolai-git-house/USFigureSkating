<script lang="ts">
	import Vue from "vue";
	import {CopyrightFormData} from "../../contracts/app/MusicContracts";
	import {MusicCopyright} from "../../models/Music/MusicCopyright";
	import {CopyrightFormValidator} from "./CopyrightFormValidator";

	export default Vue.extend({
		props: {
			source_copyright: {
				type: MusicCopyright,
				required: false
			},
			copyright_count: {
				type: Number,
				required: true
			}
		},
		/**
		 * Upon component instance creation...
		 *
		 * 1. If a source item is present, create formData state from it
		 */
		created: function () {
			if (this.source_copyright) {
				this.formData = this.source_copyright.getFormData()
			}
		},
		data: function (): {
			formData: CopyrightFormData,
			submit_attempt: boolean,
			arrangement_tip_open: boolean
		} {
			return {
				formData: {
					title: null,
					artist: null,
					arrangement: null,
					record_label: null,
					duration_minutes: null,
					duration_seconds: null
				},
				submit_attempt: false,
				arrangement_tip_open: false
			}
		},
		methods: {
			fieldClass: function (field_name: string) {
				if (!this.submit_attempt) {
					return;
				}
				if (field_name in this.errors || "global" in this.errors) {
					return "has-error";
				}
			},
			fieldMessage: function (field_name: string) {
				if (!this.submit_attempt) {
					return;
				}
				if (field_name in this.messages) {
					return this.messages[field_name][0];
				}
			},
			/**
			 * Handle cancel button click event
			 */
			cancel: function () {
				this.$emit('cancel-edit');
			},
			/**
			 * Start save process
			 */
			save: function () {
				this.submit_attempt = true;
				if (!this.valid) {
					return;
				}
				this.$emit('save-copyright', this.formData);
			},
			toggleArrangementTip: function (toggle_open?: boolean) {
				if (typeof toggle_open !== 'undefined') {
					this.arrangement_tip_open = toggle_open;
					return;
				}
				this.arrangement_tip_open = !this.arrangement_tip_open;
			}
		},
		computed: {
			/**
			 * Whether the form is valid
			 */
			valid: function () {
				return Object.keys(this.errors).length === 0;
			},
			/**
			 * The validation result on the form
			 */
			validation_result: function () {
				return new CopyrightFormValidator(this.formData).validate();
			},
			/**
			 * Validation errors on the form
			 */
			errors: function () {
				return this.validation_result.errors;
			},
			/**
			 * Validation messages on the form
			 */
			messages: function (): { [key: string]: string[] } {
				return this.validation_result.messages;
			},
			/**
			 * Whether the cancel button should show
			 */
			show_cancel: function () {
				return this.copyright_count > 0;
			}
		}
	});
</script>