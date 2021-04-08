import {IndexedEventCreditList, SessionType} from "../contracts/AppContracts";
import {SkaterSchedule} from "./Schedule/SkaterSchedule";
import {Cart} from "./Cart/Cart";
import {SkaterCredits} from "./Credits/SkaterCredits";

export class Skater {
    private _schedule: SkaterSchedule;
    private _cart: Cart;
    private _credits: SkaterCredits;

    constructor(parameters: { schedule?: SkaterSchedule, cart?: Cart, credits?: SkaterCredits }) {
        let {schedule, cart, credits} = parameters;
        this._schedule = schedule ? schedule : new SkaterSchedule([], []);
        this._cart = cart ? cart : new Cart([], 0);
        this._credits = credits ? credits : new SkaterCredits();
    }

    get schedule(): SkaterSchedule {
        return this._schedule;
    }

    set schedule(value: SkaterSchedule) {
        this._schedule = value;
    }

    get credits(): SkaterCredits {
        return this._credits;
    }

    set credits(value: SkaterCredits) {
        this._credits = value;
    }

    get cart(): Cart {
        return this._cart;
    }

    set cart(value: Cart) {
        this._cart = value;
    }

    /**
     * Get the amount of credits used/acquired toward event allowed maximums
     *
     * Get an event_id-indexed list of spent session types to determine whether sessions are available to skaters
     * Spent credits come in the form of sessions in the cart or sessions in the schedule
     *
     * Credits in cart (in the form of packages or single credits) are counted as spent if they are of a selectable type.
     *
     * Unscheduled credits are NOT counted as used, since they can be applied toward selected sessions.  They have a 1-1 increment/decrement cycle
     *
     * By default, gets list for all scheduled event ids. Optional parameter to get list for specific event ids.
     *
     */
    getSpentCredits(schedulable_session_types: SessionType[]): IndexedEventCreditList {
        let limit_event_ids = this._schedule.event_ids;
        let index_cart_session_credits: IndexedEventCreditList = this._cart.getIndexedEventCreditsSpent(limit_event_ids, schedulable_session_types);

        let result: IndexedEventCreditList = {};
        for (let i = 0; i < limit_event_ids.length; i++) {

            let event_id = limit_event_ids[i];
            result[event_id] = {
                event_id: event_id,
                opi: 0,
                wu: 0,
                upi: 0,

            };
            let keys: SessionType[] = [
                'opi',
                'wu',
                'upi'
            ];

            //...get the scheduled session type amounts from schedule for that event
            let scheduled_counts = this._schedule.getEventScheduledTypeCounts(event_id);
            // ... get the cart session type amounts for that event && get the cart credits from cart for that event
            let cart_counts = index_cart_session_credits[event_id];
            // ... get the unscheduled credits from credits for that event
            // ......sum up totals
            for (let j = 0; j < keys.length; j++) {
                let obj = keys[j];
                result[event_id][obj] = scheduled_counts[obj] + cart_counts[obj]
            }
        }
        return result;
    }

    /**
     * Get the amount of credits a user has acquired toward credit purchase maximums
     *
     * Get an event-id indexed dictionary of credits a skater has acquired within the active state
     * Totals Consist of:
     * - Credits in Cart
     * - Sessions in Cart
     * - Sessions in Schedule
     * - Purchased, unscheduled credits
     *
     * By default, gets list for all scheduled event ids. Optional parameter to get list for specific event ids.
     *
     */
    getAcquiredCredits(limit_event_ids?: number[]): IndexedEventCreditList {
        if (!limit_event_ids || limit_event_ids.length === 0) {
            limit_event_ids = this._schedule.event_ids;
        }
        let indexed_cart_credits: IndexedEventCreditList = this._cart.getIndexedEventCreditsUsed(limit_event_ids);
        let result: IndexedEventCreditList = {};
        for (let i = 0; i < limit_event_ids.length; i++) {

            let event_id = limit_event_ids[i];
            result[event_id] = {
                event_id: event_id,
                opi: 0,
                wu: 0,
                upi: 0,

            };
            let keys: SessionType[] = [
                'opi',
                'wu',
                'upi'
            ];

            //...get the scheduled session type amounts from schedule for that event
            let scheduled_counts = this._schedule.getEventScheduledTypeCounts(event_id);
            // ... get the cart session type amounts for that event && get the cart credits from cart for that event
            let cart_counts = indexed_cart_credits[event_id];
            // ... get the unscheduled credits from credits for that event
            //@note: purchased credits shouldn't count against max event limits, but should count against credit purchase limits
            // if a session was scheduled with credits, the credit would be double decremented. Only us unscheduled credits to reduce total
            let unscheduled_counts = this._credits.unscheduledCredits(event_id);
            // ......sum up totals
            for (let j = 0; j < keys.length; j++) {
                let obj = keys[j];
                result[event_id][obj] = scheduled_counts[obj] + cart_counts[obj] + unscheduled_counts[obj];
            }
        }
        return result;
    }


}