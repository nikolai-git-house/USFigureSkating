<script lang="ts">
    import FormMixin from "../../mixins/FormMixin";
    import mixins from 'vue-typed-mixins'
    import {FederationInfoFormState} from "../../models/CreateAccount/FederationInfoFormState";
    import {FederationInfoFormValidator} from "../../models/CreateAccount/FederationInfoFormValidator";

    export default mixins(FormMixin).extend({
        /**
         * The component relies on federation options existing in
         * FormOptionsState.  As of this writing, this is handled by parent components
         */
        created: function () {
            //
        },
        data: function () {
            return {
                form_data: new FederationInfoFormState(),
                validator_class: FederationInfoFormValidator,
                /**
                 * Potential user types for selection on form
                 */
                user_types: {
                    "coach": "Foreign Coach",
                    "skater": "Foreign Skater",
                }
            }
        },
        methods: {
            complete: function () {
                this.submit_attempt = true;
                if (!this.valid) {
                    return;
                }
                this.$emit('complete', this.form_data.export());
            }
        },
        computed: {
            /**
             * Form options available to form
             */
            form_options: function () {
                return {
                    federations: this.$store.getters['form_options/federations']
                }
            }
        }
    });
</script>