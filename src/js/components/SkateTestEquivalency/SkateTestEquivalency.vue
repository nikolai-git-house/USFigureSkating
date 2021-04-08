<script lang="ts">
    import Vue from "vue";
    import DisciplineForm from "./DisciplineForm.vue";
    import {
        SkateTestDisciplineKey,
        SkateTestEquivalencyDiscipline,
        SkateTestFormData,
        SkateTestFormOption
    } from "../../contracts/app/SkateTestContracts";
    import {SkateTestEquivalencyState} from "../../store/Modules/SkateTestEquivalencyState";

    export default Vue.extend({
        props: {
            external_error: {
                type: String,
                required: false
            },
            submitting: {
                type: Boolean,
                required: false
            }
        },
        /**
         * Upon creation, register the state module
         *
         * The component relies on testable disciplines and skate test options existing in
         * FormOptionsState.  As of this writing, this is handled by parent components
         */
        created: function () {
            this.$store.registerModule('skate_test_equivalency', SkateTestEquivalencyState);
        },
        data: function () {
            return {
                /**
                 * The currently active discipline
                 */
                active_discipline_key: <SkateTestDisciplineKey | null>null,
            }
        },
        methods: {
            /**
             * Add a discipline test
             */
            add: function (key: SkateTestDisciplineKey) {
                this.active_discipline_key = key;
            },
            /**
             * Edit a discipline test
             */
            edit: function (key: SkateTestDisciplineKey) {
                this.active_discipline_key = key;
            },
            /**
             * Remove a discipline test
             */
            remove: function (key: SkateTestDisciplineKey) {
                this.$store.commit('skate_test_equivalency/removeDisciplineData', key);
            },
            /**
             * Whether a particular discipline is disabled
             */
            disciplineDisabled: function (key: SkateTestDisciplineKey): boolean {
                if (!this.active_discipline_key) {
                    return false;
                }
                return this.active_discipline_key !== key;
            },
            /**
             * Whether a particular discipline is active
             */
            disciplineActive: function (key: SkateTestDisciplineKey): boolean {
                if (!this.active_discipline_key) {
                    return false;
                }
                return this.active_discipline_key === key;
            },
            /**
             * Complete the component and emit exported data
             */
            complete: function () {
                let data = this.$store.getters['skate_test_equivalency/export_data'];
                this.$emit('complete', data);
            },
            /**
             * Cancel an active discipline form
             */
            cancelDisciplineForm: function () {
                this.active_discipline_key = null;
            },
            /**
             * Complete an active discipline form
             */
            completeDisciplineForm: function (form_data: SkateTestFormData) {
                if (!this.active_discipline_key) {
                    return;
                }
                this.$store.commit('skate_test_equivalency/addDisciplineData', {
                    key: this.active_discipline_key,
                    form_data
                });
                this.active_discipline_key = null;
            },
            /**
             * Get the active data for a discipline
             */
            discipline_data: function (key: SkateTestDisciplineKey): SkateTestFormData | null {
                return this.$store.getters['skate_test_equivalency/discipline_data'](key);
            },
            /**
             * Get the test (if present) for a discipline
             */
            discipline_test: function (key: SkateTestDisciplineKey): SkateTestFormOption | null {
                return this.$store.getters['skate_test_equivalency/discipline_test'](key);
            },
            /**
             * Whether to show test information for a particular discipline
             */
            showExistingTest: function (discipline_key: SkateTestDisciplineKey) {
                return !this.disciplineActive(discipline_key) && this.discipline_test(discipline_key);
            }
        },
        computed: {
            /**
             * List of disciplines to show
             */
            disciplines: function (): SkateTestEquivalencyDiscipline[] {
                return this.$store.getters['skate_test_equivalency/testable_disciplines'];
            },
            /**
             * Whether all discipline add/edit/remove buttons should be disabled
             */
            disable_buttons: function (): boolean {
                return !!this.active_discipline_key || this.submitting;
            }
        },
        updated: function () {
            this.$emit('changed');
        },
        components: {
            DisciplineForm
        }
    });
</script>