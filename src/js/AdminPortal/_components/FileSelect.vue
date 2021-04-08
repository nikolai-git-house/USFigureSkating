<template>
    <div class="file-select">
        <input v-show="false"
               v-if="!input_resetting"
               ref="file_input"
               type="file"
               v-on:change="fileSelected">
        <div class="file-select__element" v-on:click.prevent.stop="selectFile">
            <slot>
                Select File
            </slot>
        </div>
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
                /**
                 * Whether the input is being reset
                 */
                input_resetting: false
            };
        },
        methods: {
            /**
             * Handle file selection event
             */
            fileSelected: function (event: Event) {
                const input = event.target as HTMLInputElement;
                const files = input.files;
                let file;
                if (files && files.length) {
                    file = files[0];
                }
                if (file) {
                    this.$emit('selected', file);
                    this.resetInput();
                }
            },
            /**
             * Reset the file input.  Remove it, then add it back
             */
            resetInput: function () {
                this.input_resetting = true;
                this.$nextTick(() => {
                    this.input_resetting = false;
                });
            },
            /**
             * Trigger the file selection
             */
            selectFile: function () {
                // eslint-disable-next-line
                (this.$refs.file_input as HTMLElement).click();
            }
        }
    });
</script>