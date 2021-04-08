<template>
    <div class="series-application-profile-email-edit">
        <div class="form-group"
             :class="fieldClass('email')">
            <label class="sr-only"
                   for="email">Email Address
            </label>
            <input id="email"
                   v-model="form_data.email"
                   type="text"
                   class="form-field"
                   name="email"
                   v-on:keydown.enter="attemptSave">
            <p v-if="fieldMessage('email')"
               class="input-error">
                *{{fieldMessage('email')}}
            </p>
        </div>
        <p v-if="submit_error"
           class="input-error">
            {{submit_error}}
        </p>
        <div class="form-row">
            <div class="form-column">
                <button :disabled="is_submitting"
                        class="button button--block button--medium button--info"
                        v-on:click.prevent="$emit('close')">
                    Cancel
                </button>
            </div>
            <div class="form-column">
                <button :disabled="is_submitting"
                        class="button button--block button--medium"
                        v-on:click.prevent="attemptSave">
                    {{!is_submitting?'Save':'Saving'}}
                </button>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
    import FormMixin from '../../../mixins/FormMixin';
    import mixins from 'vue-typed-mixins';
    import {SeriesApplicationProfileEditFormState} from '../_models/SeriesApplicationProfileEditFormState';
    import {SeriesApplicationProfileEditFormValidator} from '../_models/SeriesApplicationProfileEditFormValidator';
    import {SeriesApplication} from '../_contracts';

    const vueConstructor = mixins(FormMixin);
    // @vue/component
    export default vueConstructor.extend({
        props: {
            value: {
                type: String,
                required: true
            }
        },
        /**
         * Reactive data
         */
        data: function () {
            return {
                form_data: new SeriesApplicationProfileEditFormState(),
                is_submitting: false,
                submit_error: <string | false>false,
                /**
                 * The validator to use against the form data
                 */
                validator_class: SeriesApplicationProfileEditFormValidator
            };
        },
        /**
         * On creation, set default form_data value
         */
        created: function () {
            this.form_data.email = this.value;
        },
        methods: {
            /**
             * Save attempt
             */
            attemptSave: function (): void {
                this.submit_attempt = true;
                if (this.valid) {
                    this.doSave();
                }
            },
            /**
             * Save the edits to the form
             */
            doSave: function (): void {
                this.is_submitting = true;
                const payload: SeriesApplication.UpdateProfilePayload = {
                    email: this.form_data.email
                };
                this.$store.dispatch('series_registration/application/updateProfile', payload)
                    .then(() => {
                        this.is_submitting = false;
                        this.$emit('close');
                    })
                    .catch((error: string) => {
                        this.is_submitting = false;
                        this.submit_error = error;
                    });
            }
        }
    });
</script>