import {SkaterCredits} from "../models/Credits/SkaterCredits";
import {SkaterCreditDataAdaptor} from "../adaptors/SkaterCreditDataAdaptor";
import {SkaterEventDataAdaptor} from "../adaptors/SkaterEventDataAdaptor";
import {SessionDataAdaptor} from "../adaptors/SessionDataAdaptor";
import {ScheduledSession} from "../models/Sessions/ScheduledSession";
import axios from "axios";
import {BillingAddress} from "../models/BillingAddress";
import {BillingAddressDataAdaptor} from "../adaptors/BillingAddressDataAdaptor";
import {BillingAddressCreatePayload} from "../contracts/BillingAddressContracts";
import {
    CoachAddPayload,
    CoachRemovePayload,
    CoachReplacePayload,
    SkaterInfo,
    SkaterScheduleStateArgs
} from "../contracts/AppContracts";
import {SkaterAPIAdaptor} from "../adaptors/APIAdaptors/SkaterAPIAdaptor";
import {SkaterInfoDataAdaptor} from "../adaptors/SkaterInfoDataAdaptor";
import {SkaterCoachedEventCategoryCollection} from "../models/Collections/SkaterCoachedEventCollection";
import {PPC} from "../models/PPC/PPC";
import {PPCFetchArgs, PPCSavePayload, PPCSaveResponse} from "../contracts/app/PPCContracts";
import {SkaterSkatingEventSegment} from "../models/SkaterSkatingEventSegment";
import {SkaterSkatingEventSegmentAdaptor} from "../adaptors/SkaterSkatingEventSegmentAdaptor";
import {PPCDataAdaptor} from "../adaptors/PPCDataAdaptor";
import { MusicFetchArgs, MusicSavePayload, MusicSaveResponse, RhythmSavePayload, RhythmSaveResponse, ThemeSavePayload, ThemeSaveResponse } from "../contracts/app/MusicContracts";   // @downstream-sync 2020-07-02 - import rhythm/theme feature
import {MusicDataAdaptor} from "../adaptors/MusicDataAdaptor";
import {SavedMusic} from "../models/Music/SavedMusic";
import {EventSegmentMusic} from "../models/Music/EventSegmentMusic";
import {BillingAddressFormData} from "../models/BillingAddressFormState";
import {
    CreateBillingAddressAPIResponse,
    UpdateBillingAddressAPIResponse
} from "../contracts/release3/api/SkaterServiceAPIContracts";
import {CompetitionPortalApiService} from '../CompetitionPortal/_services';

export class SkaterService {
    /**
     * Retrieve the active skater's schedule
     *
     * @deprecated 2020-08-04
     */
    static getCompetitionSchedule(competition_id: number): Promise<SkaterScheduleStateArgs> {
        return new Promise(function (resolve, reject) {
            axios.get('/api/competitions/' + competition_id + "/skater-schedule").then(function (response) {
                if (response.data && response.data.sessions && response.data.events) {
                    let result: SkaterScheduleStateArgs = {
                        sessions: SessionDataAdaptor.adaptScheduledArray(response.data.sessions),
                        events: SkaterEventDataAdaptor.adaptArray(response.data.events)
                    };
                    resolve(result);
                }
                reject();
            }).catch(function () {
                reject();
            });
        });
    }

    /**
     * Retrieve the active skater's credits for the active competition
     */
    static getCompetitionCredits(competition_id: number): Promise<SkaterCredits> {
        return new Promise<SkaterCredits>(function (resolve, reject) {
            axios.get('/api/competitions/' + competition_id + "/skater-credits").then(function (response) {
                if (response.data) {
                    resolve(SkaterCreditDataAdaptor.adaptCompetitionCredits(response.data));
                }
                reject();
            }).catch(function () {
                reject();
            });
        });

    }

