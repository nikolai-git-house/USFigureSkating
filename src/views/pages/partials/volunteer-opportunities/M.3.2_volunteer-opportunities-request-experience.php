<!-- @deprecated - 2020-01-07
    future uses of the volunteer-request-experience-form component should use the template defined within the single-file component
-->
<div class="volunteer-request-experience-form">
    <div class="volunteer-request-experience-form__section">
        <h3 class="volunteer-request-experience-form__section-heading">
            What volunteer experience do you have?
            <br>
            <span>Check all that apply<span class="field-label__required-notice">*</span></span>
        </h3>
        <div class="volunteer-request-experience-form__section-content">
            <div class="form-group">
                <ul class="check-list">
                    <li v-for="(experience_option) in experience_options" :key="experience_option.value">
                        <label :for="'experience_' + experience_option.value.replace(' ','_')" class="usfsa-checkbox">
                            <input :id="'experience_' + experience_option.value.replace(' ','_')" v-on:change="handleChange($event,experience_option.value)" :value="experience_option.value" type="checkbox" name="experience[]">
                            <span class="usfsa-checkbox__text">
                                {{experience_option.label}}
                            </span>
                        </label>
                        <div class="volunteer-request-experience-form__extended-info" v-if="form_data.experience[experience_option.value]">
                            <div class="form-group">
                                <label class="sr-only" :for="experience_option.value.replace(' ','_') + '_info'">
                                    Additional {{experience_option.label}} Information
                                </label>
                                <input type="text" placeholder="(optional) Event name &amp; role" v-model="form_data.experience[experience_option.value].description" class="form-field" :id="experience_option.value.replace(' ','_') + '_info'" :name="experience_option.value.replace(' ','_') + '_info'">
                            </div>
                        </div>
                    </li>
                </ul>
                <p v-if="fieldMessage('experience')" class="input-error">*{{fieldMessage('experience')}}</p>
            </div>
            <div class="form-group">
                <label class="field-label" for="volunteer_skillset">Volunteer Skillset:</label>
                <textarea class="form-field" v-model="form_data.skillset" id="volunteer_skillset" name="volunteer_skillset">&nbsp;</textarea>
            </div>
        </div>
    </div>
    <div class="volunteer-request-experience-form__section volunteer-request-experience-form__section--terms">
        <h3 class="volunteer-request-experience-form__section-heading">
            Terms &amp; Conditions
        </h3>
        <div class="volunteer-request-experience-form__section-content">
            <ul class="check-list check-list--extended">
                <li>
                    <label for="terms_agree" class="usfsa-checkbox usfsa-checkbox--required">
                        <input id="terms_agree" v-model="form_data.terms_agree" type="checkbox">
                        <!--
                            @integration - the link below requires a target
                        -->
                        <span class="usfsa-checkbox__text">I agree to the <a class="standard-link standard-link--no-visited" href="#" target="_blank" rel="noopener">terms &amp; conditions</a> of this application</span>
                    </label>
                    <p v-if="fieldMessage('terms_agree')" class="input-error">
                        *{{fieldMessage('terms_agree')}}
                    </p>
                </li>
                <li>
                    <label for="background_agree" class="usfsa-checkbox usfsa-checkbox--required">
                        <input id="background_agree" v-model="form_data.records_consent" type="checkbox">
                        <!--
                           @integration - the link below requires a target
                       -->
                        <span class="usfsa-checkbox__text">I consent to a <a class="standard-link standard-link--no-visited" href="#" target="_blank" rel="noopener">criminal history records check</a>, if necessary</span>
                    </label>
                    <p v-if="fieldMessage('records_consent')" class="input-error">
                        *{{fieldMessage('records_consent')}}
                    </p>
                </li>
            </ul>
        </div>
    </div>
    <div class="volunteer-request-experience-form__section">
        <div class="volunteer-request-experience-form__section-content">
            <div class="form-actions">
                <div class="form-actions__row">
                    <div class="form-actions__column form-actions__column--full">
                        <button v-on:click.prevent.stop="complete" :disabled="submitting" class="button button--block" :class="{'disabled' : !valid}">
                            {{submitting ? 'Submitting' : 'Submit'}} Request
                        </button>
                    </div>
                </div>
            </div>
            <p v-if="external_error" class="input-error">
                {{external_error}}
            </p>
        </div>
    </div>
</div>