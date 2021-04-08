import {CreditCollectionConfigContract} from "./CreditCollectionConfigContract";
import {CreditState} from "../../contracts/AppContracts";

export class CreditsCollection {
    private _upi: number = 0;
    private _opi: number = 0;
    private _wu: number = 0;
    [key: string]: any;

    constructor(initial_config?: CreditCollectionConfigContract) {
        if (initial_config) {
            for (let i in initial_config) {
                this[i] = initial_config[i];
            }
        }
    }

    get upi(): number {
        return this._upi;
    }

    set upi(value: number) {
        this._upi = value;
    }

    get opi(): number {
        return this._opi;
    }

    export(): CreditState {
        return {
            opi: this._opi,
            upi: this._upi,
            wu: this._wu
        }
    }


    set opi(value: number) {
        this._opi = value;
    }

    get wu(): number {
        return this._wu;
    }

    set wu(value: number) {
        this._wu = value;
    }

    static combine(source: CreditsCollection, to_add: CreditsCollection[]) {
        let result = new CreditsCollection({
            opi: source.opi,
            upi: source.upi,
            wu: source.wu,
        });

        for (let i = 0; i < to_add.length; i++) {
            let addor = to_add[i];
            result.opi += addor.opi;
            result.upi += addor.upi;
            result.wu += addor.wu;
        }
        return result;

    }

    static diff(subtractant: CreditsCollection, subtractor: CreditsCollection): CreditsCollection {
        return new CreditsCollection({
            opi: subtractant._opi - subtractor._opi,
            upi: subtractant._upi - subtractor._upi,
            wu: subtractant._wu - subtractor._wu,
        });
    }

    public combine(to_add: CreditsCollection[]) {
        return CreditsCollection.combine(this, to_add);
    }

    /**
     * @deprecated
     */
    add(type: string, amount: number): void {
        if (type && type in this) {
            this[type] += amount;
        }
    }

    decrement(type: (string)): void {
        if (type && type in this) {
            this[type]--;
        }
    }

    increment(type: string): void {
        if (type && type in this) {
            this[type]++;
        }
    }

    public is_empty(): boolean {
        return this._upi === 0 &&
            this._opi === 0 &&
            this._wu === 0;
    }


    public creditsAvailable(types: (string[] | string)): boolean {
        if (typeof types === "string") {
            return types in this && this[types] > 0;
        }
        for (let i = 0; i < types.length; i++) {
            let type = types[i];
            if (this.creditsAvailable(type)) {
                return true;
            }
        }
        return false;
    }

    maxCreditAvailableType(types: string[]): (string | null) {
        let key_max = 0;
        let max_key = null;
        for (let i = 0; i < types.length; i++) {
            let key = types[i];
            if (this[key] > key_max) {
                key_max = this[key];
                max_key = key;
            }
        }
        return max_key;
    }
}