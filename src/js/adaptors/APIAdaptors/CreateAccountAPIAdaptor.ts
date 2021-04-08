import {
    AddressSubmissionResponse,
    EmergencyContactSubmissionResponse,
    FederationInformationSubmissionResponse,
    PasswordSubmissionResponse,
    PersonalInformationSubmissionResponse
} from "../../contracts/app/CreateAccountContracts";
import {
    CreateAccountAddressAPIPayload,
    CreateAccountEmergencyContactAPIPayload,
    CreateAccountFederationInfoAPIPayload,
    CreateAccountPasswordAPIPayload,
    CreateAccountPersonalInformationAPIPayload
} from "../../contracts/api/CreateAccountAPIContracts";
import {PersonalInformationData} from "../../models/CreateAccount/PersonalInformationFormState";
import {AccountTypeKey, SubmissionResponse} from "../../contracts/AppContracts";
import {AddressData} from "../../models/CreateAccount/AddressFormState";
import {EmergencyContactData} from "../../models/Forms/EmergencyContactFormState";
import {PasswordFormData} from "../../models/CreateAccount/PasswordFormState";
import {FederationInfoData} from "../../models/CreateAccount/FederationInfoFormState";


export class CreateAccountAPIAdaptor {
    /**
     * Adapt the response from the Personal Information submission endpoint
     */
    static adaptPersonalInformationSubmissionResponse(data: any): PersonalInformationSubmissionResponse {
        if (data.success !== true) {
            return {
                success: false,
                error: data.error ? data.error : "There was an error submitting your information",
                is_duplicate_account: data.is_duplicate_account ? data.is_duplicate_account : false
            }
        }
        return {
            success: true,
            error: "",
            is_duplicate_account: false,
            data: {
                ...data.data
            }
        }
    }

    /**
     * Adapt personal information data to an API Payload
     */
    static adaptExportedPersonalInformationFormToAPIPayload(payload: PersonalInformationData, account_type: AccountTypeKey): CreateAccountPersonalInformationAPIPayload {
        return {
            personal_information_data: {...payload},
            account_type
        }
    }

    /**
     * Adapt address data to an API Payload
     */
    static adaptExportedAddressFormToAPIPayload(payload: AddressData, account_id: string): CreateAccountAddressAPIPayload {
        return {
            account_id,
            address_data: {...payload}
        }
    }

    /**
     * Adapt the response from the address submission endpoint
     */
    static adaptAddressSubmissionResponse(data: any): AddressSubmissionResponse {

        return CreateAccountAPIAdaptor.adaptBaseSubmissionResponse(data) as AddressSubmissionResponse;
    }

    /**
     * Adapt a generic API submission response
     */
    static adaptBaseSubmissionResponse(data: any): SubmissionResponse {
        if (data.success) {
            return {
                success: true,
                error: ""
            }
        }
        return {
            success: false,
            error: data.error
        }
    }

    /**
     * Adapt emergency contact data to an API Payload
     */
    static adaptExportedEmergencyContactFormToAPIPayload(payload: EmergencyContactData, account_id: string): CreateAccountEmergencyContactAPIPayload {
        return {
            account_id,
            emergency_contact_data: {...payload}
        }
    }

    /**
     * Adapt the response from the emergency contact submission endpoint
     */
    static adaptExportedEmergencyContactSubmissionResponse(data: any): EmergencyContactSubmissionResponse {
        return CreateAccountAPIAdaptor.adaptBaseSubmissionResponse(data) as EmergencyContactSubmissionResponse;
    }

    /**
     * Adapt password data to an API Payload
     */
    static adaptExportedPasswordFormToAPIPayload(payload: PasswordFormData, account_id: string): CreateAccountPasswordAPIPayload {
        return {
            account_id,
            password_data: {...payload}
        }
    }

    /**
     * Adapt the response from the password submission endpoint
     */
    static adaptPasswordSubmissionResponse(data: any): PasswordSubmissionResponse {
        if (data.success !== true) {
            return {
                success: false,
                error: data.error ? data.error : "There was an error submitting your information"
            }
        }
        return {
            success: true,
            error: "",
            redirect_url: data.redirect_url
        }
    }

    /**
     * Adapt federation information data to an API Payload
     */
    static adaptExportedFederationInfoFormToAPIPayload(payload: FederationInfoData, account_id: string): CreateAccountFederationInfoAPIPayload {
        return {
            account_id,
            federation_information_data: {...payload}
        }
    }

    /**
     * Adapt the response from the federation information submission endpoint
     */
    static adaptFederationInformationSubmissionResponse(data: any): FederationInformationSubmissionResponse {
        return CreateAccountAPIAdaptor.adaptBaseSubmissionResponse(data) as FederationInformationSubmissionResponse;
    }
}