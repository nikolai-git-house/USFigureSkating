import {
    CompetitionSearchCriteria,
    RegistrationListCompetition
} from "../contracts/app/CompetitionRegistrationContracts";
import {DateFilterer} from "./DateFilterer";

/**
 * Class to help search the competition list
 */
export class CompetitionSearchHelpers {
    /**
     * Whether a competition passes active filters
     */
    static competitionPassesFilter(competition: RegistrationListCompetition, search_criteria: CompetitionSearchCriteria) {
        let {search_field, search_term} = search_criteria;
        // Competition passes if no search field or term are present
        if (!search_field || !search_term) {
            return true;
        }
        let competition_field = search_field;

        // If the search field isn't the date, attempt a string match and return the result
        if (search_field !== "date") {
            if (competition_field in competition) {
                let competition_value = competition[competition_field];
                if (typeof competition_value === "string") {
                    return competition_value.toLowerCase().match(search_term.toLowerCase());
                }
            }
        }
        return this.passesDateFilter(competition, search_term);
    }

    /**
     * Whether a competition passes a user's date filter
     */
    private static passesDateFilter(competition: RegistrationListCompetition, search_term: string) {
        let start = new Date(competition.start_date_ts);
        let end = new Date(competition.end_date_ts);
        let filterer = new DateFilterer(start, end, search_term);
        return filterer.passed;
    }
}