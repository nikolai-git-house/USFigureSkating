import {Music, MusicParams} from "./Music";
import {MusicCopyright} from "./MusicCopyright";
import {ExportedSavedMusic} from "../../contracts/app/MusicContracts";

export interface SavedMusicParams extends MusicParams {
    is_assigned_to_program: boolean;
    // @downstream-sync 2020-07-02 - downstream music items have id:string typing
    id: string
}

/**
 * Music that has been saved on the backend to the user's library
 */
export class SavedMusic extends Music {
    protected _has_been_played: boolean = true;
    private _is_assigned_to_program: boolean;
    // @downstream-sync 2020-07-02 - downstream music items have id:string typing
    private _id: string;

    constructor(parameters: SavedMusicParams) {
        super(parameters);
        this._id = parameters.id;
        this._has_been_played = true;
        this._is_assigned_to_program = parameters.is_assigned_to_program;
    }
    // @downstream-sync 2020-07-02 - downstream music items have id:string typing
    get id(): string {
        return this._id;
    }

    get is_assigned_to_program(): boolean {
        return this._is_assigned_to_program;
    }
    // @downstream-sync 2020-07-02 - downstream music items have id:string typing
    static createFromMusic(music: Music, id: string): SavedMusic {
        let args: SavedMusicParams = {
            ...music.getCloneArgs(),
            is_assigned_to_program: true,
            id: id
        };
        return new SavedMusic(args);
    }

    public clone(): SavedMusic {
        let args: SavedMusicParams = {
            id: this.id,
            name: this._name,
            has_been_played: this._has_been_played,
            copyrights: this._copyrights.map(function (copyright: MusicCopyright) {
                return copyright.clone();
            }),
            file: this.file ? {...this.file} : null,
            is_assigned_to_program: this.is_assigned_to_program,
            active_copyright_context_id: this.active_copyright_context_id
        };
        return new SavedMusic(args);
    }

    export(): ExportedSavedMusic {
        let base = super.export();
        return {
            ...base,
            id: this.id
        }
    }

}