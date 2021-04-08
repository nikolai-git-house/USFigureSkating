import {Music} from "./Music";

export type EventSegmentMusicParameters = { competition_id: number, event_id: number, event_segment_id: number, competition_skated_event_id: number, music: Music };

/**
 * Represents Music as associated with an Event Segment
 */
export class EventSegmentMusic {
    competition_id: number;
    event_id: number;
    event_segment_id: number;
    competition_skated_event_id: number;
    music: Music;

    constructor(parameters: EventSegmentMusicParameters) {
        let {competition_id, event_id, event_segment_id, competition_skated_event_id, music} = parameters;
        this.competition_id = competition_id;
        this.event_id = event_id;
        this.event_segment_id = event_segment_id;
        this.competition_skated_event_id = competition_skated_event_id;
        this.music = music;
    }
}