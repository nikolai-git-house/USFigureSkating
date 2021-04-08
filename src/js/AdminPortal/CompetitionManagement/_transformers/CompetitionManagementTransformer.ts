import {
    CompetitionManagementCompliancePositionEntity,
    CompetitionManagementEntityPositionFilter
} from '../_contracts/component-contracts/CompetitionManagementCompliancePositionFiltersContracts';

export class CompetitionManagementTransformer {
    /**
     * Transform a list of entities with position information into a list of position filter options for a filter form
     */
    static transformPositionEntitiesToPositionOptions(entities: CompetitionManagementCompliancePositionEntity[]): CompetitionManagementEntityPositionFilter[] {
        const added_types: any[] = [];

        return entities.reduce((carry: any[], entity) => {
            for (let j = 0; j < entity.positions.length; j++) {
                const position = entity.positions[j];
                const formOption = {
                    label: position.label,
                    value: position.key
                };
                if (added_types.indexOf(formOption.value) === -1) {
                    added_types.push(formOption.value);
                    carry.push(formOption);
                }
            }

            return carry;

        }, []);
    }
}