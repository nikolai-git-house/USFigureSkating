<fieldset class="billing-form checkout-form checkout-form--billing">
    <div class="form-group">
        <label class="field-label" for="billing_fname">First Name</label>
        <input class="form-field" :class="fieldClass('first_name')" v-model="form_data.first_name" type="text" id="billing_fname">
		<p v-if="fieldMessage('first_name')" class="input-error">*{{fieldMessage('first_name')}}</p>
    </div>
    <div class="form-group">
        <label class="field-label" for="billing_lname">Last Name</label>
        <input class="form-field" :class="fieldClass('last_name')" v-model="form_data.last_name" type="text" id="billing_lname">
		<p v-if="fieldMessage('last_name')" class="input-error">*{{fieldMessage('last_name')}}</p>
    </div>
    <div class="form-group">
        <label class="field-label" for="billing_street">Street 1</label>
        <input class="form-field" :class="fieldClass('street')" v-model="form_data.street" type="text" id="billing_street">
		<p v-if="fieldMessage('street')" class="input-error">*{{fieldMessage('street')}}</p>
    </div>
    <div class="form-group">
        <label class="field-label" for="billing_street1">Street 2</label>
        <input class="form-field" :class="fieldClass('street_2')" v-model="form_data.street_2" type="text" id="billing_street1">
		<p v-if="fieldMessage('street_2')" class="input-error">*{{fieldMessage('street_2')}}</p>
    </div>
    <div class="form-group">
        <label class="field-label" for="billing_city">City</label>
        <input class="form-field" :class="fieldClass('city')" v-model="form_data.city" type="text" id="billing_city">
		<p v-if="fieldMessage('city')" class="input-error">*{{fieldMessage('city')}}</p>
    </div>
    <div class="form-group">
        <label class="field-label" for="billing_state">State</label>
        <select class="form-field" :class="fieldClass('state')" v-model="form_data.state" id="billing_state">
            <option v-for="(state,value) in states" :disabled="value==='null'" :value="value">{{state}}</option>
        </select>
		<p v-if="fieldMessage('state')" class="input-error">*{{fieldMessage('state')}}</p>
    </div>
    <div class="form-group form-group--half">
        <label class="field-label" for="billing_zip">Zip Code</label>
        <input class="form-field" :class="fieldClass('zip_code')" v-model="form_data.zip_code" type="text" id="billing_zip">
		<p v-if="fieldMessage('zip_code')" class="input-error">*{{fieldMessage('zip_code')}}</p>
    </div>
    <div class="form-group" v-if="show_default_input">
        <div class="checkbox">
            <label for="set_as_default">
                <input type="checkbox" name="set_as_default" id="set_as_default" v-model="form_data.is_default" value="true">
                Set as Default Billing Address
            </label>
        </div>
    </div>
    <div class="checkout-step__actions address-form-actions">
        <div class="address-form-actions__cancel">
            <button type="button" v-on:click.prevent="cancel()" class="button button--block button--info">
                {{cancel_button_text}}
            </button>
        </div>
        <div class="address-form-actions__continue">
            <button type="button" v-on:click.prevent="complete()" class="button button--block button--action">Save &amp; Continue</button>
        </div>
    </div>
</fieldset>