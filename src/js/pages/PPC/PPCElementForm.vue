<script lang="ts">
    import Vue from "vue";
    import {PPCElementFormData} from "../../models/PPC/PPCElementFormData";
    import {PPCElement} from "../../models/PPC/PPCElement";

    export default Vue.extend({
        props: {
            ppc_element: {
                required: true,
                type: PPCElement
            }
        },
        data: function () {
            return {
                formData: new PPCElementFormData(this.ppc_element)
            }
        },
        computed: {
            /**
             * Whether the form options have loaded
             */
            options_loaded: function () {
                return this.$store.state.ppc.form_options_loaded;
            },
            /**
             * Whether there was an error loading the form options
             */
            option_load_error: function () {
                return this.$store.state.ppc.form_option_load_error;
            },
            /**
             * The available options for the "Type" input
             */
            type_options: function () {
                return this.$store.getters['ppc/type_options'];
            },
            /**
             * The available options for the "Element" input
             */
            type_element_options: function () {
                return this.$store.getters['ppc/type_element_options'](this.formData);
            },
            /**
             * The available options for the "Move" input(s)
             */
            move_options: function () {
                return this.$store.getters['ppc/move_options'](this.formData);
            },
            /**
             * Whether the form is in a state where the element input can display
             */
            show_element: function () {
                return !!this.formData.type;
            },
            /**
             * Whether the save button should display as disabled
             */
            save_disabled: function () {
                return !this.formData.is_complete;
            },
            /**
             * Button text for commit button. Depends on whether element is being added or edited
             */
            save_button_text: function () {
                return this.ppc_element.is_new ? "Add" : "Update";
            },
            /**
             * Whether to show the transition input
             */
            show_transition: function (): boolean {
                return !!this.formData.element && this.formData.element.is_transition;
            },
            /**
             * Button text for the cancel/clear button.  Depends on whether element is being added or edited
             */
            cancel_button_text: function () {
                return this.ppc_element.is_new ? "Cancel" : "Clear";
            },
            /**
             * Button action for the cancel/clear button.  Depends on whether element is being added or edited
             */
            cancel_button_action: function () {
                return this.ppc_element.is_new ? this.cancelAdd : this.clearForm;
            }
        },
        methods: {
            /**
             * Respond to user saving edits to the form
             */
            saveElement: function () {
                this.$emit('element-edited', this.formData.export());
            },
            /**
             * Respond to user clicking the clear button
             */
            clearForm: function () {
                this.formData.reset();
            },
            /**
             * Cancel the add element form without adding element
             */
            cancelAdd: function () {
                this.$emit('element-canceled');
            },
            /**
             * Return the unique key for a move based on its index
             */
            moveKey: function (index: number): string {
                return "move_" + index;
            },
            /**
             * Label for move form input based on index
             */
            moveName: function (index: number): string {
                return "Move " + (index + 1);
            }
        }
    });
</script>