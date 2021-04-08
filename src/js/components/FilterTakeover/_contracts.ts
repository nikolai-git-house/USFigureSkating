import {FormOption} from '../../contracts/AppContracts';

export namespace FilterTakeover {
    export interface AvailableFilterConfiguration {
        required: boolean;
        options: FormOption[];
    }

    export interface SelectedFilters {
        [key: string]: FormOption[];
    }
}