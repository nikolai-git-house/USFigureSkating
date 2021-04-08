import {CreditsCollection} from "./CreditsCollection";
import {CreditCollectionConfigContract} from "./CreditCollectionConfigContract";

/**
 * Manage the credits a skater has for a single event
 */
export class SkaterEventCredits {
    private _total_credits: CreditsCollection;
    private _scheduled_credits: CreditsCollection;
    private _available_credits: CreditsCollection;
    private _event_id: number;

    constructor(event_id: number, total_credits: CreditCollectionConfigContract, scheduled_credits: CreditCollectionConfigContract) {
        this._total_credits = new CreditsCollection(total_credits);
        this._scheduled_credits = new CreditsCollection(scheduled_credits);
        this._available_credits = CreditsCollection.diff(this._total_credits, this._scheduled_credits);
        this._event_id = event_id;
    }

    get event_id(): number {
        return this._event_id;
    }

    get available_credits(): CreditsCollection {
        return this._available_credits;
    }

    get purchased_credits(): CreditsCollection {
        return this._total_credits;
    }

    get all_scheduled_credits() {
        return this._scheduled_credits;
    }

    public creditsAvailable(types: (string[] | string)): boolean {
        return this._available_credits.creditsAvailable(types);
    }

    public decrement(type: (string | null)): void {
        if (type) {
            this._available_credits.decrement(type);
            this._scheduled_credits.increment(type);
        }
    }

    public increment(type: (string | null)): void {
        if (type) {
            this._available_credits.increment(type);
            this._scheduled_credits.decrement(type);
        }
    }

    public maxCreditAvailableType(types: string[]): (string | null) {
        return this._available_credits.maxCreditAvailableType(types);
    }

    public unscheduled_credits(): boolean {
        return !this._available_credits.is_empty();
    }

}