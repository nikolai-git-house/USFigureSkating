<script lang="ts">
    import Vue from "vue";
    import {
        SavedSkateTest,
        SkateTestHistoryDiscipline,
        UserSkateTestHistory
    } from "../../contracts/app/SkateTestContracts";

    interface SkateTestDeleteHandler extends FunctionConstructor {
        (discipline: SkateTestHistoryDiscipline, test: SavedSkateTest): Promise<void>
    }

    type DisciplineIndex = number;
    type TestIndex = number;
    type TestIndicies = [DisciplineIndex, TestIndex]
    /**
     * Component for displaying current state of user's skate test history, and controls to modify it
     */
    export default Vue.extend({
        props: {
            /**
             * Function to handle the removal of a self-reported test.
             * Overrides default test removal flow
             */
            delete_handler: {
                type: Function as SkateTestDeleteHandler,
                required: false
            }
        },
        data: function () {
            return {
                /**
                 * The indicies representing the location of a test.
                 * First item is the index of the discipline in the discipline list
                 * Second item is the test index in the test loop within the discipline list
                 */
                active_remove_indices: <TestIndicies | null>null,
                /**
                 * The active error message returned by the delete handler
                 */
                error_message: ""
            }
        },
        methods: {
            /**
             * Whether a test item, indicated by discipline and test indices, is the the item currently in the process
             * of being deleted
             */
            isActiveItem: function (test_indices: TestIndicies): boolean {
                if (!this.active_remove_indices || test_indices.length !== 2 || this.active_remove_indices.length !== 2) {
                    return false;
                }
                return (test_indices[0] === this.active_remove_indices[0] &&
                    test_indices[1] === this.active_remove_indices[1]);
            },
            /**
             * The error associated with a test item, indicated by discipline and test indices
             */
            testError: function (test_indices: TestIndicies): string | false {
                if (!this.error_message || !this.isActiveItem(test_indices)) {
                    return false;
                }
                return this.error_message;

            },
            /**
             * Add a new test.  Update state to launch the form to add test.
             */
            addTest: function (discipline: SkateTestHistoryDiscipline): void {
                this.error_message = "";
                this.$store.commit('skate_test_history/setActiveDiscipline', discipline)
            },
            /**
             * Remove an existing test
             */
            removeTest: function (discipline: SkateTestHistoryDiscipline, test: SavedSkateTest, test_indices: TestIndicies): void {
                this.active_remove_indices = test_indices;
                this.error_message = "";
                if (this.delete_handler) {
                    this.delete_handler(discipline, test).then(() => {
                        this.active_remove_indices = null;
                    }).catch((error_message: string) => {
                        this.error_message = error_message;
                    });
                    return;
                }
                this.$store.dispatch('skate_test_history/removeTest', {discipline, test}).then(() => {
                    this.active_remove_indices = null;
                }).catch((error_message: string) => {
                    this.error_message = error_message;
                })
            },
            /**
             * Whether the actions to add a new test should be disabled.
             * When no tests are available
             */
            disableDisciplineActions: function (discipline: SkateTestHistoryDiscipline): boolean {
                return discipline.available_tests.length < 1;
            }
        },
        computed: {
            /**
             * The discipline data for the discipline loop
             */
            disciplines: function (): SkateTestHistoryDiscipline[] {
                if (!this.user_skate_test_history) {
                    return [];
                }
                return this.user_skate_test_history.disciplines;
            },
            /**
             * The active user's skate test history
             */
            user_skate_test_history: function (): UserSkateTestHistory | null {
                return this.$store.getters['skate_test_history/user_skate_test_history'];
            },
            /**
             * The list of disciplines containing self reported tests
             */
            self_reported_test_disciplines: function (): SkateTestHistoryDiscipline[] {
                return this.$store.getters['skate_test_history/user_self_reported_test_disciplines'];
            }
        }
    });
</script>