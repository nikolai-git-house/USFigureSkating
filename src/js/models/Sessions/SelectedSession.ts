import {Session} from "./Session";
import {
    MultipleQualifyingEventsError, MultipleQualifyingTypesError, NullableSessionType, SelectedSessionArgs,
    SelectedSessionRejection, SelectedSessionSecondaryActionRequired, SelectedSessionValidationFailure,
    SelectedSessionValidationSuccess, SessionType, SingleMatchedQualifyingTypeError
} from "../../contracts/AppContracts";
import {CompetitionInformation} from "../Competition/CompetitionInformation";
import {SkatingEvent} from "../SkatingEvent";
import {ScheduledSession} from "./ScheduledSession";
import {SessionValidatorResult} from "../SessionValidator";

/**
 * @refactor: remove competition information dependency
 */
export class SelectedSession {
    public session: Session;
    public selected_event_id?: number;
    public selected_session_type?: SessionType;
    public reduced_event_id: number = -1;
    public reduced_session_type: NullableSessionType = "";
    public competition_information: CompetitionInformation;
    public qualifying_event_ids: number[];
    public session_args: SelectedSessionArgs;

    public selectable_types: SessionType[];
    validation_result: SessionValidatorResult;

    constructor(session_args: SelectedSessionArgs, competition_information: CompetitionInformation, validation_result: SessionValidatorResult) {

        this.validation_result = validation_result;
        this.session_args = session_args;
        this.competition_information = competition_information;
        this.session = session_args.session;
        this.qualifying_event_ids = validation_result.valid_event_ids;
        this.selectable_types = validation_result.schedulable_types_from_session;
        this.selected_event_id = session_args.selected_event_id;
        this.selected_session_type = session_args.selected_session_type;
        this.reduced_event_id = this.reduceEventId();
        this.reduced_session_type = this.reduceType();
    }

    private typeisSelectable(type: SessionType): boolean {
        return this.selectable_types.indexOf(type) !== -1;
    }

    private reduceType(): NullableSessionType {
        //if user has selected a session type and it's selectable
        if (this.session_args.selected_session_type && this.typeisSelectable(this.session_args.selected_session_type)) {
            return this.session_args.selected_session_type;
        }
        // selected session only has one type and it's selectable
        if (this.session_args.session.credit_types.length === 1 && this.typeisSelectable(this.session_args.session.credit_types[0])) {
            return this.session_args.session.credit_types[0];
        }
        return "";
    }

    private reduceEventId(): number {
        if (this.session_args.selected_event_id) {
            return this.session_args.selected_event_id;
        }
        if (this.qualifying_event_ids.length === 1) {
            return this.qualifying_event_ids[0];
        }
        return -1;
    }

    private exportSession(event_id: number, type: SessionType): ScheduledSession {
        return new ScheduledSession({
            session: this.session,
            scheduled_as: type,
            scheduled_event_id: event_id
        });
    }

    /**
     * Determine whether the user selected session can be scheduled or added to cart.
     * Validation Results indicate
     * 1. Whether the session is valid to be processed - Returns payload with success:true
     * 2. Whether the session requires further input to be processed
     * 2.a. Select event from multiple qualifying events
     * 2.b. Select session type from multiple qualifying session types
     * 3. Whether the user can't select the session
     * 3.a. Session does not belong to any of user's events
     * 3.b. Session type is not selectable based on competition configuration
     *
     */
    public export(): (SelectedSessionSecondaryActionRequired | SelectedSessionRejection) | SelectedSessionValidationSuccess {
        let validation_result = this.validation_result.tests;
        /**
         * WU/OPI/UPI - exclude event and resurface sessions
         */
        if (!validation_result.selectable_category) {
            return SelectedSession.nonSchedulableType();
        }

        /**
         * If session is full, not eligible
         */
        if (!validation_result.session_not_full) {
            return SelectedSession.sessionFull();
        }

        /**
         * If user doesn't have any event overlap, not eligible
         */
        if (this.qualifying_event_ids.length === 0) {
            return SelectedSession.skaterNotEligible();
        }

        /**
         * It's on site sales, no sessions are selectable
         * @note: [2018-06-08] - if we want to allow user to go through steps of selecting event and session type
         * only to be met with "PI managed on site" message, this can be lowered in the process.
         */
        if (!validation_result.is_not_on_site_sales) {
            return SelectedSession.onSiteSalesActive();
        }

        /**
         * Session has no selectable types - tell user to purchase credit
         */
        if (this.selectable_types.length === 0) {
            return this.sessionNotSelectable();
        }


        /**
         * If unable to distill a single qualifying event...
         * 1. Ask for feedback if the user qualifies for 2+
         * 2. Report not eligible
         */
        if (this.reduced_event_id === -1) {
            if (this.qualifying_event_ids.length > 1) {
                return this.multipleQualifyingEvents();
            }
            return SelectedSession.skaterNotEligible();
        }

        /**
         * It's the selection window and the user has no applicable credits available
         *
         * @note: placing after event refinement because messaging is limited to credit type
         * This could be placed before asking the user to select and event with no collateral damage
         */
        if (!validation_result.selection_window_credits_available) {
            return this.noSelectionCreditsAvailable();
        }

        /**
         * If unable to distill a single session type...
         * 1.
         */
        if (this.reduced_session_type === "") {
            if (this.selectable_types.length === 1) {
                let session_types = this.session_args.session.credit_types.slice();
                return this.singleQualifyingTypeAvailable(session_types)
            }
            if (this.selectable_types.length > 1) {
                return this.multipleQualifyingTypes();
            }
            /**
             * Case: this.selectable_types.length===0
             * This will have been handled earlier in the process, but it has been left here for legibility/maintainability
             * Given current structure, this should not execute
             */
            return this.sessionNotSelectable();
        }

        /**
         * User has reached the max credits
         */
        if (!validation_result.has_non_maxed_credit_types) {
            return this.maxTypeReached();
        }

        let exportedSession = this.exportSession(this.reduced_event_id, this.reduced_session_type);
        return SelectedSession.exportSuccess(exportedSession);
    }


