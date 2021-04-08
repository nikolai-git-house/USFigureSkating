<div class="emergency-contact-form">
	<div class="form-group">
		<label class="field-label" for="emergency_name">Name</label>
		<input type="text" class="form-field" id="emergency_name" v-model="form_data.name" name="emergency_name">
	</div>
	<div class="form-group">
		<label class="field-label" for="emergency_relation">Relation to You</label>
		<input type="text" class="form-field" id="emergency_relation" v-model="form_data.relationship" name="emergency_relation">
	</div>
	<div class="form-group">
		<label class="field-label" for="emergency_phone">Phone</label>
		<input type="tel" class="form-field" id="emergency_phone" v-model="form_data.phone" name="emergency_phone">
	</div>
	<div class="form-actions">
		<div class="form-actions__column form-actions__column--full">
			<button type="button" class="button button--block" v-on:click.prevent="complete()" :disabled="submitting">
				{{submitting ? "Submitting" : "Continue"}}
			</button>
		</div>
	</div>
	<p class="input-error">{{external_error}}</p>
</div>