import {SubmissionResponse} from "../../AppContracts";
import {BillingAddressRawDataV3, BillingAddressSubmitData} from "../data/BillingAddressDataContracts";
import {BillingAddress} from "../../../models/BillingAddress";

/**
 * API payload when creating a new billing address
 */
export interface UpdateBillingAddressAPIPayload {
    source: BillingAddress;                 //  [unchanged] - The source billing address being changed
    data: BillingAddressSubmitData;         //  [updated] - The data representing the change to the billing address
}

/**
 * API Payload when attempting to create a new billing address
 */
export interface CreateBillingAddressAPIPayload extends BillingAddressSubmitData {
}

/**
 * The API response when updating/changing a billing address
 */
export interface UpdateBillingAddressAPIResponse extends SubmissionResponse {
    address: BillingAddressRawDataV3;       // The updated billing address' data
}

/**
 * The API response when creating a new billing address
 */
export interface CreateBillingAddressAPIResponse extends SubmissionResponse {
    address: BillingAddressRawDataV3;       // The created billing address' data
}