import {
    AbstractMemberSearchResultValidationFunction,
    GenderedMemberSearchResult
} from '../../contracts/app/MemberSearchContracts';
import {GenderKey} from '../../contracts/AppContracts';
import {SeriesApplication} from '../../SeriesRegistration/SeriesApplication/_contracts';

export class MemberSearchValidationFunctionFactory {
    [key: string]: () => AbstractMemberSearchResultValidationFunction<any>

    /**
     * Get validation function to ensure result can only be selected if of the opposite gender of the current user
     */
    public static opposite_gender(user_gender: GenderKey | null): AbstractMemberSearchResultValidationFunction<GenderedMemberSearchResult> {
        return function (member_result: GenderedMemberSearchResult): string | false {
            if (!user_gender) {
                return false;
            }

            return member_result.gender !== user_gender ? false : 'Must be opposite gender';
        };
    }

    /**
     * Get validation function to ensure result can only be selected if level compatibility with the current user exists
     */
    public static compatible_levels(compare_levels: SeriesApplication.ApplicationDisciplineLevel[]): AbstractMemberSearchResultValidationFunction<SeriesApplication.PartnerSearchResult> {
        return function (member_result: SeriesApplication.PartnerSearchResult): string | false {
            // eslint-disable-next-line arrow-parens,arrow-body-style
            const result_level_ids = member_result.eligible_levels.map(level => level.id);

            const intersection = compare_levels.filter((level: SeriesApplication.ApplicationDisciplineLevel) => {
                return result_level_ids.indexOf(level.id) !== -1;
            });

            return intersection.length ? false : 'Incompatible Partner';
        };
    }
}