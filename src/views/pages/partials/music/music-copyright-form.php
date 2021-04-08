<div class="music-copyright-form">
	<div class="form-group">
		<label for="title" class="form-label">Title</label>
		<input id="title" v-model="formData.title" type="text" class="form-field" :class="fieldClass('title')">
	</div>
	<div class="form-group">
		<label for="artist" class="form-label">Artist</label>
		<input id="artist" v-model="formData.artist" type="text" class="form-field" :class="fieldClass('artist')">
	</div>
	<div class="form-group">
		<label for="arrangement" class="form-label">Arrangement
			<button class="icon-button icon-button--info" :class="{'icon-button--info--muted':arrangement_tip_open}" v-on:click="toggleArrangementTip()">
				More Info
			</button>
		</label>
		<div v-if="arrangement_tip_open" class="music-copyright-form__tip">
			<p>
				Beethoven's "Moonlight Sonata" performed by New York Philharmonic: the original composer is Beethoven
				and the New York Philharmonic is the arrangement.
			</p>
			<button class="tray-close" v-on:click="toggleArrangementTip(false)">Close</button>
		</div>
		<input id="arrangement" v-model="formData.arrangement" type="text" class="form-field" :class="fieldClass('arrangement')">
	</div>
	<div class="form-group">
		<label for="record_label" class="form-label">Record Label</label>
		<input id="record_label" v-model="formData.record_label" type="text" class="form-field" :class="fieldClass('record_label')">
	</div>
	<div class="form-group">
		<label for="duration" class="form-label">Duration</label>
		<div class="music-copyright-form__duration">
			<div class="form-group">
				<label for="duration_minutes" class="form-label">Minutes</label>
				<input id="duration_minutes" v-model="formData.duration_minutes" type="text" class="form-field" :class="fieldClass('duration_minutes')">
				<p v-if="fieldMessage('duration_minutes')" class="input-error">*{{fieldMessage('duration_minutes')}}</p>
			</div>
			<div class="form-group">
				<label for="duration_seconds" class="form-label">Seconds</label>
				<input id="duration_seconds" v-model="formData.duration_seconds" type="text" class="form-field" :class="fieldClass('duration_seconds')">
				<p v-if="fieldMessage('duration_seconds')" class="input-error">*{{fieldMessage('duration_seconds')}}</p>
			</div>
		</div>

	</div>
	<div class="music-editor-step__cta music-editor-step-cta">
		<div v-if="show_cancel" class="music-editor-step-cta__item">
			<button class="button button--block button--info" v-on:click="cancel()">Cancel</button>
		</div>
		<div class="music-editor-step-cta__item" :class="{'music-editor-step-cta__item--full':!show_cancel}">
			<button class="button button--block" v-on:click="save()">Save</button>
		</div>
	</div>
	<p v-if="fieldMessage('global')" class="music-editor-step__error input-error">*{{fieldMessage('global')}}</p>
</div>