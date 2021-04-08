<template>
    <fieldset class="form-fieldset">
        <div class="form-group">
            <label class="field-label" for="country">
                <span>Country<span class="field-label__required-notice">*</span></span>
            </label>
            <select id="country"
                    v-model="$parent.form_data.country"
                    class="form-field"
                    :class="$parent.fieldClass('country')">
                <option disabled
                        selected
                        :value="null">
                    Select Country
                </option>
                <option v-for="country_option in $parent.form_options.countries"
                        :key="country_option.value"
                        :disabled="country_option.value===null"
                        :value="country_option">
                    {{country_option.label}}
                </option>
            </select>
            <p v-if="$parent.fieldMessage('country')" class="input-error">
                *{{$parent.fieldMessage('country')}}
            </p>
        </div>
        <div class="form-group">
            <label class="field-label" for="street">
                <span>Street Address<span class="field-label__required-notice">*</span></span>
            </label>
            <input id="street"
                   v-model="$parent.form_data.street"
                   class="form-field"
                   :class="$parent.fieldClass('street')"
                   type="text"
                   name="street">
            <p v-if="$parent.fieldMessage('street')" class="input-error">
                *{{$parent.fieldMessage('street')}}
            </p>
        </div>
        <div class="form-group">
            <label class="field-label" for="street_2">
                Address Line 2
            </label>
            <input id="street_2"
                   v-model="$parent.form_data.street_2"
                   class="form-field"
                   :class="$parent.fieldClass('street_2')"
                   type="text"
                   name="street_2">
            <p v-if="$parent.fieldMessage('street_2')" class="input-error">
                *{{$parent.fieldMessage('street_2')}}
            </p>
        </div>
        <div class="form-group">
            <label class="field-label" for="city">
                <span>City<span class="field-label__required-notice">*</span></span>
            </label>
            <input id="city"
                   v-model="$parent.form_data.city"
                   class="form-field"
                   :class="$parent.fieldClass('city')"
                   type="text"
                   name="city">
            <p v-if="$parent.fieldMessage('city')" class="input-error">
                *{{$parent.fieldMessage('city')}}
            </p>
        </div>
        <div v-if="$parent.is_usa" class="form-group">
            <label class="field-label" for="state">
                <span>State<span class="field-label__required-notice">*</span></span>
            </label>
            <select id="state"
                    v-model="$parent.form_data.state"
                    class="form-field"
                    :class="$parent.fieldClass('state')">
                <option disabled
                        selected
                        :value="null">
                    Select State
                </option>
                <option v-for="state_option in $parent.form_options.states"
                        :key="state_option.value"
                        :disabled="state_option.value===null"
                        :value="state_option">
                    {{state_option.label}}
                </option>
            </select>
            <p v-if="$parent.fieldMessage('state')" class="input-error">
                *{{$parent.fieldMessage('state')}}
            </p>
        </div>
        <div v-if="$parent.is_canada" class="form-group">
            <label class="field-label" for="province">
                <span>Province<span class="field-label__required-notice">*</span></span>
            </label>
            <select id="province"
                    v-model="$parent.form_data.province"
                    class="form-field"
                    :class="$parent.fieldClass('province')">
                <option disabled
                        selected
                        :value="null">
                    Select Province
                </option>
                <option v-for="province_option in $parent.form_options.provinces"
                        :key="province_option.value"
                        :disabled="province_option.value===null"
                        :value="province_option">
                    {{province_option.label}}
                </option>
            </select>
            <p v-if="$parent.fieldMessage('province')" class="input-error">
                *{{$parent.fieldMessage('province')}}
            </p>
        </div>
        <div class="form-group">
            <label class="field-label" for="zip">
                <span>Zip / Postal Code<span v-if="$parent.zip_required"
                                             class="field-label__required-notice">*</span></span>
            </label>
            <input id="zip"
                   v-model="$parent.form_data.zip"
                   class="form-field"
                   :class="$parent.fieldClass('zip')"
                   type="text"
                   name="zip">
            <p v-if="$parent.fieldMessage('zip')" class="input-error">
                *{{$parent.fieldMessage('zip')}}
            </p>
        </div>
    </fieldset>
</template>