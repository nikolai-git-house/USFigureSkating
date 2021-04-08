/* eslint-disable jsdoc/require-jsdoc */
import {CompetitionManagementTransformer} from '../../_transformers/CompetitionManagementTransformer';
import {CompetitionManagementComplianceEntityPositionFilter} from '../_contracts/CompetitionManagementComplianceContracts';
import {CompetitionManagementComplianceEntity} from '../_models/CompetitionManagementComplianceEntity';

export class CompetitionManagementComplianceTransformer {
    static transformEntitiesToUniquePositionOptions(entities: CompetitionManagementComplianceEntity[]): CompetitionManagementComplianceEntityPositionFilter[] {
        const order = [
            'coach_qualifying',
            'coach_nonqualifying',
            'coach_compete_usa',
            'coach_foreign',
            'team_service_personnel'
        ];

        return CompetitionManagementTransformer.transformPositionEntitiesToPositionOptions(entities)
            .sort((item1, item2) => {
                const item2_index = order.indexOf(item2.value);
                const item1_index = order.indexOf(item1.value);
                if (item1_index === -1) {
                    return 1;
                }
                if (item2_index === -1) {
                    return -1;
                }

                return item1_index - item2_index;
            });
    }
}