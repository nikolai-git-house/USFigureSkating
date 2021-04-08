import {LinkConfiguration, StatusMessage, StatusMessageTypeKey} from '../../contracts/AppContracts';

export interface PageEntityHeaderComponentEntity {
    name?: string;
    compliance?: PageEntityHeaderComplianceSummary;
}

interface PageEntityHeaderComplianceItem {
    name: string;
    complete: boolean;
    is_membership?: boolean;
    membership_expiration_date_formatted?: string;
}

export interface PageEntityHeaderComplianceRole {
    role: string;
    items: PageEntityHeaderComplianceItem[];
}

export type PageEntityHeaderComplianceSummary = {
    status_description: string;
    status_key: StatusMessageTypeKey;
    link?: LinkConfiguration;
    supporting_description?: StatusMessage;
    role_items?: PageEntityHeaderComplianceRole[];
};