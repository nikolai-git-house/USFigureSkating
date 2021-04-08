import {ExperienceData} from './Forms/VolunteerRequestExperienceFormState';
import {FormOption} from '../contracts/AppContracts';

/**
 * Baseline class to track state of abstract Form data
 */
export class FormState {
    [key: string]: string | number | boolean | null | Function | any[] | FormOption | ExperienceData;
}