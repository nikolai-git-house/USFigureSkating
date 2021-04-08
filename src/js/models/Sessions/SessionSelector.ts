import {SelectedSession} from "./SelectedSession";
import {Dispatch} from "vuex";
import {ScheduledSession} from "./ScheduledSession";
import {CompetitionInformation} from "../Competition/CompetitionInformation";
import {SkaterCredits} from "../Credits/SkaterCredits";
import {
    CartSessionPayload, SalesWindowKey, SelectedSessionMessage, SelectedSessionMessageAction,
    SelectedSessionOutcome, SelectedSessionRejection, SelectedSessionSecondaryActionRequired,
    SessionRemovalConfirmationNeeded, SessionSelectionActionRequired
} from "../../contracts/AppContracts";
import {SkatingEvent} from "../SkatingEvent";

export interface SessionSelectorParameters {
    dispatcher: Dispatch;
    competition_information: CompetitionInformation;
    skater_credits: SkaterCredits;
    session_in_cart: boolean;
    session_in_schedule: ScheduledSession | undefined;
    active_sales_window: SalesWindowKey;
}

export class SessionSelector {

    static ConfirmRemovalFromSchedule: Promise<SessionRemovalConfirmationNeeded> = new Promise(function (resolve) {
        resolve({
            secondary_action: "confirm_removal",
        });
    });
    static ScheduledEventCannotBeRemoved: Promise<SelectedSessionMessage> = new Promise(function (resolve) {
        resolve({
            message: "This session can only be removed by an an event administrator.",
            type: "error",
            secondary_action: false
        });
    });
    private _dispatcher: Dispatch;
    private competition_information: CompetitionInformation;
    private skater_credits: any;
    private session_in_cart: boolean;
    private session_in_schedule?: ScheduledSession;
    private active_sales_window: SalesWindowKey;

    constructor(parameters: SessionSelectorParameters) {
        this._dispatcher = parameters.dispatcher;
        this.session_in_cart = parameters.session_in_cart;
        this.session_in_schedule = parameters.session_in_schedule;
        this.competition_information = parameters.competition_information;
        this.skater_credits = parameters.skater_credits;
        this.active_sales_window = parameters.active_sales_window;
    }

    public processSelection(selected_session: SelectedSession): Promise<SelectedSessionOutcome | SessionSelectionActionRequired> {
        if (this.session_in_cart) {
            return this.removeFromCart(selected_session);
        }
        if (this.session_in_schedule) {
            return this.attemptRemoveFromSchedule(selected_session, this.session_in_schedule);
        }
        return this.attemptSelection(selected_session);
    }

    public attemptSelection(selected_session: SelectedSession): Promise<SelectedSessionMessage | SessionSelectionActionRequired> {
        let selected_session_export_result = selected_session.export();
        if (selected_session_export_result.success) {
            return this.handleValidSelection(selected_session_export_result.exported_session);
        }
        return this.handleInvalidSelection(selected_session_export_result);
    }

    public removeFromCart(selected_session: SelectedSession): Promise<SelectedSessionMessageAction> {
        let dispatcher = this._dispatcher;
        return new Promise(function (resolve, reject) {
            dispatcher('cart/removeSession', selected_session, {root: true}).then(function (resolution_function: Function) {
                resolve({
                    message: "Removed from cart.",
                    type: "error",
                    secondary_action: false,
                    resolution_function
                });
                return;
            }).catch(function () {
                reject('Error removing from cart.');
                return;
            });
        });
    }

    attemptRemoveFromSchedule(selected_session: SelectedSession, scheduled_session: ScheduledSession): Promise<SelectedSessionOutcome | SessionRemovalConfirmationNeeded> {
        if (this.active_sales_window === "on_site") {
            return SessionSelector.ScheduledEventCannotBeRemoved;
        }
        if (!this.competition_information.sessionTypeIsSelectable(scheduled_session.scheduled_as)) {
            return SessionSelector.ScheduledEventCannotBeRemoved;
        }
        if (!selected_session.session_args.action_confirmed) {
            return SessionSelector.ConfirmRemovalFromSchedule;
        }
        return this.removeSessionFromSchedule(scheduled_session);
    }

    handleValidSelection(processable_session: ScheduledSession): Promise<SelectedSessionMessageAction> {
        let skater_credits = this.skater_credits;
        if (skater_credits.creditsAvailable(processable_session.scheduled_event_id, processable_session.scheduled_as)) {
            return this.addToSchedule(processable_session);
        }
        return this.addToCart(processable_session);
    }

    addToSchedule(processable_session: ScheduledSession): Promise<SelectedSessionMessageAction> {
        let dispatcher = this._dispatcher;
        return new Promise(function (resolve, reject) {
            dispatcher('skater/addSessionToSchedule', {
                scheduled_session: processable_session
            }, {root: true}).then(function (resolution_function: Function) {
                resolve({
                    message: "Added to Schedule",
                    type: "success",
                    secondary_action: false,
                    resolution_function
                });
            }).catch(function () {
                reject('Error Adding to schedule');
            });
            return;
        });
    }

    public handleInvalidSelection(validation_result: SelectedSessionSecondaryActionRequired | SelectedSessionRejection): Promise<SelectedSessionMessage | SessionSelectionActionRequired> {
        let result = validation_result;
        return new Promise(function (resolve) {
            if (result.secondary_action) {
                return resolve({
                    secondary_action: result.secondary_action_key,
                    secondary_action_args: result.secondary_action_args
                });
            }
            return resolve({
                type: 'error',
                message: result.rejection_message,
                secondary_action: false
            });
        });
    }

    private removeSessionFromSchedule(scheduled_session: ScheduledSession): Promise<SelectedSessionMessageAction> {
        let dispatcher = this._dispatcher;
        return new Promise(function (resolve, reject) {
            return dispatcher('skater/removeSessionFromSchedule', {
                scheduled_session: scheduled_session
            }, {root: true}).then(function (resolution_function: Function) {
                resolve({
                    message: "Removed from schedule.",
                    type: "error",
                    secondary_action: false,
                    resolution_function
                });
            }).catch(function () {
                reject('Error removing from schedule.');
            });
        });
    }

    private addToCart(processable_session: ScheduledSession): Promise<SelectedSessionMessageAction> {
        let dispatcher = this._dispatcher;
        let event_name = (this.competition_information.getEvent(processable_session.scheduled_event_id) as SkatingEvent).name;
        let payload: CartSessionPayload = {
            competition_id: this.competition_information.competition_id,
            event_name: event_name,
            session: processable_session,
            cost: this.competition_information.getEventTypeCost(processable_session.scheduled_event_id, processable_session.scheduled_as)
        };
        return new Promise(function (resolve, reject) {

            dispatcher('cart/addSession', payload, {root: true}).then(function (resolution_function: Function) {
                resolve({
                    message: "Added to cart",
                    type: "success",
                    secondary_action: false,
                    resolution_function
                });
            }).catch(function () {
                reject('Error Adding to Cart');
            });
        });
    }
}