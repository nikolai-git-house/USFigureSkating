<script lang="ts">
	import Vue from "vue";
	import {default as MusicItemComponent, MusicItemComponentContract} from "./MusicItem.vue";

	export interface MusicSongEditorComponentContract extends Vue {
		openChildNameEditor: Function;
	}

	export default Vue.extend({
		props: {
			editor_active: {
				type: Boolean,
				required: true
			},
			is_initial_upload: {
				type: Boolean,
				required: true
			}
		},
		data: function () {
			let song_name = this.$store.getters['music/active_music'].name;
			return {
				song_name: song_name,
				edit_initial_upload_active: false
			}
		},
		computed: {
			upload_active: function () {
				return this.$store.getters['music/upload_active'];
			},
			upload_progress: function () {
				return this.$store.getters['music/upload_progress'];
			},
			upload_error: function () {
				return this.$store.getters['music/upload_error'];
			},
			show_inline_edit_icon: function () {
				return this.is_initial_upload && !this.upload_active && !this.edit_name_active && !this.upload_error;
			},
			show_cta: function (): boolean {
				return this.editor_active && !this.upload_active && !this.upload_error;
			},
			song_unplayed: function () {
				return !this.active_music.has_been_played;
			},
			active_music: function () {
				return this.$store.state.music.active_music;
			},
			save_disabled: function () {
				return this.song_unplayed;
			},
			edit_name_active: function () {
				if (this.is_initial_upload) {
					return this.edit_initial_upload_active;
				}
				return this.editor_active;
			},
			cancel_button_action: function () {
				if (this.is_initial_upload) {
					return this.cancelUploadPath;
				}
				return this.cancelEdits;
			},
			user_upload_capability: function () {
				return this.$store.getters['user/upload_file_capability'];
			},
			show_upload_indicator: function () {
				return !this.active_music.file;
			},
			hide_song_actions: function () {
				return !this.active_music.file || !this.is_initial_upload;
			},
			music_item_component: function (): MusicItemComponentContract {
				return this.$refs.music_item as MusicItemComponentContract;
			}
		},
		methods: {
			saveSong: function () {
				let music_component = this.music_item_component;
				if (music_component.song_name !== this.active_music.name) {
					this.$store.commit('music/setActiveMusicName', music_component.song_name);
				}
				music_component.reset();
				this.edit_initial_upload_active = false;
				this.$emit('close-editor');
			},
			/**
			 * Cancel edit to the song
			 */
			cancelEdits: function () {
				this.song_name = this.active_music.name;
				this.music_item_component.cancelNameEdit();
				this.$emit('close-editor');
			},
			/**
			 * Cancel the entire upload path
			 */
			cancelUploadPath: function () {
				this.$emit('cancel-upload-path');
			},
			openUploadEdit: function () {
				this.edit_initial_upload_active = true;
			},
			handleSongPlay: function (is_play_event: boolean) {
				if (is_play_event) {
					this.$store.commit('music/setActiveHasBeenPlayed', true);
				}
			},
			openLibrary: function () {
				this.$emit('return-to-library')
			},
			selectFile: function () {
				this.$emit('select-new-file');
			},
			openChildNameEditor: function () {
				this.music_item_component.name_editor_active = true;
			}
		},
		watch: {
			"active_music.name": function (value) {
				this.song_name = value;
			}
		},
		components: {
			"music-item": MusicItemComponent
		}
	});
</script>