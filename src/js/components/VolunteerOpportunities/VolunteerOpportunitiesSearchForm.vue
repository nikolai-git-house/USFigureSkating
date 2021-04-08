<script lang="ts">
    import {FormOption, StateFormOption} from '../../contracts/AppContracts';
    import FormMixin from '../../mixins/FormMixin';
    import VolunteerRequestSearchFormState from '../../models/Forms/VolunteerRequestSearchFormState';
    import VolunteerRequestSearchFormValidator from '../../models/Forms/VolunteerRequestSearchFormValidator';
    import mixins from 'vue-typed-mixins';

    const extendedVue = mixins(FormMixin);
    export default extendedVue.extend({
        /**
         * Reactive data
         */
        data: function () {
            return {

                /**
                 * State form data class
                 */
                form_data: new VolunteerRequestSearchFormState(),
                /**
                 * Error resulting from the search
                 */
                search_error: <string | null>null,
                /**
                 * Whether the form is running the search
                 */
                searching: <boolean>false,
                /**
                 * The validator to use against the form data
                 */
                validator_class: VolunteerRequestSearchFormValidator
            };
        },
        methods: {
            /**
             * Clear/Reset the form
             */
            clear: function () {
                this.submit_attempt = false;
                this.form_data.reset();
                this.search_error = null;
            },
            /**
             * Complete and emit the form
             */
            complete: function () {
                this.submit_attempt = true;
                if (this.searching || !this.valid) {
                    return;
                }
                this.searching = true;
                this.$store.dispatch('volunteer_opportunities/runSearch', this.form_data.export())
                    .then(() => {
                        this.$emit('complete');
                    })
                    .catch((search_error: string) => {
                        this.submit_attempt = false;
                        this.searching = false;
                        this.search_error = search_error;
                    });
            }
        },
        computed: {
            /**
             * Form options for club_ form input
             */
            club_form_options: function (): FormOption[] {
                return this.$store.getters['volunteer_opportunities/club_options'];
            },
            /**
             * Form options for state form input
             */
            state_form_options: function (): StateFormOption[] {
                return this.$store.getters['volunteer_opportunities/state_options'];
            }
        },
        /**
         * When created, load active search criteria into component
         */
        created: function () {
            const active_search_criteria = this.$store.state.volunteer_opportunities.active_search_criteria;
            if (active_search_criteria) {
                this.form_data.import(active_search_criteria);
            }
        },
        watch: {
            form_data: {
                /**
                 * Handle change on form data
                 */
                handler: function () {
                    this.search_error = null;
                },
                deep: true
            }
        }
    });
</script>