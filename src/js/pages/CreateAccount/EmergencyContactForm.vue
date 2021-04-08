<script lang="ts">
    import FormMixin from "../../mixins/FormMixin";
    import mixins from 'vue-typed-mixins'
    import {EmergencyContactFormState} from "../../models/Forms/EmergencyContactFormState";
    import {EmergencyContactFormValidator} from "../../models/CreateAccount/EmergencyContactFormValidator";

    export default mixins(FormMixin).extend({
        data: function () {
            return {
                form_data: new EmergencyContactFormState(),
                validator_class: EmergencyContactFormValidator,
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
        }
    });
</script>