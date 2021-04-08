import {SkaterService} from "../../services/SkaterService";
import {ActionTree, GetterTree, MutationTree} from "vuex"
import {SkaterSchedule} from "../../models/Schedule/SkaterSchedule";
import {SkaterCredits} from "../../models/Credits/SkaterCredits";
import {SkatingEvent} from "../../models/SkatingEvent";
import {ScheduledSession} from "../../models/Sessions/ScheduledSession";
import {
    AvailableEventCredits,
    CoachAddPayload,
    CoachRemovePayload,
    CoachReplacePayload,
    EventIndexedCreditLimits,
    NamedEventCreditList,
    SkaterInfo,
    SkaterScheduleStateArgs
} from "../../contracts/AppContracts";
import {Skater} from "../../models/Skater";
import {Cart} from "../../models/Cart/Cart";
import {BillingAddress} from "../../models/BillingAddress";
import {BillingAddressCreatePayload} from "../../contracts/BillingAddressContracts";
import {CreditPackage} from "../../models/Credits/CreditPackage";
import {SkaterCoachedEventCategoryCollection} from "../../models/Collections/SkaterCoachedEventCollection";
import {SkaterSkatingEventSegment} from "../../models/SkaterSkatingEventSegment";
import {BillingAddressEditPayload} from "../../contracts/BillingAddressContracts";


export class State {
    active_schedule: SkaterSchedule = new SkaterSchedule([], []);
    competition_credits: SkaterCredits = new SkaterCredits();
    skater: Skater;
    active_competition_registered_event_ids: number[] = [];
    schedule_loaded: boolean = false;
    billing_addresses: BillingAddress[] = [];
    /**
     * @deprecated 5/27/19 - this returned basic name and address info and has been superseded by User Profile info
     */
    info: SkaterInfo | undefined;
    credits_loaded: boolean = false;
    active_competition_coach_events: SkaterCoachedEventCategoryCollection = new SkaterCoachedEventCategoryCollection();
    active_skating_event_segments: SkaterSkatingEventSegment[] = [];

    constructor() {
        this.skater = new Skater({schedule: this.active_schedule, credits: this.competition_credits});
    }
}

