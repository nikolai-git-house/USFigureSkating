import {CartCreditPackage} from "./CartCreditPackage";
import {CreditPackage} from "../Credits/CreditPackage";
import {CreditState} from "../../contracts/AppContracts";

export class CartCreditPackageCollection {
    credit_packages: CartCreditPackage[] = [];

    constructor(init_packages?: CartCreditPackage[]) {
        this.credit_packages = init_packages ? init_packages : [];
    }

    add(credit_package: CartCreditPackage) {
        this.credit_packages.push(credit_package);
    }

    count(): number {
        return this.credit_packages.length;
    }

    contains(credit_package_check: CreditPackage) {
        for (let i = 0; i < this.credit_packages.length; i++) {
            let credit_package = this.credit_packages[i];
            if (credit_package_check.id === credit_package.id) {
                return true;
            }
        }
        return false;
    }

    all() {
        return this.credit_packages;
    }

    remove(credit_package: CartCreditPackage) {
        for (let i = 0; i < this.credit_packages.length; i++) {
            let internal = this.credit_packages[i];
            if (internal.id === credit_package.id) {
                this.credit_packages.splice(i, 1);
                return;
            }
        }
    }

    /**
     * Get the total amount of credits represented by a CreditPackageCollection
     */
    totalCredits(): CreditState {
        let initialValue: CreditState = {
            opi: 0,
            upi: 0,
            wu: 0
        };
        return this.credit_packages.reduce(function (accumulator: CreditState, credit_package: CartCreditPackage) {
            let credits = credit_package.credits;
            for (let i in accumulator) {
                accumulator[i] += credits[i];
            }
            return accumulator;
        }, initialValue);
    }

    /**
     * Filter by a certain event id
     */
    eventId(event_id: number): CartCreditPackageCollection {
        return new CartCreditPackageCollection(this.credit_packages.filter(function (credit_package: CartCreditPackage) {
            return credit_package.event_id === event_id;
        }));
    }

    /**
     * Get the credits used for a certain event
     */
    getEventReport(event_id: number): CreditState {
        return this.eventId(event_id).totalCredits();
    }
}