import {AccordionStatusTriggerDataInterface, InformationStatusKey} from '../../../../contracts/AppContracts';
import {NamedDateTime, NamedDateTimeWindow, NamedDateTimeWithOptionalCost} from '../CompetitionManagementContracts';

interface CompetitionInformationDeadline extends NamedDateTime {
    late_fee: string | null;
    status_key: InformationStatusKey;
}

export interface CompetitionInformationSectionSummaryItem extends AccordionStatusTriggerDataInterface {
    label?: string;
    status_key: InformationStatusKey;
    value: string | number;
}

export type CompetitionInformationSectionDeadlines = {
    summary: CompetitionInformationSectionSummaryItem[];
    deadlines: CompetitionInformationDeadline[];
};

export type CompetitionInformationSectionPracticeIce = {
    summary: CompetitionInformationSectionSummaryItem[];
    windows: NamedDateTimeWindow[];
};

export type CompetitionInformationSectionRegistrants = {
    summary: CompetitionInformationSectionSummaryItem[];
    entity_counts: { name: string; count: number; }[];
};

export type CompetitionInformationSectionRegistration = {
    summary: CompetitionInformationSectionSummaryItem[];
    dates: NamedDateTimeWithOptionalCost[];
};

export interface CompetitionManagementCompetitionInformationPageInterface {
    deadlines_summary: CompetitionInformationSectionDeadlines;
    practice_ice_summary: CompetitionInformationSectionPracticeIce;
    registrants_summary: CompetitionInformationSectionRegistrants;
    registration_summary: CompetitionInformationSectionRegistration;
    volunteer_summary: CompetitionInformationSectionVolunteer;
}

export type CompetitionInformationSectionVolunteer = {
    windows: NamedDateTimeWindow[];
};