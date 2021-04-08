import {CopyrightFormData, ExportedMusic, MusicFile} from "../../contracts/app/MusicContracts";
import {MusicCopyright} from "./MusicCopyright";

export interface MusicParams {
    has_been_played: boolean;
    name: string;
    copyrights: MusicCopyright[];
    file: MusicFile | null;
    active_copyright_context_id: number
}

export class Music {
    [key: string]: any;
    protected _has_been_played: boolean = false;
    protected _name: string = "";
    protected _copyrights: MusicCopyright[] = [];
    protected _file: MusicFile | null = null;
    protected active_copyright_context_id = 1;

    constructor(parameters?: MusicParams) {
        if (parameters) {
            this._name = parameters.name;
            this._has_been_played = parameters.has_been_played;
            this._copyrights = parameters.copyrights;
            this._file = parameters.file;
            this.active_copyright_context_id = parameters.active_copyright_context_id
        }
    }

    get file(): MusicFile | null {
        return this._file;
    }

    set file(value: MusicFile | null) {
        this._file = value;
    }

    get copyrights(): MusicCopyright[] {
        return this._copyrights;
    }

    get has_been_played(): boolean {
        return this._has_been_played;
    }

    set has_been_played(value: boolean) {
        this._has_been_played = value;
    }

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }

    /**
     * Update the copyright at a given index with new data.
     *
     * Replaces existing copyright instance
     */
    updateCopyright(copyright_data: CopyrightFormData, copyright_index: number) {
        let context_id = this.getCopyrightContextIDByIndex(copyright_index);
        let copyright = MusicCopyright.createFromFormData(copyright_data, context_id);
        this._copyrights.splice(copyright_index, 1, copyright);
    }

    /**
     * Remove a copyright item
     */
    removeCopyright(copyright_index: number) {
        this._copyrights.splice(copyright_index, 1);
    }

    /**
     * Create a deep copy
     */
    public clone(): Music {
        let args: MusicParams = this.getCloneArgs();
        return new Music(args);
    }

    /**
     * Compare to another instance to determine if they're equivalent
     */
    public equals(compare: Music): boolean {
        let top_level_properties = [
            'has_been_played',
            'name'
        ];
        for (let i = 0; i < top_level_properties.length; i++) {
            let prop = top_level_properties[i];
            if (this[prop] !== compare[prop]) {
                return false;
            }
        }
        if (!this.files_equivalent(compare.file)) {
            return false;
        }
        if (this.copyrights.length !== compare.copyrights.length) {
            return false;
        }
        for (let i = 0; i < this.copyrights.length; i++) {
            let copyright = this.copyrights[i];
            if (!copyright.equals(compare.copyrights[i])) {
                return false;
            }
        }

        return true;
    }

    /**
     * Music files are equivalent if
     * 1. They're both set and the ids are the same
     * 2. They're both null
     */
    files_equivalent(compare_music_file_prop: MusicFile | null): boolean {
        if (this.file && compare_music_file_prop) {
            return this.file.id === compare_music_file_prop.id;
        }
        return this.file === null && compare_music_file_prop === null;
    }

    /**
     * Export data to transferable object
     */
    export(): ExportedMusic {
        return {
            has_been_played: this._has_been_played,
            name: this._name,
            copyrights: this._copyrights.map(function (copyright: MusicCopyright) {
                return copyright.export();
            }),
            // @downstream-sync 2020-07-02 - downstream music items have id:string typing
            file: this.file ? this.file : {id: "", url: ""}
        }
    }

    /**
     * Get the arguments from the instance for creating a clone
     */
    public getCloneArgs(): MusicParams {
        return {
            has_been_played: this._has_been_played,
            name: this._name,
            copyrights: this._copyrights.map(function (copyright: MusicCopyright) {
                return copyright.clone();
            }),
            file: this.file ? {...this.file} : null,
            active_copyright_context_id: this.active_copyright_context_id
        };
    }

    /**
     * Get the context ID for a copyright based on its index
     */
    protected getCopyrightContextIDByIndex(copyright_index: number) {
        let existing_copyright = this._copyrights[copyright_index];
        if (existing_copyright) {
            return existing_copyright.context_id;
        }
        return this.active_copyright_context_id++;
    }
}