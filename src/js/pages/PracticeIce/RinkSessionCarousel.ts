/* eslint-disable */
import Swiper from 'swiper/dist/js/swiper.min';

type RinkSessionCarouselParameters = {
    element?: HTMLElement | string;
    block_comparison_fn?: (slide_count: number) => boolean;
};

export class RinkSessionCarousel {
    static create(parameters?: RinkSessionCarouselParameters) {

        const binding = (parameters && parameters.element) || '#rink-session-carousel';

        const shouldBlockInit = (parameters && parameters.block_comparison_fn) || function (slide_count: number) {
            return slide_count === 3;
        };

        return new Swiper(binding, {
            effect: "slide",
            loop: false,
            autoHeight: true,
            slidesPerView: 1,
            centeredSlides: true,
            initialSlide: 1,
            noSwipingClass: 'noswipe',
            on: {
                slideChange: function () {
                },
                transitionEnd: function () {
                },
                slideNextTransitionEnd: function () {
                    if (this.activeIndex === this.slides.length - 1) {
                        let self = this;
                        //prevent visual clipping
                        setTimeout(function () {
                            self.slideTo(1, 0, false);
                        }, 20)
                    }
                },
                slideNextTransitionStart: function () {
                    if (this.activeIndex === this.slides.length - 1) {
                        this.slides[1].classList.add('swiper-slide-active');
                    }
                },
                slidePrevTransitionStart: function () {
                    if (this.activeIndex === 0) {
                        this.slides[this.slides.length - 2].classList.add('swiper-slide-active');
                    }
                },
                slidePrevTransitionEnd: function () {
                    if (this.activeIndex === 0) {
                        let self = this;
                        // prevent visual clipping
                        setTimeout(function () {
                            self.slideTo(self.slides.length - 2, 0, false);
                        }, 20);
                    }
                },
                init: function () {
                    if (shouldBlockInit(this.slides.length)) {
                        this.detachEvents();
                    }
                }
            }
        });
    }
}