const actions = <ActionTree<State, any>>{

    /**
     * Fetch basic information about the active skater
     * @deprecated 5/27/19 - this returned basic name and address info and has been superseded by User Profile info
     */
    fetchSkaterInfo: function (context) {
        return new Promise(function (resolve, reject) {
            SkaterService.getSkaterInfo().then(function (info: SkaterInfo) {
                context.commit('setSkaterInfo', info);
                resolve();
            }).catch(function () {
                reject();
            });
        });
    },
    /**
     * Fetch the active skater's competition schedule
     *
     * @deprecated 2020-08-04
     */
    fetchCompetitionSchedule: function (context, id: number) {
        context.state.schedule_loaded = false;
        return new Promise(function (resolve, reject) {
            SkaterService.getCompetitionSchedule(id).then(function (result: SkaterScheduleStateArgs) {
                context.commit('setActiveSchedule', result);
                resolve();
            }).catch(function () {
                reject();
            })
        });
    },

    /**
     * Called from Competition Information Page
     */
    fetchCompetitionRegisteredEventIDs: function (context, competition_id: number) {
        return new Promise(function (resolve, reject) {
            SkaterService.getCompetitionRegisteredEventIDs(competition_id).then(function (event_ids: number[]) {
                context.commit('setActiveCompetitionEventIDs', event_ids);
                resolve();
            }).catch(function () {
                reject();
            });
        });
    },

    /**
     * Get the skater's unscheduled credits for the competition
     * Called from Practice Ice Schedule
     */
    fetchCompetitionCredits: function (context, id: number) {
        context.state.credits_loaded = false;
        return new Promise(function (resolve, reject) {
            SkaterService.getCompetitionCredits(id).then(function (result: SkaterCredits) {
                context.commit('setCompetitionCredits', result);
                resolve();
            }).catch(function () {
                reject();
            });
        });
    },
    /**
     * Add a session to the skater's schedule
     */
    addSessionToSchedule(context, payload: { [key: string]: any; scheduled_session: ScheduledSession }): Promise<Function> {
        return new Promise(function (resolve, reject) {
            SkaterService.addSessionToSchedule(payload.scheduled_session).then(function () {
                function addSessionToAppSchedule() {
                    context.commit('addSessionToSchedule', payload.scheduled_session);
                    context.commit('decrementCredit', {
                        type: payload.scheduled_session.scheduled_as,
                        event_id: payload.scheduled_session.scheduled_event_id
                    });
                }

                resolve(addSessionToAppSchedule);
            }).catch(function () {
                reject();
            })
        });
    },
    /**
     * Remove a session from the skater's schedule
     */
    removeSessionFromSchedule: function (context, payload: { [key: string]: any; scheduled_session: ScheduledSession }): Promise<Function> {
        return new Promise(function (resolve, reject) {
            SkaterService.removeSessionFromSchedule(payload.scheduled_session).then(function () {
                function removeSessionFromAppSchedule() {
                    context.commit('removeSessionFromSchedule', payload.scheduled_session);
                    context.commit('incrementCredit', {
                        type: payload.scheduled_session.scheduled_as,
                        event_id: payload.scheduled_session.scheduled_event_id
                    });
                }

                resolve(removeSessionFromAppSchedule);
            }).catch(function () {
                reject();
            })
        });
    },
    /**
     * Fetch the saved list of billing addresses for the skater
     */
    fetchBillingAddresses: function (context) {
        return new Promise(function (resolve, reject) {
            SkaterService.getBillingAddresses().then(function (result: BillingAddress[]) {
                context.commit('setBillingAddresses', result);
                resolve();
            }).catch(function () {
                reject();
            });
        });
    },
    /**
     * Edit an address
     *
     * Resolves with the edited BillingAddress
     */
    editAddress: function (context, edit_payload: BillingAddressEditPayload): Promise<BillingAddress> {
        let {source, data} = edit_payload;
        return new Promise(function (resolve, reject) {
            SkaterService.updateBillingAddress(edit_payload).then(function (updated_address: BillingAddress) {
                context.commit('editAddress', updated_address);
                if (data.is_default) {
                    context.commit('clearDefaults', source.id);
                }
                resolve(updated_address);
            }).catch(function () {
                reject();
            });
        });
    },
    /**
     * Create an address
     *
     * Resolves with the created BillingAddress
     */
    createAddress: function (context, create_payload: BillingAddressCreatePayload): Promise<BillingAddress> {
        return new Promise(function (resolve, reject) {
            SkaterService.createBillingAddress(create_payload).then(function (result: BillingAddress) {
                context.commit('addAddress', result);
                if (result.is_default) {
                    context.commit('clearDefaults', result.id);
                }
                resolve(result);
            }).catch(function () {
                reject();
            });
        });
    },

    /**
     * Get the events and associated coaches for a skater for a given competition
     *
     * @deprecated 2020-07-28
     */
    fetchCompetitionEventCoaches: function (context, competition_id: number) {
        return new Promise(function (resolve, reject) {
            SkaterService.getCompetitionEventCoaches(competition_id).then(function (result: SkaterCoachedEventCategoryCollection) {
                context.commit('setCompetitionEventCoaches', result);
                resolve();
            }).catch(function () {
                reject();
            })
        });
    },

    /**
     * Remove a coach for a skater
     */
    removeCoach: function (context, payload: CoachRemovePayload) {
        return new Promise(function (resolve, reject) {
            SkaterService.removeCoach(payload).then(function () {
                context.commit('removeCoach', payload);
                resolve();
            }).catch(function () {
                reject();
            })
        });
    },

    /**
     * Add a coach for a skater
     */
    addCoach: function (context, payload: CoachAddPayload) {
        return new Promise(function (resolve, reject) {
            SkaterService.addCoach(payload).then(function () {
                context.commit('addCoach', payload);
                resolve();
            }).catch(function () {
                reject();
            });
        });
    },

    replaceCoach: function (context, payload: CoachReplacePayload) {
        return new Promise(function (resolve, reject) {
            SkaterService.replaceCoach(payload).then(function () {
                context.commit('replaceCoach', payload);
                resolve();
            }).catch(function () {
                reject();
            });
        });
    },

    /**
     * Fetch the skater's skating event segments for a given competition
     */
    fetchSkatingEventSegments(context, competition_id: number): Promise<void> {
        return new Promise(function (resolve, reject) {
            SkaterService.getSkatingEventSegments(competition_id).then(function (result: SkaterSkatingEventSegment[]) {
                context.commit("setActiveSkatingEventSegments", result);
                resolve();
            }).catch(function () {
                reject();
            });
        });
    }
};
const getters = <GetterTree<State, any>>{
    saved_address_count: function (state) {
        return state.billing_addresses.length;
    },
    available_credits: function (state) {
        return state.competition_credits.available_credits;
    },
    available_credit_list: function (state): NamedEventCreditList[] {
        let intermediate = state.competition_credits.getAvailableCreditList();
        let result: NamedEventCreditList[] = [];
        for (let i = 0; i < intermediate.length; i++) {
            let event_credit_list = intermediate[i];
            let event = state.active_schedule.findEvent(event_credit_list.event_id);
            if (event) {
                result.push({
                    ...event_credit_list,
                    event_name: event.name
                });
            }

        }
        return result;
    },
    /**
     * Get the available credits list for a skater with credit types of limit 0 removed
     */
    pruned_available_credit_list: function (state, getters, rootState, rootGetters): AvailableEventCredits[] {
        let indexed_skater_event_credit_limits: EventIndexedCreditLimits = rootGetters['indexed_skater_event_credit_limits'];
        let skater_available_credit_list_complete = getters['available_credit_list'];
        return skater_available_credit_list_complete.reduce(function (accumulator: AvailableEventCredits[], item: NamedEventCreditList) {
            let event_limits = indexed_skater_event_credit_limits[item.event_id];
            let item_result: AvailableEventCredits = {
                event_name: item.event_name,
                credits: {
                    upi: item.upi,
                    opi: item.opi,
                    wu: item.wu
                }
            };
            for (let i in event_limits) {
                let limit = event_limits[i];
                if (limit < 1) {
                    delete item_result.credits[i];
                }
            }
            if (Object.keys(item_result.credits).length) {
                accumulator.push(item_result);
            }
            return accumulator;
        }, []);
    },
    package_purchased: function (state, getters): Function {
        return function (credit_package: CreditPackage): boolean {
            return getters['purchased_package_ids'].indexOf(credit_package.id) !== -1;
        }
    },
    purchased_package_ids: function (state): number[] {
        return state.competition_credits.purchased_package_ids;
    },
    has_unscheduled_credits: function (state): boolean {
        return state.competition_credits.unscheduled_credits();
    },
    categoryCoachSelected: function (state): Function {
        return function (event_id: number, coach_id: number): boolean {
            return state.active_competition_coach_events.containsEventCategoryCoach(event_id, coach_id);
        }
    },
    /**
     * Get the active event segments from state
     */
    active_event_segments: function (state): SkaterSkatingEventSegment[] {
        return state.active_skating_event_segments;
    }
};

