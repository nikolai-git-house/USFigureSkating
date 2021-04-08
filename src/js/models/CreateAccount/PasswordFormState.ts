import {FormState} from "../FormState";

/**
 * Exported PasswordFormState data.
 */
export interface PasswordFormData {
    password: string;
    password_confirm: string
}

/**
 * Class to track state of Password Form data
 */
export class PasswordFormState extends FormState {
    password: string | null = null;
    password_confirm: string | null = null;

    /**
     * Export the form data state.
     */
    export(): PasswordFormData {
        return {
            password: this.password ? this.password : '',
            password_confirm: this.password_confirm ? this.password_confirm : '',
        }
    }
}