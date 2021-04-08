<template>
	<div class="music-player">
		<p class="music-player__time" v-show="duration">
			{{display_current}} / {{display_duration}}
		</p>
		<div class="music-player__scrub" v-show="duration">
			<input class="music-player__input" v-on:mousedown="handleScrubStart" v-on:mouseup="handleScrubEnd" v-on:touchstart="handleScrubStart" v-on:touchend="handleScrubEnd" type="range" min="0" :value="progress" v-on:input="handleRangeInput" v-on:change="handleRangeChange" max="1" step="any">
			<div class="music-player__progress progress">
				<span class="progress__track"></span>
				<span class="progress__progress" :style="'width:'+ progress_attribute"></span>
				<span class="progress__buffer" :style="'width:'+ buffered_attribute"></span>
			</div>
		</div>
		<audio ref="audio" :src="file"></audio>
	</div>
</template>
<script lang="ts">
	import Vue from "vue";

	export default Vue.extend({
		props: {
			file: {
				type: String
			}
		},
		data: function (): {
			current_time: number,
			duration: number,
			audio_element: HTMLMediaElement,
			progress: number,
			is_ui_playing: boolean,
			is_loading: boolean,
			buffered: number
		} {
			return {
				current_time: 0,
				duration: 0,
				audio_element: document.createElement('audio'),
				progress: 0,
				is_ui_playing: false,
				is_loading: true,
				buffered: 0
			}
		},
		mounted: function () {
			this.audio_element = this.$refs.audio as HTMLMediaElement;
			this.addEventListeners();
		},
		beforeDestroy: function () {
			this.removeEventListeners();
		},
		methods: {
			/**
			 * Trigger the audio element to play. Catch promise exception when present to prevent Chrome error
			 *
			 * If play is canceled by a pause before it begins, Chrome throws an error.
			 */
			triggerPlay: function () {
				let playPromise = this.audio_element.play();
				if (typeof playPromise !== "undefined") {
					playPromise.catch(function (er) {
						//do nothing
					});
				}
			},
			/**
			 * Handle the event where the value of the range input changes
			 * Update internal progress value to input value.
			 * Assign current time to audio input based on progress
			 */
			handleRangeChange: function (event: Event) {
				let input_element = event.target as HTMLInputElement;
				this.progress = parseFloat(input_element.value);
				this.audio_element.currentTime = this.audio_element.duration ? this.audio_element.duration * this.progress : 0;
				this.current_time = this.audio_element.currentTime;
			},
			handleScrubStart: function () {
				this.audio_element.pause();
			},
			handleScrubEnd: function () {
				if (this.is_ui_playing) {
					this.triggerPlay();
				}
			},
			/**
			 * Handle input event on range input
			 * Update displayed progress value
			 */
			handleRangeInput: function (event: Event) {
				let input_element = event.target as HTMLInputElement;
				this.progress = parseFloat(input_element.value);
			},
			handleAudioWaiting: function () {
				this.is_loading = true;
			},
			handleAudioCanPlay: function () {
				this.is_loading = false;
			},
			handleAudioEnd: function () {
				this.is_ui_playing = false;
			},
			handleMetadataLoaded: function () {
				this.duration = this.audio_element.duration;
				this.is_loading = false;
			},
			handleProgressEvent: function () {
				this.updateBuffer();
			},
			handleTimeUpdate: function () {
				let audio_element: HTMLMediaElement = this.audio_element;
				this.current_time = audio_element.currentTime;
				this.updateBuffer();
				if (audio_element.duration) {
					this.progress = audio_element.currentTime / audio_element.duration;
				}
				if (audio_element.readyState > 3 && this.is_loading && this.is_ui_playing) {
					this.is_loading = false;
				}
			},
			addEventListeners: function () {
				let audio_element: HTMLMediaElement = this.audio_element;
				audio_element.addEventListener('timeupdate', this.handleTimeUpdate);
				audio_element.addEventListener('loadedmetadata', this.handleMetadataLoaded);
				audio_element.addEventListener('progress', this.handleProgressEvent);
				audio_element.addEventListener('waiting', this.handleAudioWaiting);
				audio_element.addEventListener('stalled', this.handleAudioWaiting);
				audio_element.addEventListener('canplaythrough', this.handleAudioCanPlay);
				audio_element.addEventListener('ended', this.handleAudioEnd);
			},
			removeEventListeners: function () {
				let audio_element: HTMLMediaElement = this.audio_element;
				audio_element.removeEventListener('timeupdate', this.handleTimeUpdate);
				audio_element.removeEventListener('loadedmetadata', this.handleMetadataLoaded);
				audio_element.removeEventListener('progress', this.handleProgressEvent);
				audio_element.removeEventListener('waiting', this.handleAudioWaiting);
				audio_element.removeEventListener('stalled', this.handleAudioWaiting);
				audio_element.removeEventListener('canplaythrough', this.handleAudioCanPlay);
				audio_element.removeEventListener('ended', this.handleAudioEnd);
			},
			formatTime: function (time_seconds: number) {
				let minutes = Math.floor(time_seconds / 60);
				let seconds = time_seconds;
				if (minutes) {
					seconds = time_seconds % (minutes * 60);
				}
				seconds = Math.floor(seconds);
				let seconds_str = String(seconds);
				if (seconds < 10) {
					seconds_str = "0" + seconds;
				}

				return minutes + ":" + seconds_str;
			},
			play: function () {
				this.triggerPlay();
				this.is_ui_playing = true;
			},
			pause: function () {
				this.audio_element.pause();
				this.is_ui_playing = false;
			},
			/**
			 * Iterate over audio element's buffered items. Work backwards from the end of buffer items.
			 *  - If the start of the buffer in question comes before the current time of the audio element, it's the one we need.
			 *    - - Get the time represented by the end of the buffer
			 *    - - Calculate and return the percentage of the end buffer time to the duration of the audio track.
			 */
			updateBuffer: function () {
				let audio_element: HTMLMediaElement = this.audio_element;
				if (!audio_element.duration) {
					return;
				}

				for (let i = 0; i < audio_element.buffered.length; i++) { // iterate over buffer items
					let buffer_index = audio_element.buffered.length - 1 - i; // get the end-most buffer not already checked
					if (audio_element.buffered.start(buffer_index) < audio_element.currentTime) { // if the buffer start is before the current play time, use it
						let ratio_complete = (audio_element.buffered.end(buffer_index) / audio_element.duration); // calculate the completeness represented by the end buffer
						this.buffered = ratio_complete * 100; // convert completeness to a percentage
						break; //done
					}
				}
			}
		},
		computed: {
			buffered_attribute: function (): string {
				return this.buffered + "%";
			},
			progress_attribute: function (): string {
				return this.progress * 100 + "%";
			},
			display_duration: function (): string {
				return this.formatTime(this.duration);
			},
			display_current: function (): string {
				return this.formatTime(this.progress * this.duration);
			}
		},
		watch: {
			is_ui_playing: function (is_playing: boolean) {
				this.$emit('playing-change', is_playing);
			},
			is_loading: function (is_loading: boolean) {
				this.$emit('loading-change', is_loading);
			},
			display_duration: function (duration: string) {
				this.$emit('duration-set', duration);
			},
			display_current: function (current: string) {
				this.$emit('current-time', current);
			}
		}
	});
</script>