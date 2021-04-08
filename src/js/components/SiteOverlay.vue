<template>
    <transition
        :name="transition_name"
        v-on:after-enter="afterEnter"
        v-on:before-enter="beforeEnter"
        v-on:before-leave="beforeLeave"
        v-on:after-leave="afterLeave">
        <div v-if="show_overlay"
             ref="body"
             class="site-overlay"
             :class="{'site-overlay--no-header':!show_header}"
             :style="{top: overlay_top_offset + 'px'}">
            <div v-if="show_header" class="site-overlay__header">
                <div v-if="show_close" class="site-overlay__close">
                    <button type="button"
                            class="site-overlay__close-button active"
                            v-on:click.prevent="close">
                        <span class="nav-toggle__line nav-toggle__line--top">&nbsp;</span>
                        <span class="nav-toggle__line nav-toggle__line--middle">&nbsp;</span>
                        <span class="nav-toggle__line nav-toggle__line--bottom">&nbsp;</span>
                    </button>
                </div>
            </div>
            <div ref="content_container"
                 class="site-overlay__content"
                 :class="[content_class, {'site-overlay__content--no-top-pad':!show_header}]">
                <slot></slot>
            </div>
        </div>
    </transition>
</template>
<script lang="ts">
    import ScrollHelpers from '../helpers/scroll';
    import Vue from 'vue';

    export interface SiteOverlayComponent extends Vue {
        scrollTop: Function;
    }

    export default Vue.extend({
        props: {
            /**
             * Whether the overlay should initialize as open
             */
            init_open: {
                type: Boolean,
                default: false
            },
            /**
             * Function to determine whether the overlay should be open
             */
            open_fn: {
                type: Function
            },
            return_to_scroll_location: {
                type: Boolean,
                default: false
            },
            /**
             * Whether to show the close control
             */
            show_close: {
                type: Boolean,
                default: true,
                required: false
            },
            /**
             * Whether to show the header
             */
            show_header: {
                type: Boolean,
                default: true,
                required: false
            },
            /**
             * Whether to lock scrolling when the overlay is active
             */
            lock_scroll: {
                type: Boolean,
                default: true,
                required: false
            },
            /**
             * Name of the transition for show/hide
             */
            transition_name: {
                type: String,
                default: ''
            },
            /**
             * Array of classes to add to the content element
             */
            content_class: {
                type: Array as () => string[],
                default: () => {
                    return [];
                }
            }
        },
        /**
         * Reactive data
         */
        data: function () {
            return {
                /**
                 * The document scrolling element's top scroll amount when overlay is activated
                 */
                body_scroll_on_init: 0,
                /**
                 * The document scrolling element
                 */
                document_scroll_element: <HTMLElement>ScrollHelpers.getRootScrollingElement(),
                /**
                 * Whether the overlay is active
                 */
                overlay_active: false,
                /**
                 * The top offset of the overlay (used during transitions)
                 */
                overlay_top_offset: 0,
                /**
                 * @deprecated
                 */
                show: true
            };
        },
        computed: {
            /**
             * The actual element for the overlay (inside the transition element)
             */
            content_element: function (): HTMLElement {
                return <HTMLElement> this.$refs.body;
            },
            /**
             * Whether the overlay should be showing
             */
            show_overlay: function (): boolean {
                return this.overlay_active || this.open_fn();
            }
        },
        methods: {
            /**
             * Before content enters, set reactive data related to document scrolling element top offset
             */
            beforeEnter: function () {
                if (!this.lock_scroll) {
                    return;
                }
                this.overlay_top_offset = this.document_scroll_element.scrollTop;
                this.body_scroll_on_init = this.document_scroll_element.scrollTop;
            },
            /**
             * After the enter transition ends...
             * 1. Remove the HTML body scroll offset (set top position to 0)
             * 2. Add overlay active body class
             */
            afterEnter: function () {
                this.$emit('entered');
                if (!this.lock_scroll) {
                    return;
                }
                this.overlay_top_offset = 0;
                this.document_scroll_element.classList.add('overlay-active');
            },
            /**
             * After the leave transition ends...
             * 1. Remove overlay active body class
             */
            afterLeave: function () {
                if (!this.lock_scroll) {
                    return;
                }
                this.body_scroll_on_init = 0;
            },
            /**
             * Before leave transition starts...
             * 1. Remove overlay active scrolling element class
             * 2. If configured to return to scroll position on root, do it
             */
            beforeLeave: function () {
                if (!this.lock_scroll) {
                    return;
                }
                this.document_scroll_element.classList.remove('overlay-active');
                if (this.return_to_scroll_location) {
                    this.overlay_top_offset = this.body_scroll_on_init;
                    this.document_scroll_element.scrollTop = this.body_scroll_on_init;
                }
            },
            /**
             * Scroll the overlay content to the top
             */
            scrollTop: function () {
                const $ref = <HTMLElement | null> this.$refs.content_container;
                if ($ref) {
                    $ref.scrollTop = 0;
                }
            },
            /**
             * Close the overlay
             */
            close: function (): void {
                this.overlay_active = false;
                this.$emit('close-overlay');

            },
            /**
             * Open the overlay
             */
            open: function (): void {
                this.overlay_active = true;
            }
        }
    });
</script>