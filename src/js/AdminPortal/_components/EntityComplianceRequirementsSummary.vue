<template>
    <div class="entity-compliance-requirements-summary">
        <ul class="entity-compliance-requirements-summary__list">
            <li v-for="(compliance,index) in compliance_items"
                :key="index"
                class="entity-compliance-requirements-summary__list__item">
                <div class="entity-compliance-requirements-summary__item" :class="complianceItemComplete(compliance)?'entity-compliance-requirements-summary__item--complete':'entity-compliance-requirements-summary__item--incomplete'">
                    <div class="entity-compliance-requirements-summary__item__name">
                        {{compliance.name}}
                    </div>
                    <div v-if="!compliance.complete && override_permitted" class="entity-compliance-requirements-summary__item__control">
                        <div class="form-group">
                            <label :for="'viewed_' + index"
                                   class="usfsa-checkbox"
                                   :disabled="disableItemOverride(compliance)">
                                <input :id="'viewed_' + index"
                                       :disabled="disableItemOverride(compliance)"
                                       :checked="compliance.overridden"
                                       type="checkbox"
                                       v-on:click.prevent="handleChange($event.target.checked, compliance)">
                                <span class="usfsa-checkbox__text">Viewed</span>
                            </label>
                        </div>
                    </div>
                </div>
                <p v-if="itemError(compliance)" class="input-error">
                    {{itemError(compliance)}}
                </p>
            </li>
        </ul>
    </div>
</template>
<script lang="ts">
    import Vue from 'vue';
    import {ComplianceRequirementsSummaryItem} from '../_contracts/AdminPortalContracts';
    import {
        ComplianceRequirementsSummaryItemOverridePayload,
        EditableComplianceSummaryState
    } from '../CheckIn/_contracts/CheckInContracts';

    export default Vue.extend({
        props: {
            /**
             * The list of ComplianceRequirementsSummaryItem items to display
             */
            compliance_items: {
                type: Array as () => ComplianceRequirementsSummaryItem[],
                required: true,
                default: () => {
                    return [];
                }
            },
            /**
             * The external state of items
             */
            item_state: {
                type: Object as () => EditableComplianceSummaryState,
                default: () => {
                    return {};
                }
            },
            /**
             * Whether items can be overridden
             */
            override_permitted: {
                type: Boolean,
                default: true
            }
        },
        methods: {
            /**
             * Whether a compliance item should display as completed
             */
            complianceItemComplete: function (compliance_item: ComplianceRequirementsSummaryItem): boolean {
                return compliance_item.overridden || compliance_item.complete;
            },
            /**
             * Whether an item should have its override controls disabled
             */
            disableItemOverride: function (compliance_item: ComplianceRequirementsSummaryItem): boolean {
                if (compliance_item.id in this.item_state) {
                    if (this.item_state[compliance_item.id].submitting) {
                        return true;
                    }
                }

                return false;
            },
            /**
             * Handle overridden input change on a compliance item
             */
            handleChange: function (overridden: boolean, compliance_item: ComplianceRequirementsSummaryItem) {
                this.$emit('override-item', <ComplianceRequirementsSummaryItemOverridePayload>{
                    compliance_item,
                    overridden
                });
            },
            /**
             * The error associated with an item, if there is one
             */
            itemError: function (compliance_item: ComplianceRequirementsSummaryItem): string | null {
                if (compliance_item.id in this.item_state) {
                    if (this.item_state[compliance_item.id].error) {
                        return this.item_state[compliance_item.id].error || null;
                    }
                }

                return null;
            }
        }
    });
</script>