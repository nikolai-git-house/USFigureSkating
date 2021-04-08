import {ALL_POSITION_FILTER} from '../_constants/CompetitionManagementConstants';
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
    CompetitionManagementCompliancePositionEntity,
    CompetitionManagementEntityComplianceFilter,
    CompetitionManagementEntityComplianceFreePositionFilters,
    CompetitionManagementEntityPositionFilter
} from '../_contracts/component-contracts/CompetitionManagementCompliancePositionFiltersContracts';

export class CompetitionManagementCompliancePositionEntityFilterService<T extends CompetitionManagementCompliancePositionEntity> {
    entities: T[];
    filters: CompetitionManagementEntityComplianceFreePositionFilters;

    /**
     * Create a new instance
     */
    constructor(entities: T[], filters: CompetitionManagementEntityComplianceFreePositionFilters) {
        this.entities = entities;
        this.filters = filters;
    }

    /**
     * Filter a set of entities with a set of filters
     */
    public static filterEntities<T extends CompetitionManagementCompliancePositionEntity>(entities: T[], filters: CompetitionManagementEntityComplianceFreePositionFilters): T[] {
        const instance = new this(entities, filters);

        return instance._doFilter();
    }

    /**
     * Whether an entity passes the free text filter
     */
    protected entityPassesFreeFilter(entity: CompetitionManagementCompliancePositionEntity, filter_term_raw: string): boolean {
        return true;
    }

    /**
     * Create an instance and run the filter
     */
    private _doFilter() {
        const entities = this.entities;
        const filters = this.filters;

        return entities.filter((entity: CompetitionManagementCompliancePositionEntity) => {
            if (!this.entityPassesPositionFilter(entity, filters.positions)) {
                return false;
            }
            if (!this.entityPassesComplianceFilter(entity, filters.compliance)) {
                return false;
            }

            return this.entityPassesFreeFilter(entity, filters.free);
        });
    }

    /**
     * Whether an entity passes the compliance filter
     */
    private entityPassesComplianceFilter(entity: CompetitionManagementCompliancePositionEntity, compliance_filter: CompetitionManagementEntityComplianceFilter) {
        return compliance_filter === 'both' || compliance_filter === entity.is_compliant;
    }

    /**
     * Whether an entity passes the position filters
     */
    private entityPassesPositionFilter(entity: CompetitionManagementCompliancePositionEntity, position_filters: CompetitionManagementEntityPositionFilter[]) {
        if (position_filters.length === 1 && position_filters[0].value === ALL_POSITION_FILTER.value) {
            return true;
        }
        const filter_keys = position_filters.map((position_filter: CompetitionManagementEntityPositionFilter) => {
            return position_filter.value;
        });

        for (let i = 0; i < entity.positions.length; i++) {
            const position = entity.positions[i];
            if (filter_keys.indexOf(position.key) !== -1) {
                return true;
            }
        }

        return false;
    }
}