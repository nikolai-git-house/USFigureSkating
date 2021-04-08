import {GenderKey} from "../AppContracts";

export interface MemberSearchResult {
    club_name: string;
    first_name: string;
    id: number;
    ineligible: boolean;
    active: boolean;
    last_name: string;
    member_number: number;
    state_abbreviation: string;
    city: string;
}

export interface GenderedMemberSearchResult extends MemberSearchResult {
    gender: GenderKey;
}

export interface PartnerMemberSearchResult extends GenderedMemberSearchResult {
}

export interface MemberSearchParameters {
    [key: string]: string | null;

    member_number: string | null;
    first_name: string | null;
    last_name: string | null;
    state: string | null;
}

export interface MemberSearchResultValidationFunction {
    (member_result: MemberSearchResult): string | false;
}

export interface AbstractMemberSearchResultValidationFunction<I extends MemberSearchResult = MemberSearchResult> {
    (member_result: I): string | false;
}

export interface PartnerMemberSearchResultValidationFunction extends MemberSearchResultValidationFunction {
    (member_result: PartnerMemberSearchResult): string | false;
}

export type AbstractMemberSearchSearchFunction<I extends MemberSearchResult = MemberSearchResult> = (search_params: MemberSearchParameters) => Promise<I[]>;

export type MemberSearchSearchFunction = (search_params: MemberSearchParameters) => Promise<MemberSearchResult[]>;

export type MemberSearchFormAdditionalValidator = (...args: any[]) => true | string;

export type MemberSearchFormAdditionalValidatorsResult = { pass: true } | { pass: false; error: string };

export interface MemberSearchConfig<I extends MemberSearchResult = MemberSearchResult> {
    search_function?: AbstractMemberSearchSearchFunction<I>;
    selection_method?: (result: I) => Promise<void>;
    close_method?: () => void;
    ineligible_instruction?: string;
    entity_descriptor?: string;
    result_validators?: AbstractMemberSearchResultValidationFunction<I>[];
    form_validators?: MemberSearchFormAdditionalValidator[];
}