import {Music} from "../../models/Music/Music";
import {EventSegmentMusic} from "../../models/Music/EventSegmentMusic";

export type MusicFetchArgs = {
    competition_id: number;
    event_id: number;
    event_segment_id: number;
    competition_skated_event_id: number;
}

export type UploadedFileSuccess = {
    success: true;
    metadata: {
        name?: string;
    };
    file: {
        // @downstream-sync 2020-07-02 - downstream music items have id:string typing
        id: string;
        url: string
    };
}
export type UploadedFileError = {
    success: false;
    error: true;
    message: string;
}

export type MusicFile = {
    // @downstream-sync 2020-07-02 - downstream music items have id:string typing
    id: string;
    url: string;
}

export type CopyrightFormData = {
    title: string | null;
    artist: string | null;
    arrangement: string | null;
    record_label: string | null;
    duration_minutes: number | string | null;
    duration_seconds: number | string | null;
}

export type MusicSaveResponse = {
    success: boolean;
    is_complete: boolean;
    last_modified: number | null;
    event_segment_music: EventSegmentMusic;
}

export type ExportedCopyright = {
    title: string | null;
    artist: string | null;
    arrangement: string | null;
    record_label: string | null;
    duration_minutes: number | null;
    duration_seconds: number | null;
}

export interface ExportedMusic {
    name: string;
    has_been_played: boolean;
    copyrights: ExportedCopyright[];
    file: MusicFile;
}

export interface ExportedSavedMusic extends ExportedMusic {
    // @downstream-sync 2020-07-02 - downstream music items have id:string typing
    id: string;
}

export type MusicSavePayload = {
    competition_id: number;
    event_id: number;
    event_segment_id: number;
    competition_skated_event_id: number;
    music: Music;
}

export type CopyrightUpdatePayload = {
    copyright_data: CopyrightFormData;
    index: number;
}

// @downstream-sync 2020-07-02 - import rhythm/theme feature
export type RhythmSavePayload = {
    competition_id: number;
    event_id: number;
    event_segment_id: number;
    competition_skated_event_id: number;
    rhythms: string[];
}

// @downstream-sync 2020-07-02 - import rhythm/theme feature
export type RhythmSaveResponse = {
    success: boolean;
    is_complete: boolean;
    rhythms: string[];
}

// @downstream-sync 2020-07-02 - import rhythm/theme feature
export type ThemeSavePayload = {
    competition_id: number;
    event_id: number;
    event_segment_id: number;
    competition_skated_event_id: number;
    theme: string;
}

// @downstream-sync 2020-07-02 - import rhythm/theme feature
export type ThemeSaveResponse = {
    success: boolean;
    is_complete: boolean;
    theme: string;
}