    private static exportSuccess(exportedSession: ScheduledSession): SelectedSessionValidationSuccess {
        return {
            ...defaultSessionValidationResult,
            success: true,
            secondary_action: false,
            exported_session: exportedSession
        }
    }

    private maxTypeReached(): SelectedSessionRejection {
        return {
            ...defaultSessionValidationResult,
            rejection: true,
            secondary_action: false,
            rejection_message: "You have reached max " + this.reduced_session_type.toUpperCase()
        }
    }

    private sessionNotSelectable(): SelectedSessionRejection {
        return {
            ...defaultSessionValidationResult,
            secondary_action: false,
            rejection: true,
            rejection_message: "You cannot schedule this session type. Please purchase " + this.session_args.session.credit_types.join('/').toUpperCase() + " credit.",
        }
    }

    private noSelectionCreditsAvailable(): SelectedSessionRejection {

        let credit_type = this.validation_result.schedulable_types_from_session.join('/').toUpperCase();
        if (this.selected_session_type) {
            credit_type = this.selected_session_type.toUpperCase();
        }

        return {
            ...defaultSessionValidationResult,
            secondary_action: false,
            rejection: true,
            rejection_message: "You don’t have a " + credit_type + " credit available.",
        }
    }

    private multipleQualifyingTypes(): MultipleQualifyingTypesError {
        return {
            ...defaultSessionValidationResult,
            secondary_action: true,
            secondary_action_key: "select_type",
            secondary_action_args: {
                matched_types: this.selectable_types
            }
        }
    }

    private singleQualifyingTypeAvailable(session_types: SessionType[]): SingleMatchedQualifyingTypeError {
        let available_type = this.selectable_types[0];
        let alternate_types = session_types.slice();
        alternate_types.splice(alternate_types.indexOf(available_type), 1);

        return {
            ...defaultSessionValidationResult,
            secondary_action: true,
            secondary_action_key: "confirm_single_type",
            secondary_action_args: {
                available_type: available_type,
                alternate_types: alternate_types
            },
        };
    }

    private static skaterNotEligible(): SelectedSessionRejection {
        return {
            ...defaultSessionValidationResult,
            secondary_action: false,
            rejection: true,
            rejection_message: "You are not eligible for this session.",
        };
    }

    private static sessionFull(): SelectedSessionRejection {
        return {
            ...defaultSessionValidationResult,
            secondary_action: false,
            rejection: true,
            rejection_message: "This session is full.",
        };
    }

    private static nonSchedulableType(): SelectedSessionRejection {
        return {
            ...defaultSessionValidationResult,
            secondary_action: false,
            rejection: true,
            rejection_message: "This is not a practice ice session.",
        };
    }

    private static onSiteSalesActive(): SelectedSessionRejection {
        return {
            ...defaultSessionValidationResult,
            secondary_action: false,
            rejection: true,
            rejection_message: "All practice ice is managed onsite. Please see the LOC.",
        };
    }

    private multipleQualifyingEvents(): MultipleQualifyingEventsError {
        let self = this;
        return {
            ...defaultSessionValidationResult,
            secondary_action: true,
            secondary_action_key: "select_event",
            secondary_action_args: {
                matched_events: this.qualifying_event_ids.reduce(function (result: SkatingEvent[], id) {
                    let event = self.competition_information.getEvent(id);
                    if (event) {
                        result.push(event);
                    }
                    return result;
                }, [])
            },
        };
    }
}


const defaultSessionValidationResult: SelectedSessionValidationFailure = {
    success: false,
    secondary_action_key: '',
    secondary_action_args: {},
    secondary_action: false,
    rejection: false,
    rejection_message: "",
    exported_session: false
};

