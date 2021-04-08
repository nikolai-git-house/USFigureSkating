import {ActionTree, GetterTree, MutationTree} from "vuex"
import {SelectedSession} from "../../models/Sessions/SelectedSession";
import {
    SelectedSessionArgs, SelectedSessionMessage, SessionLike,
    SessionSelectionActionRequired
} from "../../contracts/AppContracts";
import {SessionSelector, SessionSelectorParameters} from "../../models/Sessions/SessionSelector";
import {SessionValidator, SessionValidatorResult} from "../../models/SessionValidator";

/**
 * The reactive state of competitions
 */
export class State {

}

/**
 * Accessors for computed competition state properties
 */
const getters = <GetterTree<State, any>>{};

/**
 * Perform (potentially async) actions with the state
 */
const actions = <ActionTree<State, any>>{
    /**
     * Session selection global logic.
     * Needs to occur on the state layer due to the involvement of multiple state properties
     */
    select: function (context, session_args: SelectedSessionArgs): Promise<SelectedSessionMessage | SessionSelectionActionRequired> {
        let active_sales_window = context.rootGetters['competitions/active_sales_window'];


        const competition_information = context.rootState.competitions.competition_information; //define var for legibility
        let scheduled_session;
        let session_validation_result: SessionValidatorResult;
        let session_selector_args: SessionSelectorParameters;
        let session_selector: SessionSelector;
        let selected_session: SelectedSession;
        let compiled_session: SessionLike;


        /**
         * Compile selected session args to run validation against
         */
        compiled_session = {
            id: session_args.session.id,
            type_key: session_args.session.type_key,
            is_full: session_args.session.is_full,
            event_ids: session_args.selected_event_id ? [session_args.selected_event_id] : session_args.session.event_ids,
            credit_types: session_args.selected_session_type ? [session_args.selected_session_type] : session_args.session.credit_types
        };

        /**
         * Validate the selected session and any specified arguments
         */
        session_validation_result = new SessionValidator(context.rootState.skater.skater, competition_information, context.rootGetters['competitions/active_sales_window']).validate(compiled_session);
        /**
         * If the session is in the schedule, get the scheduled version
         */
        if (session_validation_result.session_in_schedule) {
            scheduled_session = context.rootState.skater.active_schedule.findScheduledSession(session_args.session.id);
        }

        /**
         * Build the session selector
         */
        session_selector_args = {
            dispatcher: context.dispatch,
            competition_information,
            skater_credits: context.rootState.skater.competition_credits,
            session_in_schedule: scheduled_session,
            session_in_cart: session_validation_result.session_in_cart,
            active_sales_window: active_sales_window
        };
        session_selector = new SessionSelector(session_selector_args);

        /**
         * Create a selected session out of state vars
         */
        selected_session = new SelectedSession(session_args, competition_information, session_validation_result);

        /**
         * Process the selection
         */
        return session_selector.processSelection(selected_session);
    },

};

/**
 * Change reactive data
 */
const mutations = <MutationTree<State>>{};

/**
 * Export the state module
 */
export const SessionState = {
    namespaced: true,
    state: new State(),
    getters: getters,
    mutations: mutations,
    actions: actions
};


