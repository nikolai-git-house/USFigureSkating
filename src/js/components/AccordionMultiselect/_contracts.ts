import {FormOption} from '../../contracts/AppContracts';

export namespace AccordionMultiselect {
    export type OptionsConfiguration = {
        [key: string]: OptionConfiguration;
    }

    export interface OptionConfiguration {
        options: FormOption[];
    }

    export type ValueConfiguration = {
        [key: string]: FormOption[];
    }
}