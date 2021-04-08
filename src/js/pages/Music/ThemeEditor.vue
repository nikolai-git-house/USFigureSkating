<!-- @downstream-sync 2020-07-02 - import rhythm/theme feature
    the following file has been imported without modifications from the USFS repository master branch
-->
<script lang="ts">
    import Vue from "vue";
    import { SkaterSkatingEventSegment } from "../../models/SkaterSkatingEventSegment";
    import { MusicFetchArgs, ThemeSavePayload, ThemeSaveResponse } from "../../contracts/app/MusicContracts";

    export interface ThemeEditorComponent extends Vue {
        saveTheme: Function;
        unsaved_changes: boolean;
    }

    type ThemeEditorData = {
        save_error: boolean;
        notice: string;
        data_loaded: boolean;
        loading_timeout: boolean;
        load_error: boolean;
        theme: string;
    }
    export default Vue.extend({
        props: {
            event_segment: {
                type: SkaterSkatingEventSegment,
                required: true
            },
            competition_id: {
                type: Number,
                required: true
            },
			is_view_only: {
				type: Boolean,
				required: true
			}
        },
        data: function (): ThemeEditorData {
            return {
                save_error: false,
                notice: "Loading...",
                data_loaded: false,
                loading_timeout: false,
                load_error: false,
                theme: ""
            }
        },
        created: function () {
            this.initLoadingTimeout();
            this.fetchThemeData();
        },
        destroyed: function () {
            this.$store.commit('music/clearActiveTheme');
        },
        computed: {
            /**
             * Whether to show the informational notice about loading or that a load error occurred
             */
            show_notice: function () {
                if (!this.data_loaded) {
                    return this.loading_timeout;
                }
                return this.load_error;
            },
            unsaved_changes: function () {
                return this.theme !== this.$store.getters['music/active_theme'];
            },
            /**
             * Text content of submit button
             */
            confirm_button_text: function (): string {
                return this.is_view_only ? "Exit" : "Confirm Theme";
            },
            /**
             * Action taken by confirm button
             */
            confirm_button_action: function (): Function {
                if (this.is_view_only) {
                    return this.exit;
                }
                return this.saveTheme;
            },
            deadline_passed_message: function (): string {
                if (!this.is_view_only) {
                    return "";
                }
                return "The Music deadline has passed. Please contact the LOC to make any changes."
            },
            /**
			 * Whether the save button should be disabled
			 */
			save_disabled: function () {
				return !this.unsaved_changes;
			},
        },
        methods: {
            /**
             * Set variable after a timeout to ensure "loading" doesn't display if the page loads quickly
             */
            initLoadingTimeout: function () {
                let vm = this;
                setTimeout(function () {
                    vm.loading_timeout = true;
                }, 200);
            },
            /**
             * Fetch the theme data for the active event segment
             */
            fetchThemeData: function (): void {
                let vm = this;
                let fetch_args: MusicFetchArgs = {
                    competition_id: this.competition_id,
                    event_id: this.event_segment.event_id,
                    event_segment_id: this.event_segment.segment_id,
                    competition_skated_event_id: this.event_segment.competition_skated_event_id
                };
                this.$store.dispatch('music/fetchTheme', fetch_args).then(function () {
                    vm.data_loaded = true;
                    vm.theme = vm.$store.getters['music/active_theme'];
                }).catch(function () {
                    vm.load_error = true;
                    vm.notice = "Error loading theme."
                });
            },
            /**
             * Get the Save Rhythm payload from local state
             */
            getSavePayload: function (): ThemeSavePayload {
                return {
                    competition_id: this.competition_id,
                    event_id: this.event_segment.event_id,
                    event_segment_id: this.event_segment.segment_id,
                    competition_skated_event_id: this.event_segment.competition_skated_event_id,
                    theme: this.theme
                };
            },
            /**
             * Perform the save operation
             */
            performThemeSave: function (): Promise<void> {
                let vm = this;
                let save_payload = this.getSavePayload();
                return new Promise(function (resolve, reject) {
                    vm.$store.dispatch('music/saveTheme', save_payload).then(function (response: ThemeSaveResponse) {
                        vm.$emit('theme-complete', response);
                    }).catch(function () {
                        reject();
                    });
                })
            },
            /**
             * Save wrapper
             * When called externally, run and return save promise
             *
             * When called internally, run save process and handle exception case
             */
            saveTheme: function (update_local: boolean = true): Promise<void> | void {
                if (!update_local) {
                    return this.performThemeSave();
                }
                let vm = this;
                vm.performThemeSave().catch(function () {
                    vm.save_error = true;
                    setTimeout(function () {
                        vm.save_error = false;
                    }, 2000);
                });
            },
            /**
             * Handle exit button click
             */
            exit: function (): void {
                this.$emit('close-theme');
            }
        },
    });
</script>
