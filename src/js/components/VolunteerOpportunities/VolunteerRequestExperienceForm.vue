<template>
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
                            <label :for="'experience_' + experience_option.value.replace(' ','_')"
                                   class="usfsa-checkbox">
                                <input :id="'experience_' + experience_option.value.replace(' ','_')"
                                       :value="experience_option.value"
                                       type="checkbox"
                                       name="experience[]"
                                       v-on:change="handleChange($event,experience_option.value)">
                                <span class="usfsa-checkbox__text">
                                    {{experience_option.label}}
                                </span>
                            </label>
                            <div v-if="form_data.experience[experience_option.value]"
                                 class="volunteer-request-experience-form__extended-info">
                                <div class="form-group">
                                    <label class="sr-only" :for="experience_option.value.replace(' ','_') + '_info'">
                                        Additional {{experience_option.label}} Information
                                    </label>
                                    <input :id="experience_option.value.replace(' ','_') + '_info'"
                                           v-model="form_data.experience[experience_option.value].description"
                                           type="text"
                                           placeholder="(optional) Event name &amp; role"
                                           class="form-field"
                                           :name="experience_option.value.replace(' ','_') + '_info'">
                                </div>
                            </div>
                        </li>
                    </ul>
                    <p v-if="fieldMessage('experience')" class="input-error">
                        *{{fieldMessage('experience')}}
                    </p>
                </div>
                <div class="form-group">
                    <label class="field-label" for="volunteer_skillset">Volunteer Skillset:</label>
                    <textarea id="volunteer_skillset"
                              v-model="form_data.skillset"
                              class="form-field"
                              name="volunteer_skillset">&nbsp;</textarea>
                </div>
            </div>
        </div>
        <div class="volunteer-request-experience-form__section">
            <div class="volunteer-request-experience-form__section-content">
                <div class="form-actions">
                    <div class="form-actions__row">
                        <div class="form-actions__column form-actions__column--full">
                            <button :disabled="submitting"
                                    class="button button--block"
                                    :class="{'disabled' : !valid}"
                                    v-on:click.prevent.stop="complete">
                                Continue
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
</template>
<script lang="ts">
    import mixins from 'vue-typed-mixins';
    import {FormOption} from '../../contracts/AppContracts';
    import FormMixin from '../../mixins/FormMixin';
    import {
        ExperienceDatum,
        VolunteerRequestExperienceFormState
    } from '../../models/Forms/VolunteerRequestExperienceFormState';
    import {VolunteerRequestExperienceFormValidator} from '../../models/Forms/VolunteerRequestExperienceFormValidator';

    const extendedVue = mixins(FormMixin);
    export default extendedVue.extend({
        /**
         * Reactive Data
         */
        data: function () {
            return {
                form_data: new VolunteerRequestExperienceFormState(),
                validator_class: VolunteerRequestExperienceFormValidator
            };
        },
        computed: {
            /**
             * Experience form options
             */
            experience_options: function (): FormOption[] {
                return this.$store.state.form_options.volunteer_request_experiences;
            }
        },
        methods: {
            /**
             * Handle click of submission button
             */
            complete: function () {
                this.submit_attempt = true;
                if (!this.valid) {
                    return;
                }
                this.$emit('complete', this.form_data.export());
            },
            /**
             * Handle the check/uncheck event on an experience item
             *
             * Update reactive data to include appropriate properties
             */
            handleChange: function ($event: Event, form_option_value: string) {
                const target = <HTMLInputElement>$event.target;
                // If checking the item, create appropriate data
                if (target.checked) {
                    const base: ExperienceDatum = {
                        selected: true,
                        description: ''
                    };
                    this.$set(this.form_data.experience, form_option_value, base);

                    return;
                }
                // If unchecking, remove data
                this.$delete(this.form_data.experience, form_option_value);
            }
        }
    });
</script>