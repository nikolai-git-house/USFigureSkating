<template>
	<div class="music-item" :class="{'music-item--hide-actions':hide_actions,'music-item--actions-expanded':actions_expanded,'music-item--is-playing':music_playing}">
		<div class="music-item__content">
			<div class="music-item__status">
				<slot name="status_content">
					<button v-on:click="button_action" class="play-button" :class="{'play-button--is-playing':music_playing,'play-button--is-loading':music_loading}">
						Play
					</button>
				</slot>
			</div>
			<div class="music-item__description" :class="{'music-item__description--editor-active':name_editor_active}">
				<div class="form-group" v-if="name_editor_active">
					<label for="music-item-song-name" class="field-label sr-only">Name</label>
					<input type="text" id="music-item-song-name" v-on:keydown.enter="closeNameEditor" class="form-field" v-model="song_name">
				</div>
				<div v-else>
					<p class="music-item__name">{{song_name}}</p>
					<p v-if="duration" class="music-item__duration">
						<span v-if="music_playing">{{current_time}}</span>
						<span v-if="music_playing">/</span>
						<span>{{duration}}</span>
					</p>
				</div>
			</div>
			<div v-if="allow_inline_edit" class="music-item__actions music-item__actions--inline">
				<button class="icon-button icon-button--edit" v-on:click="openNameEditor">Edit</button>
			</div>
			<div class="music-item__actions" v-else-if="actions_available">
				<button class="icon-button" :class="actions_expanded?'icon-button--close':'icon-button--more'" v-on:click="toggleActions">
					Expand Actions
				</button>
			</div>
			<div class="music-item__overlay" v-if="actions_expanded">
				<div class="action-overlay">
					<slot name="action"></slot>
				</div>
			</div>
		</div>
		<music-player v-if="music.file" ref="player" :file="music.file.url" v-on:playing-change="handlePlayChange" v-on:loading-change="handleLoadChange" v-on:duration-set="setDuration" v-on:current-time="setCurrent"></music-player>
	</div>
</template>
<script lang="ts">
	import Vue from "vue";
	import {Music} from "../../models/Music/Music";

	export interface MusicItemComponentContract extends Vue {
		song_name: string;
		reset: Function;
		name_editor_active: boolean;
		pause: Function;
		cancelNameEdit: Function;
		actions_expanded: boolean;
	}

	export default Vue.extend({
		props: {
			allow_inline_edit: {
				type: Boolean,
				default: false
			},
			music: {
				required: true,
				type: Music
			},
			actions_available: {
				type: Boolean,
				default: false
			}

		},
		data: function (): any {
			return {
				name_editor_active: false,
				song_name: this.music.name,
				music_playing: false,
				actions_expanded: false,
				music_loading: true,
				duration: "",
				current_time: "0:00"
			}
		},
		computed: {
			hide_actions: function () {
				return this.name_editor_active;
			},
			button_action: function () {
				return this.music_playing ? this.pause : this.play;
			}
		},
		methods: {
			pause: function () {
				this.$refs.player.pause();
				this.music_playing = false;
			},
			play: function () {
				this.music_playing = true;
				this.$refs.player.play();
			},
			handlePlayChange: function (is_playing: boolean) {
				this.music_playing = is_playing;
				this.$emit('music-item-play', this.music_playing);
			},
			handleLoadChange: function (is_loading: boolean) {
				this.music_loading = is_loading;
			},
			openNameEditor: function () {
				this.name_editor_active = true;
			},
			closeNameEditor: function () {
				this.name_editor_active = false;
			},
			reset: function () {
				this.name_editor_active = false;
			},
			toggleActions: function () {
				this.actions_expanded = !this.actions_expanded
			},
			setDuration: function (duration: string) {
				this.duration = duration;
			},
			setCurrent: function (current: string) {
				this.current_time = current;
			},
			cancelNameEdit: function () {
				this.name_editor_active = false;
				this.song_name = this.music.name;
			}
		},
		watch: {
			"music.name": function (value: string) {
				this.song_name = value;
			},
			actions_expanded: function (value: boolean) {
				this.$emit('actions-toggled', value);
			}
		}
	});
</script>