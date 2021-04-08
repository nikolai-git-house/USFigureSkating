import { RhythmSaveResponse, RhythmSavePayload, ThemeSavePayload, ThemeSaveResponse } from './../../contracts/app/MusicContracts';
import {ActionTree, GetterTree, MutationTree} from "vuex"
import {
    CopyrightUpdatePayload, MusicFetchArgs, MusicFile, MusicSavePayload, MusicSaveResponse, UploadedFileError,
    UploadedFileSuccess
} from "../../contracts/app/MusicContracts";
import {SkaterService} from "../../services/SkaterService";
import {Music} from "../../models/Music/Music";
import {AppService} from "../../services/AppService";
import {SavedMusic} from "../../models/Music/SavedMusic";
import {EventSegmentMusicCollection} from "../../models/Collections/EventSegmentMusicCollection";
import {EventSegmentMusic} from "../../models/Music/EventSegmentMusic";
import {SavedMusicCollection} from "../../models/Collections/SavedMusicCollection";
import {MusicUploadHelpers} from "../../helpers/MusicUploadHelpers";
import axios, {CancelTokenSource} from "axios";

export class State {
    /**
     * Whether the active music item has been saved on the backend to the user's library
     */
    active_has_been_saved: boolean = false;
    /**
     * The last saved version of the music for the active event segment.  Used for change detection
     */
    last_saved_music: Music = new Music();
    /**
     * The active music item being edited for the active event segment
     * Could be an instance of SavedMusic
     */
    active_music: Music = new Music();
    /**
     * Whether an upload is currently active
     */
    upload_active: boolean = false;
    /**
     * Whether the most recent upload has encountered an error
     */
    upload_error: string | false = false;
    /**
     * The progress of the current upload. Decimal representing a percentage of 100
     */
    upload_progress: number = 0;
    /**
     * Whether the library has already been fetched
     */
    library_fetched: boolean = false;
    /**
     * Whether the library is already in the process of loading
     */
    library_loading: boolean = false;
    /**
     * The collection of music items in the active user's library
     */
    library: SavedMusicCollection = new SavedMusicCollection();
    /**
     * Whether the library API call resulted in an error
     */
    library_load_error: boolean = false;
    /**
     * Retrieved and cached information about music for event segments
     */
    event_segment_music_collection = new EventSegmentMusicCollection();
    /**
     * The source for the active upload's cancel token
     */
    cancel_token_source?: CancelTokenSource = undefined;
    /**
     * The active rhythms being edited for the active event segment
     */
    active_rhythms: string[] = [];  // @downstream-sync 2020-07-02 - import rhythm/theme feature
    /**
     * The active theme being edited for the active event segment
     */
    active_theme: string = "";  // @downstream-sync 2020-07-02 - import rhythm/theme feature
}

