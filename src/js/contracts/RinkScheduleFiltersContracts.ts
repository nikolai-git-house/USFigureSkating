export type ViewFilter = 'available_practice_ice' | 'my_schedule' | 'event_schedule';

export interface RinkScheduleFiltersContract {
    view: ViewFilter[];
    date: (number | null);
}

export interface FilterContract {
    label: string;
    value: any;
}

export interface DateFilterContract extends FilterContract {
    value: (number | null);
}

export class RinkScheduleActiveFilters implements RinkScheduleFiltersContract {
    view: ViewFilter[] = ["available_practice_ice", "my_schedule"];
    date: (number | null) = null;
}