import {SavedMusic} from "../Music/SavedMusic";
import {MusicFetchArgs} from "../../contracts/app/MusicContracts";
import {EventSegmentMusic} from "../Music/EventSegmentMusic";

export class EventSegmentMusicCollection {
    private keyed_items: { [key: string]: EventSegmentMusic } = {};

    /**
     * Generate the key for internal keyed items from fetch args
     */
    static fetchArgsToKey(fetch_args: MusicFetchArgs): string {
        return fetch_args.competition_id + "," + fetch_args.event_id + "," + fetch_args.event_segment_id;
    }

    /**
     * Add item to collection and keyed collection
     */
    add(item: EventSegmentMusic): void {
        let {competition_id, event_id, event_segment_id, competition_skated_event_id} = item;
        let key = EventSegmentMusicCollection.fetchArgsToKey({
            competition_id,
            event_id,
            event_segment_id,
            competition_skated_event_id
        });
        this.keyed_items[key] = item;
    }

    /**
     * Search for an item by fetch args
     */
    find(fetch_args: MusicFetchArgs): EventSegmentMusic | null {
        let key = EventSegmentMusicCollection.fetchArgsToKey(fetch_args);
        if (this.keyed_items.hasOwnProperty(key)) {
            return this.keyed_items[key];
        }
        return null;
    }

    /**
     * Update (replace) the music for an event segment
     */
    updateSong(saved_music: SavedMusic) {
        for (let i in this.keyed_items) {
            let event_segment_music = this.keyed_items[i];
            if (event_segment_music.music.id === saved_music.id) {
                event_segment_music.music = saved_music.clone();
            }
        }
    }
}