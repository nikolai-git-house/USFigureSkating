<template>
    <div class="volunteer-opportunities-request">
        <div class="grid-container">
            <div class="volunteer-opportunities-request__header">
                <h2 class="site-overlay__heading">
                    Volunteer Request
                </h2>
                <h3 class="site-overlay__subheading">
                    {{subheading_text}}
                </h3>
            </div>
            <div v-if="!component_loaded">
                <p v-if="load_error" class="text--alert">
                    Error loading profile.
                </p>
                <p v-else-if="!loaded && loading_timeout">
                    Loading...
                </p>
            </div>
            <div v-else class="volunteer-opportunities-request__content">
                <div v-if="general_active" class="volunteer-opportunities-request__general-information">
                    <volunteer-request-general-information v-on:complete="handleGeneralInformationComplete"
                                                           v-on:view-change="resetScroll"></volunteer-request-general-information>
                </div>
                <div v-if="experience_active" class="volunteer-opportunities-request__experience">
                    <volunteer-request-experience-form v-on:complete="completeExperience"
                                                       v-on:changed="handleSubformChange"></volunteer-request-experience-form>
                </div>
                <div v-if="waivers_active"
                     class="volunteer-opportunities-request__waivers">
                    <volunteer-request-waivers :submitting="submitting_request"
                                               :external_error="submit_request_error"
                                               v-on:complete="completeWaivers"
                                               v-on:changed="handleSubformChange"></volunteer-request-waivers>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
    import mixins from 'vue-typed-mixins';
    import {VolunteerRequestCompletionResponse} from '../../contracts/app/VolunteerOpportunitiesContracts';
    import {AppRootInterface} from '../../contracts/AppContracts';
    import {VolunteerRequestExperienceFormData} from '../../models/Forms/VolunteerRequestExperienceFormState';
    import {SiteOverlayComponent} from './../../components/SiteOverlay.vue';
    import HasDataDependencies from './../../mixins/HasDataDependencies';
    import VolunteerRequestExperienceForm from './VolunteerRequestExperienceForm.vue';
    import VolunteerRequestGeneralInformation from './VolunteerRequestGeneralInformation.vue';
    import VolunteerRequestWaivers from './VolunteerRequestWaivers.vue';
    import {VolunteerRequestFormData, VolunteerRequestFormState} from '../../models/Forms/VolunteerRequestFormState';
    import {VolunteerRequestWaiversFormData} from '../../models/Forms/VolunteerRequestWaiversFormState';

    const extendedVue = mixins(HasDataDependencies);
    export default extendedVue.extend({
        components: {
            VolunteerRequestExperienceForm,
            VolunteerRequestGeneralInformation,
            VolunteerRequestWaivers
        },
        /**
         * Reactive data on the component
         */
        data: function () {
            return {
                /**
                 * Which form is active
                 */
                active_form: <'general' | 'experience' | 'waivers'>'general',
                dependencies: {
                    component_data: false
                },
                /**
                 * Whether the volunteer request is submitting
                 */
                submitting_request: false,
                /**
                 * Error resulting from submitting the volunteer request
                 */
                submit_request_error: <string | null>null,
                /**
                 * Parent object to track request form data
                 */
                request_data: new VolunteerRequestFormState()
            };
        },
        computed: {
            /**
             * Whether the experience form is active
             */
            experience_active: function (): boolean {
                return this.active_form === 'experience';
            },
            /**
             * Whether the general information form is active
             */
            general_active: function (): boolean {
                return this.active_form === 'general';
            },
            /**
             * Subheading text in the header
             */
            subheading_text: function (): string {
                return this.general_active ? 'General Information' : this.experience_active ? 'Experience' : 'Waivers & Release';
            },
            /**
             * Whether the waivers form is active
             */
            waivers_active: function (): boolean {
                return this.active_form === 'waivers';
            }
        },
        methods: {
            /**
             * Handle completion on experience form
             */
            completeExperience: function (form_data: VolunteerRequestExperienceFormData) {
                this.request_data.importExperience(form_data);
                this.active_form = 'waivers';
            },
            /**
             * Handle completion on the waivers form
             */
            completeWaivers: function (form_data: VolunteerRequestWaiversFormData) {
                this.request_data.importWaivers(form_data);
                this.submitRequest();
            },
            /**
             * Submit the volunteer request
             */
            submitRequest: function () {
                if (this.submitting_request) {
                    return;
                }
                this.submit_request_error = null;
                this.submitting_request = true;
                const payload: VolunteerRequestFormData = this.request_data.export();

                this.$store.dispatch('volunteer_opportunities/submitRequest', payload)
                    .then((completion_response: VolunteerRequestCompletionResponse) => {
                        this.handleCompleteRequestResponse(completion_response);
                    })
                    .catch((error_message: string) => {
                        this.submit_request_error = error_message;
                        this.submitting_request = false;
                    });
            },
            /**
             * Handle response when completing experience form.
             *
             * If redirect url provided, redirect user to the URL.
             * Otherwise, emit completion event and clear appropriate local properties
             */
            handleCompleteRequestResponse: function (completion_response: VolunteerRequestCompletionResponse) {
                if (completion_response.redirect_url) {
                    location.assign(completion_response.redirect_url);

                    return;
                }
                this.submitting_request = false;
                this.$emit('complete-local', completion_response);
            },
            /**
             * Handle the complete event on general information form
             */
            handleGeneralInformationComplete: function () {
                this.active_form = 'experience';
            },
            /**
             * Handle change event on sub-form
             *
             * Clear submission error
             */
            handleSubformChange: function () {
                this.submit_request_error = null;
            },
            /**
             * Load state-based data
             */
            loadData: function (): Promise<void> {
                return new Promise((resolve, reject) => {
                    const active_competition_id: number | null = this.$store.state.volunteer_opportunities.active_competition_id;
                    this.$store.dispatch('volunteer_opportunities/fetchRequestData', active_competition_id)
                        .then(() => {
                            this.dependencies.component_data = true;
                            resolve();
                        })
                        .catch(() => {
                            reject();
                        });
                });
            },
            /**
             * Reset overlay scrolling content to top
             */
            resetScroll: function () {
                const $parent = <SiteOverlayComponent> this.$parent;
                if (typeof $parent.scrollTop === 'function') {
                    $parent.scrollTop();

                    return;
                }
                const $root: AppRootInterface = this.$root as AppRootInterface;
                $root.resetScroll();
            }

        },
        /**
         * When component is destroyed, restore appropriate values in state to defaults present prior to intiation
         */
        destroyed: function () {
            this.$store.dispatch('volunteer_opportunities/cancelRequest');
        },
        watch: {
            /**
             * When active form changes, scroll component to top
             */
            active_form: function () {
                this.resetScroll();
            }
        }
    });
</script>