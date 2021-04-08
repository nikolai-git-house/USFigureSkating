<div class="form-group">
	<label class="field-label" for="billing_fname">
		First Name<span class="field-label__required-notice">*</span>
	</label>
	<input class="form-field" :class="fieldClass('first_name')" v-model="form_data.first_name" type="text" id="billing_fname">
	<p v-if="fieldMessage('first_name')" class="input-error">*{{fieldMessage('first_name')}}</p>
</div>
<div class="form-group">
	<label class="field-label" for="billing_lname">
		Last Name<span class="field-label__required-notice">*</span>
	</label>
	<input class="form-field" :class="fieldClass('last_name')" v-model="form_data.last_name" type="text" id="billing_lname">
	<p v-if="fieldMessage('last_name')" class="input-error">*{{fieldMessage('last_name')}}</p>
</div>
<?php include __DIR__ . "/address-form-fields.php"; ?>
<div class="form-group" v-if="show_default_input">
	<div class="checkbox">
		<label for="set_as_default">
			<input type="checkbox" name="set_as_default" id="set_as_default" v-model="form_data.is_default" value="true">
			Set as Default Billing Address
		</label>
	</div>
</div>