    /**
     * Add a session to skater's schedule.
     */
    static addSessionToSchedule(scheduled_session: ScheduledSession): Promise<void> {
        return new Promise(function (resolve, reject) {
            axios.post(
                '/api/skater/schedule/add-session',
                SkaterAPIAdaptor.adaptAddSession(scheduled_session)
            ).then(function (response) {
                if (response.data.success) {
                    resolve();
                }
                reject();
            }).catch(function () {
                reject();
            });
        });
    }

    /**
     * Remove a session from a skater's schedule. Increment credit.
     */
    static removeSessionFromSchedule(scheduled_session: ScheduledSession): Promise<void> {
        return new Promise(function (resolve, reject) {
            axios.post(
                '/api/skater/schedule/remove-session',
                SkaterAPIAdaptor.adaptRemoveSession(scheduled_session)
            ).then(function (response) {
                if (response.data.success) {
                    resolve();
                }
                reject();
            }).catch(function () {
                reject();
            });
        });
    }

    /**
     * Retrieve the skater-registered event ids for a competition
     */
    static getCompetitionRegisteredEventIDs(competition_id: number) {
        return new Promise<number[]>(function (resolve, reject) {
            axios.get('/api/competitions/' + competition_id + "/skater-event-ids").then(function (response) {
                if (response.data && typeof response.data === 'object') {
                    resolve((response.data));
                }
                reject();
            }).catch(function () {
                reject();
            });
        });
    }

    /**
     * Get all billing addresses for a skater
     *
     * Resolves with array of adapted BillingAddresses
     */
    static getBillingAddresses(): Promise<BillingAddress[]> {
        return new Promise(function (resolve, reject) {
            axios.get('/api/skater-addresses').then(function (response) {
                resolve(BillingAddressDataAdaptor.adaptArray(response.data));
            }).catch(function () {
                reject();
            });

        });
    }

    /**
     * Save edits to a billing address.
     *
     * Void resolution
     */
    static updateBillingAddress(edit_opts: { source: BillingAddress; data: BillingAddressFormData }): Promise<BillingAddress> {
        let {source} = edit_opts;
        let error_message = "Error saving address.";
        return new Promise(function (resolve, reject) {
            axios.post(
                '/api/skater-addresses/' + source.id + '/update',
                SkaterAPIAdaptor.adaptUpdateAddress(edit_opts)
            ).then(function (response: { data: UpdateBillingAddressAPIResponse }) {
                if (response.data.success && response.data.address) {
                    resolve(BillingAddressDataAdaptor.adapt(response.data.address));
                    return;
                }
                if (response.data.error) {
                    error_message = response.data.error;
                }
                reject(error_message);
            }).catch(function (error) {
                if (error.response.data && error.response.data.error) {
                    error_message = error.response.data.error;
                }
                reject(error_message);
            });
        });
    }

    /**
     * Create a new billing address.
     *
     * Expected server response - the ID of the created address
     *
     * Resolves with an adapted BillingAddress object
     */
    static createBillingAddress(create_opts: BillingAddressCreatePayload): Promise<BillingAddress> {
        let data = create_opts.data;
        let error_message = "Error saving address.";
        return new Promise(function (resolve, reject) {
            axios.post(
                '/api/skater-addresses/create',
                SkaterAPIAdaptor.adaptCreateAddress(data)
            ).then(function (response: { data: CreateBillingAddressAPIResponse }) {
                if (response.data.success && response.data.address) {
                    resolve(BillingAddressDataAdaptor.adapt(response.data.address));
                    return;
                }
                if (response.data.error) {
                    error_message = response.data.error;
                }
                reject(error_message);
            }).catch(function (error) {
                if (error.response.data && error.response.data.error) {
                    error_message = error.response.data.error;
                }
                reject(error_message);
            });
        });
    }

    /**
     * Get the skater's info
     * @deprecated 5/27/19 - this returned basic name and address info and has been superseded by User Profile info
     */
    static getSkaterInfo(): Promise<SkaterInfo> {
        return new Promise(function (resolve, reject) {
            axios.get('/api/skater/info').then(function (response) {
                resolve(SkaterInfoDataAdaptor.adapt(response.data));
            }).catch(function () {
                reject();
            });
        });
    }