const actions = <ActionTree<State, any>>{
    /**
     * Fetch the music for an event segment.
     */
    fetchEventSegmentMusic: function (context, fetch_args: MusicFetchArgs) {
        return new Promise(function (resolve, reject) {
            /**
             * Search for locally saved matching EventSegmentMusic before fetching from server.
             */
            let existing = context.state.event_segment_music_collection.find(fetch_args);
            if (existing) {
                let existing_music = existing.music;
                context.commit('setActiveMusic', existing_music.clone());
                context.commit('setOriginalMusic', existing_music.clone());
                context.commit('setActiveHasBeenSaved', true);
                resolve();
                return;
            }
            SkaterService.getEventSegmentMusic(fetch_args).then(function (event_segment_music: EventSegmentMusic | null) {
                if (event_segment_music) {
                    context.commit('setActiveHasBeenSaved', true);
                    // this is the only time we should reassign active and original music since it's the only time the song applies to the event segment
                    context.commit('setActiveMusic', event_segment_music.music.clone());
                    context.commit('setOriginalMusic', event_segment_music.music.clone());
                    context.commit('storeEventSegmentMusic', event_segment_music);
                }
                resolve();
                return;
            }).catch(function () {
                reject();
            })
        });
    },
    /**
     * Handle the file selection event
     *
     * Set the file name as the active music item name
     * Validate file and trigger upload if validation passes
     * @note: if immediate feedback is desired, remove the complete upload call
     */
    handleFileSelection: function (context, file: File) {
        context.commit('setUploadActive', true);
        context.commit('setUploadError', false);
        context.commit('setUploadProgress', 0);
        context.commit('setActiveMusicName', MusicUploadHelpers.pruneFileExtension(file.name));
        let validation_result = MusicUploadHelpers.validateSelectedFile(file);
        if (!validation_result.is_valid) {
            let current_timestamp = (new Date()).getTime();
            context.dispatch('completeUpload', current_timestamp).then(function () {
                context.commit('setUploadError', validation_result.error);
            });
            return;
        }
        context.dispatch('uploadFile', file);
    },
    /**
     * Handle the upload of a selected music file
     *
     * Manage upload progress status
     * Trigger upload and report progress
     * If upload successful, update active music name to provided metadata (if present)
     * If upload failed, process error message
     */
    uploadFile: function (context, file: File) {
        let upload_upload_start_timestamp = (new Date().getTime());


        const CancelToken = axios.CancelToken;
        const source = CancelToken.source();
        context.commit('setCancelTokenSource', source);
        AppService.uploadMusicFile(file, function (progressEvent: ProgressEvent) {
            let progress = progressEvent.loaded / progressEvent.total;
            if (progress !== 1) {
                context.commit('setUploadProgress', progress);
            }
        }, source.token).then(function (result: UploadedFileSuccess | UploadedFileError) {
            context.commit('setCancelTokenSource', undefined);
            if (result.success) {
                context.dispatch('completeUpload', upload_upload_start_timestamp).then(function () {
                    if (result.metadata && result.metadata.name) {
                        context.commit('setActiveMusicName', result.metadata.name);
                    }
                    context.commit('setActiveMusicFile', result.file);
                });
                return;
            }
            let message = "File upload error.";
            if (result.message) {
                message = result.message;
            }
            context.dispatch('completeUpload', upload_upload_start_timestamp).then(function () {
                context.commit('setUploadError', message);
                context.commit('setUploadActive', false);
            });

        }).catch(function () {
            context.commit('setCancelTokenSource', undefined);
            context.dispatch('completeUpload', upload_upload_start_timestamp).then(function () {
                context.commit('setUploadError', "File upload error.");
                context.commit('setUploadActive', false);
            });

        });
    },
    /**
     * Handle user selection of a file from their library
     */
    selectFileFromLibrary: function (context, music: Music) {
        context.commit('setActiveMusic', music.clone());
        context.commit('setActiveHasBeenSaved', true);
        context.commit('setUploadError', false);
    },
    /**
     * Complete the upload progress. If minimum time hasn't elapsed, simulate upload progress over the course of the remaining time
     */
    completeUpload: function (context, upload_upload_start_timestamp: number) {
        return new Promise(function (resolve, reject) {
            const min_upload_time_ms = 500;
            const current_timestamp = (new Date().getTime());
            const elapsed_ms = current_timestamp - upload_upload_start_timestamp;
            const upload_interval_step = 50;
            let current_progress = context.state.upload_progress;
            if ((elapsed_ms) < min_upload_time_ms) {
                const remaining_ms = min_upload_time_ms - elapsed_ms;
                const steps = remaining_ms / upload_interval_step;
                const step_amount = (1 - current_progress) / steps;
                const add_int = setInterval(function () {
                    current_progress += step_amount;
                    if (current_progress > 1) {
                        current_progress = 1;
                    }
                    context.commit('setUploadProgress', current_progress);
                    if (current_progress === 1) {
                        clearInterval(add_int);
                        context.commit('setUploadActive', false);
                        resolve();
                    }
                }, upload_interval_step);
                return;
            }
            context.commit('setUploadActive', false);
            resolve();
        });
    },
    /**
     * Fetch user's music library
     */
    fetchLibrary: function (context): Promise<void> | void {
        if (context.state.library_fetched) {
            return;
        }
        context.commit('setLibraryFetched', true);
        context.commit('setLibraryLoading', true);
        return new Promise(function (resolve, reject) {
            SkaterService.fetchMusicLibrary().then(function (music_items: SavedMusic[]) {
                context.commit('setLibrary', music_items);
                context.commit('setLibraryLoading', false);
            }).catch(function () {
                context.commit('setLibraryLoading', false);
                context.commit('setLibraryLoadError', true);
            });
        });
    },
    /**
     * Save current music and associate it with the active event segment
     */
    saveAndConfirmMusic: function (context, save_payload: MusicSavePayload): Promise<MusicSaveResponse> {
        return new Promise(function (resolve, reject) {
            SkaterService.saveEventSegmentMusic(save_payload).then(function (response: MusicSaveResponse) {
                context.commit('setActiveHasBeenSaved', true);
                context.commit('storeEventSegmentMusic', response.event_segment_music);
                context.commit('updateSongInLibrary', response.event_segment_music.music.clone());
                context.commit('updateSongInSegments', response.event_segment_music.music.clone());
                resolve(response);
            }).catch(function () {
                reject();
            })
        });
    },
    /**
     * Send message to server to delete the uploaded file for the active music item
     *
     * called internally from state
     */
    deleteActiveFile: function (context) {
        let active_file = context.state.active_music.file;
        if (active_file) {
            let active_file_id = active_file.id;
            AppService.deleteUploadedMusicFile(active_file_id);
        }
    },
    /**
     * Clear the active music state without clearing original cached music reference
     */
    clearActiveMusic: function (context) {
        if (!context.state.active_has_been_saved) {
            context.dispatch('deleteActiveFile');
        }
        context.commit('setActiveHasBeenSaved', false);
        context.commit('setActiveMusic', new Music());
    },
    /**
     * Reset the active music state
     * If a song has been uploaded, but the Music item hasn't been saved, tell the server to delete the file
     */
    resetActiveMusicState: function (context) {
        if (!context.state.active_has_been_saved) {
            context.dispatch('deleteActiveFile');
        }
        if (context.state.cancel_token_source) {
            context.state.cancel_token_source.cancel('Operation canceled by the user.');
        }
        context.commit('resetActiveMusicState');
    },
    /**
     * Remove a song from the library on the server
     */
    removeLibrarySong: function (context, song: SavedMusic) {
        return new Promise(function (resolve, reject) {
            AppService.deleteMusicFromLibrary(song).then(function () {
                context.commit('removeLibrarySong', song);
                resolve();
            }).catch(function () {
                reject();
            });
        });
    },
    /**
     * Fetch Rhythm data
     */
    fetchRhythms: function (context, fetch_args: MusicFetchArgs) {  // @downstream-sync 2020-07-02 - import rhythm/theme feature
        return new Promise(function (resolve, reject) {
            SkaterService.fetchRhythms(fetch_args).then(function (rhythms: string[]) {
                context.commit('setActiveRhythms', rhythms);
                resolve();
                return;
            }).catch(function () {
                reject();
            });
        });
    },
    /**
     * Save current rhythms and associate it with the active event segment
     */
    saveRhythms: function (context, save_payload: RhythmSavePayload): Promise<RhythmSaveResponse> {  // @downstream-sync 2020-07-02 - import rhythm/theme feature
        return new Promise(function (resolve, reject) {
            SkaterService.saveRhythms(save_payload).then(function (response: RhythmSaveResponse) {
                context.commit('setActiveRhythms', response.rhythms);
                resolve(response);
            }).catch(function () {
                reject();
            })
        });
    },
    /**
     * Fetch Theme data
     */
    fetchTheme: function (context, fetch_args: MusicFetchArgs) {  // @downstream-sync 2020-07-02 - import rhythm/theme feature
        return new Promise(function (resolve, reject) {
            SkaterService.fetchTheme(fetch_args).then(function (theme: string) {
                context.commit('setActiveTheme', theme);
                resolve();
                return;
            }).catch(function () {
                reject();
            });
        });
    },
    /**
     * Save current theme and associate it with the active event segment
     */
    saveTheme: function (context, save_payload: ThemeSavePayload): Promise<ThemeSaveResponse> {  // @downstream-sync 2020-07-02 - import rhythm/theme feature
        return new Promise(function (resolve, reject) {
            SkaterService.saveTheme(save_payload).then(function (response: ThemeSaveResponse) {
                context.commit('setActiveTheme', response.theme);
                resolve(response);
            }).catch(function () {
                reject();
            });
        });
    }
};

