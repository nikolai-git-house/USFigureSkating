<!-- @deprecated - 2020-01-07
    future needs surrounding address fields should use the dedicated <address-form-fields> component
-->
<div class="form-group">
	<label class="field-label" for="country">
		Country<span class="field-label__required-notice">*</span>
	</label>
	<select class="form-field" :class="fieldClass('country')" id="country" v-model="form_data.country">
		<option disabled selected :value="null">Select Country</option>
		<option v-for="country_option in form_options.countries" :disabled="country_option.value===null" :value="country_option">
			{{country_option.label}}
		</option>
	</select>
	<p v-if="fieldMessage('country')" class="input-error">*{{fieldMessage('country')}}</p>
</div>
<div class="form-group">
	<label class="field-label" for="street">
		Street Address<span class="field-label__required-notice">*</span>
	</label>
	<input class="form-field" :class="fieldClass('street')" type="text" id="street" v-model="form_data.street" name="street">
	<p v-if="fieldMessage('street')" class="input-error">*{{fieldMessage('street')}}</p>
</div>
<div class="form-group">
	<label class="field-label" for="street_2">
		Address Line 2
	</label>
	<input class="form-field" :class="fieldClass('street_2')" type="text" id="street_2" v-model="form_data.street_2" name="street_2">
	<p v-if="fieldMessage('street_2')" class="input-error">*{{fieldMessage('street_2')}}</p>
</div>
<div class="form-group">
	<label class="field-label" for="city">
		City<span class="field-label__required-notice">*</span>
	</label>
	<input class="form-field" :class="fieldClass('city')" type="text" id="city" v-model="form_data.city" name="city">
	<p v-if="fieldMessage('city')" class="input-error">*{{fieldMessage('city')}}</p>
</div>
<div class="form-group" v-if="is_usa">
	<label class="field-label" for="state">
		State<span class="field-label__required-notice">*</span>
	</label>
	<select class="form-field" :class="fieldClass('state')" id="state" v-model="form_data.state">
		<option disabled selected :value="null">Select State</option>
		<option v-for="state_option in form_options.states" :disabled="state_option.value===null" :value="state_option">
			{{state_option.label}}
		</option>
	</select>
	<p v-if="fieldMessage('state')" class="input-error">*{{fieldMessage('state')}}</p>
</div>
<div class="form-group" v-if="is_canada">
	<label class="field-label" for="province">
		Province<span class="field-label__required-notice">*</span>
	</label>
	<select class="form-field" :class="fieldClass('province')" id="province" v-model="form_data.province">
		<option disabled selected :value="null">Select Province</option>
		<option v-for="province_option in form_options.provinces" :disabled="province_option.value===null" :value="province_option">
			{{province_option.label}}
		</option>
	</select>
	<p v-if="fieldMessage('province')" class="input-error">*{{fieldMessage('province')}}</p>
</div>
<div class="form-group">
	<label class="field-label" for="zip">
		Zip / Postal Code<span class="field-label__required-notice" v-if="zip_required">*</span>
	</label>
	<input class="form-field" :class="fieldClass('zip')" type="text" id="zip" v-model="form_data.zip" name="zip">
	<p v-if="fieldMessage('zip')" class="input-error">*{{fieldMessage('zip')}}</p>
</div>