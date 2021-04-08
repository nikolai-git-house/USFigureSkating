<template>
	<div class="autosuggest">
		<input v-on:keydown.tab="handleTab"
			   v-on:focus="handleFocus"
			   v-on:blur="handleBlur"
			   v-on:input="handleInput"
			   v-on:keydown.enter="handleEnter"
			   v-on:keydown.up.prevent="handleUp"
			   v-on:keydown.down.prevent="handleDown"
			   v-bind="input_attrs"
			   v-model="active_input_text">
		<div class="autosuggest__suggestions" v-if="show_suggestions">
			<div class="autosuggest__suggestions__content">
				<ul class="autosuggest__list">
					<li class="autosuggest__list__item"
						v-for="(value,index) in suggestions"
						:class="{'active':isActive(index)}"
						v-on:mousedown="mouseDown"
						v-on:touchstart="mouseDown"
						v-on:click="select(value)">
						{{value.label}}
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>
<script lang="ts">
    import Vue from "vue";
    import {FormOption} from "../contracts/AppContracts";

    export default Vue.extend({
        props: {
            options: {
                type: Array as () => FormOption[],
            },
            input_attrs: {
                type: Object,
                default: () => {
                    return {};
                }
            },
            restricted: {
                type: Boolean,
                default: false
            },
            initial_value: {
                type: Object as () => FormOption,
                required: false
            }
        },
        data: function () {
            return {
                /**
                 * User-entered text input
                 */
                active_input_text: "",
                /**
                 * Index of the active suggestion
                 */
                active_suggestion_index: -1,
                /**
                 * The active tracked value for the component
                 */
                active_value: {
                    label: "",
                    value: null
                },
                /**
                 * Whether to hide the suggestions list
                 */
                hide_suggestions: false,
                /**
                 * Whether the input is currently focused
                 */
                input_focused: false,
                /**
                 * Whether an option from suggestions list has been clicked as the most recent action
                 */
                option_clicked: false,
                /**
                 * Whether the component has been loaded and should start emitting changes
                 */
                loaded: false,
                suggestions: <FormOption[]>[],
                suggestions_debounce: <number | false>false
            }
        },
        /**
         * Load initial value if present
         */
        created: function () {
            if (this.initial_value) {
                this.active_value = {...this.initial_value};
                this.active_input_text = this.initial_value.label;
            }
            this.loaded = true;
        },
        methods: {
            /**
             * Handle mousedown on suggestion
             */
            mouseDown: function () {
                this.option_clicked = true;
            },
            /**
             * Handle focus on input
             */
            handleFocus: function () {
                this.input_focused = true;
            },
            /**
             * Handle blur on input
             */
            handleBlur: function () {
                this.input_focused = false;
            },
            /**
             * Handle direct content change on input element
             */
            handleInput: function (event: Event) {
                this.suggestions = [];
                this.option_clicked = false;
                this.active_value.value = null;
                this.active_value.label = (event.target as HTMLInputElement).value;
                if (this.suggestions_debounce) {
                    clearTimeout(this.suggestions_debounce);
                }
                this.suggestions_debounce = window.setTimeout(() => {
                    this.suggestions = this.getSuggestions();
                    this.suggestions_debounce = false;
                }, 200);
            },
            /**
             * Whether a suggest item is the active suggest item
             */
            isActive: function (index: number) {
                return index === this.active_suggestion_index;
            },
            /**
             * Handle the user tabbing out of input
             */
            handleTab: function () {
                if (this.hide_suggestions) {
                    return;
                }
                if (this.active_suggestion) {
                    this.select(this.active_suggestion);
                }
                if (this.suggestions.length === 1) {
                    this.select(this.suggestions[0]);
                }
            },
            /**
             * Handle down key event
             */
            handleDown: function () {
                if (this.hide_suggestions) {
                    return;
                }
                if (this.active_suggestion_index === this.suggestions.length - 1) {
                    return;
                }
                this.active_suggestion_index++;
            },
            /**
             * Handle up key event
             */
            handleUp: function () {
                if (this.hide_suggestions) {
                    return;
                }
                if (this.active_suggestion_index === -1) {
                    return;
                }

                this.active_suggestion_index--;
            },
            /**
             * Handle enter key event
             */
            handleEnter: function () {
                if (this.active_suggestion) {
                    this.select(this.active_suggestion);
                }
            },
            /**
             * Select a form option
             */
            select: function (option: FormOption) {
                this.active_value = {...option};
                this.active_input_text = option.label;

                Vue.nextTick(() => {
                    this.hide_suggestions = true;
                });
            },
            /**
             * Handle component blur.
             * 1. Hide suggestions list
             * 2. If restricted version, and a valid value not picked, reset the display text
             */
            componentBlur: function () {
                this.hide_suggestions = true;
                if (this.restricted && !this.active_value.value) {
                    this.active_input_text = "";
                }
            },
            /**
             * The suggestions based on current input
             */
            getSuggestions: function (): FormOption[] {
                if (!this.options) {
                    return [];
                }
                return this.options.filter((option: FormOption) => {
                    if (!this.active_input_text) {
                        return false;
                    }
                    return option.label.toLowerCase().indexOf(this.active_input_text.toLowerCase()) !== -1;
                })
            }
        },
        computed: {
            /**
             * The active suggest item, if present
             */
            active_suggestion: function (): FormOption | false {
                if (this.active_suggestion_index > -1 && this.active_suggestion_index < this.suggestions.length) {
                    return this.suggestions[this.active_suggestion_index];
                }
                return false;
            },

            /**
             * Whether to show suggestions
             */
            show_suggestions: function () {
                if (!this.suggestions.length) {
                    return false;
                }
                return !this.hide_suggestions;
            }
        },
        watch: {
            /**
             *  When the user changes the input, start showing results again and reset the active index
             */
            active_input_text: function () {
                this.hide_suggestions = false;
                this.active_suggestion_index = -1;
            },
            /**
             * When active value changes, emit the change
             */
            active_value: {
                handler: function (value) {
                    if (!this.loaded) {
                        return;
                    }
                    if (this.restricted && value.value === null) {
                        this.$emit('input', {
                            label: null,
                            value: null
                        });
                        return;
                    }
                    this.$emit('input', value)
                },
                deep: true
            },
            /**
             * When input focus changes...
             */
            input_focused: function (value) {
                if (value === false) {
                    Vue.nextTick(() => {
                        // if blur results from an option click, do nothing
                        if (this.option_clicked) {
                            return;
                        }
                        //trigger component blur event
                        this.componentBlur();
                    });
                }
            }
        }
    });
</script>