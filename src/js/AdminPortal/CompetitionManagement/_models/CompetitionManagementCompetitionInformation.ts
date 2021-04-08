/* eslint-disable jsdoc/require-jsdoc */
import {InformationStatusKey} from '../../../contracts/AppContracts';
import {CompetitionManagementCompetitionInformationData} from '../_contracts/CompetitionManagementDataContracts';
import {
    CompetitionInformationSectionDeadlines,
    CompetitionInformationSectionPracticeIce,
    CompetitionInformationSectionRegistrants,
    CompetitionInformationSectionRegistration,
    CompetitionInformationSectionVolunteer,
    CompetitionManagementCompetitionInformationPageInterface
} from '../_contracts/page-contracts/CompetitionManagementCompetitionInformationPageContracts';

export class CompetitionManagementCompetitionInformation implements CompetitionManagementCompetitionInformationPageInterface {
    deadlines: {
        name: string;
        date_time_formatted: string;
        relative_deadline: string;
        status: InformationStatusKey;
        show_in_summary: boolean;
        late_fee: string | null;
    }[];

    practice_ice: {
        status: {
            description: string;
            status: InformationStatusKey;
        };
        windows: {
            name: string;
            begin_date_time_formatted: string;
            end_date_time_formatted: string;
        }[];
    };

    registrants: {
        registered: {
            amount: number;
            status: InformationStatusKey;
        };
        entries: {
            amount: number;
            status: InformationStatusKey;
        };
        entity_counts: {
            name: string;
            count: number;
        }[];
    };

    registration: {
        status: {
            description: string;
            status: InformationStatusKey;
        };
        dates: {
            name: string;
            date_time_formatted: string;
        }[];
    };

    volunteers: {
        windows: {
            name: string;
            begin_date_time_formatted: string;
            end_date_time_formatted: string;
        }[];
    };

    constructor(data: CompetitionManagementCompetitionInformationData) {
        this.deadlines = data.deadlines;
        this.practice_ice = data.practice_ice;
        this.registrants = data.registrants;
        this.registration = data.registration;
        this.volunteers = data.volunteers;
    }

    get deadlines_summary(): CompetitionInformationSectionDeadlines {
        return {
            summary: this.deadlines.reduce((carry: any[], item: any) => {
                if (item.show_in_summary) {
                    carry.push({
                        label: item.name,
                        status_key: item.status,
                        value: item.relative_deadline
                    });
                }

                return carry;
            }, []),
            deadlines: this.deadlines.map((item) => {
                return {
                    name: item.name,
                    date_time_formatted: item.date_time_formatted,
                    late_fee: item.late_fee,
                    status_key: item.status
                };
            })
        };
    }

    get practice_ice_summary(): CompetitionInformationSectionPracticeIce {
        return {
            summary: [
                {
                    value: this.practice_ice.status.description,
                    status_key: this.practice_ice.status.status
                }
            ],
            windows: this.practice_ice.windows
        };
    }

    get registrants_summary(): CompetitionInformationSectionRegistrants {
        return {
            summary: [
                {
                    label: 'Registered',
                    status_key: this.registrants.registered.status,
                    value: this.registrants.registered.amount
                },
                {
                    label: 'Entries',
                    status_key: this.registrants.entries.status,
                    value: this.registrants.entries.amount
                }
            ],
            entity_counts: this.registrants.entity_counts
        };
    }

    get registration_summary(): CompetitionInformationSectionRegistration {
        return {
            summary: [
                {
                    value: this.registration.status.description,
                    status_key: this.registration.status.status
                }
            ],
            dates: this.registration.dates
        };
    }

    get volunteer_summary(): CompetitionInformationSectionVolunteer {
        return {
            windows: this.volunteers.windows
        };
    }
}