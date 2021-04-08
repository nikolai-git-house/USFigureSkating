import {StatusMessage, SupportDocumentCategory} from "../../contracts/AppContracts";
import {SupportDocumentCategoryData} from "../../contracts/release3/data/AppDataContracts";
import {StatusMessageData} from '../../contracts/data/DataContracts';


export class AppAPIAdaptor {
    static adaptSupportDocumentCategoryDataArrayToSupportDocumentCategoryArray(data: SupportDocumentCategoryData[]): SupportDocumentCategory[] {
        return data.map((item) => {
            return {...item} as SupportDocumentCategory;
        })
    }

    /**
     * Adapt a status message
     */
    static adaptStatusMessageData(data: StatusMessageData): StatusMessage {
        return {
            text: data.text,
            type_key: data.type_key || 'default'
        };
    }
}