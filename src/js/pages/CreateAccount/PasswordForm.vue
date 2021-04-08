<script lang="ts">
    import FormMixin from "../../mixins/FormMixin";
    import mixins from 'vue-typed-mixins'
    import {PasswordFormState} from "../../models/CreateAccount/PasswordFormState";
    import {PasswordFormValidator} from "../../models/CreateAccount/PasswordFormValidator";

    export default mixins(FormMixin).extend({
        data: function () {
            return {
                form_data: new PasswordFormState(),
                validator_class: PasswordFormValidator,
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
        }
    });
</script>