const mutations = <MutationTree<State>>{
    clearDefaults: function (state, default_id: number) {
        state.billing_addresses.forEach(function (address: BillingAddress) {
            if (default_id !== address.id) {
                address.is_default = false;
            }
        });
    },
    /**
     * @deprecated 5/27/19 - this returned basic name and address info and has been superseded by User Profile info
     */
    setSkaterInfo: function (state, info: SkaterInfo) {
        state.info = info;
    },
    setBillingAddresses: function (state, billing_addresses: BillingAddress[]) {
        state.billing_addresses = billing_addresses;
    },
    setActiveCompetitionEventIDs: function (state, event_ids: number[]) {
        state.active_competition_registered_event_ids = event_ids;
    },

    addSessionToSchedule: function (state, scheduled_session: ScheduledSession) {
        state.active_schedule.add(scheduled_session);
    },
    removeSessionFromSchedule: function (state, scheduled_session: ScheduledSession) {
        state.active_schedule.remove(scheduled_session);
    },
    decrementCredit: function (state, {event_id, type}) {
        state.competition_credits.decrement(event_id, type);
    },
    incrementCredit: function (state, {event_id, type}) {
        state.competition_credits.increment(event_id, type);
    },
    setActiveSchedule: function (state, payload: SkaterScheduleStateArgs) {
        state.active_schedule = new SkaterSchedule(payload.sessions, payload.events);
        state.skater.schedule = state.active_schedule;
        state.active_competition_registered_event_ids = payload.events.map(function (event: SkatingEvent) {
            return event.id;
        });
        state.schedule_loaded = true;

    },
    setCompetitionCredits: function (state, payload: SkaterCredits) {
        state.competition_credits = payload;
        state.skater.credits = payload;
        state.credits_loaded = true;
    },
    /**
     * Called from Cart State
     */
    setSkaterCart: function (state, payload: Cart) {
        state.skater.cart = payload;
    },

    /**
     * Commit the edit of a BillingAddress to State
     */
    editAddress: function (state, updated_address: BillingAddress): void {
        for (let i = 0; i < state.billing_addresses.length; i++) {
            let billing_address = state.billing_addresses[i];
            if (billing_address.id === updated_address.id) {
                state.billing_addresses[i] = updated_address;
                break;
            }
        }
    },
    /**
     * Commit the creation of a BillingAddress to State
     */
    addAddress: function (state, billing_address: BillingAddress) {
        state.billing_addresses.push(billing_address);
    },

    setCompetitionEventCoaches: function (state, event_coaches: SkaterCoachedEventCategoryCollection) {
        state.active_competition_coach_events = event_coaches;
    },

    removeCoach: function (state, payload: CoachRemovePayload) {
        let {coach, event_category_id} = payload;
        let coach_id = coach.id;
        state.active_competition_coach_events.remove(event_category_id, coach_id)
    },

    addCoach: function (state, payload: CoachAddPayload) {
        let {coach, event_category_id} = payload;
        state.active_competition_coach_events.add(event_category_id, coach);
    },

    replaceCoach: function (state, payload: CoachReplacePayload) {
        let {coach, event_category_id, previous_coach_id} = payload;
        state.active_competition_coach_events.replace(event_category_id, previous_coach_id, coach);
    },
    /**
     * Commit a set of active skating event segments to state
     */
    setActiveSkatingEventSegments: function (state, skating_event_segments: SkaterSkatingEventSegment[]) {
        state.active_skating_event_segments = skating_event_segments;
    }
};


export const SkaterState = {
    namespaced: true,
    state: new State(),
    actions: actions,
    getters: getters,
    mutations: mutations
};