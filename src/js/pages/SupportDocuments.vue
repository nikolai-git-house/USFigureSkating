<script lang="ts">
    import {SupportDocumentCategory} from "../contracts/AppContracts";
    import HasDataDependencies from "../mixins/HasDataDependencies";
    import mixins from 'vue-typed-mixins'
    import {getElementScrollBarWidth} from "../helpers/DOMHelpers";

    export default mixins(HasDataDependencies).extend({
        props: {
            /**
             * Whether document links should open in a new tab
             */
            new_tab: {
                type: Boolean,
                default: true
            }
        },
        data: function () {
            return {
                /**
                 * Data dependencies for the component to load
                 */
                dependencies: {
                    documents: false
                },
                /**
                 * The actively-selected category
                 */
                active_category: <SupportDocumentCategory | null>null,
                /**
                 * The height of the scrollable content area
                 */
                content_height: "auto",
                /**
                 * The scrollable content area width that's offset by any scrollbars that are present
                 */
                scrollbar_offset: 0,
                /**
                 * Whether the user has scrolled in the category view
                 */
                scrolling: false
            }
        },
        /**
         * When mounted, set initial content height and add debounced window resize listener to update it on window size change
         */
        mounted: function () {
            let window_resize_timeout: number;
            window.addEventListener('resize', () => {
                if (window_resize_timeout) {
                    clearTimeout(window_resize_timeout);
                }
                window_resize_timeout = window.setTimeout(() => {
                    this.updateContentHeight();
                }, 150);
            });
            this.updateContentHeight();
        },
        computed: {
            /**
             * All the categories for support documents
             */
            support_document_categories: function (): SupportDocumentCategory[] {
                return this.$store.getters['app/categorized_support_documents'];
            },
            /**
             * Whether the index view is active
             */
            index_active: function (): boolean {
                return this.active_category === null;
            }
        },
        methods: {
            /**
             * Load data into the component
             */
            loadData: function () {
                return new Promise((resolve, reject) => {
                    this.$store.dispatch('app/fetchSupportDocuments').then(() => {
                        this.dependencies.documents = true;
                        resolve();
                        this.$nextTick(() => {
                            this.updateActiveScrollbarOffset();
                        });
                    }).catch(() => {
                        reject();
                    })
                });
            },
            /**
             * Update the locally cached scrollbar offset
             *
             * Called after component data is loaded into the view, and when sub-screen changes
             */
            updateActiveScrollbarOffset: function () {
                let ref_key = 'index_scroll_content';
                if (this.active_category) {
                    ref_key = 'category_scroll_content'
                }
                this.scrollbar_offset = -1 * getElementScrollBarWidth(this.$refs[ref_key] as HTMLElement);
            },
            /**
             * Update content display properties
             *
             * 1) Update the height of the scrollable content area to be the viewport height less the nav height.
             *     - Needed due to lack of reliability for vh units on iOS Safari due to action bar
             */
            updateContentHeight: function () {
                let navbar_offset = 68;
                let navbar = document.querySelector('.site-header__navbar') as HTMLElement;
                if (navbar) {
                    navbar_offset = navbar.offsetHeight || navbar.clientHeight;
                }
                this.content_height = window.innerHeight - navbar_offset + "px";
            },
            /**
             * Set an active category, or nullify the active category
             */
            setActiveCategory: function (category: null | SupportDocumentCategory) {
                this.active_category = category;
                if (category === null) {
                    this.scrolling = false;
                }
            },
            /**
             * Handle scroll event on category screen.
             * Update local property indicating whether the page has been scrolled.
             *
             * No throttle currently implemented due to low-cost operation
             */
            scrollCategory: function (e: Event) {
                this.scrolling = (e.target as HTMLElement).scrollTop > 0
            }
        }
    });
</script>