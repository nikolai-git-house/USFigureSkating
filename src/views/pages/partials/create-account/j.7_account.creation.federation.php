<div class="federation-form">
	<div class="form-group" v-for="(label,value) in user_types" :class="fieldClass('user_type')">
		<div class="checkbox">
			<label :for="'user_type'+value">
				<input type="checkbox" name="user_type" :id="'user_type'+value" :value="value" v-model="form_data.user_type">
				{{label}}
			</label>
		</div>
	</div>
	<p v-if="fieldMessage('user_type')" class="input-error">*{{fieldMessage('user_type')}}</p>
	<div class="form-group">
		<label class="field-label" for="country">Federation</label>
		<select class="form-field" :class="fieldClass('federation')" id="country" v-model="form_data.federation">
			<option disabled selected :value="null">Select a Federation</option>
			<option v-for="federation_option in form_options.federations" :value="federation_option">
				{{federation_option.label}}
			</option>
		</select>
		<p v-if="fieldMessage('federation')" class="input-error">*{{fieldMessage('federation')}}</p>
	</div>
	<div class="form-actions">
		<div class="form-actions__column form-actions__column--full">
			<button type="button" class="button button--block" :disabled="submitting" v-on:click.prevent="complete()">
				{{submitting ? "Submitting" : "Continue"}}
			</button>
		</div>
	</div>
	<p class="input-error">{{external_error}}</p>
</div>