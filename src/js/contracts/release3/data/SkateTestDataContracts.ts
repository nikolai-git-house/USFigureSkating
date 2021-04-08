import {FormOptionData} from "./CommonDataContracts";
import {SkateTestDisciplineKey} from "../../app/SkateTestContracts";

/**
 * Represents data for a form option for skate test selection
 */
export interface SkateTestFormOptionData extends FormOptionData {
    level_id: number; // Indicates the relative level of the skate test
}

/**
 * Data structure used when adding a new self-reported Skate Test.
 * If a club_id is present, the user has picked a specific club from the club list.  If not, the user has simply
 * typed in the club name.
 */
export interface IndividualSkateTestData {
    test: any;                             // [primitive] The 'value' of the SkateTestFormOption selected for the test
    club: string;                          // The club name associated with the Skate Test
    club_id: number | string | null;       // The club identifier, if applicable, associated with the Skate Test
    date: string;                          // The date of the Skate Test
}

/**
 * Represents a Skate Test that has been saved, whether official or self, reported
 */
export interface SavedSkateTestData {
    id: number;                     // Unique identifier for the saved skate test
    name: string;                   // corresponds to the label of the selected SkateTestFormOption
    is_self_reported: boolean;      // Whether the skate test is self-reported
}

/**
 * Represents the Skate Test summary for a specific discipline/category
 */
interface SkateTestHistoryDisciplineData {
    label: string;                                  // The name of the discipline
    key: SkateTestDisciplineKey;                    // The identifying key for the discipline.  Used in creation of UserAddSkateTestAPIPayload
    key_test: SavedSkateTestData[];                 // The test(s) to display on Skate Test summary.  Array to accommodate
                                                    // multiple "Dance" display tests, but most instances will only have one
                                                    // item in the array
    available_tests: SkateTestFormOptionData[];     // Based on the state of the user's skate tests, the available options
                                                    // for the form, for this discipline, should the user choose to add a self-reported test
    self_reported_tests: SavedSkateTestData[];      // The list of self-reported tests the user has for this discipline
}

/**
 * The complete summary of a user's skate test history along with self-report test options
 */
export interface UserSkateTestHistoryData {
    disciplines: SkateTestHistoryDisciplineData[];  // Array of the disciplines, and their associated data, for display
}