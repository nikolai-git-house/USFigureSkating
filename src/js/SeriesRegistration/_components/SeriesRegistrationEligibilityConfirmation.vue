<template>
    <div class="series-registration-eligibility-confirmation">
        <div class="confirmation-overlay__dialog">
            <h3 class="series-registration-eligibility-confirmation__title">
                Eligibility Confirmation
            </h3>
            <label for="eligibility_confirm"
                   class="usfsa-checkbox">
                <input id="eligibility_confirm"
                       v-model="confirmed"
                       type="checkbox">
                <span class="usfsa-checkbox__text">I have read and reviewed eligibility requirements.</span>
            </label>
            <ul class="series-registration-eligibility-confirmation__document-list">
                <li v-for="(document, index) in eligibility_documents"
                    :key="index">
                    <a :href="document.link"
                       target="_blank"
                       rel="noopener noreferrer"
                       class="icon-link icon-link--download">{{document.name}}
                    </a>
                </li>
            </ul>
            <div class="series-registration-eligibility-confirmation__cta">
                <button :disabled="disable_button"
                        class="button button--medium button--block"
                        v-on:click.prevent="$emit('continue')">
                    Continue
                </button>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
    import Vue from 'vue';
    import {SeriesApplication} from '../SeriesApplication/_contracts';

    export default Vue.extend({
        props: {
            /**
             * The eligibility documents for the series
             */
            eligibility_documents: {
                type: Array as () => SeriesApplication.SeriesEligibilityDocument[],
                required: true
            }
        },
        /**
         * Reactive data
         */
        data: function () {
            return {
                confirmed: false
            };
        },
        computed: {
            /**
             * Whether the button should be disabled
             */
            disable_button: function (): boolean {
                return !this.confirmed;
            }
        }
    });
</script>