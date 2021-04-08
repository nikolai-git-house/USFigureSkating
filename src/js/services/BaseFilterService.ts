/**
 * Base level filterer with abstract filter methods
 */
export class BaseFilterService {
    /**
     * Whether a value passes a string filter
     */
    protected static valuePassesStringFilter(source_value: string, filter_value: string): boolean {
        return !!source_value.toLowerCase()
            .match(filter_value.toLowerCase());

    }
}