    /**
     * Get the events a skater is registered for along with linked coaches for a given competition
     *
     * @deprecated 2020-07-28
     */
    static getCompetitionEventCoaches(competition_id: number): Promise<SkaterCoachedEventCategoryCollection> {
        return new Promise(function (resolve, reject) {
            axios.get('/api/competitions/' + competition_id + '/my-coaches').then(function (response) {
                if (response.data.event_categories) {
                    resolve(new SkaterCoachedEventCategoryCollection(SkaterEventDataAdaptor.adaptCoachedEventArray(response.data.event_categories)));
                }
                reject();
            }).catch(function () {
                reject();
            })
        });
    }

    /**
     * Remove a coach from a skater's competition event category
     */
    static removeCoach(payload: CoachRemovePayload) {
        let competition_id = payload.competition_id;
        return new Promise(function (resolve, reject) {
            axios.post(
                '/api/competitions/' + competition_id + '/my-coaches/remove',
                SkaterAPIAdaptor.adaptRemoveCoach(payload)
            ).then(function (response) {
                if (response.data.success) {
                    resolve();
                }
                reject();
            }).catch(function () {
                reject();
            });
        });
    }

    /**
     * Add a coach for an event category within a competition
     */
    static addCoach(payload: CoachAddPayload) {
        let competition_id = payload.competition_id;
        return new Promise(function (resolve, reject) {
            axios.post(
                '/api/competitions/' + competition_id + '/my-coaches/add',
                SkaterAPIAdaptor.adaptAddCoach(payload)
            ).then(function (response) {
                if (response.data.success) {
                    resolve();
                }
                reject();
            }).catch(function () {
                reject();
            });
        });
    }

    /**
     * Replace a coach for an event category within a competition
     */
    static replaceCoach(payload: CoachReplacePayload) {
        let competition_id = payload.competition_id;
        return new Promise(function (resolve, reject) {
            axios.post(
                '/api/competitions/' + competition_id + '/my-coaches/replace',
                SkaterAPIAdaptor.adaptReplaceCoach(payload)
            ).then(function (response) {
                if (response.data.success) {
                    resolve();
                }
                reject();
            }).catch(function () {
                reject();
            });
        });
    }

    static savePPC(payload: PPCSavePayload): Promise<PPCSaveResponse> {
        let competition_id = payload.competition_id;
        return new Promise(function (resolve, reject) {
            axios.post(
                CompetitionPortalApiService.transformMusicPpcUrl('ppc/save'),
                SkaterAPIAdaptor.adaptSavePPC(payload)
            ).then(function (response) {
                if (response.data.success) {
                    resolve(SkaterAPIAdaptor.adaptSavePPCResponse(response.data as PPCSaveResponse));
                }
                reject();
            }).catch(function () {
                reject();
            });
        });
    }

    static getPPC(fetch_args: PPCFetchArgs): Promise<PPC> {
        let {event_id, event_segment_id, competition_id} = fetch_args;
        return new Promise(function (resolve, reject) {
            axios.get(CompetitionPortalApiService.transformMusicPpcUrl('ppc'),
                {
                    params: fetch_args
                }).then(function (response) {
                if (response.data.ppc) {
                    let ppc = PPCDataAdaptor.adapt_PPCData_To_PPC(response.data.ppc);
                    resolve(ppc);
                }
                reject();
            }).catch(function () {
                reject();
            })
        });
    }

    static getSkatingEventSegments(competition_id: number): Promise<SkaterSkatingEventSegment[]> {
        return new Promise(function (resolve, reject) {
            axios.get('/api/competitions/' + competition_id + "/skater-event-segments").then(function (response) {
                try {
                    resolve(SkaterSkatingEventSegmentAdaptor.adaptEventSegmentsData(response.data));
                } catch (e) {
                    reject();
                }
                reject();
            }).catch(function () {
                reject();
            });
        });

    }

