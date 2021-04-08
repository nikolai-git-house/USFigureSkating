import {DataNavigationLinkComponent} from '../_components/DataNavigationLink/_contracts';

export interface DataNavigationLinkParams {
    label: string;
    url: string;
    is_disabled: boolean;
    is_complete?: boolean;
    data?: DataNavigationLinkComponent.DataNavigationLinkData[];
}

export class DataNavigationLink implements DataNavigationLinkComponent.DataNavigationLink {
    label: string;
    url: string;
    is_disabled: boolean;
    is_complete?: boolean;
    data?: DataNavigationLinkComponent.DataNavigationLinkData[];

    /* eslint-disable-next-line jsdoc/require-jsdoc */
    constructor(params: DataNavigationLinkParams) {
        this.label = params.label;
        this.url = params.url;
        this.is_disabled = params.is_disabled;
        if (params.is_complete) {
            this.is_complete = params.is_complete;
        }
        if (params.data) {
            this.data = params.data;
        }
    }
}