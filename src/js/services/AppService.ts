import {PPCFormOptions, PPCOptionFetchParams} from "../contracts/app/PPCContracts";
import axios, {CancelToken} from "axios";
import {PPCDataAdaptor} from "../adaptors/PPCDataAdaptor";
import {UploadedFileError, UploadedFileSuccess} from "../contracts/app/MusicContracts";
import {MusicDataAdaptor} from "../adaptors/MusicDataAdaptor";
import {SavedMusic} from "../models/Music/SavedMusic";
import {
    EMSSupportIssueTypeOption,
    EMSSupportSubmitResult,
    ExportedEMSSupportFormData,
    PracticeIceSchedulesStateArgs,
    SupportDocumentCategory
} from "../contracts/AppContracts";
import {PracticeIceSchedulesDataAdaptor} from "../adaptors/PracticeIceSchedulesDataAdaptor";
import {AppAPIAdaptor} from "../adaptors/APIAdaptors/AppAPIAdaptor";
import {FetchSupportDocumentsAPIResponse} from "../contracts/release3/api/AppAPIContracts";
import {CompetitionPortalApiService} from '../CompetitionPortal/_services';

export class AppService {
    /**
     * Fetch the PPC form options
     */
    static getPPCFormOptions(fetch_params: PPCOptionFetchParams): Promise<PPCFormOptions> {
        return new Promise(function (resolve, reject) {
            axios.post(CompetitionPortalApiService.transformMusicPpcUrl('ppc-element-options'), fetch_params).then(function (response) {
                try {
                    let adapted: PPCFormOptions = PPCDataAdaptor.adapt_PPCOptionsData_To_PPCFormOptions(response.data);
                    resolve(adapted);
                }
                catch (e) {
                    reject();
                }
            }).catch(function () {
                reject();
            });
        });
    }

    /**
     * Upload a file.
     *
     * Run progress_function on upload progress
     *
     * Resolve on success
     * Reject with error message on failure
     */
    static uploadMusicFile(file: File, progress_function: Function, cancel_token: CancelToken): Promise<UploadedFileSuccess | UploadedFileError> {
        return new Promise(function (resolve) {
            let formData = new FormData();
            formData.append('file', file);
            axios.request({
                method: "post",
                url: '/api/upload-music',
                data: formData,
                cancelToken: cancel_token,
                onUploadProgress: function (progressEvent: ProgressEvent) {
                    progress_function(progressEvent);
                },
            }).then(function (response) {
                resolve(MusicDataAdaptor.adaptMusicFileUploadResponse(response.data));
            }).catch(function () {
                let response_params: UploadedFileError = {
                    success: false,
                    error: true,
                    message: "Error uploading file."
                };
                resolve(response_params);
            });
        });
    }

    /**
     * Delete a file uploaded for a music item
     */
    static deleteUploadedMusicFile(file_id: string) { // @downstream-sync 2020-07-02 - downstream music items have id:string typing
        return new Promise(function (resolve, reject) {
            axios.post('/api/delete-uploaded-music-file', {
                music_file_id: file_id
            }).then(function () {
                resolve();
            }).catch(function () {
                reject();
            });
        });
    }

    /**
     * Delete a music item from the library
     */
    static deleteMusicFromLibrary(song: SavedMusic): Promise<void> {
        return new Promise(function (resolve, reject) {
            axios.post('/api/music-library/remove', {
                music_item_id: song.id
            }).then(function (response) {
                if (response.data.success) {
                    resolve();
                    return;
                }
                reject();
            }).catch(function () {
                reject();
            });
        });
    }

    /**
     * Fetch dynamic input options for EMS Support Form
     */
    static fetchEMSSupportFormOptions(): Promise<EMSSupportIssueTypeOption[]> {
        return new Promise(function (resolve, reject) {
            axios.get('/api/ems-support/issue-types').then(function (response) {
                if (response.data.issue_types) {
                    resolve(response.data.issue_types);
                    return;
                }
                reject();
            }).catch(function () {
                reject();
            });

        });

    }

    /**
     * Submit the EMS Support Form
     */
    static submitEMSSupport(form_data: ExportedEMSSupportFormData): Promise<EMSSupportSubmitResult> {
        return new Promise(function (resolve, reject) {
            axios.post('/api/ems-support/submit', form_data).then(function (response) {
                let result = response.data.success ? response.data.success : false;
                let error = "";
                if (!result) {
                    error = response.data.error ? response.data.error : "Error submitting form.";
                }

                resolve({
                    success: result,
                    error: error
                })
            }).catch(function () {
                reject();
            })
        });
    }

    /**
     * Get PracticeIceSchedulesStateArgs for a given competition
     *
     * This is composed of all the parsed data structures for Skater and Competition Schedules for Practice Ice
     */
    static getPracticeIceSchedules(competition_id: number): Promise<PracticeIceSchedulesStateArgs> {
        return new Promise(function (resolve, reject) {
            axios.get('/api/competitions/' + competition_id + "/practice-ice-schedules").then(function (response) {
                let adapted_result = PracticeIceSchedulesDataAdaptor.adapt(response.data);
                resolve(adapted_result);
            }).catch(function () {
                reject();
            });
        });
    }

    /**
     * Fetch categorized support documents for Support Documents (Help & Resources) page
     */
    static fetchCategorizedSupportDocuments(): Promise<SupportDocumentCategory[]> {
        return new Promise(function (resolve, reject) {
            axios.get('/api/support-documents').then(function (response: { data: FetchSupportDocumentsAPIResponse }) {
                if (response.data && response.data.categorized_support_documents) {
                    resolve(AppAPIAdaptor.adaptSupportDocumentCategoryDataArrayToSupportDocumentCategoryArray(response.data.categorized_support_documents));
                }
                reject();
            }).catch(function () {
                reject();
            });
        });
    }
}