<template slot-scope="props">
	<div class="accordion" :class="{expanded:is_expanded}">
		<button class="accordion__trigger" @click="triggerAction" type="button">
			<slot name="trigger_text"></slot>
		</button>
		<!-- @note:
			currently, aria expanded doesn't do anything because the markup is removed from the DOM when closed because
			v-if is used instead of v-show.  Aria expanded attribute left in case this changes and v-show is used.
		-->
		<div v-if="is_expanded" class="accordion__content" :aria-expanded="is_expanded ?'true':'false'">
			<slot name="expand_content"></slot>
		</div>
	</div>
</template>
<script lang="ts">
    import Vue from 'vue';
    import {AccordionComponentInterface as RootAccordionComponentInterface} from '../contracts/AppContracts';

    export interface AccordionComponentInterface extends RootAccordionComponentInterface {}
    const Accordion = Vue.extend({
        props: {
            init_expanded: {
                type: Boolean,
                default: false
            },
            trigger_link: {
                type: String,
                default: ""
            },
            external_expand_check: {
                type: Boolean,
                default: undefined
            },
            /**
             * Whether to emit the toggle event rather than handle it locally
             */
            emit_toggle: {
                type: Boolean,
                default: false
            }
        },
        data: function () {
            return {
                expanded: false,
            }
        },
        computed: {
            is_expanded: function (): boolean {
                if (typeof this.external_expand_check !== 'undefined') {
                    return this.external_expand_check;
                }
                return this.expanded;
            }
        },
        methods: {
            /**
             * Handle trigger activation
             */
            triggerAction: function (): void {
                if (this.emit_toggle) {
                    this.$emit('toggle');
                    return;
                }
                if (this.trigger_link) {
                    this.redirect();
                    return;
                }
                this.toggleExpand();
            },
            redirect: function (): void {
                location.assign(this.trigger_link);
            },
            open: function (): void {
                this.expanded = true;
            },
            close: function (): void {
                this.expanded = false;
            },
            toggleExpand: function (): void {
                this.expanded = !this.expanded;
                this.$emit('accordion_toggle');
            }
        },
        created: function () {
            if (this.init_expanded) {
                this.expanded = true;
            }
        }
    });
    export default Accordion;
</script>