<script lang="ts">
    import BillingAddressFormManager from "./BillingAddressFormManager.vue"
    import SavedAddresses from "./SavedAddresses.vue"
    import {BillingAddress} from "../../models/BillingAddress";
    import HasDataDependencies from "../../mixins/HasDataDependencies";
    import mixins from "vue-typed-mixins";

    export interface AddressPayload {
        address: BillingAddress;
    }

    /**
     * The whole purpose of this component is to result in a BillingAddress to use for the checkout process.
     */
    export default mixins(HasDataDependencies).extend({
        data: function () {
            return {
                /**
                 * Whether the address step is complete
                 */
                step_complete: false,
                /**
                 * The address selected as a result of the component workflow
                 */
                selected_address: <BillingAddress | undefined>undefined,
                /**
                 * Whether the address edit form is active
                 */
                form_active: false,
                /**
                 * The address used as a source for the edit form
                 */
                edit_address: <BillingAddress | undefined>undefined,
                dependencies: {
                    address_data: false,
                    form_options: false
                },
                error_notice: "",
            }
        },
        methods: {
            loadData: function () {
                return new Promise((resolve, reject) => {
                    let promises: Promise<void>[] = [
                        /**
                         * Fetch base address info
                         */
                        this.$store.dispatch('skater/fetchBillingAddresses').then(() => {
                            if (this.saved_addresses_exist) {
                                this.dependencies.address_data = true;
                                return;
                            }
                            this.$store.dispatch('user/fetchUserProfile').then(() => {
                                this.form_active = true;
                                this.dependencies.address_data = true;
                            }).catch(() => {
                                this.error_notice = 'Error loading skater info.';
                                reject();
                            });
                        }).catch(() => {
                            this.error_notice = "Error loading saved addresses.";
                            reject();
                        }),
                        /**
                         * Fetch form options
                         */
                        this.$store.dispatch('form_options/fetchBillingAddressOptions').then(() => {
                            this.dependencies.form_options = true;
                        }).catch(() => {
                            this.error_notice = "Error loading form.";
                            reject();
                        })
                    ];
                    Promise.all(promises).then(() => {
                        resolve();
                    })
                });
            },
            /**
             * Complete the address step. Called internally by component
             *
             * Log the selected address within this component, and report it to parent components
             *
             */
            complete: function (address: BillingAddress) {
                this.selected_address = address;
                this.step_complete = true;
                this.$emit('step_complete', address);
            },
            /**
             * Reload this step after it's been completed
             */
            reloadStep: function () {
                this.step_complete = false;
                this.$emit('reload');
            },
            /**
             * Handle event when a saved address is selected
             */
            selectAddress: function (payload: AddressPayload) {
                this.complete(payload.address);
            },
            /**
             * Edit the address used to complete the step
             */
            editAddress: function () {
                this.reloadStep();
                this.edit_address = this.selected_address;
                this.form_active = true;
            },
            /**
             * Edit an address from the saved address list
             */
            editSavedAddress: function (payload: AddressPayload) {
                this.edit_address = payload.address;
                this.form_active = true;
                this.step_complete = false;
            },
            /**
             * Handle event of user electing to add a new address
             */
            addAddress: function () {
                this.form_active = true;
            },
            /**
             * Handle event when billing address form is completed
             * possible reasons:
             * Editing saved address
             * Creating new Address
             */
            completeAddress: function (payload: AddressPayload) {
                this.form_active = false;
                this.complete(payload.address);
                this.edit_address = undefined;
            },
            cancelEdit: function () {
                this.form_active = false;
                this.edit_address = undefined;
            }

        },
        computed: {
            /**
             * Whether the saved addresses section of the component should show
             */
            show_saved_addresses: function () {
                return this.step_complete === false && this.form_active === false;
            },
            saved_addresses_exist: function () {
                return this.$store.getters['skater/saved_address_count'] > 0;
            },
        },
        components: {
            /**
             * Component to handle the editor form
             */
            BillingAddressFormManager,
            /**
             * Component to handle saved addresses
             */
            SavedAddresses
        }
    });
</script>