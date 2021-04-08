import {BillingAddressRawDataV3} from "../contracts/release3/data/BillingAddressDataContracts";
import {BillingAddress} from "../models/BillingAddress";

export class BillingAddressDataAdaptor {
    static adapt(raw_data: BillingAddressRawDataV3) {
        return new BillingAddress(raw_data);
    }

    static adaptArray(raw_data: BillingAddressRawDataV3[]) {
        return raw_data.map(function (data_point: BillingAddressRawDataV3) {
            return BillingAddressDataAdaptor.adapt(data_point);
        })
    }
}