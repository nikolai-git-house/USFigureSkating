<template>
    <div class="entity-check-in-roster-skater-info">
        <div class="entity-check-in-subpage__header entity-check-in-subpage__header--overlay">
            <h2 class="entity-check-in-subpage__header__title">
                Skater Information
            </h2>
            <h3 class="entity-check-in-subpage__header__subtitle">
                {{entity.summary_name}}
            </h3>
        </div>
        <div class="entity-check-in-subpage__content-container entity-check-in-subpage__content-container--pad-lg">
            <div class="entity-check-in-roster-skater-info__content">
                <div class="entity-check-in-subpage__section">
                    <div class="entity-check-in-roster-skater-info__summary">
                        <div class="entity-check-in-roster-skater-info__summary__icon">
                            <i class="icon-status-primary" :class="'icon-status-primary--' + (skater.requirements_and_compliance_complete ? 'yes' : 'no')"></i>
                        </div>
                        <div class="entity-check-in-roster-skater-info__summary__info">
                            <div class="entity-check-in-roster-skater-info__summary__name">
                                {{skater.full_name}}
                            </div>
                            <ul class="entity-check-in-roster-skater-info__summary__data">
                                <li class="entity-check-in-roster-skater-info__summary__data__datum">
                                    Age: {{skater.age}}
                                </li>
                                <li class="entity-check-in-roster-skater-info__summary__data__datum">
                                    Member #: {{skater.member_number}}
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="entity-check-in-subpage__section">
                    <div class="entity-check-in-roster-skater-info__body">
                        <div class="entity-check-in-roster-skater-info__body__section">
                            <h4 class="entity-check-in-roster-skater-info__body__section__summary" :class="{'entity-check-in-roster-skater-info__body__section__summary--no' : !skater.requirements_complete}">
                                Requirements
                            </h4>
                            <ul class="entity-check-in-roster-skater-info__body__section__list">
                                <li v-for="requirements_item in requirements"
                                    :key="requirements_item.id"
                                    class="entity-check-in-roster-skater-info__body__item"
                                    :class="'entity-check-in-roster-skater-info__body__item--'+(requirements_item.complete ? 'complete' : 'incomplete')">
                                    <span class="entity-check-in-roster-skater-info__body__item__label">{{requirements_item.name}}:</span>
                                    <span class="entity-check-in-roster-skater-info__body__item__value" :class="{'entity-check-in-roster-skater-info__body__item__value--error' : !requirements_item.complete}">
                                        {{requirements_item.status_description}}
                                    </span>
                                </li>
                            </ul>
                        </div>
                        <div class="entity-check-in-roster-skater-info__body__section">
                            <h4 class="entity-check-in-roster-skater-info__body__section__summary" :class="{'entity-check-in-roster-skater-info__body__section__summary--no' : !skater.compliance_complete}">
                                Compliance
                            </h4>
                            <ul class="entity-check-in-roster-skater-info__body__section__list">
                                <li v-for="compliance_item in compliance"
                                    :key="compliance_item.id"
                                    class="entity-check-in-roster-skater-info__body__item"
                                    :class="'entity-check-in-roster-skater-info__body__item--'+(compliance_item.complete ? 'complete' : 'incomplete')">
                                    <span class="entity-check-in-roster-skater-info__body__item__label">{{compliance_item.name}}:</span>
                                    <span class="entity-check-in-roster-skater-info__body__item__value" :class="{'entity-check-in-roster-skater-info__body__item__value--error' : !compliance_item.complete}">
                                        {{compliance_item.status_description}}
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="entity-check-in-subpage__section">
                    <div class="entity-check-in-roster-skater-info__close">
                        <button class="button button--block button--large" v-on:click.prevent="$emit('close')">
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
    import Vue from 'vue';
    import {ComplianceRequirementsSummaryItemDescribed} from '../../../../../_contracts/AdminPortalContracts';
    import {AbstractCheckInEntity} from '../../../../_models/CheckInEntities/AbstractCheckInEntity';
    import {CheckInSubEntitySkater} from '../../../_models/CheckInSubEntitySkater';

    export default Vue.extend({
        props: {
            skater: {
                type: Object as () => CheckInSubEntitySkater,
                required: true
            }
        },
        computed: {
            /**
             * The list of compliance item summaries
             */
            compliance: function (): ComplianceRequirementsSummaryItemDescribed[] {
                return this.skater.compliance_summary;
            },
            /**
             *  The entity being checked in
             */
            entity: function (): AbstractCheckInEntity {
                return this.$store.state.checkin.active_entity;
            },
            /**
             * The list of requirements item summaries
             */
            requirements: function (): ComplianceRequirementsSummaryItemDescribed[] {
                return this.skater.requirements_summary;
            }
        }
    });
</script>