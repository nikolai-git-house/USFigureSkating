<template>
    <div class="volunteer-request-general-information-form">
        <div class="volunteer-request-general-information__section">
            <div class="volunteer-request-general-information__section-heading">
                <h3 class="volunteer-request-general-information__section-heading__text">
                    Personal
                </h3>
            </div>
            <div class="volunteer-request-general-information__data">
                <div class="volunteer-request-general-information-form__summary">
                    <table class="data-table">
                        <tr>
                            <td class="data-table__label">
                                Name:
                            </td>
                            <td class="data-table__value">
                                {{active_profile.full_name}}
                            </td>
                        </tr>
                        <tr>
                            <td class="data-table__label">
                                Birth Date:
                            </td>
                            <td class="data-table__value">
                                {{active_profile.birth_date.formatted}}
                            </td>
                        </tr>
                        <tr>
                            <td class="data-table__label">
                                Gender:
                            </td>
                            <td class="data-table__value">
                                {{$parent.displayGender(active_profile.gender)}}
                            </td>
                        </tr>
                    </table>
                    <p class="volunteer-request-general-information-form__summary__description">
                        You must contact Member Services or your club to change the Name, DOB or Gender. Verify you are
                        logged into the correct account.
                    </p>
                </div>
                <div class="volunteer-request-general-information-form__fields">
                    <div class="field-header field-header--external">
                        <span class="field-label__required-notice field-header__notice">*required fields</span>
                    </div>
                    <address-form-fields></address-form-fields>
                    <div class="form-group">
                        <label class="field-label" for="cell_phone">
                            <span>Cell Phone<span class="field-label__required-notice">*</span></span>
                        </label>
                        <input id="cell_phone"
                               v-model="form_data.cell_phone"
                               class="form-field"
                               :class="fieldClass('cell_phone')"
                               type="tel"
                               name="cell_phone">
                        <p v-if="fieldMessage('cell_phone')" class="input-error">
                            *{{fieldMessage('cell_phone')}}
                        </p>
                    </div>
                    <div class="form-group">
                        <label class="field-label" for="email">
                            <span>Email<span class="field-label__required-notice">*</span></span>
                        </label>
                        <input id="email"
                               v-model="form_data.email"
                               class="form-field"
                               :class="fieldClass('email')"
                               type="email"
                               name="email">
                        <p v-if="fieldMessage('email')" class="input-error">
                            *{{fieldMessage('email')}}
                        </p>
                    </div>
                </div>
            </div>
        </div>
        <div class="volunteer-request-general-information__section">
            <div class="volunteer-request-general-information__section-heading">
                <h3 class="volunteer-request-general-information__section-heading__text">
                    Emergency Contact
                </h3>
            </div>
            <div class="volunteer-request-general-information__data">
                <div class="volunteer-request-general-information-form__fields">
                    <div class="form-group">
                        <label class="field-label" for="emergency_name">
                            <span>Name<span class="field-label__required-notice">*</span></span>
                        </label>
                        <input id="emergency_name"
                               v-model="form_data.emergency_contact_name"
                               type="text"
                               class="form-field"
                               name="emergency_name"
                               :class="fieldClass('emergency_contact_name')">
                        <p v-if="fieldMessage('emergency_contact_name')" class="input-error">
                            *{{fieldMessage('emergency_contact_name')}}
                        </p>
                    </div>
                    <div class="form-group">
                        <label class="field-label" for="emergency_relation">
                            <span>Relation to You<span class="field-label__required-notice">*</span></span>
                        </label>
                        <input id="emergency_relation"
                               v-model="form_data.emergency_contact_relationship"
                               type="text"
                               class="form-field"
                               name="emergency_relation"
                               :class="fieldClass('emergency_contact_relationship')">
                        <p v-if="fieldMessage('emergency_contact_relationship')" class="input-error">
                            *{{fieldMessage('emergency_contact_relationship')}}
                        </p>
                    </div>
                    <div class="form-group">
                        <label class="field-label" for="emergency_phone">
                            <span>Phone<span class="field-label__required-notice">*</span></span>
                        </label>
                        <input id="emergency_phone"
                               v-model="form_data.emergency_contact_phone"
                               type="tel"
                               class="form-field"
                               name="emergency_phone"
                               :class="fieldClass('emergency_contact_phone')">
                        <p v-if="fieldMessage('emergency_contact_phone')" class="input-error">
                            *{{fieldMessage('emergency_contact_phone')}}
                        </p>
                    </div>
                </div>
            </div>
        </div>
        <div class="volunteer-request-general-information-form__cta">
            <div class="form-actions">
                <div class="form-actions__row">
                    <div class="form-actions__column form-actions__column--sm">
                        <button class="button button--info button--block"
                                :disabled="submitting"
                                v-on:click.prevent="cancel">
                            Cancel
                        </button>
                    </div>
                    <div class="form-actions__column form-actions__column--lg">
                        <button class="button button--block"
                                :disabled="submitting"
                                v-on:click.prevent="complete">
                            {{submitting ? 'Saving' : 'Save'}}
                        </button>
                    </div>
                </div>
            </div>
            <p class="input-error">
                {{external_error}}
            </p>
        </div>
    </div>
</template>
<script lang="ts">
    import mixins from 'vue-typed-mixins';
    import {UserProfile} from '../../contracts/app/UserContracts';
    import {EmergencyContact} from '../../contracts/AppContracts';
    import {VolunteerRequestGeneralInformationFormState} from '../../models/Forms/VolunteerRequestGeneralInformationFormState';
    import {VolunteerRequestGeneralInformationFormValidator} from '../../models/Forms/VolunteerRequestGeneralInformationFormValidator';
    import AddressFormMixin from './../../mixins/AddressFormMixin';

    const extendedVue = mixins(AddressFormMixin);
    export default extendedVue.extend({
        /**
         * Reactive data on component
         */
        data: function () {
            return {
                form_data: new VolunteerRequestGeneralInformationFormState(),
                validator_class: VolunteerRequestGeneralInformationFormValidator
            };
        },
        computed: {
            /**
             * The active user's emergency contact in state
             */
            active_emergency_contact: function (): EmergencyContact | null {
                return this.$store.getters['user/emergency_contact'];
            },
            /**
             * The active user profile, if there is one
             */
            active_profile: function (): UserProfile | null {
                return this.$store.getters['user/profile'];
            }
        },
        methods: {
            /**
             * Cancel the form
             */
            cancel: function () {
                this.$emit('cancel');
            }
        },
        /**
         * Upon creation, import existing data into FormState
         */
        created: function () {
            this.form_data.import(this.active_profile, this.active_emergency_contact);
        }
    });
</script>