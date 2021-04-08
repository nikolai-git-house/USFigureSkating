import {PaginationOption, PerPageOption} from "../contracts/AppContracts";

export type SearchResultsSpread = { start: number; end: number };
export default class SearchResultHelpers {
    static getSpread(result_count: number, active_page_index: number, per_page: PerPageOption): SearchResultsSpread {
        if (result_count === 0) {
            return {
                start: 0,
                end: 0
            }
        }
        let start = 1;
        let end = result_count;
        if (typeof per_page === "number") {
            start = per_page * active_page_index + 1;
            end = per_page * (active_page_index + 1);
        }
        return {
            start: start,
            end: end < result_count ? end : result_count
        }
    }

    /**
     * Create pagination that always contains 7 items (unless source pages are shorter)
     * Pagination always includes first and last page
     * Pagination contains 5 remaining items surrounding the active page
     * For non-sequential pagination elements, display ellipsis.
     */
    static getPaginationOptions(paginated_data: any[], active_page_index: number): PaginationOption[] {
        let first_page: PaginationOption = {
            page_number: 1,
            page_index: 0
        };
        let last_page: PaginationOption = {
            page_number: paginated_data.length,
            page_index: paginated_data.length - 1
        };

        let result: PaginationOption[] = [
            first_page,
            last_page
        ];

        /**
         * If only 1 page of data, return the first item in our result set
         */
        if (paginated_data.length === 1) {
            return result.splice(0, 1);
        }


        let spread: PaginationOption[] = SearchResultHelpers.getPaginationSpread(paginated_data, active_page_index);

        result.splice(1, 0, ...spread);


        /**
         *
         */
        return result.map(function (item: any, index: number): PaginationOption {
            /**
             * Preserve first and last items
             */
            if (index === 0 || index === result.length - 1) {
                return item;
            }

            let previous_item = result[index - 1];
            let next_item = result[index + 1];
            /**
             * If a next item isn't sequentially 1 step above the current, replace current with ellipsis
             */
            if (next_item && next_item.page_number > item.page_number + 1) {
                return {
                    page_number: "...",
                    page_index: false
                }
            }
            /**
             * If a previous item isn't sequentially 1 step below the current, replace current with ellipsis
             */
            if (previous_item && previous_item.page_number < item.page_number - 1) {
                return {
                    page_number: "...",
                    page_index: false
                }
            }
            return item;
        });


    }

    /**
     * Get the spread of pages surrounding the active page
     */
    static getPaginationSpread(paginated_data: any[], active_page_index: number): PaginationOption[] {
        let full_spread_length = 5;
        let spread: PaginationOption[] = [];
        let max_spread = paginated_data.length - 2;
        let spread_length = max_spread < full_spread_length ? max_spread : full_spread_length;

        /**
         * Add the active page first if it's not the first or last page
         */
        let active_page_not_first = active_page_index > 0;
        let active_page_not_last = active_page_index < paginated_data.length - 1;
        if (active_page_not_first && active_page_not_last) {
            spread.push({
                page_number: active_page_index + 1,
                page_index: active_page_index
            })
        }


        /**
         * Build the spread according to it's length.
         *
         * Add previous pages while applicable before the current spread
         * Add next pages while applicable to the end of the spread
         */
        for (let j = 1; j <= spread_length; j++) {
            let previous_index = active_page_index - j;
            let next_index = active_page_index + j;
            if (previous_index > 0) {
                spread.unshift({
                    page_number: previous_index + 1,
                    page_index: previous_index
                })
            }
            if (next_index < paginated_data.length - 1) {
                spread.push({
                    page_number: next_index + 1,
                    page_index: next_index
                })
            }
            if (spread.length >= spread_length) {
                break;
            }
        }
        return spread;
    }
}