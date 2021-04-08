import {SkaterSkatingEventSegment, SkaterSkatingEventSegmentParams} from "../models/SkaterSkatingEventSegment";
import {SkaterSkatingEventSegmentData} from "../contracts/data/DataContracts";

export class SkaterSkatingEventSegmentAdaptor {
    static adaptArray(raw_data: SkaterSkatingEventSegmentData[]): SkaterSkatingEventSegment[] {
        return raw_data.map(function (raw_datum: SkaterSkatingEventSegmentData) {
            return SkaterSkatingEventSegmentAdaptor.adapt(raw_datum);
        });
    }

    static adaptEventSegmentsData(raw_data: { skater_event_segments: SkaterSkatingEventSegment[] }) {
        if (raw_data.skater_event_segments && typeof raw_data.skater_event_segments === "object") {
            return SkaterSkatingEventSegmentAdaptor.adaptArray(raw_data.skater_event_segments);
        }
        throw("Invalid event segment data");
    }

    static adapt(raw_data: SkaterSkatingEventSegmentData): SkaterSkatingEventSegment {
        let required_fields = [
            'event_name',
            'segment_name',
            'event_id',
            'segment_id',
            'ppc_required',
            'music_required',
            'rhythm_required',  // @downstream-sync 2020-07-02 - import rhythm/theme feature
            'theme_required',  // @downstream-sync 2020-07-02 - import rhythm/theme feature
            'is_ppc_complete',
            'is_music_complete',
            'is_rhythm_complete',  // @downstream-sync 2020-07-02 - import rhythm/theme feature
            'is_theme_complete',  // @downstream-sync 2020-07-02 - import rhythm/theme feature
            'competition_skated_event_id',
            'ppc_last_modified_timestamp',
            'music_last_modified_timestamp',
            'rhythms',  // @downstream-sync 2020-07-02 - import rhythm/theme feature
            'theme'  // @downstream-sync 2020-07-02 - import rhythm/theme feature
        ];

        for (let i = 0; i < required_fields.length; i++) {
            let param = required_fields[i];
            if (!(param in raw_data)) {
                throw("Invalid event segment data");
            }
        }
        let args: SkaterSkatingEventSegmentParams = {
            event_name: raw_data.event_name,
            segment_name: raw_data.segment_name,
            event_id: raw_data.event_id,
            segment_id: raw_data.segment_id,
            ppc_required: raw_data.ppc_required,
            music_required: raw_data.music_required,
            rhythm_required: raw_data.rhythm_required,  // @downstream-sync 2020-07-02 - import rhythm/theme feature
            theme_required: raw_data.theme_required,  // @downstream-sync 2020-07-02 - import rhythm/theme feature
            is_ppc_complete: raw_data.is_ppc_complete,
            is_music_complete: raw_data.is_music_complete,
            is_rhythm_complete: raw_data.is_rhythm_complete,  // @downstream-sync 2020-07-02 - import rhythm/theme feature
            is_theme_complete: raw_data.is_theme_complete,  // @downstream-sync 2020-07-02 - import rhythm/theme feature
            ppc_last_modified_timestamp: raw_data.ppc_last_modified_timestamp ? raw_data.ppc_last_modified_timestamp * 1000 : null,
            music_last_modified_timestamp: raw_data.music_last_modified_timestamp ? raw_data.music_last_modified_timestamp * 1000 : null,
            competition_skated_event_id: raw_data.competition_skated_event_id,
            rhythms: raw_data.rhythms,  // @downstream-sync 2020-07-02 - import rhythm/theme feature
            theme: raw_data.theme  // @downstream-sync 2020-07-02 - import rhythm/theme feature
        };
        return new SkaterSkatingEventSegment(args);
    }
}

