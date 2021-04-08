import {SkaterEventCategoryCoach} from "../contracts/AppContracts";
import {AssignableMember, MemberAssignmentCategory} from "../contracts/app/CompetitionRegistrationContracts";

export interface SkaterCoachedEventCategoryArgs {
    id: number
    name: string
    coach_limit: number
    coaches: SkaterEventCategoryCoach[]
};

export class SkaterCoachedEventCategory implements MemberAssignmentCategory {
    id: number;
    name: string;
    coach_limit: number;
    coaches: SkaterEventCategoryCoach[];


    constructor(parameters: SkaterCoachedEventCategoryArgs) {
        let {id, name, coach_limit, coaches} = parameters;
        this.id = id;
        this.name = name;
        this.coach_limit = coach_limit;
        this.coaches = coaches;
    }

    get coach_limit_met(): boolean {
        return this.coaches.length >= this.coach_limit;
    }

    get members(): AssignableMember[] {
        return this.coaches;
    }

    get member_limit(): number {
        return this.coach_limit;
    }
}