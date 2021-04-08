import Swiper from 'swiper/dist/js/swiper.min';

type RinkNameCarouselParameters = {
    element?: HTMLElement;
    navigation?: {
        nextEl: HTMLElement | string;
        prevEl: HTMLElement | string;
    };
    block_comparison_fn?: (slide_count: number) => boolean;
};

export class RinkNameCarousel {

    /**
     * Create the carousel
     */
    static create(parameters?: RinkNameCarouselParameters) {

        const binding = (parameters && parameters.element) || '#rink-name-carousel';

        const navigation = (parameters && parameters.navigation) || {
            nextEl: '#rink-carousel-next',
            prevEl: '#rink-carousel-prev'
        };

        const shouldBlockInit = (parameters && parameters.block_comparison_fn) || function (slide_count: number) {
            return slide_count === 3;
        };

        return new Swiper(binding, {
            effect: 'slide',
            loop: false,
            autoHeight: true,
            slidesPerView: 1,
            centeredSlides: true,
            initialSlide: 1,
            slideToClickedSlide: true,
            navigation: navigation,
            on: {
                /**
                 * When a slide changes, update the autoheight of the Swiper instance
                 */
                slideChange: function () {
                    this.updateAutoHeight();
                },
                /**
                 * Upon init, handle display criteria based on amount of rinks
                 */
                init: function () {
                    if (shouldBlockInit(this.slides.length)) {
                        this.$el[0].classList.add('single-rink');
                        this.detachEvents();

                        return;
                    }
                    this.$el[0].classList.add('multiple-rinks');
                }
            }
        });
    }
}