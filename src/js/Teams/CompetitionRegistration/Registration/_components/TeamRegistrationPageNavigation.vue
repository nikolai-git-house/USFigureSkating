<template>
    <div class="team-registration__navigation">
        <div v-if="$slots.pre"
             class="team-registration__navigation__pre">
            <slot name="pre"></slot>
        </div>
        <div class="team-registration__navigation__buttons">
            <div v-if="!hide_retreat"
                 class="team-registration__navigation__button">
                <button class="button button--info button--block"
                        v-on:click.prevent="retreat">
                    Back
                </button>
            </div>
            <div class="team-registration__navigation__button">
                <button class="button button--block"
                        :disabled="advance_disabled"
                        v-on:click.prevent="advance">
                    Continue
                </button>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
    import Vue from 'vue';

    export default Vue.extend({
        props: {
            advance: {
                type: Function as () => void,
                required: true
            },
            advance_disabled: {
                type: Boolean,
                default: false
            },
            hide_retreat: {
                type: Boolean,
                default: false
            },
            retreat: {
                type: Function as () => void,
                required: true
            }
        }
    });
</script>