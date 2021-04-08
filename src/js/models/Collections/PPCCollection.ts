import {PPC} from "../PPC/PPC";
import {PPCFetchArgs} from "../../contracts/app/PPCContracts";

export class PPCCollection {
    private keyed_items: { [key: string]: PPC } = {};


    constructor(items?: PPC[]) {
        if (items) {
            for (let i = 0; i < items.length; i++) {
                let item = items[i];
                this.add(item);
            }
        }
    }

    /**
     * Generate the key for internal keyed items from fetch args
     */
    static fetchArgsToKey(fetch_args: PPCFetchArgs): string {
        return fetch_args.competition_id + "," + fetch_args.event_id + "," + fetch_args.event_segment_id;
    }

    /**
     * Add item to collection and keyed collection
     */
    add(item: PPC): void {
        let key = PPCCollection.fetchArgsToKey({
            competition_id: item.competition_id,
            event_id: item.event_id,
            event_segment_id: item.event_segment_id,
            competition_skated_event_id: item.competition_skated_event_id
        });
        this.keyed_items[key] = item;
    }

    /**
     * Search for an item by fetch args
     */
    find(fetch_args: PPCFetchArgs): PPC | null {
        let key = PPCCollection.fetchArgsToKey(fetch_args);
        if (this.keyed_items.hasOwnProperty(key)) {
            return this.keyed_items[key];
        }
        return null;
    }
}