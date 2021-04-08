import {SkaterInfo} from "../contracts/AppContracts";
import {SkaterInfoData} from "../contracts/data/DataContracts";

/**
 * @deprecated 5/27/19 - this returned basic name and address info and has been superseded by User Profile info
 */
export class SkaterInfoDataAdaptor {
    static adapt(raw_data: SkaterInfoData): SkaterInfo {
        return {
            first_name: raw_data.first_name,
            last_name: raw_data.last_name,
            address: {
                street: raw_data.address.street,
                street_2: raw_data.address.street_2 ? raw_data.address.street_2 : null,
                city: raw_data.address.city,
                state: raw_data.address.state,
                zip_code: raw_data.address.zip_code,
            }
        };
    }
}