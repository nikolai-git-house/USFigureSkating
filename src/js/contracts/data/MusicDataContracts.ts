export type EventSegmentMusicData = {
    competition_id: number;
    event_id: number;
    event_segment_id: number;
    competition_skated_event_id: number;
    music: SavedMusicData | null;
}

/**
 * Represents information about a file.
 *
 */
export type FileData = {
    url: string;     // The URL to the file
    // @downstream-sync 2020-07-02 - downstream music items have id:string typing
    id: string;      // Unique identifier for the file
}

/**
 * Represents a saved music item
 */
export interface SavedMusicData {
    // @downstream-sync 2020-07-02 - downstream music items have id:string typing
    id: string;                           // Unique identifier for the saved music
    name: string;                         // Name of the music
    has_been_played: boolean;             // Whether the music has been played by the user following upload
    is_assigned_to_program: boolean;      // Whether the music has been assigned to a program.  Music assigned to a program cannot be deleted
    copyrights: MusicCopyrightData[];     // List of copyrights for the music. Used when editing music
    file: FileData | null;                // Information about the audio file for the music
}

/**
 * Represents copyright information associated with a Music item
 */
export type MusicCopyrightData = {
    title: string | null;                         // The title of the music
    artist: string | null;                        // The artist of the music
    arrangement: string | null;                   // The arrangement credit for the music
    record_label: string | null;                  // The label for the music
    duration_minutes: number | null | string;     // The duration of the music's minutes
    duration_seconds: number | null | string;     // The duration of the music's seconds
}

export interface MusicFileUploadResponse {
    success: boolean;
    error: boolean;
    error_message?: string;
}

export interface MusicFileUploadSuccessResponse extends MusicFileUploadResponse {
    success: true;
    error: false;
    metadata: {
        name?: string;
    };
    file: {
        // @downstream-sync 2020-07-02 - downstream music items have id:string typing
        id: string;
        url: string;
    };
}

export interface MusicFileUploadErrorResponse extends MusicFileUploadResponse {
    success: false;
    error: true;
    error_message: string;
}

export type MusicSaveResponseData = {
    success: boolean;
    is_complete: boolean;
    last_modified: number | null;
    // @downstream-sync 2020-07-02 - downstream music items have id:string typing
    music_item_id: string;
}

export type MusicSaveAPIPayload = {
    competition_id: number;
    event_id: number;
    event_segment_id: number;
    competition_skated_event_id: number;
    music: {
        name: string;
        has_been_played: boolean;
        copyrights: {
            title: string | null;
            artist: string | null;
            arrangement: string | null;
            record_label: string | null;
            duration_minutes: number | null;
            duration_seconds: number | null;
        }[];
        file: {
            // @downstream-sync 2020-07-02 - downstream music items have id:string typing
            id: string;
            url: string;
        };
    };
}