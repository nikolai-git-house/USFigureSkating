import {EventSegmentMusic, EventSegmentMusicParameters} from '../models/Music/EventSegmentMusic';
import {
    EventSegmentMusicData,
    FileData,
    MusicCopyrightData,
    MusicFileUploadErrorResponse,
    MusicFileUploadSuccessResponse,
    SavedMusicData
} from '../contracts/data/MusicDataContracts';
import {Music, MusicParams} from '../models/Music/Music';
import {MusicCopyright, MusicCopyrightParams} from '../models/Music/MusicCopyright';
import {MusicFile, UploadedFileError, UploadedFileSuccess} from '../contracts/app/MusicContracts';
import {SavedMusic, SavedMusicParams} from '../models/Music/SavedMusic';

export class MusicDataAdaptor {
    static adaptEventSegmentMusicDataToSavedMusic(data: { music: SavedMusicData | null; }): SavedMusic | null {
        if (!('music' in data)) {
            throw 'Invalid data';
        }
        if (!data.music) {
            return null;
        }

        return MusicDataAdaptor.adaptSavedMusicDataToSavedMusic(data.music);
    }

    static adaptEventSegmentMusicDataToEventSegmentMusic(data: EventSegmentMusicData): EventSegmentMusic | null {
        const required_properties = [
            'music',
            'competition_id',
            'event_id',
            'event_segment_id',
            'competition_skated_event_id'
        ];
        for (let i = 0; i < required_properties.length; i++) {
            const obj = required_properties[i];
            if (!(obj in data)) {
                throw 'Invalid data';
            }
        }
        if (!data.music) {
            return null;
        }
        const args: EventSegmentMusicParameters = {
            competition_id: parseInt(String(data.competition_id)),
            event_id: parseInt(String(data.event_id)),
            event_segment_id: parseInt(String(data.event_segment_id)),
            competition_skated_event_id: parseInt(String(data.competition_skated_event_id)),
            music: MusicDataAdaptor.adaptSavedMusicDataToSavedMusic(data.music)
        };

        return new EventSegmentMusic(args);
    }

    static adaptMusicCopyrightDataToMusicCopyright(data: MusicCopyrightData, context_id: number): MusicCopyright {
        if (typeof data.duration_minutes === 'string') {
            data.duration_minutes = parseInt(data.duration_minutes);
        }
        if (typeof data.duration_seconds === 'string') {
            data.duration_seconds = parseInt(data.duration_seconds);
        }
        const args: MusicCopyrightParams = {
            title: data.title,
            artist: data.artist,
            arrangement: data.arrangement,
            record_label: data.record_label,
            duration_minutes: data.duration_minutes,
            duration_seconds: data.duration_seconds,
            context_id
        };

        return new MusicCopyright(args);
    }

    /**
     * Adapt the response from uploading a music file
     */
    static adaptMusicFileUploadResponse(data: MusicFileUploadSuccessResponse | MusicFileUploadErrorResponse): UploadedFileSuccess | UploadedFileError {
        if (data.success) {
            return {
                success: true,
                file: data.file,
                metadata: data.metadata
            };
        }

        return {
            success: false,
            error: true,
            message: data.error_message
        };
    }

    static adaptMusicLibrary(library: SavedMusicData[]) {
        return library.map(function (music_data: SavedMusicData) {
            return MusicDataAdaptor.adaptSavedMusicDataToSavedMusic(music_data);
        });
    }

    static adaptSavedMusicDataToMusic(saved_music_data: SavedMusicData): Music {
        const params: MusicParams = {
            name: saved_music_data.name,
            has_been_played: saved_music_data.has_been_played,
            copyrights: saved_music_data.copyrights.map(function (copyright_data: MusicCopyrightData, index: number) {
                return MusicDataAdaptor.adaptMusicCopyrightDataToMusicCopyright(copyright_data, index + 1);
            }),
            file: MusicDataAdaptor.adaptFileDataToFile(saved_music_data.file),
            active_copyright_context_id: saved_music_data.copyrights.length + 1
        };

        return new Music(params);
    }

    static adaptSavedMusicDataToSavedMusic(saved_music_data: SavedMusicData): SavedMusic {
        const args: SavedMusicParams = {
            name: saved_music_data.name,
            has_been_played: saved_music_data.has_been_played,
            copyrights: saved_music_data.copyrights.map(function (copyright_data: MusicCopyrightData, index: number) {
                return MusicDataAdaptor.adaptMusicCopyrightDataToMusicCopyright(copyright_data, index + 1);
            }),
            file: MusicDataAdaptor.adaptFileDataToFile(saved_music_data.file),
            is_assigned_to_program: saved_music_data.is_assigned_to_program,
            // @downstream-sync 2020-07-02 - downstream music items have id:string typing
            id: saved_music_data.id,
            active_copyright_context_id: saved_music_data.copyrights.length + 1
        };

        return new SavedMusic(args);
    }

    private static adaptFileDataToFile(file: FileData | null): MusicFile | null {
        if (!file) {
            return null;
        }

        return {
            url: file.url,
            id: file.id
        };
    }
}