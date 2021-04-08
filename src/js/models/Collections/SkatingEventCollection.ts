import {SkatingEvent} from "../SkatingEvent";
import {IndexedEventCreditList} from "../../contracts/AppContracts";

export class SkatingEventCollection {
    events: SkatingEvent[];

    constructor(events: SkatingEvent[]) {
        this.events = events;
    }

    ids(): number[] {
        return this.events.map(function (item: SkatingEvent) {
            return item.id;
        })
    }

    all(): SkatingEvent[] {
        return this.events;
    }

    add(event: SkatingEvent) {
        this.events.push(event);
    }

    find(id: number): SkatingEvent | null {
        for (let i = 0; i < this.events.length; i++) {
            let event = this.events[i];
            if (event.id == id) {
                return event;
            }
        }
        return null;
    }

    getTypeLimits(): IndexedEventCreditList {
        return this.all().reduce(function (accumulator: IndexedEventCreditList, event: SkatingEvent) {
            accumulator[event.id] = {
                event_id: event.id,
                ...event.getCreditLimits()
            };
            return accumulator;
        }, {})
    }
}