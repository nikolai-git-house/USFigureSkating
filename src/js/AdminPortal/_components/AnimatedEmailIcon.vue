<template>
    <div class="animated-email-icon animated-icon">
        <svg class="animated-icon__svg"
             viewBox="0 0 94 63"
             width="94"
             height="63"
             version="1.1"
             xmlns="http://www.w3.org/2000/svg">
            <defs>
                <clipPath id="clip">
                    <rect class="animated-email-icon__clip"
                          x="5"
                          y="-20"
                          width="26"
                          height="36"
                          transform="rotate(-194, 13, 18)"
                          fill="FFF">
                        <animate v-if="animating"
                                 attributeName="height"
                                 from="0"
                                 to="36"
                                 values="0;0;11;11;23;23;34;34"
                                 keyTimes="0;0.24;0.25;0.49;0.5;0.74;0.75;1"
                                 dur="1s"
                                 repeatCount="indefinite"></animate>
                    </rect>
                </clipPath>
            </defs>
            <g transform="translate(4)"
               stroke="#2599F2"
               fill="none"
               fill-rule="evenodd">
                <g transform="rotate(-15 69.2895304 -81.0951843)" stroke-width="2.496">
                    <rect id="Rectangle-Copy-4"
                          x="1.248"
                          y="1.248"
                          width="55.9191579"
                          height="36.4416"
                          rx="2.496"></rect>
                    <path id="Path-2" d="M2.56340398 2.47446364C10.2102666 9.6166548 17.8571292 16.758846 25.5039918 23.9010371h0c1.8915645 1.7667266 4.8197274 1.7946613 6.7446538.0643441L56.1566514 2.47446364"></path>
                </g>
                <g clip-path="url(#clip)"
                   stroke-width="2"
                   stroke-linecap="round"
                   stroke-linejoin="round">
                    <path d="M0 28h19.1824355"></path>
                    <path d="M5 38h19.1824355"></path>
                    <path d="M8 50h19.1824355"></path>
                </g>
            </g>
        </svg>
    </div>
</template>
<script lang="ts">
    import Vue from 'vue';

    export interface AnimatedEmailIconInterface extends Vue {
        complete(): void;

        play(): void;
    }

    export default Vue.extend({
        /**
         * Reactive data
         */
        data: function () {
            return {
                animating: false
            };
        },
        methods: {
            /**
             * Play the animation
             */
            play: function () {
                this.animating = true;
            },
            /**
             * Stop the animation in a complete state
             */
            complete: function () {
                this.animating = false;
            }
        }
    });
</script>