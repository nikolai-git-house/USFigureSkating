import {PaginationOption} from "../contracts/AppContracts";
import SearchResultHelpers from "../helpers/SearchResultHelpers";

export type PaginatedList<T> = T[][]

/**
 * New service class to wrap previously-existing functions
 */
export class PaginationService {
    /**
     * Paginate an array of items
     */
    static paginate<T>(items: T[], per_page: number | string): PaginatedList<T> {
        if (items.length === 0) {
            return [[]];
        }
        let result: PaginatedList<any> = [];
        return items.reduce(function (accumulator, item, index) {
            let result_index = 0;
            if (typeof per_page === "number") {
                result_index = Math.floor(index / per_page);
            }
            if (!accumulator[result_index]) {
                accumulator[result_index] = [];
            }
            accumulator[result_index].push(item);
            return accumulator;
        }, result);
    }

    /**
     * Get the options to display in pagination
     */
    static paginationOptions(paginated_data: PaginatedList<any>, active_page_index: number): PaginationOption[] {
        return SearchResultHelpers.getPaginationOptions(paginated_data, active_page_index);
    }
}