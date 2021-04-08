<div class="competition-search">
	<div class="form-group">
		<label for="search_field" class="field-label sr-only">
			Search By
		</label>
		<select id="search_field" v-model="search_field" class="form-field">
			<option :value="null" selected disabled>Search by:</option>
			<option :value="option" v-for="option in field_options">{{option.label}}</option>
		</select>
	</div>
	<div class="form-group" v-if="search_field">
		<label class="field-label sr-only" for="search_term">
			Search Term
		</label>
		<select v-if="search_field.value==='state'" v-model="search_term" class="form-field" id="search_term" name="search_term">
			<option disabled selected :value="null">Select State</option>
			<option v-for="state_option in state_options" :value="state_option.value">
				{{state_option.label}}
			</option>
		</select>
		<input v-else v-model="search_term" :placeholder="input_placeholder" class="form-field form-field--search" type="text" id="search_term" name="search_term">
		<p v-if="search_field.value==='date'" class="help-text">Format: M/D or M/D/YY</p>
		<p v-if="search_field.value==='state'" class="help-text">Only states with available competitions will display.</p>
	</div>
</div>