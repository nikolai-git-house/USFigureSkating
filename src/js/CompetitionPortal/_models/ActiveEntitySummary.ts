/* eslint-disable jsdoc/require-jsdoc */
import {
    PageEntityHeaderComplianceSummary,
    PageEntityHeaderComponentEntity
} from '../../components/_contracts/PageEntityHeaderComponentContracts';

export interface ActiveEntitySummaryParams {
    compliance?: PageEntityHeaderComplianceSummary;
    name?: string;
}

export class ActiveEntitySummary implements PageEntityHeaderComponentEntity {
    compliance?: PageEntityHeaderComplianceSummary;
    name?: string;

    constructor(params: ActiveEntitySummaryParams) {
        this.compliance = params.compliance;
        this.name = params.name;
    }
}