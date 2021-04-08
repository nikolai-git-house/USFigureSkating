<template>
    <div class="event-card"
         :class="{'event-card--registered' : event.is_registered_for, 'event-card--selected' : event.is_selected}">
        <div class="event-card__content">
            <div class="event-card__details">
                <p class="event-card__event-name">
                    {{event.name}}
                </p>
                <p class="event-card__event-details">
                    Judging System:
                    <span :class="{'ijs-fix':event.judging_system.toLowerCase()==='ijs'}">{{event.judging_system}}</span>
                </p>
                <p v-for="(datum,index) in event.additional_data"
                   :key="index"
                   class="event-card__event-details">
                    {{datum}}
                </p>
            </div>
            <div class="event-card__actions">
                <span v-if="event.is_registered_for"
                      class="event-card__paid">
                    Paid
                </span>
                <button v-else-if="event.is_selected"
                        :disabled="disable_actions"
                        class="icon-button--md-text icon-button icon-button--delete icon-button--labeled-inline icon-button--pseudo"
                        v-on:click.prevent="$emit('remove')">
                    Remove
                </button>
                <button v-else
                        :disabled="disable_actions"
                        class="button--medium-text button button--block button--info button--medium button--medium--text"
                        v-on:click.prevent="$emit('add')">
                    Add
                </button>
            </div>
        </div>
        <slot name="error"></slot>
    </div>
</template>
<script lang="ts">
    import Vue from 'vue';
    import {TeamRegistration} from '../_contracts';

    export default Vue.extend({
        props: {
            /**
             * The source event item
             */
            event: {
                type: Object as () => TeamRegistration.TeamRegistrationEventCardEvent,
                required: true
            },
            /**
             * Whether action buttons should be disabled
             */
            disable_actions: {
                type: Boolean,
                default: false
            }
        }
    });
</script>