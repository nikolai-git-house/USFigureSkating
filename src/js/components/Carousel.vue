<!--
    Generic Carousel Component

   1. Creates a swiper carousel instance around a set of slides
   2. Updates on window resize
   3. Emits initialization event
   usage:

     <carousel class="<additional_class_names>"
        :show_navigation="<bool - whether to show nav elements>"
        :factory_method="<factory_method_to_generate_Swiper_instance>"
        v-on:init="<external init handler>">

        // loop of slide elements.  should each have .swiper-slide class

    </carousel>

-->
<template>
    <div class="swiper-container carousel">
        <div class="swiper-wrapper">
            <slot></slot>
        </div>
        <div v-show="show_navigation" class="carousel__navigation">
            <div class="grid-container">
                <div ref="nav-next"
                     class="carousel__navigation__control carousel__navigation__control--next swiper-no-swiping"></div>
                <div ref="nav-prev"
                     class="carousel__navigation__control carousel__navigation__control--prev swiper-no-swiping"></div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
    import Swiper from 'swiper/dist/js/swiper.min';
    import Vue from 'vue';

    interface CarouselFactoryFunction extends FunctionConstructor {
        (params?: { [key: string]: any; }): Swiper;
    }

    export default Vue.extend({
        props: {
            /**
             * The factory method to generate the Swiper Carousel instance
             */
            factory_method: {
                type: Function as CarouselFactoryFunction,
                required: false
            },
            /**
             * Whether to show the navigation
             */
            show_navigation: {
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
                 * The carousel instance on the component
                 */
                carousel: <Swiper | null>null
            };
        },
        /**
         * Upon component mount, initialize carousel and listeners
         */
        mounted: function () {
            this.$nextTick(() => {
                this.initCarousel();
            });
            this.attachResizeListener();
        },
        methods: {
            /**
             * Add resize listener.
             */
            attachResizeListener: function () {
                let resize_timeout: number | false = false;
                /**
                 * Debounce resize
                 */
                window.addEventListener('resize', () => {
                    if (resize_timeout) {
                        clearTimeout(resize_timeout);
                    }
                    /**
                     * On debounced resize, update carousel
                     */
                    resize_timeout = window.setTimeout(() => {
                        if (this.carousel) {
                            this.carousel.update();
                        }
                    }, 200);
                });
            },
            /**
             * Initialize carousel with provided factory method
             */
            initWithFactory: function () {
                this.carousel = this.factory_method({
                    element: this.$el,
                    navigation: {
                        nextEl: this.$refs['nav-next'] as HTMLElement,
                        prevEl: this.$refs['nav-prev'] as HTMLElement
                    },
                    /**
                     * Carousel shouldn't init if there is only 1 slide
                     */
                    block_comparison_fn: function (slide_count: number) {
                        return slide_count < 2;
                    }
                });
            },
            /**
             * Initialize with a default swiper
             */
            initDefault: function () {
                this.carousel = new Swiper(this.$el, {
                    autoHeight: true,
                    centeredSlides: true,
                    loop: true,
                    navigation: this.show_navigation ? {
                        nextEl: this.$refs['nav-next'] as HTMLElement,
                        prevEl: this.$refs['nav-prev'] as HTMLElement
                    } : {},
                    slideToClickedSlide: true,
                    on: {
                        /**
                         * When a slide changes, update the autoheight of the Swiper instance
                         */
                        slideChange: function () {
                            this.updateAutoHeight();
                        }
                    }
                });
            },
            /**
             * Initialize the carousel instance
             */
            initCarousel: function () {
                if (this.factory_method) {
                    this.initWithFactory();
                } else {
                    this.initDefault();
                }
                /**
                 * Emit initialize event
                 */
                this.$emit('input', this.carousel);
                this.$emit('init');
            }
        }
    });
</script>