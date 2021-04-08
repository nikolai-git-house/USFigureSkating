<template>
    <div class="page-entity-header"
         :class="root_classes">
        <div class="grid-container">
            <div class="page-entity-header__content">
                <p v-if="entity && entity.name"
                   class="page-entity-header__entity-name">
                    {{entity.name}}
                </p>
                <p v-else-if="entity_name"
                   class="page-entity-header__entity-name">
                    {{entity_name}}
                </p>
                <div v-if="entity && !!entity.compliance"
                     class="page-entity-header__compliance ada-text">
                    <page-entity-compliance-header :compliance="entity.compliance"></page-entity-compliance-header>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
    import Vue from 'vue';
    import {PageEntityHeaderComponentEntity} from './_contracts/PageEntityHeaderComponentContracts';
    import PageEntityComplianceHeader from './PageEntityComplianceHeader.vue';

    export default Vue.extend({
        components: {
            PageEntityComplianceHeader
        },
        props: {
            /**
             * Tne name of the entity in the header
             */
            entity_name: {
                type: String,
                required: false
            },
            entity: {
                type: Object as () => PageEntityHeaderComponentEntity,
                required: false
            }
        },
        computed: {
            /**
             * The name to display for the entity
             */
            display_name: function (): string | null {
                if (this.entity && this.entity.name) {
                    return this.entity.name;
                }

                return this.entity_name || null;
            },
            /**
             * Classes to apply to the root element
             */
            root_classes: function (): string[] {
                const result: string[] = [];
                const root = 'page-entity-header';
                if (!this.display_name && this.entity && this.entity.compliance) {
                    result.push(`${root}--compliance-only`);
                }

                return result;
            }
        },
        /**
         * Upon creation, update app navbar state to accommodate header
         */
        created: function () {
            this.$store.commit('app/removeNavBorder');
        }
    });
</script>