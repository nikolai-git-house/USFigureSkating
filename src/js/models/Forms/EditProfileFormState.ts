import {FormState} from "../FormState";
import {UserProfile} from "../../contracts/app/UserContracts";
import {FormOptionValue} from "../../contracts/AppContracts";
import {FormInputDate} from "../../helpers/time";


export class EditProfileFormState extends FormState {
    prefix: FormOptionValue | null = null;
    first_name: string | null = null;
    pronunciation_firstname: string | null = null;
    middle_name: string | null = null;
    last_name: string | null = null;
    pronunciation_lastname: string | null = null;
    suffix: FormOptionValue | null = null;
    birth_date: string | null = null;
    primary_email: string | null = null;
    publish_primary_email: boolean = false;
    opt_out_primary_email: boolean = false;
    secondary_email: string | null = null;
    publish_secondary_email: boolean = false;
    opt_out_secondary_email: boolean = false;
    primary_phone: string | null = null;
    primary_phone_carrier: FormOptionValue | null = null;


    public import(profile_data: UserProfile) {
        //Simple Fields
        this.first_name = profile_data.first_name;
        this.pronunciation_firstname = profile_data.pronunciation_firstname;
        this.middle_name = profile_data.middle_name;
        this.last_name = profile_data.last_name;
        this.pronunciation_lastname = profile_data.pronunciation_lastname;

        //Complex fields
        this.prefix = profile_data.prefix ? profile_data.prefix.value : null;
        this.suffix = profile_data.suffix ? profile_data.suffix.value : null;
        this.primary_email = profile_data.primary_email ? profile_data.primary_email.value : null;
        this.publish_primary_email = profile_data.primary_email ? profile_data.primary_email.publish : false;
        this.opt_out_primary_email = profile_data.primary_email ? profile_data.primary_email.opt_out : false;
        this.secondary_email = profile_data.secondary_email ? profile_data.secondary_email.value : null;
        this.publish_secondary_email = profile_data.secondary_email ? profile_data.secondary_email.publish : false;
        this.opt_out_secondary_email = profile_data.secondary_email ? profile_data.secondary_email.opt_out : false;
        this.primary_phone = profile_data.primary_phone ? profile_data.primary_phone.value : null;
        this.primary_phone_carrier = profile_data.primary_phone && profile_data.primary_phone.carrier ? profile_data.primary_phone.carrier.value : null;

        //transformed fields
        this.birth_date = profile_data.birth_date ? FormInputDate(new Date(profile_data.birth_date.timestamp)) : null;

    }
}