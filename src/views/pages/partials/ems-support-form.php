<form class="ems-support-form" novalidate action="">
    <div class="form-group">
        <label for="member_number" class="field-label">Member Number<span class="field-label__required-notice">*</span></label>
		<input disabled v-model="formData.member_number" type="text" class="form-field" id="member_number" :class="fieldClass('member_number')">
        <p v-if="fieldMessage('member_number')" class="input-error">*{{fieldMessage('member_number')}}</p>
    </div>
    <div class="form-group">
        <label for="email" class="field-label">Email<span class="field-label__required-notice">*</span></label>
		<input v-model="formData.email" type="email" class="form-field" id="email" :class="fieldClass('email')">
        <p v-if="fieldMessage('email')" class="input-error">*{{fieldMessage('email')}}</p>
    </div>
    <div class="form-group">
        <label for="phone" class="field-label">Phone Number</label>
		<input v-model="formData.phone" type="tel" class="form-field" id="phone" :class="fieldClass('phone')">
        <p v-if="fieldMessage('phone')" class="input-error">*{{fieldMessage('phone')}}</p>
    </div>
    <div class="form-group">
        <label for="issue_type" class="field-label">Issue Type<span class="field-label__required-notice">*</span></label>
		<select v-model="formData.issue_type" class="form-field" id="issue_type" :class="fieldClass('issue_type')">
			<option disabled selected :value="null">Select one...</option>
			<option v-for="type in type_options" :value="type">{{type.label}}</option>
		</select>
        <p v-if="fieldMessage('issue_type')" class="input-error">*{{fieldMessage('issue_type')}}</p>
    </div>
    <div class="form-group">
        <label for="subtype" class="field-label">Sub-Issue Type<span class="field-label__required-notice" v-if="!subtype_disabled">*</span></label>
		<select v-model="formData.subtype" :disabled="subtype_disabled" class="form-field" id="subtype" :class="fieldClass('subtype')">
			<option disabled selected :value="null">{{subtype_placeholder}}</option>
			<option v-for="subtype in available_subtypes" :value="subtype">{{subtype}}</option>
		</select>
		<p v-if="fieldMessage('subtype')" class="input-error">*{{fieldMessage('subtype')}}</p>
    </div>
    <div class="form-group">
        <label for="description" class="field-label">Description<span class="field-label__required-notice">*</span></label>
		<textarea v-model="formData.description" class="form-field" id="description" :class="fieldClass('description')"></textarea>
        <p v-if="fieldMessage('description')" class="input-error">*{{fieldMessage('description')}}</p>
    </div>
    <button v-on:click.prevent="submitForm" class="button button--block ems-support-form__submit" :disabled="submitting">{{submitting?"Submitting...":"Submit"}}</button>
    <p class="input-error" v-if="submission_error">{{submission_error}}</p>
</form>