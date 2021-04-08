<script lang="ts">
	import Vue from "vue";
	import {SkaterSkatingEventSegment} from "../../models/SkaterSkatingEventSegment";

	import {
		MusicFetchArgs,
		MusicSavePayload,
		MusicSaveResponse
	} from "../../contracts/app/MusicContracts";
	import {default as MusicSongEditor, MusicSongEditorComponentContract} from "./MusicSongEditor.vue";
	import MusicCopyrightEditor from "./MusicCopyrightEditor.vue";
	import MusicLibrary from "./MusicLibrary.vue";
	import {Music} from "../../models/Music/Music";
	import {SiteOverlayComponent} from "../../components/SiteOverlay.vue"

	export interface MusicEditorComponent extends Vue {
		unsaved_changes: boolean
		saveMusic: Function
	}

	type MusicEditorData = {
		data_loaded: boolean,
		loading_timeout: boolean,
		load_error: boolean,
		notice: string,
		song_editor_active: boolean,
		copyright_editor_active: boolean,
		library_active: boolean,
		is_initial_upload: boolean,
		save_error: boolean,
		is_saving: boolean,
		show_music_action_items: boolean,
		show_copyright_information: boolean,
		confirm_remove: boolean
	}
	export default Vue.extend({
		props: {
			event_segment: {
				type: SkaterSkatingEventSegment,
				required: true
			},
			competition_id: {
				type: Number,
				required: true
			},
			is_view_only: {
				type: Boolean,
				required: true
			}
		},
		created: function () {
			this.initLoadingTimeout();
			this.fetchMusicData();
		},
		data: function (): MusicEditorData {
			return {
				data_loaded: false,
				loading_timeout: false,
				load_error: false,
				notice: "Loading...",
				song_editor_active: false,
				copyright_editor_active: false,
				library_active: false,
				is_initial_upload: false,
				save_error: false,
				is_saving: false,
				show_music_action_items: false,
				show_copyright_information: false,
				confirm_remove: false
			}
		},
		computed: {
			/**
			 * Whether to show the informational notice about loading or that a load error occurred
			 */
			show_notice: function () {
				if (!this.data_loaded) {
					return this.loading_timeout;
				}
				return this.load_error;
			},
			/**
			 * Whether the active music item has unsaved changes
			 */
			unsaved_changes: function () {
				return this.$store.getters['music/unsaved_changes'] || this.song_editor_active || this.copyright_editor_active;
			},
			/**
			 * Whether the path selection screen should show
			 */
			launch_point_active: function () {
				return this.music.file === null && !this.library_active && !this.song_editor_active;
			},
			/**
			 * Name of the step 1 editor box
			 */
			step_one_name: function () {
				return this.library_active ? "Library" : "Music"
			},
			/**
			 * The active music item
			 */
			music: function (): Music {
				return this.$store.getters['music/active_music'];
			},
			/**
			 * Whether to show the edit/delete controls on the step 1 box
			 */
			show_music_actions: function () {
				if (this.is_view_only) {
					return false;
				}
				return !this.song_editor_active && !this.library_active && !this.copyright_editor_active;
			},
			/**
			 * Whether the copyright box should be disabled with its content hidden
			 * Disable when music has no file as this indicates data is not ready for copyright step editor to load
			 *
			 */
			copyright_disabled: function () {
				return !this.music.file || this.song_editor_active;
			},
			/**
			 * Whether the save button should be disabled
			 */
			save_disabled: function () {
				return this.is_saving ||
					this.song_editor_active ||
					!this.music.has_been_played ||
					this.music.copyrights.length < 1 ||
					this.copyright_editor_active ||
					!this.unsaved_changes;
			},
			save_button_text: function (): string {
				if (this.is_view_only) {
					return "Exit";
				}
				return this.is_saving ? "Saving..." : "Save Music";
			},
			user_upload_capability: function () {
				return this.$store.getters['user/upload_file_capability'];
			},
			song_editor: function (): MusicSongEditorComponentContract {
				return this.$refs.song_editor as MusicSongEditorComponentContract;
			},
			deadline_passed_message: function (): string {
				if (!this.is_view_only) {
					return "";
				}
				if (this.music.has_been_played) {
					return "The Music deadline has passed. Please contact the LOC to make any changes."
				}
				return "The Music deadline has passed. Please contact the LOC to add music."
			},
			confirm_button_action: function () {
				if (this.is_view_only) {
					return this.exit;
				}
				return this.saveMusic;
			}
		},
		methods: {
			initLoadingTimeout: function () {
				let vm = this;
				setTimeout(function () {
					vm.loading_timeout = true;
				}, 200);
			},
			/**
			 * Fetch music data
			 * Music data for active event segment
			 * Music Library (state prevents multiple library fetches)
			 */
			fetchMusicData: function (): void {
				let vm = this;
				let fetch_args: MusicFetchArgs = {
					competition_id: this.competition_id,
					event_id: this.event_segment.event_id,
					event_segment_id: this.event_segment.segment_id,
					competition_skated_event_id: this.event_segment.competition_skated_event_id
				};
				this.$store.dispatch('music/fetchEventSegmentMusic', fetch_args).then(function () {
					vm.data_loaded = true;
				}).catch(function () {
					vm.load_error = true;
					vm.notice = "Error loading Music.";
				});
				this.$store.dispatch('music/fetchLibrary');
			},
			/**
			 * Trigger the file selection to lead into upload path
			 */
			selectFile: function () {
				(this.$refs.file_input as HTMLElement).click();
			},
			/**
			 * Handle file selection event for upload
			 */
			fileSelected: function (event: Event) {
				let input = event.target as HTMLInputElement;
				let files = input.files;
				let file;
				if (files && files.length) {
					file = files[0];
				}
				if (file) {
					this.library_active = false;
					this.song_editor_active = true;
					this.resetScroll();
					this.is_initial_upload = true;
					(this.$refs.input_form as HTMLFormElement).reset();
					this.$store.dispatch("music/handleFileSelection", file);
				}
			},
			/**
			 * Open the library
			 */
			openLibrary: function () {
				this.library_active = true;
			},
			/**
			 * Handle song selection from library
			 */
			handleLibrarySelect: function (song: Music) {
				this.$store.dispatch('music/selectFileFromLibrary', song);
				this.library_active = false;
				this.song_editor_active = false;
				this.is_initial_upload = false;
				this.resetScroll();
			},
			/**
			 * Wrapper for save functionality.  Run save process and followup tasks depending on caller
			 *
			 * 1. When called externally, run and return save promise
			 * 2. When called internally, run save process and handle exception case
			 */
			saveMusic: function (update_local: boolean = true): Promise<void> | void {
				if (!update_local) {
					return this.performMusicSave();
				}
				let vm = this;
				vm.performMusicSave().catch(function () {
					vm.save_error = true;
					setTimeout(function () {
						vm.save_error = false;
					}, 2000);
				});
			},
			/**
			 * Perform the save operation
			 * Emit completion event with server response upon completion
			 */
			performMusicSave: function (): Promise<void> {
				let vm = this;
				let save_payload = this.getSavePayload();
				this.is_saving = true;
				return new Promise(function (resolve, reject) {
					vm.$store.dispatch('music/saveAndConfirmMusic', save_payload).then(function (response: MusicSaveResponse) {
						vm.$emit('music-complete', response);
						vm.is_saving = false;
						resolve();
					}).catch(function () {
						vm.is_saving = false;
						reject();
					});
				});
			},
			/**
			 * Get the payload for saving the active music item
			 */
			getSavePayload: function (): MusicSavePayload {
				return {
					music: this.music,
					competition_id: this.competition_id,
					event_id: this.event_segment.event_id,
					event_segment_id: this.event_segment.segment_id,
					competition_skated_event_id: this.event_segment.competition_skated_event_id
				};
			},
			/**
			 * Handle event from child requesting closing of song editor
			 */
			handleCloseSongEditor: function () {
				this.song_editor_active = false;
				this.is_initial_upload = false;
			},
			/**
			 * Handle event from child indicating open/close of copyright form
			 */
			handleCopyrightFormToggle: function (is_open: boolean) {
				this.copyright_editor_active = is_open
			},
			/**
			 * Open the song editor
			 */
			openSongEdit: function () {
				this.song_editor_active = true;
				this.show_music_action_items = false;
				this.song_editor.openChildNameEditor();
			},
			/**
			 * Handle child report of canceling Music editor from initial upload
			 */
			cancelUploadPath: function () {
				this.$store.dispatch('music/clearActiveMusic');
				this.song_editor_active = false;
			},
			/**
			 * Handle the event where the user clicks the step 1 delete button
			 */
			removeMusic: function () {
				this.closeConfirmRemove();
				this.song_editor_active = false;
				this.library_active = false;
				this.$store.dispatch('music/clearActiveMusic');
			},
			/**
			 * Toggle the display of the copyright information tray
			 */
			toggleCopyrightInformation: function (toggle_open?: boolean) {
				if (typeof toggle_open !== 'undefined') {
					this.show_copyright_information = toggle_open;
					return;
				}
				this.show_copyright_information = !this.show_copyright_information;
			},
			exit: function () {
				this.$emit('close-music');
			},
			resetScroll: function () {
				let parent: SiteOverlayComponent = this.$parent as SiteOverlayComponent;
				if (parent && typeof parent.scrollTop === "function") {
					parent.scrollTop();
				}
			},
			confirmRemoveMusic: function () {
				this.confirm_remove = true;
				this.show_music_action_items = false;

			},
			closeConfirmRemove: function () {
				this.confirm_remove = false;
			}

		},
		destroyed: function () {
			this.$store.dispatch('music/resetActiveMusicState');
		},
		components: {
			"music-song-editor": MusicSongEditor,
			"music-copyright-editor": MusicCopyrightEditor,
			"music-library": MusicLibrary
		}
	});
</script>