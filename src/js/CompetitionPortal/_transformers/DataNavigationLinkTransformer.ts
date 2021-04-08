import {DataNavigationLink} from '../_models';
import {DataNavigationLinkParams} from '../_models/DataNavigationLink';
import {DataNavigationLinkComponent} from '../_components/DataNavigationLink/_contracts';
import {AppAPIAdaptor} from '../../adaptors/APIAdaptors/AppAPIAdaptor';
import {StatusMessageData} from '../../contracts/data/DataContracts';
import {StatusMessage} from '../../contracts/AppContracts';
import {DataNavigationLinkData} from '../../contracts/release3/data';

/**
 * Optional DataNavigationLink params.  Used for transformation typing
 */
type OptionalParams = {
    is_complete?: boolean;
    data?: DataNavigationLinkComponent.DataNavigationLinkData[];
};

export class DataNavigationLinkTransformer {
    /**
     * Transform an entire DataNavigationLink from API navigation_link_data to App model
     */
    static transformDataNavigationLink(navigation_link_data: DataNavigationLinkData.DataNavigationLink): DataNavigationLink {
        return new DataNavigationLink({
            ...this.transformCore(navigation_link_data),
            ...this.transformOptionalParams(navigation_link_data)
        });
    }

    /**
     * Transform core information required for all items
     */
    private static transformCore(navigation_link_data: DataNavigationLinkData.DataNavigationLink): DataNavigationLinkParams {
        return {
            label: navigation_link_data.label,
            url: navigation_link_data.url,
            is_disabled: !!navigation_link_data.is_disabled
        };
    }

    /**
     * Transform optional information that may be present on items
     */
    private static transformOptionalParams(navigation_link_data: DataNavigationLinkData.DataNavigationLink): OptionalParams {
        const result: OptionalParams = {};

        const supporting_data = this.transformData(navigation_link_data.data);
        if (supporting_data) {
            result.data = supporting_data;
        }

        if (Object.prototype.hasOwnProperty.call(navigation_link_data, 'is_complete')) {
            result.is_complete = navigation_link_data.is_complete;
        }

        return result;
    }

    /**
     * Transform the data/content set within a link
     */
    private static transformData(data?: DataNavigationLinkData.DataNavigationLinkSupportingDatum[]): DataNavigationLinkComponent.DataNavigationLinkData[] | null {
        if (!data || !data.length) {
            return null;
        }

        return data.map((data_item: DataNavigationLinkData.DataNavigationLinkSupportingDatum): DataNavigationLinkComponent.DataNavigationLinkData => {
            return this.transformDatum(data_item);
        });
    }

    /**
     * Transform an individual data/content item within the link
     */
    private static transformDatum(data_item: DataNavigationLinkData.DataNavigationLinkSupportingDatum): DataNavigationLinkComponent.DataNavigationLinkData {
        const result: DataNavigationLinkComponent.DataNavigationLinkData = {
            content: this.transformDatumContent(data_item.content)
        };
        if (data_item.icon) {
            result.icon = data_item.icon;
        }
        if (data_item.status_type) {
            result.status_type = data_item.status_type || 'default';
        }

        return result;
    }

    /**
     * Transform the content property within an individual data/content item
     */
    private static transformDatumContent(data: string | StatusMessageData[]): string | StatusMessage[] {
        if (typeof data === 'string') {
            return data;
        }

        return data.map((item) => {
            return AppAPIAdaptor.adaptStatusMessageData(item);
        });
    }
}