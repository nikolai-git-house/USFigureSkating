<template>
    <div class="animated-check-icon animated-icon">
        <svg viewBox="0 0 80 79"
             width="80"
             height="79"
             version="1.1"
             class="animated-icon__svg"
             xmlns="http://www.w3.org/2000/svg">
            <defs>
                <clipPath id="clip">
                    <path d="M31.1111488 52.6603235L18.5946724 40.0415294l4.8864705-4.8467823 7.6300059 7.6926353 22.9797177-23.1680648L58.9773371 24.5661z"></path>
                </clipPath>
            </defs>
            <g id="content"
               transform="translate(1 1.165635)"
               fill="none"
               stroke="#3AB44A">
                <path d="M38.7860284.16653C17.4218284.16653.102846 17.2590829.102846 38.34363c0 21.0847765 17.3189824 38.1771 38.6831824 38.1771s38.6831823-17.0923235 38.6831823-38.1771c0-21.0845471-17.3189823-38.1771-38.6831823-38.1771z"
                      class="animated-check-icon__circle"
                      stroke-width="1.7792"
                      stroke-linecap="round"
                      stroke-dasharray="244"
                      stroke-linejoin="round">
                    <animate v-if="animating"
                             attributeName="stroke-dashoffset"
                             from="244"
                             to="0"
                             dur="1.25s"
                             calcMode="spline"
                             keySplines="0.455, 0.03, 0.515, 0.955"
                             keyTimes="0;1"
                             repeatCount="indefinite"
                             fill="freeze"></animate>
                </path>
            </g>
        </svg>
    </div>
</template>
<script lang="ts">
    import Vue from 'vue';

    export default Vue.extend({
        /**
         * Reactive data
         */
        data: function () {
            return {
                animating: true
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
             * Stop the animation
             */
            stop: function () {
                this.animating = true;
            }
        }
    });
</script>