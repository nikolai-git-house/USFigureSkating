<div class="music-path-selection">
	<button type="button" class="button button--block" :disabled="!user_upload_capability.can_upload" v-on:click="selectFile()">
		Upload Music
	</button>
	<p class="music-path-selection__error text--alert" v-if="!user_upload_capability.can_upload">
		{{user_upload_capability.error_message}}
	</p>
	<button type="button" class="button button--block button--info" v-on:click="openLibrary()">
		Previous Uploads
	</button>
</div>