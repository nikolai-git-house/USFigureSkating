<template>
    <div class="page-entity-compliance-header ada-text"
         :class="{'page-entity-compliance-header--multirole': is_multirole}">
        <div class="page-entity-compliance-header__summary">
            <p class="page-entity-compliance-header__status">
                Compliance:
                <a v-if="compliance.link"
                   :class="compliance.status_key|status_class"
                   :href="compliance.link.url"
                   :target="compliance.link|link_target"
                   :rel="compliance.link|link_rel">
                    <span>{{compliance.status_description}}</span>
                </a>
                <span v-else
                      :class="compliance.status_key|status_class">
                    {{compliance.status_description}}
                </span>
                <span v-if="compliance.supporting_description">
                    <span>|</span>
                    <span :class="compliance.supporting_description.type_key|status_class">{{compliance.supporting_description.text}}</span>
                </span>
            </p>
            <button v-if="compliance_role_items_exist"
                    title="Show compliance summary"
                    type="button"
                    class="icon-button--pseudo icon-button icon-button--sm"
                    :class="expanded ? 'icon-button--up' : 'icon-button--down'"
                    v-on:click.prevent="toggle">
                <span class="sr-only">Show compliance summary</span>
            </button>
        </div>
        <div v-if="show_expand_content"
             class="page-entity-compliance-header__expand-content">
            <status-summary v-for="(compliance_role,index) in compliance_role_items"
                            :key="index"
                            :class="{'status-summary--inline': !is_multirole && compliance_role.items.length < 3}"
                            :heading="show_role_headings ? compliance_role.role : null"
                            :status_items="compliance_role.items">
                <template v-if="item.is_membership && item.membership_expiration_date_formatted"
                          slot="name_support"
                          slot-scope="{item}">
                    <span>:</span>
                    <span :class="item.complete ? 'text--success' : 'text--alert'">
                        ({{item.membership_expiration_date_formatted}})
                    </span>
                </template>
            </status-summary>
        </div>
    </div>
</template>
<script lang="ts">
    import Vue from 'vue';
    import {
        PageEntityHeaderComplianceRole,
        PageEntityHeaderComplianceSummary
    } from './_contracts/PageEntityHeaderComponentContracts';

    export default Vue.extend({
        props: {
            /**
             * Source compliance information
             */
            compliance: {
                type: Object as () => PageEntityHeaderComplianceSummary,
                required: true
            }
        },
        /**
         * Reactive data
         */
        data: function () {
            return {
                /**
                 * Whether the expanded content section is open
                 */
                expanded: false
            };
        },
        computed: {
            /**
             * List of individual compliance items by role
             */
            compliance_role_items: function (): PageEntityHeaderComplianceRole[] {
                return this.compliance.role_items || [];
            },
            /**
             * Whether individual compliance items exist
             */
            compliance_role_items_exist: function (): boolean {
                return !!this.compliance_role_items.length;
            },
            /**
             * Whether compliance items come within multiple roles
             */
            is_multirole: function (): boolean {
                return this.compliance_role_items.length >= 2;
            },
            /**
             * Whether to show the expanded content area
             */
            show_expand_content: function (): boolean {
                return this.expanded && this.compliance_role_items_exist;
            },
            /**
             * Whether to show role headings above sets of compliance items
             */
            show_role_headings: function (): boolean {
                return this.compliance_role_items_exist && this.compliance_role_items.length > 1;
            }
        },
        methods: {
            /**
             * Toggle the expanded content section
             */
            toggle: function (): void {
                this.expanded = !this.expanded;
            }
        }
    });
</script>