<template>
	<input v-on:input="valueChanged($event.target.value)" :value="formatted" maxlength="10" type="text" class="form-field">
</template>
<script lang="ts">
    import Vue from "vue";

    export default Vue.extend({
        props: {
            initial: {
                required: false
            }
        },
        /**
         * Upon creation, assign default value if present
         */
        created: function () {
            this.value = this.initial ? String(this.initial) : "";
        },
        data: function () {
            return {
                value: "",
            }
        },
        methods: {
            valueChanged: function (value: string) {
                this.value = value;
            },
            export: function () {
                this.$emit('input', this.formatted);
            }

        },
        updated: function () {
            this.export();
        },
        computed: {
            formatted: function () {
                return this.value;
            }
        },
        watch: {
            /**
             * Watch initial value.  If it changes, update local value
             */
            initial: function () {
                this.value = this.initial ? String(this.initial) : '';
            }
        }
    });
</script>