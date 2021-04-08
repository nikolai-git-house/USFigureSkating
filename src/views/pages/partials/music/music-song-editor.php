<div class="music-song-editor">
	<music-item ref="music_item" :music="active_music" :allow_inline_edit="!hide_song_actions" v-on:music-item-play="handleSongPlay">
		<div slot="status_content" v-if="show_upload_indicator" class="upload-status" :class="{'upload-status--error':upload_error}">
			<svg version="1.1" class="upload-status__indicator" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
				<circle cx="26" cy="26" r="25" stroke="#dadada" fill="none" stroke-width="2"></circle>
				<circle cx="26" cy="26" r="25" :stroke="upload_error?'#e1161f':'#138df4'" fill="none" stroke-linecap="round" stroke-width="2" stroke-dasharray="157.079632679" :stroke-dashoffset="157.079632679 * (1 - upload_progress)"></circle>
			</svg>
			<span class="upload-status__value">{{Math.floor(upload_progress * 100)}}%</span>
		</div>
	</music-item>
	<div v-if="upload_error" class="music-song-editor__upload-error">
		<p class="music-song-editor__upload-error-message">
			{{upload_error}}
		</p>
        <?php include __DIR__ . '/music-path-selection.php'; ?>
	</div>
	<div class="music-editor-step__cta music-editor-step-cta" v-if="show_cta">
		<div class="music-editor-step-cta__item">
			<button class="button button--block button--info" v-on:click="cancel_button_action">Cancel</button>
		</div>
		<div class="music-editor-step-cta__item">
			<p class="music-song-editor__play-notice" v-if="song_unplayed">Play song to continue</p>
			<button class="button button--block" :disabled="save_disabled" v-on:click="saveSong()">Save</button>
		</div>
	</div>
</div>