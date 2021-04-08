import {CountryFormOption, FormOption, GenderKey, ProvinceFormOption, StateFormOption} from '../AppContracts';

export type EmailRecord = {
    value: string;
    opt_out: boolean;
    publish: boolean;
}

export type PhoneRecord = {
    value: string;
    carrier: FormOption | null;
}

export interface UpdateUserProfileArgs {
    [key: string]: any;

    first_name?: string;
    last_name?: string;
    full_name?: string;
    middle_name?: string | null;
    pronunciation_firstname?: string | null;
    pronunciation_lastname?: string | null;
    is_us_citizen?: boolean;
    eligibility?: {
        description: string;
        status_description: string;
    };
    prefix?: FormOption | null;
    suffix?: FormOption | null;
    member_number?: string;
    home_club?: UserClubInformation | null;
    region_name?: string;
    section_name?: string;
    gender?: GenderKey;
    birth_date?: {
        formatted: string;
        timestamp: number;
    };
    primary_email?: EmailRecord | null;
    secondary_email?: EmailRecord | null;
    primary_phone?: PhoneRecord | null;
    lts_programs?: UserLTSInformation | null;
    address?: {
        street: string;
        street_2: string | null;
        city: string;
        state: StateFormOption | null;
        country: CountryFormOption | null;
        province: ProvinceFormOption | null;
        zip_code: number | string | null;
    };
}

export interface UserClubInformation {
    name: string;
    membership_validity_formatted?: string;
}

export interface UserLTSInformation {
    summary: UserLTSInformationSummary;
    programs: FormOption[];
}

export interface UserLTSInformationSummary {
    description: string;
    validity_date_formatted?: string;
}

export interface UserLTSInformationSummaryWithExpiration extends UserLTSInformationSummary {
    expired?: boolean;
}

export interface UserProfile {
    [key: string]: any;

    first_name: string;
    last_name: string;
    full_name: string;
    middle_name: string | null;
    pronunciation_firstname: string | null;
    pronunciation_lastname: string | null;
    is_us_citizen: boolean;
    eligibility: {
        description: string;
        status_description: string;
    };
    prefix: FormOption | null;
    suffix: FormOption | null;
    member_number: string;
    home_club: UserClubInformation | null;
    region_name: string;
    section_name: string;
    gender: GenderKey;
    birth_date: {
        formatted: string;
        timestamp: number;
    };
    primary_email: EmailRecord | null;
    secondary_email: EmailRecord | null;
    primary_phone: PhoneRecord | null;
    lts_programs: UserLTSInformation | null;
    address: {
        street: string;
        street_2: string | null;
        city: string;
        state: StateFormOption | null;
        country: CountryFormOption | null;
        province: ProvinceFormOption | null;
        zip_code: number | string | null;
    };
}