<template>
    <ul class="team-registration__roster-list">
        <li v-for="(entity,index) in entity_list"
            :key="entity.id"
            class="team-registration__roster-list__item">
            <div class="team-registration-roster-card">
                <div class="team-registration-roster-card__content">
                    <div class="team-registration-roster-card__content__description">
                        <p class="team-registration-roster-card__text team-registration-roster-card__text--primary">
                            <span>{{include_numbering ? `${index + 1}. ` : ''}}{{entity.last_name}}, {{entity.first_name}} <span class="text--muted">({{entity.member_number}})</span></span>
                        </p>
                        <p v-if="$scopedSlots.card_secondary"
                           class="team-registration-roster-card__text team-registration-roster-card__text--secondary">
                            <slot name="card_secondary"
                                  :entity="entity"></slot>
                        </p>
                    </div>
                    <div v-if="!entity.can_be_added_to_roster"
                         class="team-registration-roster-card__content__error">
                        <span class="member-result-notice member-result-notice--alert">
                            <span class="member-result-notice__icon">&nbsp;</span>
                            <span class="member-result-notice__text">
                                {{entity.cannot_be_added_to_roster_reason}}
                            </span>
                        </span>
                    </div>
                </div>
            </div>
        </li>
    </ul>
</template>
<script lang="ts">
    import Vue from 'vue';
    import {TeamRegistration} from '../_contracts';

    export default Vue.extend({
        props: {
            entity_list: {
                type: Array as () => TeamRegistration.ReviewListEntity[],
                required: true
            },
            include_numbering: {
                type: Boolean,
                default: false
            }
        }
    });
</script>