import {SubmissionResponse} from "../AppContracts";

export interface SavedPersonalInformation {
    account_id: string;
    member_number: string;
}

export interface PersonalInformationSuccessSubmissionResponse extends SubmissionResponse {
    success: true;
    data: SavedPersonalInformation;
    is_duplicate_account: false;
}

export interface PersonalInformationErrorSubmissionResponse extends SubmissionResponse {
    success: false;
    is_duplicate_account: boolean;
}

export type PersonalInformationSubmissionResponse =
    PersonalInformationErrorSubmissionResponse
    | PersonalInformationSuccessSubmissionResponse;

interface AddressErrorSubmissionResponse extends SubmissionResponse {
    success: false;
}

interface AddressSuccessSubmissionResponse extends SubmissionResponse {
    success: true;
}

export type AddressSubmissionResponse =
    AddressErrorSubmissionResponse
    | AddressSuccessSubmissionResponse;

interface EmergencyContactErrorSubmissionResponse extends SubmissionResponse {
    success: false;
}

interface EmergencyContactSuccessSubmissionResponse extends SubmissionResponse {
    success: true;
}

export type EmergencyContactSubmissionResponse =
    EmergencyContactErrorSubmissionResponse
    | EmergencyContactSuccessSubmissionResponse;


interface PasswordErrorSubmissionResponse extends SubmissionResponse {
    success: false;
}

interface PasswordSuccessSubmissionResponse extends SubmissionResponse {
    success: true;
    redirect_url: string;
}

export type PasswordSubmissionResponse = PasswordErrorSubmissionResponse | PasswordSuccessSubmissionResponse;

interface FederationInformationErrorSubmissionResponse extends SubmissionResponse {
    success: false;
}

interface FederationInformationSuccessSubmissionResponse extends SubmissionResponse {
    success: true;
}

export type FederationInformationSubmissionResponse =
    FederationInformationErrorSubmissionResponse
    | FederationInformationSuccessSubmissionResponse;