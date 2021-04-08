import {CopyrightFormData, ExportedCopyright} from "../../contracts/app/MusicContracts";

export type MusicCopyrightParams = {
    title: string | null,
    artist: string | null,
    arrangement: string | null,
    record_label: string | null,
    duration_minutes: number | null,
    duration_seconds: number | null
    context_id: number

};

/**
 * A copyright on a Music instance
 * @property context_id - Unique identifier for Copyright within its parent context (eg: parent Music class)
 */
export class MusicCopyright {
    [key: string]: string | number | null | Function;
    context_id: number;
    title: string | null = null;
    artist: string | null = null;
    arrangement: string | null = null;
    record_label: string | null = null;
    duration_minutes: number | null = null;
    duration_seconds: number | null = null;

    constructor(parameters: MusicCopyrightParams) {
        let {context_id, title, artist, arrangement, record_label, duration_minutes, duration_seconds} = parameters;
        this.artist = artist;
        this.arrangement = arrangement;
        this.record_label = record_label;
        this.duration_minutes = duration_minutes;
        this.duration_seconds = duration_seconds;
        this.title = title;
        this.context_id = context_id;
    }

    get duration(): string | null {
        if (!this.duration_minutes && !this.duration_seconds) {
            return null;
        }
        let duration_minutes_formatted = this.duration_minutes ? this.duration_minutes : "0";
        let duration_seconds_formatted = "00";
        if (this.duration_seconds) {
            duration_seconds_formatted = String(this.duration_seconds);
            if (this.duration_seconds < 10 && String(this.duration_seconds).length != 2) {
                duration_seconds_formatted = "0" + this.duration_seconds;
            }
        }

        return duration_minutes_formatted + ":" + duration_seconds_formatted;
    }

    /**
     * Create an instance from Copyright Form data
     */
    static createFromFormData(form_data: CopyrightFormData, context_id: number): MusicCopyright {
        let {title, artist, arrangement, record_label, duration_minutes, duration_seconds} = form_data;
        if (typeof duration_seconds === "string") {
            duration_seconds = parseInt(duration_seconds);
        }
        if (typeof duration_minutes === "string") {
            duration_minutes = parseInt(duration_minutes);
        }
        let args: MusicCopyrightParams = {
            title,
            artist,
            arrangement,
            record_label,
            duration_minutes,
            duration_seconds,
            context_id
        };
        return new MusicCopyright(args)
    }

    /**
     * Get Copyright Form data from the instance
     */
    getFormData(): CopyrightFormData {
        return {
            title: this.title,
            artist: this.artist,
            arrangement: this.arrangement,
            record_label: this.record_label,
            duration_minutes: this.duration_minutes,
            duration_seconds: this.duration_seconds,
        }
    }

    /**
     * Make a deep copy of the instance
     */
    clone(): MusicCopyright {
        let args: MusicCopyrightParams = {
            title: this.title,
            artist: this.artist,
            arrangement: this.arrangement,
            record_label: this.record_label,
            duration_minutes: this.duration_minutes,
            duration_seconds: this.duration_seconds,
            context_id: this.context_id
        };
        return new MusicCopyright(args);
    }

    /**
     * Compare with another copyright to determine if they're equivalent
     */
    equals(compare: MusicCopyright): boolean {
        let keys = Object.keys(this);
        for (let i = 0; i < keys.length; i++) {
            let key = keys[i];
            if (this[key] !== compare[key]) {
                return false;
            }
        }
        return true;
    }

    /**
     * Export to a transferable data object
     */
    export(): ExportedCopyright {
        return {
            title: this.title,
            artist: this.artist,
            arrangement: this.arrangement,
            record_label: this.record_label,
            duration_minutes: this.duration_minutes,
            duration_seconds: this.duration_seconds,
        };
    }
}