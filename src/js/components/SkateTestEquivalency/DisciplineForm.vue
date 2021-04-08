<script lang="ts">
    import FormMixin from "../../mixins/FormMixin";
    import HasDataDependencies from "../../mixins/HasDataDependencies";
    import mixins from 'vue-typed-mixins'
    import SkateTestDisciplineFormState from "../../models/SkateTestEquivalency/SkateTestDisciplineFormState";
    import {SkateTestDisciplineFormValidator} from "../../models/SkateTestEquivalency/SkateTestDisciplineFormValidator";
    import {
        SkateTestDisciplineKey,
        SkateTestFormOption,
        SkateTestFormData
    } from "../../contracts/app/SkateTestContracts";
    import AutoSuggest from "../../components/AutoSuggest.vue";
    import {FormOption} from "../../contracts/AppContracts";

    export default mixins(FormMixin, HasDataDependencies).extend({
        props: {
            existing_data: {
                type: Object as () => SkateTestFormData | null,
                default: null
            },
            discipline_key: {
                type: String as () => SkateTestDisciplineKey
            },
            form_test_options: {
                type: Array as () => SkateTestFormOption[],
                required: false
            },
            is_equivalency: {
                type: Boolean,
                default: true
            },
            allow_cancel: {
                type: Boolean,
                default: true
            },
            external_error: {
                type: String,
                required: false
            },
            submitting: {
                type: Boolean,
                default: false
            },
            club_autosuggest: {
                type: Object,
                default: () => {
                    return {
                        active: false,
                    }
                }
            },
        },
        data: function () {
            return {
                dependencies: {
                    club_options: false
                },
                form_data: new SkateTestDisciplineFormState(this.is_equivalency),
                validator_class: SkateTestDisciplineFormValidator
            }
        },
        /**
         * Import existing data if it exists
         */
        created: function () {
            this.form_data.import(this.existing_data);
        },
        methods: {
            loadData: function () {
                return new Promise((resolve, reject) => {
                    if (!this.club_autosuggest.active) {
                        this.dependencies.club_options = true;
                        resolve();
                        return;
                    }
                    let promises: Promise<void>[] = [
                        this.$store.dispatch('form_options/fetchClubs').then(() => {
                            this.dependencies.club_options = true;
                        }).catch(() => {
                            reject();
                        })
                    ];
                    Promise.all(promises).then(() => {
                        resolve();
                    })
                });
            },
            /**
             * Handle change event on club autosuggest input
             */
            clubChange: function (value: FormOption) {
                this.form_data.club = value.label;
                this.form_data.club_id = value.value;
            },
            /**
             * Cancel the form
             */
            cancel: function () {
                this.$emit('cancel');
            },
            /**
             * Complete the form
             */
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
             * The minimum selectable test level based on existing selections
             */
            minimum_level: function (): number {
                if (this.existing_data) {
                    return this.existing_data.test.level_id;
                }
                return 0;
            },
            /**
             * Options for the test input
             */
            test_options: function (): SkateTestFormOption[] {
                if (this.form_test_options) {
                    return this.form_test_options;
                }
                let discipline_options = this.$store.getters['form_options/skate_test_options'](this.discipline_key);
                return discipline_options.filter((item: SkateTestFormOption) => {
                    return item.level_id >= this.minimum_level;
                });
            },
            clubs: function () {
                return this.$store.getters['form_options/clubs'];
            },
            show_auto_suggest: function () {
                return this.club_autosuggest.active;
            }
        },
        components: {
            AutoSuggest
        }
    });
</script>