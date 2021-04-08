import {AccountTypeKey} from "../AppContracts";
import {PersonalInformationData} from "../../models/CreateAccount/PersonalInformationFormState";
import {AddressData} from "../../models/CreateAccount/AddressFormState";
import {EmergencyContactData} from "../../models/Forms/EmergencyContactFormState";
import {FederationInfoData} from "../../models/CreateAccount/FederationInfoFormState";
import {SkateTestEquivalencyData} from "../app/SkateTestContracts";
import {PasswordFormData} from "../../models/CreateAccount/PasswordFormState";

export interface CreateAccountPersonalInformationAPIPayload {
    personal_information_data: PersonalInformationData;
    account_type: AccountTypeKey;
}

export interface CreateAccountAddressAPIPayload {
    account_id: string;
    address_data: AddressData;
}

export interface CreateAccountEmergencyContactAPIPayload {
    account_id: string;
    emergency_contact_data: EmergencyContactData;
}

export interface CreateAccountFederationInfoAPIPayload {
    account_id: string;
    federation_information_data: FederationInfoData;
}

export interface CreateAccountSkateTestEquivalencyAPIPayload {
    account_id: string;
    skate_test_data: SkateTestEquivalencyData;
}

export interface CreateAccountPasswordAPIPayload {
    account_id: string;
    password_data: PasswordFormData;
}