import {FormState} from "../FormState";
import {SkateTestFormOption, SkateTestFormData} from "../../contracts/app/SkateTestContracts";

/**
 * Class to track state of Skate Test Discipline Form data
 */
export default class SkateTestDisciplineFormState extends FormState {
    test: SkateTestFormOption | null = null;
    club: string | null = null;
    club_id: number | null = null;
    date: string | null = null;

    constructor(default_club = true) {
        super();
        if (default_club) {
            this.club = "Foreign";
        }
    }

    /**
     * Export the form data state.
     * Flatten FormOptions
     */
    export(): SkateTestFormData {
        return {
            test: this.test ? this.test : {label: "None", value: null, level_id: 0},
            club: this.club ? this.club : '',
            date: this.date ? this.date : '',
            club_id: this.club_id ? this.club_id : null,
        }
    }


    import(data: SkateTestFormData | null) {
        if (!data) {
            return;
        }
        this.test = {...data.test};
        this.club = data.club;
        this.date = data.date;
    }
}