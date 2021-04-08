<script lang="ts">
    import Vue from "vue";
    import {BillingAddress} from "../../models/BillingAddress";
    import BillingAddressForm from "./../../components/Forms/BillingAddressForm.vue";
    import {
        BillingAddressToBillingAddressStateImportDataAdapter,
        UserProfileToBillingAddressStateImportDataAdapter
    } from "../../adaptors/TrueAdapters/BillingAddressStateImportDataAdapters";
    import {BillingAddressFormData, BillingAddressStateImportData} from "../../models/BillingAddressFormState";
    import {BillingAddressCreatePayload, BillingAddressEditPayload} from "../../contracts/BillingAddressContracts";
    import {UserProfile} from "../../contracts/app/UserContracts";


    /**
     * Component that handles data coordination for checkout billing addresses.  Some functionality remains the same
     * as previous release BillingAddressForm component, but this extension allows data coordination while allowing a
     * sub-component to handle the form-specific functionality
     */
    export default Vue.extend({
        props: {
            /**
             * Source address to edit.  If undefined, start with new address
             */
            source_address: {
                type: BillingAddress,
                required: false
            }
        },
        created: function () {
            if (this.source_address) {
                this.existing_data = new BillingAddressToBillingAddressStateImportDataAdapter(this.source_address, this.form_options);
                return;
            }
            //If saved addresses don't exist, use the user's profile as the foundational data
            if (this.saved_addresses_exist === false) {
                let active_profile: UserProfile = this.$store.getters['user/profile'];
                this.existing_data = new UserProfileToBillingAddressStateImportDataAdapter(active_profile, this.form_options)
            }
        },
        data: function () {
            /**
             * Build state based on whether we're editing or creating an address
             */
            return {
                /**
                 * Source data for the form
                 */
                existing_data: <BillingAddressStateImportData | null>null,
                submit_error: <string | null>null,
                submitting: false
            }
        },
        computed: {
            /**
             * Whether to show the "is default" input on the form
             */
            show_default_input: function () {
                return this.saved_addresses_exist && (!this.source_address || !this.source_address.is_default);
            },
            /**
             * Whether saved addresses exist
             */
            saved_addresses_exist: function () {
                return this.$store.getters['skater/saved_address_count'] > 0;
            },
            /**
             * Whether the form is in edit mode (as opposed to add mode)
             */
            is_edit: function () {
                return this.source_address && this.source_address.id;
            },
            /**
             * Text to display in cancel button
             */
            cancel_button_text: function () {
                return this.saved_addresses_exist ? "Cancel" : "Clear";
            },
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
        },
        methods: {
            /**
             * Handle the completion event of the form.  Fire downstream data processing methods
             */
            complete: function (data: BillingAddressFormData): void {
                this.submitting = true;
                this.submit_error = null;


                if (this.is_edit) {
                    this.$store.dispatch('skater/editAddress',
                        <BillingAddressEditPayload>{
                            data: data,
                            source: this.source_address,
                        }
                    ).then((result: BillingAddress) => {
                        this.$emit('address_completed', {address: result});
                        this.submitting = false;
                    }).catch(() => {
                        this.submit_error = "Error saving address.";
                        this.submitting = false;
                    });
                    return;
                }

                this.$store.dispatch('skater/createAddress',
                    <BillingAddressCreatePayload>{
                        data: data
                    }
                ).then((result: BillingAddress) => {
                    this.$emit('address_completed', {address: result});
                }).catch(() => {
                    this.submit_error = "Error saving address.";
                    this.submitting = false;
                });
            },
            /**
             * Cancel the form
             */
            cancel: function () {
                this.submit_error = null;
                if (this.saved_addresses_exist) {
                    this.$emit('cancel_edit');
                }
            }
        },
        components: {
            /**
             * Register sub component for form management
             */
            'billing-address-form': BillingAddressForm
        }
    });
</script>