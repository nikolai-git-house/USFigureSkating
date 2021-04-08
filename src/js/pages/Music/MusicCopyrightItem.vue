<template>
	<div class="music-copyright">
		<div class="music-copyright__content">
			<div class="music-copyright__data">
				<ul class="music-copyright__list label-list">
					<li v-for="item in summary" class="music-copyright__list-item" :class="{'music-copyright__list-item--incomplete':!item.value}">
						<span class="label-list__label">{{item.label}}:</span>
						{{item.value?item.value:"Not complete"}}
					</li>
				</ul>
			</div>
			<div class="music-copyright__actions">
				<button v-if="show_actions" class="icon-button" :class="overlay_active?'icon-button--close':'icon-button--more'" v-on:click="overlay_active=!overlay_active">
					Toggle Actions
				</button>
			</div>
			<div class="music-copyright__overlay" v-if="overlay_active">
				<div class="action-overlay">
					<slot name="action"></slot>
				</div>
			</div>
		</div>
	</div>
</template>
<script lang="ts">
	import Vue from "vue";
	import {MusicCopyright} from "../../models/Music/MusicCopyright";

	export default Vue.extend({
		props: {
			copyright: {
				type: MusicCopyright,
				required: true
			},
			is_view_only: {
				type: Boolean,
				default: false
			}
		},
		data: function () {
			return {
				overlay_active: false
			}
		},
		computed: {
			summary: function () {
				return [
					{
						label: "Title",
						value: this.copyright.title
					},
					{
						label: "Artist",
						value: this.copyright.artist
					},
					{
						label: "Arrangement",
						value: this.copyright.arrangement
					},
					{
						label: "Record Label",
						value: this.copyright.record_label
					},
					{
						label: "Duration",
						value: this.copyright.duration
					},
				]
			},
			show_actions: function () {
				return !this.is_view_only;
			}
		}
	});
</script>