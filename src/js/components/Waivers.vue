<template>
    <div class="competition-registration-waivers">
        <div class="accordion-group accordion-group--up-down">
            <accordion v-for="(waiver,index) in waivers"
                       :key="waiver.id"
                       :init_expanded="!isComplete(waiver)">
                <span slot="trigger_text"
                      class="accordion-status-trigger"
                      :class="isComplete(waiver) ? 'accordion-status-trigger--yes' : 'accordion-status-trigger--no'">{{waiver.name}}</span>
                <div slot="expand_content">
                    <div class="waiver-accordion-content">
                        <a :href="waiver.file_url"
                           target="_blank"
                           rel="noopener"
                           class="download-link">
                            Download {{waiver.name}}
                        </a>
                        <p class="waiver-accordion-content__lead">
                            I have read and accepted the above
                            <br>
                            waiver information:
                        </p>
                        <div class="waiver-accordion-content__form">
                            <div class="form-group">
                                <label class="field-label"
                                       :for="'name_'+index">Name:
                                </label>
                                <input :id="'name_'+index"
                                       v-model="waiver.status.name"
                                       type="text"
                                       class="form-field"
                                       :name="'name_'+index">
                                <p class="help-text">
                                    (If under 18, name of parent or guardian)
                                </p>
                            </div>
                            <div class="form-group">
                                <label class="field-label"
                                       :for="'relationship_'+index">
                                    Relationship:
                                </label>
                                <select :id="'relationship_'+index"
                                        v-model="waiver.status.relationship"
                                        :name="'relationship_'+index"
                                        class="form-field form-field--reduced-right">
                                    <option disabled
                                            :value="null">
                                        Select
                                    </option>
                                    <option v-for="option in relationship_form_options"
                                            :key="option.value"
                                            :value="option.value">
                                        {{option.label}}
                                    </option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </accordion>
        </div>
    </div>
</template>
<script lang="ts">
    import Vue from 'vue';
    import {UserWaiver} from '../contracts/app/CompetitionRegistrationContracts';

    export default Vue.extend({
        props: {
            waivers: {
                type: Array as () => UserWaiver[],
                required: true
            }
        },
        computed: {
            /**
             * Form options for relationship inputs
             */
            relationship_form_options: function () {
                return this.$store.getters['form_options/waiver_relationships'];
            }
        },
        methods: {
            /**
             * Whether a waiver is complete
             */
            isComplete: function (waiver: UserWaiver): boolean {
                return !!waiver.status.name && !!waiver.status.relationship;
            }
        }
    });
</script>