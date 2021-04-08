import {EMSSupportIssueTypeOption, ExportedEMSSupportFormData} from "../../contracts/AppContracts";


export class EMSSupportFormData {
    member_number: number | null = null;
    email: string | null = null;
    phone: string | null = null;
    issue_type: EMSSupportIssueTypeOption | null = null;
    subtype: string | null = null;
    description: string | null = null;

    [key: string]: EMSSupportIssueTypeOption | Function | number | string | null;

    export(): ExportedEMSSupportFormData {
        return {
            member_number: this.member_number ? this.member_number : -1,
            email: this.email ? this.email : "",
            phone: this.phone ? this.phone : "",
            issue_type: this.issue_type && this.issue_type.label ? this.issue_type.label : "",
            issue_subtype: this.subtype ? this.subtype : "",
            description: this.description ? this.description : "",
        }
    }
}