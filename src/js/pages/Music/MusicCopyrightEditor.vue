<script lang="ts">
	import Vue from "vue";
	import {Music} from "../../models/Music/Music";
	import MusicCopyrightForm from "./MusicCopyrightForm.vue"
	import MusicCopyrightItem from "./MusicCopyrightItem.vue"
	import {CopyrightFormData, CopyrightUpdatePayload} from "../../contracts/app/MusicContracts";

	export default Vue.extend({
		props: {
			is_view_only: {
				type: Boolean,
				default: false
			}
		},
		data: function (): {
			form_active: boolean,
			active_copyright_index: number
		} {
			return {
				form_active: false,
				active_copyright_index: -1
			}
		},
		computed: {
			music: function (): Music {
				return this.$store.getters['music/active_music'];
			},
			copyrights: function () {
				return this.music.copyrights;
			},
			/**
			 * Whether to show the copyright summary list
			 */
			show_summary: function () {
				return !this.form_active;
			},
			/**
			 * Whether to show the add copyright button
			 */
			show_add: function () {
				if (this.is_view_only) {
					return false;
				}
				return !this.form_active;
			},
			/**
			 * The copyright item currently being interacted with
			 */
			active_copyright: function () {
				return this.copyrights[this.active_copyright_index];
			}
		},
		/**
		 * Upon component instance creation...
		 *
		 * 1. if the active music has no copyright items, automatically open the form
		 */
		created: function () {
			if (this.copyrights.length < 1) {
				this.form_active = true;
				this.active_copyright_index = 0;
			}
		},
		methods: {
			/**
			 * Start the add copyright process
			 */
			addCopyright: function () {
				this.form_active = true;
				this.active_copyright_index = this.copyrights.length;
			},
			/**
			 * Start the edit copyright process for a copyright at a given index
			 */
			editCopyright: function (copyright_index: number) {
				this.active_copyright_index = copyright_index;
				this.form_active = true;
			},
			/**
			 * Remove a copyright at a given index.
			 *
			 * If resulting copyright set no longer has any items, open the copyright form
			 */
			deleteCopyright: function (copyright_index: number) {
				this.$store.commit('music/removeCopyright', copyright_index);
				if (this.copyrights.length < 1) {
					this.addCopyright();
				}
			},
			/**
			 * Reset the state of the component to baseline
			 *
			 * 1. Deactivate the form
			 * 2. Reset the active copyright item index
			 */
			reset: function () {
				this.form_active = false;
				this.active_copyright_index = -1;
			},
			/**
			 * Cancel the edit of a copyright item
			 */
			cancelEdit: function () {
				this.reset();
			},
			/**
			 * Save active copyright edits
			 *
			 * Note, this only saves updates to the copyright item in state, not on the server
			 */
			saveCopyright: function (copyright_data: CopyrightFormData) {
				let update_payload: CopyrightUpdatePayload = {
					copyright_data,
					index: this.active_copyright_index
				};
				this.$store.commit('music/updateCopyright', update_payload);
				this.reset();
			},
			/**
			 * The display value for a summary field
			 */
			summaryFieldValue: function (field_value: any) {
				return field_value ? field_value : "Not complete";
			},
			/**
			 * Class to apply to a summary field
			 */
			summaryFieldClass: function (field_value: any) {
				return field_value ? null : "music-copyright-summary__field--incomplete";
			}
		},
		components: {
			"music-copyright-form": MusicCopyrightForm,
			"music-copyright-item": MusicCopyrightItem
		},
		watch: {
			form_active: function (value) {
				this.$emit('copyright-editor-active', value);
			}
		}
	});
</script>