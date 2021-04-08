<script lang="ts">
    /* eslint-disable */
    import Vue from "vue";
    import {EventCreditConfig, IndexedEventCreditList, SessionType} from "../contracts/AppContracts";
    import {CreditRule, SkatingEvent} from "../models/SkatingEvent";
    import {StagingCartCredits} from "../models/Cart/StagingCartCredits";
    import {CreditPackage} from "../models/Credits/CreditPackage";
    import {CartAdaptor} from "../models/Cart/CartAdaptor";
    import {CreditsAdaptor} from "../adaptors/CreditsAdaptor";

    interface IncrementInput extends Vue {
        value: number
    }

    export default Vue.extend({
        props: {
            package_purchase_available: {
                type: Boolean,
                required: true,
            },
            credit_purchase_available: {
                type: Boolean,
                required: true,
            }
        },
        data: function () {
            return {
                cart_credits: new StagingCartCredits(),
                processing: false,
                input_lock: false,
                individual_credit_counts: []
            }
        },

        methods: {
            showCreditLimitMessage: function (event_id: number, credit_type: CreditRule, field_index: number): boolean {
                if (credit_type.limit < 1) {
                    return true;
                }
                return false;
                /**
                 * @note: if we want to refine messaging, we can display the message as soon as the input is 0 and the local limits have been met by
                 * uncommenting the following code.

                 if(this.individual_credit_counts[field_index] && this.individual_credit_counts[field_index]>0){
						return false;
					}
                 return this.individualCreditLimit(event_id,credit_type.key)<1;

                 */

            },
            individualCreditLimit(event_id: number, key: SessionType): number {
                if (this.local_limits.hasOwnProperty(String(event_id)) && this.local_limits[event_id].hasOwnProperty(String(key))) {
                    let local_limit = this.local_limits[event_id][key];
                    return local_limit >= 0 ? local_limit : 0;
                }
                return 0;
            },
            package_acquired_message: function (credit_package: CreditPackage): string | false {
                if (this.$store.getters['cart/contains_package'](credit_package)) {
                    return "Package in cart";
                }
                if (this.$store.getters['skater/package_purchased'](credit_package)) {
                    return "Package already purchased";
                }
                return false;
            },
            handlePackageChange: function (event: SkatingEvent, credit_package: CreditPackage, amount: number) {
                if (amount === 0) {
                    this.cart_credits.removePackage(credit_package);
                    return;
                }
                this.cart_credits.addPackage(CartAdaptor.adaptCreditPackage({
                    competition: this.$store.getters['competitions/active_competition'],
                    credit_package: credit_package,
                    event: event
                }));
                this.addCreditsToCart();
            },
            handleCreditChange: function (event: SkatingEvent, credit_type: CreditRule, amount: number) {
                let parameters = {
                    event_id: event.id,
                    credit_config: credit_type,
                    amount: amount,
                    event_name: event.name,
                    competition_id: this.active_competition_id,
                    competition_name: this.active_competition_name,
                };
                this.cart_credits.add(parameters);
            },

            addCreditsToCart: function () {
                if (this.processing) {
                    return;
                }
                let vm = this;

                // disable inputs if request takes more than 200ms
                let disable_inputs = setTimeout(function () {
                    vm.input_lock = true;
                }, 200);

                this.processing = true;

                const state_action: string = this.$store.state.competition_portal.is_team_view ? 'cart/addTeamCredits' : 'cart/addCredits';

                this.$store.dispatch(state_action, {
                    credits: this.cart_credits.export(),
                    packages: this.cart_credits.exportPackages()
                }).then(function () {
                    vm.cart_credits.clear();
                    vm.processing = false;
                    let increment_inputs: IncrementInput[] = vm.$refs.increment as IncrementInput[];
                    if (increment_inputs) {
                        for (let i = 0; i < increment_inputs.length; i++) {
                            let increment = increment_inputs[i];
                            increment.value = 0;
                        }
                    }

                    // make sure clear the timeout so inputs don't get disabled after this point
                    clearTimeout(disable_inputs);

                    vm.input_lock = false;
                }).catch(function () {
                    alert("Error adding credits to cart");
                });
            }
        },
        computed: {
            packages_available: function () {
                return this.package_purchase_available && this.credit_package_events.length > 0;
            },
            credit_package_events: function () {
                return this.$store.getters['available_credit_packages'];
            },
            /**
             * The local limits on credit types.
             * Takes the globally allowed credits, then reduces it by package credits that are in the staging cart
             */
            local_limits: function (): IndexedEventCreditList {
                let global_indexed_event_credit_list = CreditsAdaptor.adaptEventCreditConfigArrayIndexedEventCreditList(this.purchasable_credits);
                let package_report = this.cart_credits.packageReport();
                if (package_report) {
                    return CreditsAdaptor.reduceIndexedEventCreditList(global_indexed_event_credit_list, package_report);
                }
                return global_indexed_event_credit_list;
            },
            purchasable_credits: function (): EventCreditConfig[] {
                return this.$store.getters['purchasable_credits'];
            },
            total_credit_cost: function () {
                return this.cart_credits.total_cost;
            },
            disable_button: function () {
                return this.processing || this.cart_credits.total_cost === 0;
            },
            active_competition_id: function () {
                return this.$store.state.competitions.active_competition_id;
            },
            active_competition_name: function () {
                let competition = this.$store.getters['competitions/active_competition'];
                return competition.name;
            }
        }
    })
</script>