    static getEventSegmentMusic(fetch_args: MusicFetchArgs): Promise<EventSegmentMusic | null> {
        let competition_id = fetch_args.competition_id;
        return new Promise(function (resolve, reject) {
            axios.get(CompetitionPortalApiService.transformMusicPpcUrl('music'),
                {
                    params: fetch_args
                }).then(function (response) {
                try {
                    resolve(MusicDataAdaptor.adaptEventSegmentMusicDataToEventSegmentMusic(response.data));
                } catch (e) {
                    reject();
                }
            }).catch(function () {
                reject();
            })
        });
    }

    static saveEventSegmentMusic(save_payload: MusicSavePayload): Promise<MusicSaveResponse> {
        return new Promise(function (resolve, reject) {
            axios.post(
                CompetitionPortalApiService.transformMusicPpcUrl('music/save'),
                SkaterAPIAdaptor.adaptSaveMusic(save_payload)
            ).then(function (response) {
                if (response.data.success) {
                    resolve(SkaterAPIAdaptor.adaptSaveMusicResponse(response.data, save_payload));
                    return;
                }
                reject();
            }).catch(function () {
                reject();
            });
        });
    }

    static fetchMusicLibrary(): Promise<SavedMusic[]> {
        return new Promise(function (resolve, reject) {
            axios.get('/api/music-library').then(function (response) {
                if (response.data.library) {
                    resolve(MusicDataAdaptor.adaptMusicLibrary(response.data.library));
                }
                resolve();
            }).catch(function () {
                reject();
            })
        });
    }
    // @downstream-sync 2020-07-02 - import rhythm/theme feature
    static fetchRhythms(fetch_args: MusicFetchArgs): Promise<string[]> {
        let competition_id = fetch_args.competition_id; // @downstream-sync 2020-07-02 - it looks like there was a bug here.  Added ".competition_id"
        return new Promise(function (resolve, reject) {
            axios.get(CompetitionPortalApiService.transformMusicPpcUrl('rhythms'), { params: fetch_args }).then(function (response) {
                if (response.data.rhythms) {
                    resolve(response.data.rhythms);
                }
                reject();
            }).catch(function () {
                reject();
            })
        });
    }
    // @downstream-sync 2020-07-02 - import rhythm/theme feature
    static saveRhythms(payload: RhythmSavePayload): Promise<RhythmSaveResponse> {
        let competition_id = payload.competition_id;
        return new Promise(function (resolve, reject) {
            axios.post(
                CompetitionPortalApiService.transformMusicPpcUrl('rhythms/save'),
                payload
            ).then(function (response) {
                if (response.data.success) {
                    resolve(response.data as RhythmSaveResponse);
                }
                reject();
            }).catch(function () {
                reject();
            });
        });
    }
    // @downstream-sync 2020-07-02 - import rhythm/theme feature
    static fetchTheme(fetch_args: MusicFetchArgs): Promise<string> {
        let competition_id = fetch_args.competition_id;
        return new Promise(function (resolve, reject) {
            axios.get(CompetitionPortalApiService.transformMusicPpcUrl('theme'), { params: fetch_args }).then(function (response) {
                if (response.data.theme !== null && response.data.theme !== undefined) {
                    resolve(response.data.theme);
                }
                reject();
            }).catch(function () {
                reject();
            })
        });
    }
    // @downstream-sync 2020-07-02 - import rhythm/theme feature
    static saveTheme(payload: ThemeSavePayload): Promise<ThemeSaveResponse> {
        let competition_id = payload.competition_id;
        return new Promise(function (resolve, reject) {
            axios.post(
                CompetitionPortalApiService.transformMusicPpcUrl('theme/save'),
                payload
            ).then(function (response) {
                if (response.data.success) {
                    resolve(response.data as ThemeSaveResponse);
                }
                reject();
            }).catch(function () {
                reject();
            });
        });
    }
}
