<script lang="ts">
    import AddressFormMixin from "../../mixins/AddressFormMixin";
    import mixins from 'vue-typed-mixins'
    import {BillingAddressFormState, BillingAddressStateImportData} from "../../models/BillingAddressFormState";
    import {BillingAddressFormValidator} from "../../models/BillingAddressFormValidator";

    export default mixins(AddressFormMixin).extend({
        props: {
            /**
             * Whether to show the "is default" input
             */
            show_default_input: {
                type: Boolean,
                default: true
            },
            /**
             * What the cancel button should say
             */
            cancel_button_text: {
                type: String,
                default: "Clear"
            },
            /**
             * Existing data to load into the form
             */
            existing_data: {
                type: Object as () => BillingAddressStateImportData,
                required: false
            }
        },
        data: function () {
            return {
                form_data: new BillingAddressFormState(),
                validator_class: BillingAddressFormValidator
            }
        },
        methods: {
            /**
             * Clear the form
             */
            reset: function () {
                this.form_data = new BillingAddressFormState();
            },
            /**
             * Complete the form
             */
            complete: function () {
                this.submit_attempt = true;
                if (!this.valid) {
                    return;
                }
                this.$emit('complete', this.form_data.export());
            },
            /**
             * Cancel the form
             */
            cancel: function () {
                this.$emit('cancel');
                //reset state after tick to prevent content jump if component is destroyed
                this.$nextTick(() => {
                    this.reset();
                });
            }
        },
        /**
         * Import existing data into form if it's present
         */
        created: function () {
            if (this.existing_data) {
                this.form_data.import(this.existing_data);
            }
        },
        computed: {
            /**
             * Options for form inputs
             */
            form_options: function () {
                return {
                    states: this.$store.getters['form_options/states'],
                    countries: this.$store.getters['form_options/billing_countries'],
                    provinces: this.$store.getters['form_options/provinces'],
                }
            }
        }
    });
</script>