import {ScheduledSession} from "../../models/Sessions/ScheduledSession";
import {BillingAddress} from "../../models/BillingAddress";
import {CoachAddPayload, CoachRemovePayload, CoachReplacePayload} from "../../contracts/AppContracts";
import {PPCSaveAPIPayload, PPCSavePayload, PPCSaveResponse} from "../../contracts/app/PPCContracts";
import {MusicSavePayload, MusicSaveResponse} from "../../contracts/app/MusicContracts";
import {MusicSaveAPIPayload, MusicSaveResponseData} from "../../contracts/data/MusicDataContracts";
import {EventSegmentMusic} from "../../models/Music/EventSegmentMusic";
import {SavedMusic} from "../../models/Music/SavedMusic";
import {BillingAddressFormData} from "../../models/BillingAddressFormState";
import {
    CreateBillingAddressAPIPayload,
    UpdateBillingAddressAPIPayload
} from "../../contracts/release3/api/SkaterServiceAPIContracts";
import {BillingAddressSubmitData} from "../../contracts/release3/data/BillingAddressDataContracts";


/**
 * Adapt App Data for Consumption by API
 */
export class SkaterAPIAdaptor {

    static adaptAddSession(scheduled_session: ScheduledSession) {
        return {
            scheduled_as: scheduled_session.scheduled_as,
            scheduled_event_id: scheduled_session.scheduled_event_id,
            session_id: scheduled_session.session.id,

        }
    }

    static adaptRemoveSession(scheduled_session: ScheduledSession) {
        return {
            scheduled_as: scheduled_session.scheduled_as,
            scheduled_event_id: scheduled_session.scheduled_event_id,
            session_id: scheduled_session.session.id,
        }
    }

    static adaptBillingAddressFormDataToBillingAddressSubmitData(data: BillingAddressFormData): BillingAddressSubmitData {
        return {
            ...data,
            street_2: data.street_2 ? data.street_2 : null,
            state: data.state ? data.state : null,
            province: data.province ? data.province : null,
        }
    }

    static adaptUpdateAddress(edit_opts: { source: BillingAddress; data: BillingAddressFormData }): UpdateBillingAddressAPIPayload {
        let {source, data} = edit_opts;
        return {
            source,
            data: SkaterAPIAdaptor.adaptBillingAddressFormDataToBillingAddressSubmitData(data)
        }
    }

    static adaptCreateAddress(data: BillingAddressFormData): CreateBillingAddressAPIPayload {
        return SkaterAPIAdaptor.adaptBillingAddressFormDataToBillingAddressSubmitData(data);
    }

    static adaptRemoveCoach(payload: CoachRemovePayload) {
        return {
            competition_id: payload.competition_id,
            coach_id: payload.coach.id,
            event_category_id: payload.event_category_id
        }
    }

    static adaptAddCoach(payload: CoachAddPayload) {
        return {
            competition_id: payload.competition_id,
            coach_id: payload.coach.id,
            event_category_id: payload.event_category_id
        }
    }

    static adaptReplaceCoach(payload: CoachReplacePayload) {
        return {
            competition_id: payload.competition_id,
            replacement_coach_id: payload.coach.id,
            event_category_id: payload.event_category_id,
            previous_coach_id: payload.previous_coach_id
        }
    }

    static adaptSavePPC(payload: PPCSavePayload): PPCSaveAPIPayload {
        return {
            ppc: payload.ppc.export(),
            event_id: payload.event_id,
            event_segment_id: payload.segment_id,
            competition_id: payload.competition_id,
            competition_skated_event_id: payload.competition_skated_event_id
        }
    }

    static adaptSavePPCResponse(save_response: PPCSaveResponse): PPCSaveResponse {
        if (save_response.last_modified) {
            save_response.last_modified *= 1000;
        }
        return {
            ...save_response
        }
    }

    static adaptSaveMusic(save_payload: MusicSavePayload): MusicSaveAPIPayload {
        return {
            ...save_payload,
            music: save_payload.music.export()
        }

    }

    static adaptSaveMusicResponse(save_response: MusicSaveResponseData, save_payload: MusicSavePayload): MusicSaveResponse {
        // @downstream-sync 2020-07-02 - downstream music items have id:string typing
        let saved_music = SavedMusic.createFromMusic(save_payload.music, save_response.music_item_id);

        let event_segment_music = new EventSegmentMusic({
            ...save_payload,
            music: saved_music
        });


        return {
            success: save_response.success,
            is_complete: save_response.is_complete,
            last_modified: save_response.last_modified ? save_response.last_modified * 1000 : save_response.last_modified,
            event_segment_music
        }
    }
}
