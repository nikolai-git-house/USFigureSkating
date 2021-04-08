import {CreditList, NullableCreditList} from "../contracts/AppContracts";

export class NullableCreditListCreditListAdaptor {
    static adapt(nullable_credit_list: NullableCreditList): CreditList {
        let result: CreditList = {
            opi: 0,
            upi: 0,
            wu: 0
        };
        if (nullable_credit_list) {
            for (let type in result) {
                let source_value = nullable_credit_list[type];
                if (source_value) {
                    result[type] = source_value;
                }
            }
        }
        return result;


    }
}