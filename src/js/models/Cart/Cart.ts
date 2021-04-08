import {Session} from "../Sessions/Session";
import {CartSessionCollection} from "../Collections/CartSessionCollection";
import {CartSession} from "../Sessions/CartSession";
import {CreditState, EventCreditList, IndexedEventCreditList, SessionType} from "../../contracts/AppContracts";
import {CartCreditPackage} from "./CartCreditPackage";
import {SessionCollection} from "../Collections/SessionCollection";
import {CartCreditCollection} from "./CartCreditCollection";
import {CartCreditPackageCollection} from "./CartCreditPackageCollection";
import {CreditPackage} from "../Credits/CreditPackage";
import {CartCredit} from "./CartCredit";
import {CartFee} from "../../contracts/CartItemContract";
import {CartCostProperties, CartRegistrationItem} from "../../contracts/CartItemContract";


export class Cart {
    total_cost: number = 0;
    scheduled_sessions: CartSessionCollection;
    credits: CartCreditCollection;
    credit_packages: CartCreditPackageCollection;
    private _additional_fees: CartFee[] = [];
    private _subtotal: number | null = null;
    registration_items: CartRegistrationItem[] = [];

    constructor(sessions: CartSession[], cost: number, credits?: CartCredit[], credit_packages?: CartCreditPackage[]) {

        this.scheduled_sessions = new CartSessionCollection(sessions);
        this.credits = new CartCreditCollection(credits);
        this.credit_packages = new CartCreditPackageCollection(credit_packages);
        this.total_cost = cost
    }

    get subtotal(): number | null {
        return this._subtotal;
    }

    set subtotal(value: number | null) {
        this._subtotal = value;
    }

    get additional_fees(): CartFee[] {
        return this._additional_fees;
    }

    set additional_fees(value: CartFee[]) {
        this._additional_fees = value;
    }

    get session_ids() {
        return this.scheduled_sessions.ids();
    }

    get sessions(): SessionCollection {
        return this.scheduled_sessions.session_collection;
    }

    get item_count(): number {
        return this.scheduled_sessions.count() + this.credits.credit_count() + this.credit_packages.count() + this.registration_items.length;
    }

    get items(): (CartSession | CartCredit | CartCreditPackage | CartRegistrationItem)[] {
        let result: (CartSession | CartCredit | CartCreditPackage | CartRegistrationItem)[] = this.scheduled_sessions.all();
        result = result.concat(this.credit_packages.all());
        result = result.concat(this.credits.export());
        result = result.concat(this.registration_items);
        return result;
    }

    isEmpty() {
        return this.item_count === 0;
    }

    public addSession(cart_session: CartSession) {
        this.scheduled_sessions.add(cart_session);
        this.total_cost += cart_session.cost;
    }

    public removeSession(session_id: number) {
        let cart_session = this.scheduled_sessions.find(session_id);
        if (cart_session) {
            this.total_cost -= cart_session.cost
        }
        this.scheduled_sessions.remove(session_id);
    }

    public contains(session: Session): boolean {
        return this.scheduled_sessions.containsSession(session);
    }

    addCredits(credits: CartCredit[]) {
        for (let i = 0; i < credits.length; i++) {
            let credit: CartCredit = credits[i];
            this.credits.add(credit);
            this.total_cost += credit.cost;
        }
    }

    addPackages(packages: CartCreditPackage[]) {
        for (let i = 0; i < packages.length; i++) {
            let credit_package: CartCreditPackage = packages[i];
            this.credit_packages.add(credit_package);
            this.total_cost += credit_package.cost;
        }
    }

    getIndexedEventCreditsUsed(event_ids: number[], exclude_credits?: boolean): IndexedEventCreditList {
        let result: IndexedEventCreditList = {};
        for (let i = 0; i < event_ids.length; i++) {
            let event_id = event_ids[i];
            result[event_id] = this.getEventCreditsUsed(event_id, exclude_credits);
        }
        return result;
    }

    /**
     * Get IndexedEventCreditList for listing all session credit types used, and all credit/packages of the specified types used
     */
    getIndexedEventCreditsSpent(event_ids: number[], session_types: SessionType[]): IndexedEventCreditList {
        let index_cart_session_credits: IndexedEventCreditList = this.getIndexedEventCreditsUsed(event_ids, true);
        let cart_filled_credit_types: IndexedEventCreditList = this.getEventCreditsUsedFiltered(event_ids, session_types);
        for (let i in cart_filled_credit_types) {
            let obj: EventCreditList = cart_filled_credit_types[i];
            if (!index_cart_session_credits.hasOwnProperty(String(obj.event_id))) {
                index_cart_session_credits[obj.event_id] = {
                    event_id: obj.event_id,
                    opi: 0,
                    upi: 0,
                    wu: 0
                }
            }
            index_cart_session_credits[obj.event_id].opi += obj.opi;
            index_cart_session_credits[obj.event_id].upi += obj.upi;
            index_cart_session_credits[obj.event_id].wu += obj.wu;
        }
        return index_cart_session_credits;
    }

    /**
     * Report the credits present in the cart for an event.
     *
     * Includes single credits and credit packages
     */
    getCreditReport(event_id: number): CreditState {
        let result: CreditState = {
            opi: 0,
            upi: 0,
            wu: 0
        };
        let single_credit_report = this.credits.getEventReport(event_id);
        let package_report = this.credit_packages.getEventReport(event_id);
        for (let i in result) {
            result[i] = single_credit_report[i] + package_report[i];

        }

        return result;
    }

    /**
     * For an event, add up the credits used by sessions and credits and in the cart
     *
     * Option to exclude credits from totals
     */
    getEventCreditsUsed(event_id: number, exclude_credits?: boolean): EventCreditList {
        let result: EventCreditList = {
            event_id: event_id,
            ...this.scheduled_sessions.eventId(event_id).creditsUsed()
        };
        if (exclude_credits !== true) {
            let credit_counts = this.getCreditReport(event_id);
            for (let i in result) {
                if (i === 'event_id') {
                    continue;
                }
                result[i] += credit_counts[i] ? credit_counts[i] : 0;
            }
        }
        return result;
    }

    removeCredit(credit: CartCredit) {
        this.credits.remove(credit);
        this.total_cost -= credit.cost;
    }

    removeCreditPackage(credit_package: CartCreditPackage) {
        this.credit_packages.remove(credit_package);
        this.total_cost -= credit_package.cost;
    }

    containsPackage(credit_package: CreditPackage): boolean {
        return this.credit_packages.contains(credit_package);
    }

    getEventCreditsUsedFiltered(event_ids: number[], schedulable_session_types: SessionType[]): IndexedEventCreditList {
        let result: IndexedEventCreditList = {};
        for (let i = 0; i < event_ids.length; i++) {
            let event_id = event_ids[i];
            let event_credit_report = this.getCreditReport(event_id);

            let types: SessionType[] = ['opi', 'upi', 'wu'];
            for (let j = 0; j < types.length; j++) {
                let type = types[j];
                if (schedulable_session_types.indexOf(type) === -1) {
                    event_credit_report[type] = 0;
                }
            }
            result[event_id] = {
                event_id,
                ...event_credit_report
            };
        }
        return result;
    }

    setCostProperties(cost_properties: CartCostProperties) {
        if (cost_properties.total !== false) {
            this.total_cost = cost_properties.total;
        }
        if (cost_properties.additional_fees !== false) {
            this.additional_fees = cost_properties.additional_fees;
        }
        if (cost_properties.subtotal !== false) {
            this.subtotal = cost_properties.subtotal;
        }

    }
}
