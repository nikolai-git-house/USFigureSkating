import {VolunteerShiftSelection} from '../_contracts';

export const VOLUNTEER_SHIFT_SELECTION = {
    filters: {
        statuses: <VolunteerShiftSelection.FilterOptionStatus[]>[
            {
                label: 'Available',
                value: 'new'
            },
            {
                label: 'My Shifts',
                value: 'approved'
            },
            {
                label: 'Pending',
                value: 'pending'
            }
        ],
        compliance_requirements: <VolunteerShiftSelection.FilterOptionCompliance[]>[
            {
                label: 'Compliance Required',
                value: true
            },
            {
                label: 'Compliance Not Required',
                value: false
            }
        ]
    }
};