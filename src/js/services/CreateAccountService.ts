import axios from "axios";
import {
    AddressSubmissionResponse,
    EmergencyContactSubmissionResponse,
    FederationInformationSubmissionResponse,
    PasswordSubmissionResponse,
    PersonalInformationSubmissionResponse
} from "../contracts/app/CreateAccountContracts";
import {CreateAccountAPIAdaptor} from "../adaptors/APIAdaptors/CreateAccountAPIAdaptor";
import {PersonalInformationData} from "../models/CreateAccount/PersonalInformationFormState";
import {AccountTypeKey} from "../contracts/AppContracts";
import {AddressData} from "../models/CreateAccount/AddressFormState";
import {EmergencyContactData} from "../models/Forms/EmergencyContactFormState";
import {PasswordFormData} from "../models/CreateAccount/PasswordFormState";
import {FederationInfoData} from "../models/CreateAccount/FederationInfoFormState";

/**
 * Service class for interacting with API for create account purposes
 */
export class CreateAccountService {
    /**
     * Transform and submit personal information data
     */
    static SubmitPersonalInformation(payload: PersonalInformationData, account_type: AccountTypeKey): Promise<PersonalInformationSubmissionResponse> {
        return new Promise(function (resolve, reject) {
            let adapted_payload = CreateAccountAPIAdaptor.adaptExportedPersonalInformationFormToAPIPayload(payload, account_type);
            axios.post('/api/create-account/personal-info', adapted_payload).then(function (response) {
                resolve(CreateAccountAPIAdaptor.adaptPersonalInformationSubmissionResponse(response.data));
            }).catch(function () {
                reject();
            })
        });
    }

    /**
     * Transform and submit address information
     */
    static SubmitAddressInformation(payload: AddressData, account_id: string): Promise<AddressSubmissionResponse> {
        return new Promise(function (resolve, reject) {
            let adapted_payload = CreateAccountAPIAdaptor.adaptExportedAddressFormToAPIPayload(payload, account_id);
            axios.post('/api/create-account/address', adapted_payload).then(function (response) {
                resolve(CreateAccountAPIAdaptor.adaptAddressSubmissionResponse(response.data));
            }).catch(function () {
                reject();
            })
        });
    }

    /**
     * Transform and emergency contact information
     */
    static SubmitEmergencyContactInformation(payload: EmergencyContactData, account_id: string): Promise<EmergencyContactSubmissionResponse> {
        return new Promise(function (resolve, reject) {
            let adapted_payload = CreateAccountAPIAdaptor.adaptExportedEmergencyContactFormToAPIPayload(payload, account_id);
            axios.post('/api/create-account/emergency-contact', adapted_payload).then(function (response) {
                resolve(CreateAccountAPIAdaptor.adaptExportedEmergencyContactSubmissionResponse(response.data));
            }).catch(function () {
                reject();
            })
        });
    }

    /**
     * Transform and submit password information
     */
    static SubmitPassword(payload: PasswordFormData, account_id: string): Promise<PasswordSubmissionResponse> {
        return new Promise(function (resolve, reject) {
            let adapted_payload = CreateAccountAPIAdaptor.adaptExportedPasswordFormToAPIPayload(payload, account_id);
            axios.post('/api/create-account/password', adapted_payload).then(function (response) {
                resolve(CreateAccountAPIAdaptor.adaptPasswordSubmissionResponse(response.data));
            }).catch(function () {
                reject();
            })
        });
    }

    /**
     * Transform and submit federation information
     */
    static SubmitFederationInformation(payload: FederationInfoData, account_id: string): Promise<FederationInformationSubmissionResponse> {
        return new Promise(function (resolve, reject) {
            let adapted_payload = CreateAccountAPIAdaptor.adaptExportedFederationInfoFormToAPIPayload(payload, account_id);
            axios.post('/api/create-account/federation-information', adapted_payload).then(function (response) {
                resolve(CreateAccountAPIAdaptor.adaptFederationInformationSubmissionResponse(response.data));
            }).catch(function () {
                reject();
            })
        });
    }
}