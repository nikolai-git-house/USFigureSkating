<form action="" v-on:submit.prevent="doSearch()">
	<h2 class="my-coaches-search__heading">Search for Coach By:</h2>
	<div class="my-coaches-search-form grid-container">
		<div class="form-group">
			<label for="member_number" class="field-label">Membership #</label>
			<input :disabled="inputs_disabled" type="text" id="member_number" v-model="formData.member_number" class="form-field">
		</div>
		<div class="form-group">
			<label for="first_name" class="field-label">First Name</label>
			<input :disabled="inputs_disabled" type="text" id="first_name" v-model="formData.first_name" class="form-field">
		</div>
		<div class="form-group">
			<label for="last_name" class="field-label">Last Name</label>
			<input :disabled="inputs_disabled" type="text" id="last_name" v-model="formData.last_name" class="form-field">
		</div>
		<div class="form-group form-group--state">
			<label for="state" class="field-label">State</label>
			<select :disabled="inputs_disabled" id="state" v-model="formData.state" class="form-field">
				<option v-for="state_option in state_options" :value="state_option.value">{{state_option.label}}
				</option>
			</select>
		</div>
		<div class="my-coaches-search-form__cta">
			<div class="my-coaches-search-form__cta-element">
				<button :disabled="inputs_disabled" class="button button--block button--info" type="button" v-on:click="clearForm">Clear</button>
			</div>
			<div class="my-coaches-search-form__cta-element">
				<button :disabled="inputs_disabled" class="button button--block" type="submit">{{search_button_text}}</button>
			</div>
		</div>
		<p class="input-error" v-if="error.visible">{{error.message}}</p>
	</div>
</form>