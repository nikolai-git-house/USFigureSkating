<template>
    <div
        ref="body"
        class="site-takeover">
        <div class="site-takeover__header">
            <div class="grid-container">
                <div class="site-takeover__close">
                    <button type="button"
                            class="site-takeover__close-button active"
                            v-on:click.prevent="close">
                        <span class="nav-toggle__line nav-toggle__line--top">&nbsp;</span>
                        <span class="nav-toggle__line nav-toggle__line--middle">&nbsp;</span>
                        <span class="nav-toggle__line nav-toggle__line--bottom">&nbsp;</span>
                    </button>
                </div>
            </div>
        </div>
        <div ref="content_container"
             class="site-takeover__content">
            <slot></slot>
        </div>
    </div>
</template>
<script lang="ts">
    /* ===========================================================================================================
    *                                              SITE TAKEOVER
    *
    * Relative-positioned alternative to site overlay component
    * ===========================================================================================================*/
    import Vue from 'vue';
    import {AppRootInterface} from '../contracts/AppContracts';

    export default Vue.extend({
        props: {
            /**
             * Whether, upon close, to return to the prior document scroll position
             */
            return_to_scroll_location: {
                type: Boolean,
                default: false
            }
        },
        /**
         * Reactive data
         */
        data: function () {
            return {
                /**
                 * The logged document scroll upon open
                 */
                previous_scroll: 0,
                /**
                 * Any classes removed from the root element upon creation
                 */
                previous_root_classes: <string[]>[]
            };
        },
        /**
         * Upon component creation...
         *
         * 1. Log the document scroll position
         * 2. Remove root classes that we don't want
         * 3. Hide all direct children of app root element
         */
        created: function () {
            const root: AppRootInterface = this.$root as AppRootInterface;
            if (!root) {
                return;
            }
            const current_scroll = root.getCurrentScroll();
            if (current_scroll) {
                this.previous_scroll = current_scroll;
            }
            const root_element = root.$el;

            if (root_element.classList.contains('app--header-pad')) {
                this.previous_root_classes = ['app--header-pad'];
                root_element.classList.remove('app--header-pad');
            }
            const root_children = root_element.children;
            for (let i = 0; i < root_children.length; i++) {
                const rootChild = root_children[i] as HTMLElement;
                rootChild.style.display = 'none';
            }
        },
        /**
         * On component mount...
         *
         * 1. Append this component's element to app root element
         * 2. Reset document scroll
         */
        mounted: function () {
            const root: AppRootInterface = this.$root as AppRootInterface;
            if (!root) {
                return;
            }
            const root_element = root.$el;
            root_element.appendChild(this.$el);
            root.scrollTo(0);
        },
        /**
         * Before component is destroyed...
         *
         * 1. Restore root element classes removed upon creation of takeover.
         * 2. Un-hide root element child elements
         */
        beforeDestroy: function () {
            const root: AppRootInterface = this.$root as AppRootInterface;
            if (!root) {
                return;
            }
            const root_element = root.$el;
            if (this.previous_root_classes.length) {
                for (let i = 0; i < this.previous_root_classes.length; i++) {
                    const previousRootClass = this.previous_root_classes[i];
                    root_element.classList.add(previousRootClass);
                }
            }
            const root_children = root.$el.children;
            for (let i = 0; i < root_children.length; i++) {
                const rootChild = root_children[i] as HTMLElement;
                rootChild.style.removeProperty('display');
            }
        },
        /**
         * Upon component destruction...
         *
         * 1. If configured to do so, restore the original document scroll position. Otherwise reset scroll
         *
         * Component element will be removed via its destruction
         */
        destroyed: function () {
            const root: AppRootInterface = this.$root as AppRootInterface;
            if (!root) {
                return;
            }
            root.scrollTo(this.return_to_scroll_location ? this.previous_scroll : 0);
        },
        methods: {
            /**
             * Close the takeover
             */
            close: function (): void {
                this.$emit('close');
            }
        }
    });
</script>