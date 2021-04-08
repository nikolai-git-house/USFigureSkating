import {SkaterEventCredits} from "./SkaterEventCredits";
import {CreditsCollection} from "./CreditsCollection";
import {CreditState, EventCreditList} from "../../contracts/AppContracts";


/**
 * Class to track all of a skater's event credits
 */
export class SkaterCredits {
    _event_credits: SkaterEventCredits[] = [];
    private _purchased_package_ids: number[] = [];

    constructor(event_credits?: SkaterEventCredits[], purchased_package_ids?: number[]) {
        if (event_credits) {
            this._event_credits = event_credits;
        }
        if (purchased_package_ids) {
            this._purchased_package_ids = purchased_package_ids;
        }
    }

    get purchased_package_ids(): number[] {
        return this._purchased_package_ids;
    }

    /**
     * ? total available across all events?
     */
    get available_credits() {
        let result = new CreditsCollection();
        if (this._event_credits.length) {
            for (let i = 0; i < this._event_credits.length; i++) {
                let ec = this._event_credits[i];
                result = result.combine([ec.available_credits]);
            }

        }
        return result
    }

    find(event_id: number): SkaterEventCredits | null {
        for (let i = 0; i < this._event_credits.length; i++) {
            let event_credit = this._event_credits[i];
            if (event_credit.event_id == event_id) {
                return event_credit
            }
        }
        return null;
    }

    decrement(event_id: number, type: (string | null)): void {

        let event_credits = this.find(event_id);
        if (!type || !event_credits) {
            return;
        }
        return event_credits.decrement(type);

    }

    increment(event_id: number, type: (string | null)): void {

        let event_credits = this.find(event_id);
        if (!type || !event_credits) {
            return;
        }
        event_credits.increment(type);
        return;

    }

    add(event_credits: SkaterEventCredits) {
        this._event_credits.push(event_credits);
    }

    maxCreditAvailableType(event_id: number, types: string[]): (string | null) {
        let event_credits = this.find(event_id);
        if (!event_credits) {
            return null;
        }
        return event_credits.maxCreditAvailableType(types);
    }

    creditsAvailable(event_id: number, types: (string[] | string)): boolean {
        let event_credits = this.find(event_id);
        if (!event_credits) {
            return false;
        }
        return event_credits.creditsAvailable(types);
    }

    purchasedCredits(event_id: number): CreditState {
        let event_credits = this.find(event_id);
        if (!event_credits) {
            return {
                opi: 0,
                upi: 0,
                wu: 0
            };
        }
        return event_credits.purchased_credits.export();
    }

    unscheduledCredits(event_id: number): CreditState {
        let event_credits = this.find(event_id);
        if (!event_credits) {
            return {
                opi: 0,
                upi: 0,
                wu: 0
            };
        }
        return event_credits.available_credits.export();
    }

    scheduledEventCredits(event_id: number) {
        let event_credits = this.find(event_id);
        if (!event_credits) {
            return false;
        }
        return event_credits.all_scheduled_credits;
    }

    scheduledEventCreditsOfType(event_id: number, type: string) {
        let creditsScheduled2 = this.scheduledEventCredits(event_id);
        if (!creditsScheduled2) {
            return 0;
        }
        return creditsScheduled2[type];
    }

    public unscheduled_credits(): boolean {
        for (let i = 0; i < this._event_credits.length; i++) {
            let obj = this._event_credits[i];
            if (obj.unscheduled_credits()) {
                return true;
            }

        }
        return false;
    }

    getAvailableCreditList(): EventCreditList[] {
        let result = [];
        for (let i = 0; i < this._event_credits.length; i++) {
            let obj = this._event_credits[i];
            if (obj.unscheduled_credits()) {
                result.push({
                    event_id: obj.event_id,
                    opi: obj.available_credits.opi,
                    upi: obj.available_credits.upi,
                    wu: obj.available_credits.wu,
                });
            }

        }

        return result;
    }

}

