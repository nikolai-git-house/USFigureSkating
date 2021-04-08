<template>
    <div class="competition-team-personnel-accordion">
        <accordion class="accordion--large accordion--unpadded-content-h accordion--white-bg-content">
            <span slot="trigger_text"
                  class="competition-team-personnel-accordion__trigger-label accordion-trigger-raw">
                <span class="competition-team-personnel-accordion__trigger-label__count">
                    <span class="count-badge count-badge--large"
                          :class="{'count-badge--red': show_badge_error}">
                        <span class="count-badge__content">
                            {{personnel.length}}
                        </span>
                    </span>
                </span>
                <span class="competition-team-personnel-accordion__trigger-label__text">
                    {{personnel_descriptor}}
                </span>
            </span>
            <template slot="expand_content">
                <div v-if="!personnel.length"
                     class="competition-team-personnel-accordion__no-personnel">
                    <button class="labeled-action-button labeled-action-button--add"
                            v-on:click.prevent="$emit('edit')">
                        Add {{personnel_descriptor}}
                    </button>
                    <p class="warning-notice">
                        <i class="inline-icon icon-warning-alt">&nbsp;</i>
                        There are no {{personnel_descriptor.toLowerCase()}} identified as attending the competition.
                    </p>
                </div>
                <div v-else>
                    <div class="competition-team-personnel-accordion__edit">
                        <button class="labeled-action-button labeled-action-button--edit"
                                type="button"
                                v-on:click.prevent="$emit('edit')">
                            Edit {{personnel_descriptor}}
                        </button>
                    </div>
                    <div class="competition-team-personnel-accordion__cards">
                        <status-entity-card v-for="person in personnel"
                                            :key="person.id"
                                            class="status-entity-card--centered"
                                            :is_success="person.is_compliant"
                                            :is_invalid="person.is_ineligible">
                            <div slot="primary-content">
                                {{person.last_name}}, {{person.first_name}}
                                <span class="text--muted">({{person.member_number}})</span>
                            </div>
                            <status-summary slot="expand-content"
                                            class="status-summary--with-columns"
                                            :status_items="person.compliance_summary"></status-summary>
                        </status-entity-card>
                    </div>
                </div>
            </template>
        </accordion>
    </div>
</template>
<script lang="ts">
    import Vue from 'vue';
    import {CompetitionTeamPersonnelAccordion} from './_contracts';

    export default Vue.extend({
        props: {
            /**
             * The list of personnel to show in the accordion
             */
            personnel: {
                type: Array as () => CompetitionTeamPersonnelAccordion.Person[],
                required: true
            },
            /**
             * The type label of the personnel ("Coaches," "Prop Crew," etc.)
             */
            personnel_descriptor: {
                type: String,
                required: true
            }
        },
        computed: {
            /**
             * Whether to show the count badge in an error state
             */
            show_badge_error: function (): boolean {
                for (let i = 0; i < this.personnel.length; i++) {
                    const person = this.personnel[i];
                    if (person.is_ineligible) {
                        return true;
                    }
                }

                return false;
            }
        }
    });
</script>