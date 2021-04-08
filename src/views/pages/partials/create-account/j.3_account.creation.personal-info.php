<div class="personal-info-form">
	<div class="form-group">
		<div class="field-header">
			<label for="first_name" class="field-label">
				First Name<span class="field-label__required-notice">*</span>
			</label>
			<span class="field-label__required-notice field-header__notice">*required fields</span>
		</div>
		<input type="text" class="form-field" :class="fieldClass('first_name')" id="first_name" v-model="form_data.first_name">
		<p v-if="fieldMessage('first_name')" class="input-error">*{{fieldMessage('first_name')}}</p>
	</div>
	<div class="form-group">
		<label for="last_name" class="field-label">
			Last Name<span class="field-label__required-notice">*</span>
		</label>
		<input type="text" class="form-field" :class="fieldClass('last_name')" id="last_name" v-model="form_data.last_name">
		<p v-if="fieldMessage('last_name')" class="input-error">*{{fieldMessage('last_name')}}</p>
	</div>
	<div class="form-group">
		<label for="date_of_birth" class="field-label">
			Date of Birth<span class="field-label__required-notice">*</span>
		</label>
		<date-input placeholder="mm/dd/yyyy" :class="fieldClass('date_of_birth')" v-model="form_data.date_of_birth"></date-input>
		<p v-if="fieldMessage('date_of_birth')" class="input-error">*{{fieldMessage('date_of_birth')}}</p>
	</div>
	<div class="form-group">
		<label for="gender" class="field-label">
			Gender<span class="field-label__required-notice">*</span>
		</label>
		<div class="radio-group" :class="fieldClass('gender')">
			<div class="radio">
				<label for="gender_female" class="field-label">
					<input type="radio" name="gender" id="gender_female" value="female" v-model="form_data.gender">
					Female
				</label>
			</div>
			<div class="radio">
				<label for="gender_male" class="field-label">
					<input type="radio" name="gender" id="gender_male" value="male" v-model="form_data.gender">
					Male
				</label>
			</div>
		</div>
		<p v-if="fieldMessage('gender')" class="input-error">*{{fieldMessage('gender')}}</p>
	</div>
	<div class="form-group">
		<label for="phone" class="field-label">
			Cell Phone<span class="field-label__required-notice">*</span>
		</label>
		<input type="tel" class="form-field" :class="fieldClass('phone')" id="phone" v-model="form_data.phone">
		<p v-if="fieldMessage('phone')" class="input-error">*{{fieldMessage('phone')}}</p>
	</div>
	<div class="form-group">
		<label for="email" class="field-label">
			Email<span class="field-label__required-notice">*</span>
		</label>
		<input type="email" class="form-field" :class="fieldClass('email')" id="email" v-model="form_data.email">
		<p v-if="fieldMessage('email')" class="input-error">*{{fieldMessage('email')}}</p>
	</div>
	<div class="form-group">
		<!--@integration -
			your reCaptcha site key will need to be added to the site key attribute below
		 	http://www.google.com/recaptcha/admin
		 -->
		<captcha site_key="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI" v-model="form_data.captcha_value"></captcha>
		<p v-if="fieldMessage('captcha_value')" class="input-error">*Demonstrate you're not a robot</p>
	</div>
	<div class="form-actions">
		<div class="form-actions__column form-actions__column--sm">
			<button type="button" class="button button--info button--block" :disabled="submitting" v-on:click.prevent="cancel()">
				Cancel
			</button>
		</div>
		<div class="form-actions__column form-actions__column--lg">
			<button type="button" class="button button--block" :disabled="submitting" v-on:click.prevent="complete()">
				{{submitting ? "Submitting" : "Continue"}}
			</button>
		</div>
	</div>
	<p class="input-error">
		{{external_error}}
		<!--@integration - the following link displays when a user attempts to create a duplicate account and requires a link target-->
		<a class="standard-link" v-if="duplicate_account_attempt" href="/">Login.</a>
	</p>
</div>