import {SkaterCoachedEventCategory, SkaterCoachedEventCategoryArgs} from '../../../models/SkaterCoachedEventCategory';
import {CheckInSubEntitySkaterCoach} from '../EntityCheckIn/_models/CheckInSubEntitySkaterCoach';

interface CheckInSkaterCoachedEventCategoryArgs extends SkaterCoachedEventCategoryArgs {
    coaches: CheckInSubEntitySkaterCoach[];
}

export class CheckInSkaterCoachedEventCategory extends SkaterCoachedEventCategory {
    coaches: CheckInSubEntitySkaterCoach[];

    /**
     * Create a new CheckInSkaterCoachedEventCategory instance
     */
    constructor(parameters: CheckInSkaterCoachedEventCategoryArgs) {
        super(parameters);
        this.coaches = parameters.coaches;
    }

}