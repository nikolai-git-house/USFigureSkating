import {CompetitionManagementCompliancePositionEntityFilterService} from '../../_services/CompetitionManagementCompliancePositionEntityFilterService';
import {CompetitionManagementContactsIndexEntityInterface} from '../_contracts/CompetitionManagementContactsContracts';

export class CompetitionManagementsContactsFilterService extends CompetitionManagementCompliancePositionEntityFilterService<CompetitionManagementContactsIndexEntityInterface> {

    /**
     * Whether an entity passes the free text filter
     */
    public entityPassesFreeFilter(entity: CompetitionManagementContactsIndexEntityInterface, filter_term_raw: string) {
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
        if (entity.position.label.toLowerCase()
            .match(filter_term)) {
            return true;
        }

        return false;
    }
}