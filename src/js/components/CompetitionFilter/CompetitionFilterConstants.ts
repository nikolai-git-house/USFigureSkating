import {CompetitionFilterFieldOption} from './CompetitionFilterContracts';

/**
 * The available fields to filter competitions by in the CompetitionFilter component
 */
export const CompetitionFilterFieldOptions: CompetitionFilterFieldOption[] = [
    {
        label: 'Name',
        value: 'name',
        type: 'text'
    },
    {
        label: 'Date',
        value: 'date',
        type: 'date_range'
    },
    {
        label: 'City',
        value: 'city',
        type: 'text'
    },
    {
        label: 'State',
        value: 'state',
        type: 'state'
    },
    {
        label: 'Host Club',
        value: 'club',
        type: 'text'
    }
];