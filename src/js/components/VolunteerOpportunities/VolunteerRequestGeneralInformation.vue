<template>
    <div class="volunteer-request-general-information">
        <div v-if="!form_active"
             class="volunteer-request-general-information__submodule volunteer-request-general-information__submodule--show">
            <div class="volunteer-request-general-information__section">
                <div class="volunteer-request-general-information__section-heading">
                    <h3 class="volunteer-request-general-information__section-heading__text">
                        Personal
                    </h3>
                    <div class="volunteer-request-general-information__section-heading__edit">
                        <button class="icon-button icon-button--edit icon-button--md icon-button--pseudo"
                                v-on:click.prevent="form_active=true">
                            <span class="sr-only">Edit Icon Button</span>
                        </button>
                    </div>
                </div>
                <div class="volunteer-request-general-information__data">
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
                                {{displayGender(active_profile.gender)}}
                            </td>
                        </tr>
                        <tr v-if="show_country">
                            <td class="data-table__label">
                                Country:
                            </td>
                            <td class="data-table__value">
                                {{active_profile.address.country.label}}
                            </td>
                        </tr>
                        <tr>
                            <td class="data-table__label">
                                Address:
                            </td>
                            <td class="data-table__value">
                                <address class="display-address">
                                    <span>{{active_profile.address.street}}</span>
                                    <span v-if="active_profile.address.street_2">{{active_profile.address.street_2}}</span>
                                    <span>{{city_state_zip}}</span>
                                </address>
                            </td>
                        </tr>
                        <tr>
                            <td class="data-table__label">
                                Cell Phone:
                            </td>
                            <td class="data-table__value">
                                <span v-if="display_phone">
                                    {{display_phone}}
                                </span>
                                <em v-else class="text--alert">None Provided</em>
                            </td>
                        </tr>
                        <tr>
                            <td class="data-table__label">
                                Email:
                            </td>
                            <td class="data-table__value">
                                <span v-if="display_email">
                                    {{display_email}}
                                </span>
                                <em v-else class="text--alert">None Provided</em>
                            </td>
                        </tr>
                    </table>
                </div>
            </div>
            <div class="volunteer-request-general-information__section">
                <div class="volunteer-request-general-information__section-heading">
                    <h3 class="volunteer-request-general-information__section-heading__text">
                        Emergency Contact
                    </h3>
                </div>
                <div class="volunteer-request-general-information__data">
                    <table class="data-table">
                        <tr>
                            <td class="data-table__label">
                                Name:
                            </td>
                            <td class="data-table__value">
                                <span v-if="active_emergency_contact.name">
                                    {{active_emergency_contact.name}}
                                </span>
                                <em v-else class="text--alert">None Provided</em>
                            </td>
                        </tr>
                        <tr>
                            <td class="data-table__label">
                                Relation:
                            </td>
                            <td class="data-table__value">
                                <span v-if="active_emergency_contact.relationship">
                                    {{active_emergency_contact.relationship}}
                                </span>
                                <em v-else class="text--alert">None Provided</em>
                            </td>
                        </tr>
                        <tr>
                            <td class="data-table__label">
                                Phone:
                            </td>
                            <td class="data-table__value">
                                <span v-if="active_emergency_contact.phone">
                                    {{active_emergency_contact.phone}}
                                </span>
                                <em v-else class="text--alert">None Provided</em>
                            </td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
        <div v-else
             class="volunteer-request-general-information__submodule volunteer-request-general-information__submodule--edit">
            <volunteer-request-general-information-form :external_error="general_information_save_error"
                                                        :submitting="saving_general_information"
                                                        v-on:cancel="cancelEdit"
                                                        v-on:complete="saveGeneralInformation"
                                                        v-on:changed="handleSubformChange">
            </volunteer-request-general-information-form>
        </div>
        <div v-if="!form_active" class="volunteer-request-general-information__continue">
            <div class="form-actions">
                <div class="form-actions__column form-actions__column--sm">
                    <button class="button button--info button--block" v-on:click.prevent="cancel">
                        Cancel
                    </button>
                </div>
                <div class="form-actions__column form-actions__column--lg">
                    <button :disabled="!can_continue"
                            class="button button--block"
                            v-on:click.prevent="continueRequest">
                        Continue
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
    import Vue from 'vue';
    import {UserProfile} from '../../contracts/app/UserContracts';
    import {VolunteerRequestGeneralInformationFormData} from '../../contracts/app/VolunteerOpportunitiesContracts';
    import {EmergencyContact, GenderKey} from '../../contracts/AppContracts';
    import {DataDisplayService} from '../../services/DataDisplayService';
    import VolunteerRequestGeneralInformationForm from '../Forms/VolunteerRequestGeneralInformationForm.vue';

    export default Vue.extend({
        components: {
            VolunteerRequestGeneralInformationForm
        },
        /**
         * Reactive data on the component
         */
        data: function () {
            return {
                /**
                 * Whether the form is active, or whether the summary should show
                 */
                form_active: false,
                /**
                 * If there's an error saving the general information form
                 */
                general_information_save_error: <string | null>null,
                /**
                 * Whether general information form is currently saving
                 */
                saving_general_information: <boolean>false
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
            },
            /**
             * Whether the user has sufficient information to continue to the next step
             */
            can_continue: function (): boolean {
                const emergency_contact = this.active_emergency_contact;

                return !!emergency_contact
                    && !!emergency_contact.name
                    && !!emergency_contact.relationship
                    && !!emergency_contact.phone
                    && !!this.display_phone
                    && !!this.display_email;
            },
            /**
             * The combined city, state, zip line for the user's address
             */
            city_state_zip: function (): string {
                if (!this.active_profile) {
                    return '';
                }
                const address = this.active_profile.address;

                return address.city + ', ' + (address.state ? address.state.label : address.province ? address.province.label : '') + ' ' + address.zip_code;
            },
            /**
             * The email to display
             *
             * Primary if present, otherwise secondary if present, otherwise null
             */
            display_email: function (): string | null {
                const active_profile = this.active_profile;
                if (active_profile === null) {
                    return null;
                }
                if (active_profile.primary_email !== null) {
                    return active_profile.primary_email.value;
                }
                if (active_profile.secondary_email !== null) {
                    return active_profile.secondary_email.value;
                }

                return null;
            },
            /**
             * The phone number to display
             */
            display_phone: function (): string | null {
                return this.active_profile && this.active_profile.primary_phone && this.active_profile.primary_phone.value ? this.active_profile.primary_phone.value : null;
            },
            /**
             * Whether to display a user's country in the display data
             */
            show_country: function (): boolean {
                return !!this.active_profile
                    && !!this.active_profile.address.country
                    && this.active_profile.address.country.is_usa !== true;
            }
        },
        watch: {
            /**
             * When the form activates or deactivates, emit view change event
             */
            form_active: function () {
                this.$emit('view-change');
            }
        },
        methods: {
            /**
             * Cancel the currently active volunteer request
             */
            cancel: function () {
                this.$store.dispatch('volunteer_opportunities/exitRequest');
            },
            /**
             * Cancel the active edit form
             */
            cancelEdit: function (): void {
                this.form_active = false;
                this.general_information_save_error = null;
            },
            /**
             * Continue the currently active volunteer request
             */
            continueRequest: function (): void {
                if (!this.can_continue) {
                    return;
                }
                this.$emit('complete');
            },
            /**
             * Format gender display
             */
            displayGender: function (gender_key: GenderKey): string {
                return DataDisplayService.capitalize(gender_key);
            },
            /**
             * Handle change on sub-form
             *
             * Clear submission error
             */
            handleSubformChange: function () {
                this.general_information_save_error = null;
            },
            /**
             * Save user data from general information form
             */
            saveGeneralInformation: function (form_data: VolunteerRequestGeneralInformationFormData): void {
                // If already saving, block additional submissions
                if (this.saving_general_information) {
                    return;
                }

                // Set saving state variables
                this.general_information_save_error = null;
                this.saving_general_information = true;

                // Submit the save request
                this.$store.dispatch('volunteer_opportunities/saveGeneralInformation', form_data)
                    // On success...
                    .then(() => {
                        // Return to profile display and clear local props
                        this.form_active = false;
                        this.saving_general_information = false;
                    })
                    // On error...
                    .catch((error_message: string) => {
                        // Log the error and update state props
                        this.general_information_save_error = error_message;
                        this.saving_general_information = false;
                    });
            }
        }
    });
</script>