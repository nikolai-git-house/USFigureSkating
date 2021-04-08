<template>
    <div class="entity-check-in-compliance">
        <div class="entity-check-in-subpage__content-container  entity-check-in-subpage__content-container--pad-lg">
            <div v-if="!component_loaded" class="entity-check-in-subpage__notice">
                <p v-if="load_error" class="text--alert">
                    Error loading compliance information.
                </p>
                <p v-else-if="!loaded && loading_timeout">
                    Loading...
                </p>
            </div>
            <div v-else-if="!compliance_items.length" class="entity-check-in-subpage__notice">
                <p class="text--alert">
                    Compliance information is not available for {{active_entity_name}}.
                </p>
            </div>
            <div v-else class="entity-check-in-compliance__content">
                <h3 class="entity-check-in-compliance__header" :class="overall_summary.complete?'text--success':'text--error'">
                    <i class="inline-icon" :class="overall_summary.complete?'icon-status-primary-success':'icon-status-primary-error'"></i>
                    {{overall_summary.text}}
                </h3>
                <div class="entity-check-in-compliance__summary">
                    <entity-compliance-requirements-summary :item_state="item_state"
                                                            :compliance_items="compliance_items"
                                                            v-on:override-item="updateItem($event.overridden,$event.compliance_item)"></entity-compliance-requirements-summary>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
    import mixins from 'vue-typed-mixins';
    import HasDataDependencies from '../../../../mixins/HasDataDependencies';
    import {ComplianceRequirementsSummaryItem} from '../../../_contracts/AdminPortalContracts';
    import {
        ComplianceRequirementsSummaryItemOverridePayload,
        EditableComplianceSummaryState
    } from '../../_contracts/CheckInContracts';

    const vueClass = mixins(HasDataDependencies);
    // @vue/component
    export default vueClass.extend({
        /**
         * Reactive Data
         */
        data: function () {
            return {
                dependencies: {
                    compliance_data: false
                },
                item_state: <EditableComplianceSummaryState>{}
            };
        },
        computed: {
            /**
             * The name of the active check-in entity
             */
            active_entity_name: function (): string {
                return this.$store.getters['checkin/active_entity_name'];
            },
            /**
             * The list of compliance items for the active entity
             */
            compliance_items: function (): ComplianceRequirementsSummaryItem[] {
                return this.$store.state.checkin.compliance.active_compliance_summary;
            },
            /**
             * Whether all compliance items are complete
             */
            overall_complete: function (): boolean {
                return this.$store.getters['checkin/compliance/is_compliance_complete'];
            },
            /**
             * Summary of the Overall Status
             */
            overall_summary: function (): { complete: boolean; text: string; } {
                return {
                    complete: this.overall_complete,
                    text: this.overall_complete ? 'Complete' : 'Not Complete'
                };
            }

        },
        methods: {
            /**
             * Load data for component from API
             */
            loadData: function () {
                return new Promise((resolve, reject) => {
                    this.$store.dispatch('checkin/compliance/fetchActiveComplianceSummary')
                        .then(() => {
                            this.dependencies.compliance_data = true;
                            resolve();
                        })
                        .catch(() => {
                            reject();
                        });
                });
            },
            /**
             * Update the overridden status on a compliance item
             */
            updateItem: function (overridden: boolean, compliance_item: ComplianceRequirementsSummaryItem) {
                const item_state_key = String(compliance_item.id);
                this.$set(this.item_state, item_state_key, {submitting: true});
                const payload: ComplianceRequirementsSummaryItemOverridePayload = {
                    compliance_item,
                    overridden
                };
                this.$store.dispatch('checkin/compliance/overrideComplianceItem', payload)
                    .then(() => {
                        this.item_state[item_state_key].submitting = false;
                    })
                    .catch((error) => {
                        this.item_state[item_state_key].submitting = false;
                        this.item_state[item_state_key].error = error;
                    });
            }
        }
    });
</script>