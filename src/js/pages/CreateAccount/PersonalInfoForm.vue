<script lang="ts">
    import {PersonalInformationFormValidator} from "../../models/CreateAccount/PersonalInformationFormValidator";
    import {PersonalInformationFormState} from "../../models/CreateAccount/PersonalInformationFormState";
    import FormMixin from "../../mixins/FormMixin";
    import mixins from 'vue-typed-mixins'
    import Captcha from "../../components/Captcha.vue";

    export default mixins(FormMixin).extend({
        props: {
            duplicate_account_attempt: {
                type: Boolean,
                default: false
            }
        },
        data: function () {
            return {
                form_data: new PersonalInformationFormState(),
                validator_class: PersonalInformationFormValidator,
            }
        },
        methods: {
            cancel: function () {
                this.$emit('cancel');
            },
            complete: function () {
                this.submit_attempt = true;
                if (!this.valid) {
                    return;
                }
                this.$emit('complete', this.form_data.export());
            }
        },
        /**
         * Register subcomponents
         */
        components: {
            Captcha
        }
    });
</script>