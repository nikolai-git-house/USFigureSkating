import {Session} from "../../models/Sessions/Session";
import {SkatingEvent} from "../../models/SkatingEvent";

/**
 * @refactor: there are some legacy properties on this that should be audited and removed
 */
export class SelectedSessionState {
    session: (Session | null) = null;
    confirmation_required: boolean = false;
    index: number = -1;
    action_confirmed: boolean = false;
    event_selection_required: boolean = false;
    event_options: SkatingEvent[] = [];
    selected_event_id: (number | null) = null;
    session_type_required: boolean = false;
    session_type_options: string[] = [];
    selected_session_type: string | null = null;
    confirm_single_type: boolean = false;
    confirm_available_type: string | null = null;
    alternate_types: string[] = [];

    reset() {
        this.session = null;
        this.confirmation_required = false;
        this.index = -1;
        this.action_confirmed = false;
        this.event_selection_required = false;
        this.event_options = [];
        this.selected_event_id = null;
        this.session_type_required = false;
        this.session_type_options = [];
        this.selected_session_type = null;
        this.confirm_single_type = false;
        this.confirm_available_type = null;
        this.alternate_types = [];
    }
}