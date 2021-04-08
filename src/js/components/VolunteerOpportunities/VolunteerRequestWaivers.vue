<template>
    <div class="volunteer-request-experience-form">
        <div class="volunteer-request-experience-form__section volunteer-request-experience-form__section--lead">
            <p>{{lead}}</p>
        </div>
        <div v-if="form_data.waivers.length"
             class="volunteer-request-experience-form__section volunteer-request-experience-form__section--waivers">
            <waivers :waivers="form_data.waivers"></waivers>
            <p v-if="fieldMessage('waivers')"
               class="input-error volunteer-request-experience-form__waivers-error">
                *{{fieldMessage('waivers')}}
            </p>
        </div>
        <div class="volunteer-request-experience-form__section volunteer-request-experience-form__section--terms">
            <h3 class="volunteer-request-experience-form__section-heading">
                Terms &amp; Conditions
            </h3>
            <div class="volunteer-request-experience-form__section-content">
                <ul class="check-list check-list--extended">
                    <li>
                        <label for="terms_agree"
                               class="usfsa-checkbox usfsa-checkbox--required">
                            <input id="terms_agree"
                                   v-model="form_data.terms_agree"
                                   type="checkbox">
                            <span class="usfsa-checkbox__text">I agree to the <a class="standard-link standard-link--no-visited"
                                                                                 :href="terms_and_conditions_link"
                                                                                 target="_blank"
                                                                                 rel="noopener">terms &amp; conditions</a> of this application</span>
                        </label>
                        <p v-if="fieldMessage('terms_agree')"
                           class="input-error">
                            *{{fieldMessage('terms_agree')}}
                        </p>
                    </li>
                    <li>
                        <label for="background_agree"
                               class="usfsa-checkbox usfsa-checkbox--required">
                            <input id="background_agree"
                                   v-model="form_data.records_consent"
                                   type="checkbox">
                            <span class="usfsa-checkbox__text">I consent to a <a class="standard-link standard-link--no-visited"
                                                                                 :href="criminal_history_check_link"
                                                                                 target="_blank"
                                                                                 rel="noopener">criminal history records check</a>, if necessary</span>
                        </label>
                        <p v-if="fieldMessage('records_consent')"
                           class="input-error">
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
                            <button :disabled="submitting"
                                    class="button button--block"
                                    :class="{'disabled' : !valid}"
                                    v-on:click.prevent.stop="complete">
                                {{submitting ? 'Submitting' : 'Submit'}} Request
                            </button>
                        </div>
                    </div>
                </div>
                <p v-if="external_error"
                   class="input-error">
                    {{external_error}}
                </p>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
    import mixins from 'vue-typed-mixins';
    import FormMixin from '../../mixins/FormMixin';
    import {VolunteerRequestWaiversFormState} from '../../models/Forms/VolunteerRequestWaiversFormState';
    import {VolunteerRequestWaiversFormValidator} from '../../models/Forms/VolunteerRequestWaiversFormValidator';
    import {UserWaiver} from '../../contracts/app/CompetitionRegistrationContracts';
    import Waivers from '../Waivers.vue';

    const extendedVue = mixins(FormMixin);
    // @vue/component
    export default extendedVue.extend({
        components: {
            Waivers
        },
        /**
         * Reactive Data
         */
        data: function () {
            return {
                form_data: new VolunteerRequestWaiversFormState(),
                validator_class: VolunteerRequestWaiversFormValidator
            };
        },
        computed: {
            /**
             * Link target for criminal history check link
             */
            criminal_history_check_link: function (): string {
                return this.$store.state.volunteer_opportunities.links.criminal_history_check;
            },
            /**
             * Component lead/intro text
             */
            lead: function (): string {
                return this.$store.state.volunteer_opportunities.waivers_lead;
            },
            /**
             * Link target for terms and conditions link
             */
            terms_and_conditions_link: function (): string {
                return this.$store.state.volunteer_opportunities.links.terms_and_conditions;
            },
            /**
             * Waivers associated with a volunteer request
             */
            waivers: function (): UserWaiver[] {
                return this.$store.state.volunteer_opportunities.waivers;
            }
        },
        /**
         * Upon component creation...
         * 1. Import state waivers into form data
         */
        created: function () {
            this.form_data.waivers = this.waivers.map((waiver: UserWaiver) => {
                return {
                    ...waiver
                };
            });
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
            }
        }
    });
</script>