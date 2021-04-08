import { ThemeSaveResponse } from './../contracts/app/MusicContracts';  // @downstream-sync 2020-07-02 - import rhythm/theme feature
import {DateFormatAbridgedYear} from "../helpers/time";
import {PPCSaveResponse} from "../contracts/app/PPCContracts";
import {MusicSaveResponse, RhythmSaveResponse} from "../contracts/app/MusicContracts";  // @downstream-sync 2020-07-02 - import rhythm/theme feature

export type SkaterSkatingEventSegmentParams = {
    event_name: string;
    segment_name: string;
    event_id: number;
    segment_id: number;
    ppc_required: boolean;
    music_required: boolean;
    rhythm_required: boolean;  // @downstream-sync 2020-07-02 - import rhythm/theme feature
    theme_required: boolean;  // @downstream-sync 2020-07-02 - import rhythm/theme feature
    is_ppc_complete: boolean;
    is_music_complete: boolean;
    is_rhythm_complete: boolean;  // @downstream-sync 2020-07-02 - import rhythm/theme feature
    is_theme_complete: boolean;  // @downstream-sync 2020-07-02 - import rhythm/theme feature
    ppc_last_modified_timestamp: number | null;
    music_last_modified_timestamp: number | null;
    competition_skated_event_id: number;
    rhythms: string[];  // @downstream-sync 2020-07-02 - import rhythm/theme feature
    theme: string;  // @downstream-sync 2020-07-02 - import rhythm/theme feature
};

export class SkaterSkatingEventSegment {
    event_name: string;
    segment_name: string;
    event_id: number;
    segment_id: number;
    ppc_required: boolean;
    music_required: boolean;
    rhythm_required: boolean;  // @downstream-sync 2020-07-02 - import rhythm/theme feature
    theme_required: boolean;  // @downstream-sync 2020-07-02 - import rhythm/theme feature
    is_ppc_complete: boolean;
    is_music_complete: boolean;
    is_rhythm_complete: boolean;  // @downstream-sync 2020-07-02 - import rhythm/theme feature
    is_theme_complete: boolean;  // @downstream-sync 2020-07-02 - import rhythm/theme feature
    ppc_last_modified_date: Date | null = null;
    ppc_last_modified: string | null = null;
    music_last_modified_date: Date | null = null;
    music_last_modified: string | null = null;
    competition_skated_event_id: number;
    rhythms: string[];  // @downstream-sync 2020-07-02 - import rhythm/theme feature
    theme: string;  // @downstream-sync 2020-07-02 - import rhythm/theme feature
    private _ppc_last_modified_timestamp: number | null = null;
    private _music_last_modified_timestamp: number | null = null;

    constructor(parameters: SkaterSkatingEventSegmentParams) {
        // @downstream-sync 2020-07-02 - import rhythm/theme feature
        let { event_name, segment_name, event_id, segment_id, ppc_required, music_required, rhythm_required, theme_required, is_ppc_complete, is_music_complete, is_rhythm_complete, is_theme_complete, ppc_last_modified_timestamp, music_last_modified_timestamp, competition_skated_event_id, rhythms, theme } = parameters;
        this.event_name = event_name;
        this.segment_name = segment_name;
        this.event_id = event_id;
        this.segment_id = segment_id;
        this.ppc_required = ppc_required;
        this.music_required = music_required;
        this.rhythm_required = rhythm_required;  // @downstream-sync 2020-07-02 - import rhythm/theme feature
        this.theme_required = theme_required;  // @downstream-sync 2020-07-02 - import rhythm/theme feature
        this.is_ppc_complete = is_ppc_complete;
        this.is_music_complete = is_music_complete;
        this.is_rhythm_complete = is_rhythm_complete;  // @downstream-sync 2020-07-02 - import rhythm/theme feature
        this.is_theme_complete = is_theme_complete;  // @downstream-sync 2020-07-02 - import rhythm/theme feature
        this.competition_skated_event_id = competition_skated_event_id;
        this.ppc_last_modified_timestamp = ppc_last_modified_timestamp;
        this.music_last_modified_timestamp = music_last_modified_timestamp;
        this.rhythms = rhythms;  // @downstream-sync 2020-07-02 - import rhythm/theme feature
        this.theme = theme;  // @downstream-sync 2020-07-02 - import rhythm/theme feature
    }

    set music_last_modified_timestamp(value: number | null) {
        this._music_last_modified_timestamp = value;
        this.music_last_modified_date = value ? new Date(value) : null;
        this.music_last_modified = SkaterSkatingEventSegment.formatModifiedDate(this.music_last_modified_date);
    }

    set ppc_last_modified_timestamp(value: number | null) {
        this._ppc_last_modified_timestamp = value;
        this.ppc_last_modified_date = value ? new Date(value) : null;
        this.ppc_last_modified = SkaterSkatingEventSegment.formatModifiedDate(this.ppc_last_modified_date);

    }

    private static formatModifiedDate(date: Date | null): string | null {
        if (!date) {
            return null;
        }

        return DateFormatAbridgedYear(date);
    }

    handlePPCUpdate(save_response: PPCSaveResponse) {
        this.is_ppc_complete = save_response.is_complete;
        this.ppc_last_modified_timestamp = save_response.last_modified;
    }

    handleMusicUpdate(save_response: MusicSaveResponse) {
        this.is_music_complete = save_response.is_complete;
        this.music_last_modified_timestamp = save_response.last_modified;
    }

    // @downstream-sync 2020-07-02 - import rhythm/theme feature
    handleRhythmUpdate(save_response: RhythmSaveResponse) {
        this.is_rhythm_complete = save_response.is_complete;
        this.rhythms = save_response.rhythms;
    }

    // @downstream-sync 2020-07-02 - import rhythm/theme feature
    handleThemeUpdate(save_response: ThemeSaveResponse) {
        this.is_theme_complete = save_response.is_complete;
        this.theme = save_response.theme;
    }
}
