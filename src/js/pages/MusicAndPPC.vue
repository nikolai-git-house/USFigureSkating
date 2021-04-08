<script lang="ts">
    /* eslint-disable */
    import {default as PPCEditor, PPCEditorComponent} from "./PPC/PPCEditor.vue";
    import {default as MusicEditor, MusicEditorComponent} from "./Music/MusicEditor.vue";
    import {default as RhythmEditor, RhythmEditorComponent} from "./Music/RhythmEditor.vue";
    import {default as ThemeEditor, ThemeEditorComponent} from "./Music/ThemeEditor.vue";
    import {SkaterSkatingEventSegment} from "../models/SkaterSkatingEventSegment";
    import {PPCSaveResponse} from "../contracts/app/PPCContracts";
    import {PPCState} from "../store/Modules/PPCState";
    import {MusicState} from "../store/Modules/MusicState";
    import {MusicPPCDeadline, MusicPPCInformation} from "../contracts/AppContracts";
    import {MusicSaveResponse, RhythmSaveResponse, ThemeSaveResponse} from "../contracts/app/MusicContracts";
    import mixins from 'vue-typed-mixins';
    import HasDataDependencies from '../mixins/HasDataDependencies';
    import {CompetitionPortalPageMixin} from '../CompetitionPortal/_mixins';

    type MusicAndPPCAlertArgs = {
        description: string;
        button_1: {
            text: string;
            action: Function
        }
    }
    type MusicAndPPCData = {
        ppc_active: boolean;
        music_active: boolean;
        rhythm_active: boolean;
        theme_active: boolean;
        active_event_segment: SkaterSkatingEventSegment | null,
        current_datestamp: number,
        dependencies: {
            music_and_ppc: boolean,
        }
        show_component_close_confirm: boolean;
        saving_component: boolean;
        component_save_error: boolean;
        page_title: string;
        active_competition_id: number;
    }
    const vueClass = mixins(HasDataDependencies, CompetitionPortalPageMixin);
    export default vueClass.extend({
        data: function (): MusicAndPPCData {
            return {
                ppc_active: false,
                music_active: false,
                rhythm_active: false,
                theme_active: false,
                active_event_segment: null,
                current_datestamp: (new Date).getTime(),
                dependencies: {
                    music_and_ppc: false,
                },
                show_component_close_confirm: false,
                saving_component: false,
                component_save_error: false,
                /**
                 * Title to display for the page in the header block
                 */
                page_title: 'Music & Planned Program Content',
                active_competition_id: -1
            };
        },
        created: function () {
            this.initCurrentDateStamp();
            this.loadPPCModule();
            this.loadMusicModule();
        },
        methods: {
            /**
             * Initialize timeout to determine whether enough time has elapsed to show loading info
             */
            initCurrentDateStamp: function () {
                let vm = this;

                setInterval(function () {
                    vm.current_datestamp = (new Date().getTime());
                }, 1000)

            },
            /**
             * Reset page to initial state
             */
            reset: function (): void {
                this.active_event_segment = null;
                this.ppc_active = false;
                this.music_active = false;
                this.rhythm_active = false;
                this.theme_active = false;
                this.show_component_close_confirm = false;
                this.saving_component = false;
                this.component_save_error = false;
            },
            /**
             * Whether the page overlay is active
             */
            overlayActive: function () {
                return this.ppc_active || this.music_active || this.rhythm_active || this.theme_active;
            },
            /**
             * Handle Music/PPC overlay close request event
             */
            closeOverlay: function () {
                if (this.ppc_active) {
                    let ppc_unsaved = (this.$refs.ppc_editor as PPCEditorComponent).unsaved_changes;
                    if (ppc_unsaved) {
                        this.show_component_close_confirm = true;
                        return;
                    }
                }
                if (this.music_active) {
                    let music_unsaved = (this.$refs.music_editor as MusicEditorComponent).unsaved_changes;
                    if (music_unsaved) {
                        this.show_component_close_confirm = true;
                        return;
                    }
                }
                if (this.rhythm_active) {
                    let rhythm_unsaved = (this.$refs.rhythm_editor as RhythmEditorComponent).unsaved_changes;
                    if (rhythm_unsaved) {
                        this.show_component_close_confirm = true;
                        return;
                    }
                }
                if (this.theme_active) {
                    let theme_unsaved = (this.$refs.theme_editor as ThemeEditorComponent).unsaved_changes;
                    if (theme_unsaved) {
                        this.show_component_close_confirm = true;
                        return;
                    }
                }
                this.reset();
            },
            /**
             * Load the PPC state module
             */
            loadPPCModule: function () {
                this.$store.registerModule('ppc', PPCState);
            },
            loadMusicModule: function () {
                this.$store.registerModule('music', MusicState);
            },
            /**
             * Launch PPC for an event segment
             */
            openPPC: function (event_segment: SkaterSkatingEventSegment) {
                this.active_event_segment = event_segment;
                this.ppc_active = true;
            },
            /**
             * Open Music for an event segment
             */
            openMusic: function (event_segment: SkaterSkatingEventSegment) {
                this.active_event_segment = event_segment;
                this.music_active = true;
            },
            /**
             * Open Rhythm for an event segment
             */
            openRhythm: function (event_segment: SkaterSkatingEventSegment) {
                this.active_event_segment = event_segment;
                this.rhythm_active = true;
            },
            /**
             * Open Theme for an event segment
             */
            openTheme: function (event_segment: SkaterSkatingEventSegment) {
                this.active_event_segment = event_segment;
                this.theme_active = true;
            },
            /**
             * Respond to the completion event and API response for saving PPC
             */
            handlePPCComplete: function (result: PPCSaveResponse) {
                if (this.active_event_segment instanceof SkaterSkatingEventSegment) {
                    this.active_event_segment.handlePPCUpdate(result);
                }
                this.reset();
            },
            /**
             * Respond to the music completion event and API response
             */
            handleMusicComplete: function (result: MusicSaveResponse) {
                if (this.active_event_segment instanceof SkaterSkatingEventSegment) {
                    this.active_event_segment.handleMusicUpdate(result);
                }
                this.reset();
            },
            /**
             * Respond to the rhythm completion event and API response
             */
            handleRhythmComplete: function (result: RhythmSaveResponse) {
                if (this.active_event_segment instanceof SkaterSkatingEventSegment) {
                    this.active_event_segment.handleRhythmUpdate(result);
                }
                this.reset();
            },
            /**
             * Respond to the theme completion event and API response
             */
            handleThemeComplete: function (result: ThemeSaveResponse) {
                if (this.active_event_segment instanceof SkaterSkatingEventSegment) {
                    this.active_event_segment.handleThemeUpdate(result);
                }
                this.reset();
            },
            /**
             * Whether a particular deadline has passed
             */
            deadlinePassed: function (deadline: MusicPPCDeadline | null) {
                if (!deadline) {
                    return false;
                }
                return deadline.timestamp <= this.current_datestamp;
            },
            /**
             * Handle "Save" selection from PPC/Music edits active warning
             * @refactor - use state to prevent need to use child component functionality
             *
             * @note: 8/1/2018 - This method isn't called from the music alert anymore. Music logic has been retained
             * in case a restore is needed, but it is deprecated and unused.
             */
            saveAndClose: function () {
                this.component_save_error = false;
                this.saving_component = true;
                let vm = this;
                let ref_method: Function;
                if (this.music_active) {
                    ref_method = (this.$refs.music_editor as MusicEditorComponent).saveMusic;
                } else if (this.ppc_active) {
                    ref_method = (this.$refs.ppc_editor as PPCEditorComponent).savePPC;
                } else if (this.rhythm_active) {
                    ref_method = (this.$refs.rhythm_editor as RhythmEditorComponent).saveRhythms;
                } else {
                    ref_method = (this.$refs.theme_editor as ThemeEditorComponent).saveTheme;
                }

                ref_method(false).catch(function () {
                    vm.component_save_error = true;
                    vm.saving_component = false;
                });
            },
            /**
             * Handle "Exit Without Saving" selection from PPC edits active warning
             */
            exitWithoutSave: function () {
                this.reset();
            },
            /**
             * Handle the close event for the unsaved edits popup alert
             */
            unsavedAlertClose: function (): void {
                this.show_component_close_confirm = false;
                this.saving_component = false;
                this.component_save_error = false;
            },
            loadData: function () {
                return new Promise((resolve, reject) => {
                    this.$store.dispatch('competition_portal/fetchMusicAndPpc')
                        .then((competition_id: number) => {
                            this.dependencies.music_and_ppc = true;
                            this.active_competition_id = competition_id;
                        })
                        .catch(() => {
                            reject();
                        })
                });
            }
        },
        computed: {
            /**
             * Information about music and ppc deadlines
             */
            music_ppc_deadline_information: function (): MusicPPCInformation {
                return this.$store.getters['competitions/music_and_ppc_information'];
            },
            /**
             * Whether the PPC deadline has passed
             */
            ppc_deadline_passed: function (): boolean {
                return this.deadlinePassed(this.music_ppc_deadline_information.ppc);
            },
            /**
             * Whether the music deadline has passed
             */
            music_deadline_passed: function (): boolean {
                return this.deadlinePassed(this.music_ppc_deadline_information.music);
            },
            /**
             * The active competition
             *
             * @note:  This is a legacy property that all sub-editors depend on for it's `id` property.  This is left in
             * place to avoid breaking existing functionality until there is time for a full refactor
             */
            competition: function (): { id: number } {
                return {
                    id: this.active_competition_id
                }
            },
            /**
             * Available event segments data
             */
            event_segments: function (): SkaterSkatingEventSegment[] {
                return this.$store.getters['skater/active_event_segments'];
            },
            /**
             * Text on Music trigger button
             */
            music_button_text: function (): string {
                return this.music_deadline_passed ? "View Music" : "Edit Music";
            },
            /**
             * Text on PPC trigger button
             */
            ppc_button_text: function (): string {
                return this.ppc_deadline_passed ? "View PPC" : "Edit PPC";
            },
            deadline_passed_message: function (): string {
                let deadline_message: { [key: number]: string } = {
                    0: "",
                    1: "PPC deadline has passed.",
                    2: "Music deadline has passed.",
                    3: "Music and PPC deadlines have passed."
                };
                let map = 0;
                map += this.ppc_deadline_passed ? 1 : 0;
                map += this.music_deadline_passed ? 2 : 0;
                return deadline_message[map];
            },
            /**
             * Display elements and functionality hooks for unsaved alert
             * These differ based on which component is active
             */
            unsaved_alert: function (): MusicAndPPCAlertArgs {
                if (this.music_active) {
                    return {
                        description: "You have unsaved changes. Are you sure you want to exit?",
                        button_1: {
                            text: "Continue Editing",
                            action: this.unsavedAlertClose
                        }
                    };
                }
                return {
                    description: "You have unsaved changes. Would you like to save them?",
                    button_1: {
                        text: this.saving_component ? "Saving" : "Save Changes",
                        action: this.saveAndClose
                    }
                };

            }
        },
        components: {
            'ppc-editor': PPCEditor,
            'music-editor': MusicEditor,
            'rhythm-editor': RhythmEditor,
            'theme-editor': ThemeEditor
        }
    });
</script>
