import {SkaterCoachedEventCategory} from '../SkaterCoachedEventCategory';
import {SkaterEventCategoryCoach} from '../../contracts/AppContracts';

export class SkaterCoachedEventCategoryCollection<T extends SkaterCoachedEventCategory = SkaterCoachedEventCategory> {
    protected _skater_coached_event_categories: T[] = [];

    /**
     * Create a new SkaterCoachedEventCategoryCollection instance
     */
    constructor(event_categories?: T[]) {
        if (event_categories) {
            this._skater_coached_event_categories = event_categories;
        }
    }

    /**
     * Get the array of all items in collection
     */
    all(): T[] {
        return this._skater_coached_event_categories;
    }

    /**
     * Return the event item in collection for a given event category id
     */
    eventCategoryId(event_category_id: number): T | false {
        for (let i = 0; i < this._skater_coached_event_categories.length; i++) {
            const event = this._skater_coached_event_categories[i];
            if (event.id === event_category_id) {
                return event;
            }
        }

        return false;
    }

    /**
     * Return whether the collection contains a certain coach for a given event category
     */
    containsEventCategoryCoach(event_category_id: number, coach_id: number): boolean {
        const event = this.eventCategoryId(event_category_id);
        if (event) {
            for (let i = 0; i < event.coaches.length; i++) {
                const coach = event.coaches[i];
                if (coach.id === coach_id) {
                    return true;
                }
            }
        }

        return false;
    }

    /**
     * Remove a coach given a event category id and coach id
     */
    remove(event_category_id: number, coach_id: number) {
        const event_category = this.eventCategoryId(event_category_id);
        if (event_category) {
            for (let i = 0; i < event_category.coaches.length; i++) {
                const coach = event_category.coaches[i];
                if (coach.id === coach_id) {
                    event_category.coaches.splice(i, 1);

                    return;
                }
            }
        }
    }

    /**
     * Add a coach given an event category id
     * If specified event category is not in collection, do nothing silently
     */
    add(event_category_id: number, coach: SkaterEventCategoryCoach) {
        const event_category = this.eventCategoryId(event_category_id);
        if (event_category) {
            event_category.coaches.push(coach);
        }
    }

    /**
     * Replace a specified coach given an event category ID
     * If specified event category is not in collection, do nothing silently
     */
    replace(event_category_id: number, previous_coach_id: number, replacement_coach: SkaterEventCategoryCoach) {
        const event_category = this.eventCategoryId(event_category_id);
        if (event_category) {
            for (let i = 0; i < event_category.coaches.length; i++) {
                const coach = event_category.coaches[i];
                if (previous_coach_id === coach.id) {
                    event_category.coaches.splice(i, 1, replacement_coach);

                    return;
                }
            }
        }
    }

    /**
     * Get the total coach count
     */
    coach_count(): number {
        let total = 0;
        for (let i = 0; i < this._skater_coached_event_categories.length; i++) {
            const event = this._skater_coached_event_categories[i];
            total += event.coaches.length;
        }

        return total;
    }
}