const getters = <GetterTree<State, any>>{
    active_music: function (state) {
        return state.active_music;
    },
    upload_error: function (state) {
        return state.upload_error;
    },
    upload_active: function (state): boolean {
        return state.upload_active;
    },
    upload_progress: function (state) {
        return state.upload_progress;
    },
    library_load_error: function (state): boolean {
        return state.library_load_error;
    },
    library_loading: function (state): boolean {
        return state.library_loading;
    },
    library: function (state): SavedMusicCollection {
        return state.library;
    },
    unsaved_changes: function (state): boolean {
        return state.last_saved_music.equals(state.active_music) !== true;
    },
    // @downstream-sync 2020-07-02 - import rhythm/theme feature
    active_rhythms: function (state): string[] {
        return state.active_rhythms;
    },
    // @downstream-sync 2020-07-02 - import rhythm/theme feature
    active_theme: function (state): string {
        return state.active_theme;
    }
};

const mutations = <MutationTree<State>>{
    setActiveHasBeenSaved: function (state, has_been_saved: boolean) {
        state.active_has_been_saved = has_been_saved;
    },
    setActiveHasBeenPlayed: function (state, has_been_played: boolean) {
        state.active_music.has_been_played = has_been_played;
    },
    setOriginalMusic: function (state, music: Music) {
        state.last_saved_music = music;
    },
    setActiveMusic: function (state, music: Music) {
        state.active_music = music;
    },
    setUploadActive: function (state, is_active: boolean) {
        state.upload_active = is_active;
    },
    setUploadError: function (state, error: string | false) {
        if (error) {
            error += " Please upload a different file."
        }
        state.upload_error = error;
    },
    setUploadProgress: function (state, progress: number) {
        state.upload_progress = progress;
    },
    setActiveMusicName: function (state, file_name: string) {
        state.active_music.name = file_name;
    },
    setActiveMusicFile: function (state, file: MusicFile) {
        state.active_music.file = file;
    },
    setLibraryFetched: function (state, is_fetched: boolean) {
        state.library_fetched = is_fetched;
    },
    setLibraryLoading: function (state, is_loading: boolean) {
        state.library_loading = is_loading;
    },
    setLibrary: function (state, music: SavedMusic[]) {
        for (let i = 0; i < music.length; i++) {
            let music_item = music[i];
            state.library.add(music_item);
        }
    },
    setLibraryLoadError: function (state, load_error: boolean) {
        state.library_load_error = load_error;
    },
    resetActiveMusicState: function (state) {
        state.active_has_been_saved = false;
        state.last_saved_music = new Music();
        state.active_music = new Music();
        state.upload_error = false;
    },
    removeLibrarySong: function (state, song: SavedMusic) {
        state.library.remove(song);
    },
    storeEventSegmentMusic: function (state, event_segment_music: EventSegmentMusic) {
        state.event_segment_music_collection.add(event_segment_music);
    },
    updateSongInLibrary: function (state, saved_music: SavedMusic) {
        state.library.update(saved_music)
    },
    updateSongInSegments: function (state, saved_music: SavedMusic) {
        state.event_segment_music_collection.updateSong(saved_music);
    },
    updateCopyright: function (state, payload: CopyrightUpdatePayload) {
        state.active_music.updateCopyright(payload.copyright_data, payload.index);
    },
    removeCopyright: function (state, copyright_index) {
        state.active_music.removeCopyright(copyright_index);
    },
    setCancelTokenSource: function (state, cancel_token_source?: CancelTokenSource) {
        state.cancel_token_source = cancel_token_source
    },
    // @downstream-sync 2020-07-02 - import rhythm/theme feature
    setActiveRhythms: function (state, rhythms: string[]) {
        state.active_rhythms = rhythms;
    },
    // @downstream-sync 2020-07-02 - import rhythm/theme feature
    clearActiveRhythms: function (state) {
        state.active_rhythms = [];
    },
    // @downstream-sync 2020-07-02 - import rhythm/theme feature
    setActiveTheme: function (state, theme: string) {
        state.active_theme = theme;
    },
    // @downstream-sync 2020-07-02 - import rhythm/theme feature
    clearActiveTheme: function (state) {
        state.active_theme = "";
    }
};


export const MusicState = {
    namespaced: true,
    state: new State(),
    actions: actions,
    getters: getters,
    mutations: mutations
};