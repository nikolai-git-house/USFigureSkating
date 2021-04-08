<div class="music-library">
	<popup class="popup--notice popup--music-library" v-if="popup.active" :math_center="true" v-on:close-popup="closePopup">
		<span slot="heading-text">
			{{popup.title}}
		</span>
		<div slot="content" class="">
			<p>{{popup.message}}</p>
			<div class="popup__cta">
				<div class="popup__cta-item" v-for="action in popup.actions" :class="{'popup__cta-item--full':popup.actions.length===1}">
					<button class="button button--block" :class="action.class" v-on:click="action.action" :disabled="action.disabled">
						{{action.label}}
					</button>
				</div>
			</div>
			<div v-if="popup.error" class="popup__error">{{popup.error}}</div>
		</div>
	</popup>
	<p v-if="loading">Loading...</p>
	<p v-else-if="load_error">Error loading library.</p>
	<div v-else class="music-item-list">
		<music-item ref="songs" v-for="(song,index) in library_songs" v-on:actions-toggled="handleItemActionToggle($event,index)" :music="song" :actions_available="true" :key="song.id" v-on:music-item-play="handleSongPlay($event,index)">
			<div slot="action" class="action-overlay__item">
				<button v-on:click="selectSong(song,index)" class="icon-button icon-button--add icon-button--labeled">Add
				</button>
			</div>
			<div slot="action" class="action-overlay__item">
				<button v-on:click="deleteSong(song,index)" class="icon-button icon-button--delete icon-button--labeled">Delete
				</button>
			</div>
		</music-item>
	</div>
	<button class="music-library__upload button button--info button--block" :disabled="!user_upload_capability.can_upload" v-on:click="uploadNewFile()">
		Upload Music
	</button>
	<p class="text--alert" v-if="!user_upload_capability.can_upload">
		{{user_upload_capability.error_message}}
	</p>

</div>