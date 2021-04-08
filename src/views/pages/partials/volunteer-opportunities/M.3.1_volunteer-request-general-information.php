<!-- @deprecated - 2020-01-07
    future uses of the volunteer-request-general-information component should use the template defined within the single-file component
-->
<div class="volunteer-request-general-information">
    <div class="volunteer-request-general-information__submodule volunteer-request-general-information__submodule--show" v-if="!form_active">
        <div class="volunteer-request-general-information__section">
            <div class="volunteer-request-general-information__section-heading">
                <h3 class="volunteer-request-general-information__section-heading__text">
                    Personal
                </h3>
                <div class="volunteer-request-general-information__section-heading__edit">
                    <button class="icon-button icon-button--edit icon-button--md icon-button--pseudo" v-on:click.prevent="form_active=true">
                        <span class="sr-only">Edit Icon Button</span>
                    </button>
                </div>
            </div>
            <div class="volunteer-request-general-information__data">
                <table class="data-table">
                    <tr>
                        <td class="data-table__label">Name:</td>
                        <td class="data-table__value">
                            {{active_profile.full_name}}
                        </td>
                    </tr>
                    <tr>
                        <td class="data-table__label">Birth Date:</td>
                        <td class="data-table__value">
                            {{active_profile.birth_date.formatted}}
                        </td>
                    </tr>
                    <tr>
                        <td class="data-table__label">Gender:</td>
                        <td class="data-table__value">
                            {{displayGender(active_profile.gender)}}
                        </td>
                    </tr>
                    <tr v-if="show_country">
                        <td class="data-table__label">Country:</td>
                        <td class="data-table__value">
                            {{active_profile.address.country.label}}
                        </td>
                    </tr>
                    <tr>
                        <td class="data-table__label">Address:</td>
                        <td class="data-table__value">
                            <address class="display-address">
                                <span>{{active_profile.address.street}}</span>
                                <span v-if="active_profile.address.street_2">{{active_profile.address.street_2}}</span>
                                <span>{{city_state_zip}}</span>
                            </address>
                        </td>
                    </tr>
                    <tr>
                        <td class="data-table__label">Cell Phone:</td>
                        <td class="data-table__value">
                            <span v-if="display_phone">
                                {{display_phone}}
                            </span>
                            <em class="text--alert" v-else>None Provided</em>
                        </td>
                    </tr>
                    <tr>
                        <td class="data-table__label">Email:</td>
                        <td class="data-table__value">
                            <span v-if="display_email">
                                {{display_email}}
                            </span>
                            <em class="text--alert" v-else>None Provided</em>
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
                        <td class="data-table__label">Name:</td>
                        <td class="data-table__value">
                            <span v-if="active_emergency_contact.name">
                                {{active_emergency_contact.name}}
                            </span>
                            <em class="text--alert" v-else>None Provided</em>
                        </td>
                    </tr>
                    <tr>
                        <td class="data-table__label">Relation:</td>
                        <td class="data-table__value">
                            <span v-if="active_emergency_contact.relationship">
                                {{active_emergency_contact.relationship}}
                            </span>
                            <em class="text--alert" v-else>None Provided</em>
                        </td>
                    </tr>
                    <tr>
                        <td class="data-table__label">Phone:</td>
                        <td class="data-table__value">
                            <span v-if="active_emergency_contact.phone">
                                {{active_emergency_contact.phone}}
                            </span>
                            <em class="text--alert" v-else>None Provided</em>
                        </td>
                    </tr>
                </table>
            </div>
        </div>
    </div>
    <div class="volunteer-request-general-information__submodule volunteer-request-general-information__submodule--edit" v-else>
        <volunteer-request-general-information-form inline-template v-on:cancel="cancelEdit" v-on:complete="saveGeneralInformation" v-on:changed="handleSubformChange" :external_error="general_information_save_error" :submitting="saving_general_information">
            <?php include __DIR__ . "/M.3.1.1_volunteer-request-general-information-form.php"; ?>
        </volunteer-request-general-information-form>
    </div>
    <div class="volunteer-request-general-information__continue" v-if="!form_active">
        <div class="form-actions">
            <div class="form-actions__column form-actions__column--sm">
                <button v-on:click.prevent="cancel" class="button button--info button--block">
                    Cancel
                </button>
            </div>
            <div class="form-actions__column form-actions__column--lg">
                <button :disabled="!can_continue" v-on:click.prevent="continueRequest" class="button button--block">
                    Continue
                </button>
            </div>
        </div>
    </div>
</div>