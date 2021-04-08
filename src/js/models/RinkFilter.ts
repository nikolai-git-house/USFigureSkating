import {RinkScheduleFiltersContract, ViewFilter} from "../contracts/RinkScheduleFiltersContracts";
import {SessionCollection} from "./Collections/SessionCollection";
import {Session} from "./Sessions/Session";
import {CompetitionInformation} from "./Competition/CompetitionInformation";
import {Skater} from "./Skater";
import {SessionValidator} from "./SessionValidator";
import {SalesWindowKey} from "../contracts/AppContracts";


interface ViewFilterParams extends FiltererSupportingArgs {
    sessions: SessionCollection;
}

interface FiltererSupportingArgs {
    competition_information: CompetitionInformation,
    skater: Skater,
    active_sales_window: SalesWindowKey
}

export class RinkSessionFilterer {
    [key: string]: any

    static filterDate(datestamp: (number | null), sessions: SessionCollection): SessionCollection {
        return sessions.filterDate(datestamp);
    }

    static filter(filters: RinkScheduleFiltersContract, rink_sessions: SessionCollection, support_args: FiltererSupportingArgs): SessionCollection {
        let date_filtered_sessions = RinkSessionFilterer.filterDate(filters.date, rink_sessions);
        let view_filtered = RinkSessionFilterer.filterView(filters.view, {
            sessions: date_filtered_sessions,
            ...support_args
        });
        return view_filtered.orderDate();
    }

    /**
     * Return sessions that meet the following criteria:
     * 1. WU/UPI/OPI
     * 4. Not full
     * 2. Not in the skater's schedule
     * 3. Not in the skater's cart
     * 5. Has any at least 1 session type that is skater selectable
     * 6. The session has at least 1 event the skater is registered for
     * 7. The session has at least 1 type the skater hasn't maxed out
     */
    static available_practice_ice(parameters: ViewFilterParams): SessionCollection {
        let {skater, competition_information, active_sales_window} = parameters;

        let session_validator = new SessionValidator(skater, competition_information, active_sales_window);

        return new SessionCollection(parameters.sessions.all().filter(function (session: Session) {
            let validation_result = session_validator.validate(session);
            return validation_result.available;
        }));
    }


    /**
     * Filter sessions that are either in the skater's cart or schedule within the current set of rink sessions
     */
    static my_schedule(parameters: ViewFilterParams): SessionCollection {
        return parameters.sessions.intersect(
            parameters.skater.cart.sessions
                .combine(parameters.skater.schedule.sessions)
        );
    }

    /**
     * Return all sessions
     */
    static event_schedule(parameters: ViewFilterParams): SessionCollection {
        return parameters.sessions;
    }

    /**
     * Filter based on the user's view selection.
     *
     * If "event schedule" is selected, return only its result
     */
    private static filterView(view_keys: ViewFilter[], view_filter_params: ViewFilterParams) {
        if (view_keys.indexOf("event_schedule") === -1) {
            let result = new SessionCollection([]);
            for (let i = 0; i < view_keys.length; i++) {
                let key = view_keys[i];
                result = result.combine(RinkSessionFilterer[key](view_filter_params)); //add unique elements of filter to result
            }
            return result;
        }
        return RinkSessionFilterer.event_schedule(view_filter_params);

    }
}