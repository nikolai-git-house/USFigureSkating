import mixins from 'vue-typed-mixins'
import FormMixin from "./FormMixin";
import {AddressFormState} from "../models/CreateAccount/AddressFormState";
import {AddressFormValidator} from "../models/CreateAccount/AddressFormValidator";

export default mixins(FormMixin).extend({
    /**
     * The component relies on country, state, and province options existing in
     * FormOptionsState.  As of this writing, this is handled by parent components
     */
    created: function () {
        //
    },
    data: function () {
        return {
            form_data: new AddressFormState(),
            validator_class: AddressFormValidator
        }
    },
    methods: {
        complete: function () {
            this.submit_attempt = true;
            if (!this.valid) {
                return;
            }
            this.$emit('complete', this.form_data.export());
        },
    },
    computed: {
        /**
         * Whether the user has selected USA as the country
         */
        is_usa: function (): boolean {
            return this.form_data.is_usa;
        },
        /**
         * Whether the user has selected Canada as the country
         */
        is_canada: function (): boolean {
            return this.form_data.is_canada;
        },
        /**
         * Whether zip code input is required.
         */
        zip_required: function (): boolean {
            return this.is_usa || this.is_canada;
        },
        /**
         * Options for form inputs
         */
        form_options: function () {
            return {
                states: this.$store.getters['form_options/states'],
                countries: this.$store.getters['form_options/countries'],
                provinces: this.$store.getters['form_options/provinces'],
            }
        }
    }
});