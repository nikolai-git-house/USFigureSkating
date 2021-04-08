import Vue from "vue";
import Vuex from "vuex";
import {CompetitionState} from "./Modules/CompetitionsState";
import {SkaterState} from "./Modules/SkaterState";
import {CartState} from "./Modules/CartState";
import {
    CompetitionScheduleStateArgs,
    EventCreditConfig,
    EventIndexedCreditLimits,
    PracticeIceSchedulesStateArgs,
    SkaterScheduleStateArgs
} from "../contracts/AppContracts";
import {SessionState} from "./Modules/SessionState";
import {CreditRule, SkatingEvent} from "../models/SkatingEvent";
import {AppState} from "./Modules/AppState";
import {CoachState} from "./Modules/CoachState";
import {UserState} from "./Modules/UserState";
import {AppService} from "../services/AppService";
import {TeamsState} from '../Teams/TeamsState';
import {CompetitionPortalState} from '../CompetitionPortal/_store/CompetitionPortalState';

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        app: AppState,
        cart: CartState,
        coach: CoachState,
        competition_portal: CompetitionPortalState,
        competitions: CompetitionState,
        session: SessionState,
        skater: SkaterState,
        teams: TeamsState,
        user: UserState
    },
    actions: {
        /**
         * Get the Skater and Competition Schedules for Practice Ice
         *
         * @deprecated 2020-07-13: see src/js/CompetitionPortal/_store/CompetitionPortalPracticeIceState.ts:13
         */
        getPracticeIceSchedulesData: function (context, competition_id: number) {
            return new Promise(function (resolve, reject) {
                AppService.getPracticeIceSchedules(competition_id).then(function (parsed_schedules: PracticeIceSchedulesStateArgs) {
                    let competition_schedule_args: CompetitionScheduleStateArgs = {
                        result: parsed_schedules.competition_schedule,
                        competition: context.rootGetters['competitions/active_competition']
                    };
                    let skater_schedule_args: SkaterScheduleStateArgs = parsed_schedules.skater_schedule_args;

                    context.commit('competitions/setCompetitionSchedule', competition_schedule_args, {root: true});
                    context.commit('skater/setActiveSchedule', skater_schedule_args, {root: true});

                    resolve();
                }).catch(function () {
                    reject();
                });
            });
        }
    },
    getters: {
        credit_purchase_available: function (state, getters): boolean {
            return !!getters['purchasable_credits'].length;
        },
        skater_events: function (state) {
            let skater_event_ids = state.skater.active_schedule.event_ids;
            let competition_events = state.competitions.active_competition_events;
            return competition_events.filter(function (event: SkatingEvent) {
                return skater_event_ids.indexOf(event.id) !== -1;
            })
        },
        /**
         * Get an EventID-indexed collection of credit limits for each event for which the skater is registered for
         */
        indexed_skater_event_credit_limits: function (state, getters): EventIndexedCreditLimits {
            return getters['skater_events'].reduce(function (accumulator: EventIndexedCreditLimits, event: SkatingEvent) {
                accumulator[event.id] = event.getCreditLimits();
                return accumulator;
            }, {});
        },

        available_credit_packages: function (state, getters) {
            return getters['skater_events'].reduce(function (accumulator: any[], event: SkatingEvent) {
                if (event.credit_packages.length) {
                    accumulator.push({
                        name: event.name,
                        competition_id: event.competition_id,
                        id: event.id,
                        packages: event.credit_packages
                    });
                }
                return accumulator;
            }, []);
        },

        /**
         * Get a list of EventCreditConfigs containing each event for which the skater is registered and how many
         * credits of each type are still available for purchase, along with their costs.
         *
         * Do not include credit types that are not available (limit=0)
         * Do not include events with available credit types
         *
         * For every event for which the skater is registered...
         *  For every type within the event for which one can buy credits (competition configuration/sales window)
         *      Return the event, and each associated CreditRule with its limits reduced by the spent credits
         */
        purchasable_credits: function (state, getters): EventCreditConfig[] {
            let purchasable_credit_types = getters['competitions/purchasable_credit_types'];

            /**
             * If there's not any non selectable types, no credits are available for purchase
             */
            if (purchasable_credit_types.length === 0) {
                return [];
            }


            let skater_events = getters['skater_events'];
            let used_credits = state.skater.skater.getAcquiredCredits();
            // create array with skater's events as the base
            return skater_events.reduce(function (array: EventCreditConfig[], event: SkatingEvent) {
                let event_purchasable_credit_rules: CreditRule[] = event.getCreditRules(purchasable_credit_types);
                let event_used_credits = used_credits[event.id];


                // create list of credit rules, with limits set by configured limit reduced by skater's used amount
                // if a defined credit limit is 0, do not include it
                let reduced_credit_rules = event_purchasable_credit_rules.reduce(function (accumulator: CreditRule[], credit_rule: CreditRule) {
                    if (credit_rule.limit > 0) {
                        let reduced_limit = credit_rule.limit - event_used_credits[credit_rule.key];
                        let result = {
                            ...credit_rule,
                            limit: reduced_limit >= 0 ? reduced_limit : 0
                        };
                        accumulator.push(result);
                    }
                    return accumulator;
                }, []);
                if (reduced_credit_rules.length > 0) {
                    array.push({
                        event: {
                            name: event.name,
                            id: event.id
                        },
                        purchasable_credits: reduced_credit_rules
                    });
                }
                return array
            }, []);

        }
    }
});