<script lang="ts">
    import Vue from "vue";
    import {
        CompetitionSearchCriteria,
        CompetitionSearchFieldOption
    } from "../../contracts/app/CompetitionRegistrationContracts";
    import {FormOption} from "../../contracts/AppContracts";

    export interface CompetitionSearchInterface extends Vue {
        reset: () => void;
    }

    export default Vue.extend({
        props: {
            state_options: {
                type: Array as () => FormOption[],
                required: true
            }
        },
        data: function () {
            return {
                /**
                 * The form option selected for the field to search against
                 */
                search_field: <CompetitionSearchFieldOption | null>null,
                /**
                 * The options available for the search field
                 */
                field_options: <CompetitionSearchFieldOption[]>[
                    <CompetitionSearchFieldOption>{
                        label: "Competition Name",
                        value: "name"
                    },
                    <CompetitionSearchFieldOption>{
                        label: "City",
                        value: "city"
                    },
                    <CompetitionSearchFieldOption> {
                        label: "Club Name",
                        value: "club"
                    },
                    <CompetitionSearchFieldOption>{
                        label: "Date",
                        value: "date"
                    },
                    <CompetitionSearchFieldOption>{
                        label: "State",
                        value: "state"
                    },

                ],
                /**
                 * The currently entered search term
                 */
                search_term: null
            }
        },
        methods: {
            /**
             * Clear the search
             */
            reset: function () {
                this.search_field = null;
            },
            /**
             * Emit event indicating search value change
             */
            emit: function () {
                this.$emit('input', <CompetitionSearchCriteria>{
                    search_term: this.search_term,
                    search_field: this.search_field ? this.search_field.value : null,
                })
            }
        },
        /**
         * Emit event on component update
         */
        updated: function () {
            this.emit();
        },
        watch: {
            /**
             * Clear the search term when the field changes
             */
            search_field: function () {
                this.search_term = null;
            }
        },
        computed: {
            /**
             * The placeholder for the search input
             */
            input_placeholder: function (): string {
                if (this.search_field) {
                    return "Enter " + this.search_field.label;
                }
                return "";
            }
        }
    });
</script>