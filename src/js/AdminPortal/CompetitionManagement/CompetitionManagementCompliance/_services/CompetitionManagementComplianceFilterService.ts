import {CompetitionManagementCompliancePositionEntityFilterService} from '../../_services/CompetitionManagementCompliancePositionEntityFilterService';
import {CompetitionManagementCompliancePageEntityInterface} from '../_contracts/CompetitionManagementComplianceContracts';

export class CompetitionManagementComplianceFilterService extends CompetitionManagementCompliancePositionEntityFilterService<CompetitionManagementCompliancePageEntityInterface> {

    /**
     * Whether an entity passes the free text filter
     */
    public entityPassesFreeFilter(entity: CompetitionManagementCompliancePageEntityInterface, filter_term_raw: string) {
        const filter_term = filter_term_raw.trim()
            .toLowerCase();
        if (!filter_term) {
            return true;
        }
        if (entity.member_number.toString()
            .match(filter_term)) {
            return true;
        }
        if (entity.full_name.toLowerCase()
            .match(filter_term)) {
            return true;
        }

        return false;
    }

}