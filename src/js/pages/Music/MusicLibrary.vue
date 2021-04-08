<script lang="ts">
	import Vue from "vue";
	import {Music} from "../../models/Music/Music";
	import {SavedMusic} from "../../models/Music/SavedMusic";
	import {default as MusicItemComponent, MusicItemComponentContract} from "./MusicItem.vue";

	type popupAction = {
		label: string,
		action: Function,
		disabled?: boolean
		class?: string
	}
	type firePopupArgs = {
		title: string,
		message: string,
		actions: popupAction[]
	}
	export default Vue.extend({
		data: function (): {
			popup: {
				active: boolean,
				title: string,
				message: string,
				actions: popupAction[],
				error?: string
			}
		} {
			return {
				popup: {
					active: false,
					title: "",
					message: "",
					actions: [],
				}
			}
		},
		computed: {
			library_songs: function (): Music[] {
				return this.$store.getters['music/library'].all();
			},
			load_error: function (): boolean {
				return this.$store.getters['music/library_load_error'];
			},
			loading: function (): boolean {
				return this.$store.getters['music/library_loading'];
			},
			user_upload_capability: function () {
				return this.$store.getters['user/upload_file_capability'];
			},
			music_items: function (): MusicItemComponentContract[] {
				return this.$refs.songs as MusicItemComponentContract[];
			}
		},
		methods: {
			firePopup: function (args: firePopupArgs) {
				this.popup.active = true;
				this.popup.title = args.title;
				this.popup.actions = args.actions;
				this.popup.message = args.message;
			},
			closePopup: function () {
				this.popup.active = false;
				this.popup.title = "";
				this.popup.message = "";
				this.popup.actions = [];
				if (this.popup.error) {
					delete this.popup.error;
				}
			},
			selectSong: function (song: Music, index: number) {
				this.closeItemActions(index);
				let vm = this;
				this.firePopup({
					title: "Add Song",
					message: "Add " + song.name + " to your program?",
					actions: [
						{
							label: "Cancel",
							action: this.closePopup,
							class: "button--info"
						},
						{
							label: "Ok",
							action: function () {
								vm.$emit('library-song-selected', song);
							}
						}
					]
				});
			},
			deleteSong: function (song: SavedMusic, index: number) {
				this.closeItemActions(index);
				let vm = this;
				if (song.is_assigned_to_program) {
					this.firePopup({
						title: "Cannot Delete Song",
						message: "This song is assigned to a program and cannot be deleted. To delete this song, remove it from all programs and try again.",
						actions: [
							{
								label: "Ok",
								action: this.closePopup
							}
						]
					});
					return;
				}
				this.firePopup({
					title: "Remove Song",
					message: "Are you sure you want to remove " + song.name + " from your library?",
					actions: [
						{
							label: "Cancel",
							action: this.closePopup,
							class: "button--info"
						},
						{
							label: "Ok",
							action: function () {
								Vue.set(vm.popup.actions[1], 'disabled', true);
								Vue.set(vm.popup.actions[1], 'label', "Removing...");
								Vue.set(vm.popup, 'error', undefined);
								vm.$store.dispatch('music/removeLibrarySong', song).then(function () {
									vm.closePopup();
								}).catch(function () {
									Vue.set(vm.popup.actions[1], 'disabled', false);
									Vue.set(vm.popup.actions[1], 'label', "Ok");
									Vue.set(vm.popup, 'error', "Error removing song from library.");
								});
							}
						}
					]
				});
			},
			uploadNewFile: function () {
				this.$emit('upload-new-file');
			},
			handleSongPlay: function (is_play_event: boolean, index: number) {
				if (!is_play_event) {
					return;
				}
				for (let i = 0; i < this.music_items.length; i++) {
					let music_item = this.music_items[i];
					if (i !== index) {
						music_item.pause();
					}

				}
			},
			handleItemActionToggle: function (is_open_event: boolean, index: number) {
				if (is_open_event) {
					this.closeAllItemActions(index);
				}
			},
			closeAllItemActions: function (exclude_index?: number) {
				for (let i = 0; i < this.music_items.length; i++) {
					if (i === exclude_index) {
						continue;
					}
					this.music_items[i].actions_expanded = false;
				}
			},
			closeItemActions: function (index: number) {
				this.music_items[index].actions_expanded = false;
			}
		},
		components: {
			"music-item": MusicItemComponent
		}
	});
</script>