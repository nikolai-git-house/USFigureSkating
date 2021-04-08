/* eslint-disable */
import {CompetitionInformation} from "./Competition/CompetitionInformation";
import {Skater} from "./Skater";
import {SkaterSchedule} from "./Schedule/SkaterSchedule";
import {IndexedEventCreditList, SalesWindowKey, SessionLike, SessionType, SessionTypeKey} from "../contracts/AppContracts";
import {SkaterCredits} from "./Credits/SkaterCredits";

export interface SessionValidatorResult {
    valid: boolean,
    tests: {
        selectable_category: boolean,
        session_not_full: boolean,
        session_and_skater_share_events: boolean,
        session_and_competition_share_types: boolean,
        has_non_maxed_credit_types: boolean,
        selection_window_credits_available: boolean,
        is_not_on_site_sales: boolean,
    },
    session_in_schedule: boolean,
    session_in_cart: boolean,
    valid_event_ids: number[]
    schedulable_types_from_session: SessionType[],
    available: boolean;
}

export class SessionValidator {
    skater: Skater;
    competition_information: CompetitionInformation;
    active_sales_window: SalesWindowKey;
    valid_type_keys: SessionTypeKey[] = ['warm_up', 'practice_ice'];
    skater_schedule: SkaterSchedule;
    skater_credits: SkaterCredits;
    schedule_session_ids: number[];
    cart_session_ids: number[];
    skater_filled_session_types: IndexedEventCreditList;
    event_limits: IndexedEventCreditList;
    default_validation_result = {
        valid: true,
        tests: {
            selectable_category: true,
            session_not_full: true,
            session_and_skater_share_events: true,
            session_and_competition_share_types: true,
            has_non_maxed_credit_types: true,
            selection_window_credits_available: true,
            is_not_on_site_sales: true
        },
        session_in_schedule: false,
        session_in_cart: false,
        available: true
    };

    constructor(skater: Skater, competition_information: CompetitionInformation, active_sales_window: SalesWindowKey) {
        this.skater = skater;
        this.competition_information = competition_information;
        this.active_sales_window = active_sales_window;
        this.skater_schedule = skater.schedule;
        this.skater_credits = skater.credits;
        this.schedule_session_ids = skater.schedule.session_ids;
        this.cart_session_ids = skater.cart.session_ids;
        this.skater_filled_session_types = skater.getSpentCredits(competition_information.schedulable_session_types);
        this.event_limits = competition_information.getEventsTypeLimits();

    }

    /*
      * Validate whether a session is available (available) or able to be interacted with by the user (valid)
      * Available:
      * Session is PI type
      * Session isn't full
      * Session isn't in schedule
      * Session isn't in cart
      * Session belongs to an event for which skater is registered
      * Of the types on the session, and the events for which  the skater is registered, no credit limits have been exceeded or the user has applicable unscheduled credits
      *
      * Selectable:
      * Session is PI type
      * Session isn't full
      * Session isn't in schedule
      * Session isn't in cart
      * Session belongs to an event for which skater is registered
      * Session has selectable type
      * Of the types on the session, and the events for which  the skater is registered, no credit limits have been exceeded or the user has applicable unscheduled credits
      * The window is selection, and the skater has applicable credits
      * The active sales window isn't on site
      */
    validate(session: SessionLike): SessionValidatorResult {
        let result = {...this.default_validation_result};
        /**
         * 1. Session isn't practice ice or Warm Up
         */
        if (this.valid_type_keys.indexOf(session.type_key) === -1) {
            result.tests.selectable_category = false;
            result.valid = false;
            result.available = false;
        }
        /**
         * 4. Session is full
         */
        if (session.is_full) {
            result.valid = false;
            result.available = false;
            result.tests.session_not_full = false;
        }


        /**
         * 2. Session is already in schedule
         */
        if (this.schedule_session_ids.indexOf(session.id) !== -1) {
            result.available = false;
            result.session_in_schedule = true;
        }

        /**
         * 3. Session is already in cart
         */
        if (this.cart_session_ids.indexOf(session.id) !== -1) {
            result.available = false;
            result.session_in_cart = true;
        }

        /**
         * 6. Session doesn't have any events for which the skater is registered
         * @refactor remove skater_schedule dependency
         */
        let valid_event_ids: number[] = this.skater_schedule.filterAvailableSessionEventIds(session);
        if (valid_event_ids.length === 0) {
            result.valid = false;
            result.available = false;
            result.tests.session_and_skater_share_events = false;
        }


        /**
         * 5. Session doesn't have any selectable types
         * Note - these sessions are available, but not selectable
         */
        let schedulable_types_from_session: SessionType[] = this.competition_information.filterSessionSchedulableTypes(session);
        if (schedulable_types_from_session.length === 0) {
            result.valid = false;
            result.tests.session_and_competition_share_types = false;
        }


        /**
         * 7. Within the events the skater and session share, at least one of the session's credit type hasn't exceeded the max
         */
        if (!SessionValidator.checkLimits(valid_event_ids, this.event_limits, session.credit_types, this.skater_filled_session_types, this.skater_credits)) {
            result.valid = false;
            result.available = false;
            result.tests.has_non_maxed_credit_types = false;
        }

        /**
         * W-1
         * If active sales window is selection and the user doesn't have credits, invalid
         * in this case, it's still available
         */
        if (this.active_sales_window === "selection" && !SessionValidator.sessionCanBeScheduled(session, this.skater_credits)) {
            result.valid = false;
            result.tests.selection_window_credits_available = false;
        }

        /**
         * W-2
         */
        if (this.active_sales_window === "on_site") {
            result.valid = false;
            result.tests.is_not_on_site_sales = false;
        }

        return {...result, valid_event_ids, schedulable_types_from_session};


    }


    /**
     * Check to see if any of the session type/event id combinations have not yet been maxed out
     *
     * @param event_ids all the session's event id's the skater qualifies for
     * @param event_caps - the caps for each type for each event
     * @param session_types - the session types belonging to the session that are skater selectable
     * @param spent_credits - the config for the spent credits by the skater
     * @param skater_credits - active skater credits
     */
    static checkLimits(event_ids: number[], event_caps: IndexedEventCreditList, session_types: SessionType[], spent_credits: IndexedEventCreditList, skater_credits: SkaterCredits): boolean {

        for (let i = 0; i < event_ids.length; i++) {
            let event_id: number = event_ids[i];

            let event_credit_limits = event_caps[event_id];
            for (let j = 0; j < session_types.length; j++) {
                let session_type = session_types[j];
                let available_amount = event_credit_limits[session_type] - spent_credits[event_id][session_type];
                if (available_amount > 0) {
                    return true;
                }
                if (skater_credits.creditsAvailable(event_id, session_type)) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * Check to see if any of the event/type combinations on the session have user credits available
     */
    private static sessionCanBeScheduled(session: SessionLike, skater_credits: SkaterCredits) {
        let event_ids = session.event_ids;
        let session_types = session.credit_types;
        for (let i = 0; i < event_ids.length; i++) {
            let event_id: number = event_ids[i];
            for (let j = 0; j < session_types.length; j++) {
                let session_type = session_types[j];
                if (skater_credits.creditsAvailable(event_id, session_type)) {
                    return true;
                }
            }
        }
        return false;
    }
}

