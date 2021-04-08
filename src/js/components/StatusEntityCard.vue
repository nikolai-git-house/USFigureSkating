<template>
    <div class="status-entity-card" :class="{'status-entity-card--with-overlay':this.$slots.overlay}">
        <div class="status-entity-card__row">
            <div class="status-entity-card__column status-entity-card__column--status">
                <i class="status-entity-card__status-icon icon-status-primary" :class="icon_class"></i>
            </div>
            <div class="status-entity-card__column status-entity-card__column--description">
                <div class="status-entity-card__primary-content">
                    <slot name="primary-content"></slot>
                </div>
                <div class="status-entity-card__secondary-content">
                    <slot name="secondary-content" :card_expanded="expanded"></slot>
                </div>
            </div>
            <div class="status-entity-card__column status-entity-card__column--actions">
                <slot name="actions"
                      :expandHandler="toggleExpand"
                      :expanded="expanded">
                    <button title="Open Additional Information"
                            class="icon-button icon-button--sm icon-button--pseudo"
                            :class="expanded?'icon-button--up':'icon-button--down'"
                            v-on:click.prevent="toggleExpand">
                        <span class="sr-only">Expand</span>
                    </button>
                </slot>
            </div>
        </div>
        <div v-if="expanded" class="status-entity-card__expand-content">
            <slot name="expand-content"></slot>
        </div>
        <div v-if="this.$slots.overlay" class="status-entity-card__overlay">
            <slot name="overlay"></slot>
        </div>
    </div>
</template>
<script lang="ts">
    import Vue from 'vue';

    export default Vue.extend({
        props: {
            /**
             * Whether to show the status as success
             */
            is_success: {
                type: Boolean,
                required: true
            },
            /**
             * Whether to show the icon as invalid.  Supersedes success/error
             */
            is_invalid: {
                type: Boolean
            }
        },
        /**
         * Reactive data
         */
        data: function () {
            return {
                expanded: false
            };
        },
        computed: {
            /**
             * The class to apply to the icon
             */
            icon_class: function (): string {
                const root = 'icon-status-primary';
                if (this.is_invalid) {
                    return `${root}--invalid`;
                }

                return this.is_success ? `${root}--yes` : `${root}--no`;
            }
        },
        methods: {
            /**
             * Toggle expansion of expansion section
             */
            toggleExpand: function () {
                this.expanded = !this.expanded;
            },
            /**
             * Collapse the card
             */
            close: function () {
                this.expanded = false;
            }
        }
    });
</script>