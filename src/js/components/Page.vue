<template>
    <div class="page"
         :class="getAdditionalPageClasses()">
        <slot name="pre-header"></slot>
        <slot name="competition-heading"></slot>
        <slot v-if="!$slots.loader" name="page-heading">
            <div v-if="show_header" class="page-heading">
                <div class="page-heading__container">
                    <div v-if="show_back_link"
                         class="page-heading__back-link">
                        <a :href="back_link_href"
                           class="icon-link icon-link--back"
                           v-on:click="handleBackClick">
                            {{header.back_link_label ? header.back_link_label : 'Back'}}
                        </a>
                        <slot name="back-bar-secondary-link"></slot>
                    </div>
                    <h1 v-if="header.title" class="page-heading__title">
                        {{header.title}}
                        <small v-if="header.subtitle"
                               class="page-heading__subtitle">{{header.subtitle}}
                        </small>
                    </h1>
                    <p v-if="header.lead" class="page-heading__lead">
                        {{header.lead}}
                    </p>
                    <slot name="header-content"></slot>
                </div>
            </div>
        </slot>
        <slot name="loader"></slot>
        <div v-if="!$slots.loader && $slots.content" class="page__content-container">
            <slot name="content"></slot>
        </div>
        <div v-if="$slots.pagination" class="page__pagination-footer">
            <div class="grid-container">
                <slot name="pagination"></slot>
            </div>
        </div>
        <slot></slot>
    </div>
</template>
<script lang="ts">
    import Vue from 'vue';
    import {PageComponentHeaderConfiguration} from '../contracts/AppContracts';

    export default Vue.extend({
        props: {
            /**
             * Prop to control properties for display in header
             */
            header: {
                type: Object as () => PageComponentHeaderConfiguration,
                /**
                 * Default is an empty object
                 */
                default: (): PageComponentHeaderConfiguration => {
                    return {};
                }
            }
        },
        computed: {
            /**
             * The href attribute for the back link
             */
            back_link_href: function (): string {
                return this.header.back_link || '#';
            },
            /**
             * Whether to show the back link
             */
            show_back_link: function (): boolean {
                return !!this.header.back_link || typeof this.header.back_link_handler === 'function';
            },
            /**
             * Whether to show the header block
             */
            show_header: function () {
                for (const i in this.header) {
                    if (Object.prototype.hasOwnProperty.call(this.header, i)) {
                        const argument = this.header[i];
                        if (argument) {
                            return true;
                        }
                    }
                }

                return false;
            }
        },
        methods: {
            /**
             * Additional classes to apply to the page element
             */
            getAdditionalPageClasses: function () {
                const classes = [];
                if (this.$slots.pagination) {
                    classes.push('page--with-pagination');
                }

                return classes;
            },
            /**
             * Handle click event on back link
             */
            handleBackClick: function (e: MouseEvent) {
                if (typeof this.header.back_link_handler === 'function') {
                    e.preventDefault();
                    this.header.back_link_handler();
                }
            }
        }
    });
</script>