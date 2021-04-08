/* eslint-disable */
import {CompetitionSeries, CompetitionTileCompetition} from '../../components/CompetitionTile/CompetitionTileContracts';
import {FormOption, FormOptionValue} from '../AppContracts';
import {UserSkateTestHistory} from './SkateTestContracts';
import {SkaterCoachedEventCategory} from '../../models/SkaterCoachedEventCategory';
import {UserProfile} from './UserContracts';


/* ===========================================================================================================
*                                              Search
* ===========================================================================================================*/
type CompetitionSearchKey = "name" | "city" | "state" | "date" | "club";

export type CompetitionSearchCriteria = {
    search_term: string | null;                     // The entered search term value
    search_field: CompetitionSearchKey | null;      // The field being searched against
};

export interface CompetitionSearchFieldOption extends FormOption {
    value: CompetitionSearchKey;
}


/* ===========================================================================================================
*                                              Competitions
* ===========================================================================================================*/
export type CompetitionQualifyingKey = "qualifying" | "non_qualifying";

export type CompetitionRegistrationStatusKey = "open" | "late" | "future" | "closed";

export type UserCompetitionRegistrationStatusKey = "registered" | "in_progress" | "new";

export interface CompetitionRegistrationCompetitionCore {
    id: number;
    name: string;
    icon: string;
    city: string;
    state: string;
    club: string;
    start_date: string;
    end_date: string;
    start_date_ts: number;
    end_date_ts: number;
    registration_links: {
        overview: string;
        profile: string;
        skate_test: string;
        partner_events: string;
        partner_identification: string;
        event_selection: string;
        coach_information: string;
        waivers: string;
        cart: string;
    };
    has_partner_events: boolean;
}

/**
 * Source for Competition Registration CTA component/element
 */
export interface CompetitionRegistrationCtaConfiguration {
    action_blocked_message?: string;
    competition_registration_status: CompetitionRegistrationStatusKey;
    has_registration_deadline_warning: boolean;
    registration_deadline: string;
    user_registration_link: string;
    user_registration_status: UserCompetitionRegistrationStatusKey;
}

/**
 * Competition for competition registration competition list
 */
export interface RegistrationListCompetition extends CompetitionRegistrationCompetitionCore, CompetitionTileCompetition, CompetitionRegistrationCtaConfiguration {
    [key: string]: boolean | string | number | CompetitionSeries | null | object | undefined;

    state: string;
    is_qualifying: boolean;
    series: CompetitionSeries[] | null;
    registration_deadline: string;
    has_registration_deadline_warning: boolean;
    user_registration_status: UserCompetitionRegistrationStatusKey;
    competition_registration_status: CompetitionRegistrationStatusKey;
    user_registration_link: string;
}

/**
 * Competition used within competition registration process for a competition
 */
export interface CompetitionRegistrationActiveCompetition {
    competition: CompetitionRegistrationCompetitionCore;
    information: {
        overview: string[];
    };
    available_partner_events: FormOption[];
}

export type PriceRow = {
    [key: string]: string | number | null;
    category: string;
    first_price: number | null;
    second_price: number | null;
    third_price: number | null;
    combined_price: number | null;
};

export interface CompetitionPrices {
    six_point_zero: PriceRow[];
    ijs: PriceRow[];
}
/* ===========================================================================================================
*                                              User Profile/User-Related
* ===========================================================================================================*/
export type RepresentationType = "lts_program" | "home_club";

export type RepresentationSelection = {
    representation_type: RepresentationType;
    lts_program: FormOptionValue | null;
};

export type ProfileSectionKey = "main" | "email_phone";


/* ===========================================================================================================
*                                              Payloads
* ===========================================================================================================*/
export interface AddPartnerPayload {
    member_id: number;
    category_id: number;
}

export interface RemovePartnerPayload {
    member_id: number;
    category_id: number;
}

export interface CompRegRemoveCoachPayload {
    coach_id: number;
    category_id: number;
}

export interface CompRegAddCoachPayload {
    coach_id: number;
    category_id: number;
}

export interface CompRegReplaceCoachPayload {
    coach_id: number;
    category_id: number;
    replace_coach_id: number;
}


/* ===========================================================================================================
*                                              Responses
* ===========================================================================================================*/
export interface EventSelectionResponse {
    available_events: EventSelectionEvent[];
    partner_skate_test_summary: PartnerSkateTestSummary[];
}

export interface PartnerSkateTestRemoveResult {
    skate_test_history: UserSkateTestHistory;
    partner_skate_test_summary: PartnerSkateTestSummary[];
}

export interface PartnerSkateTestAddResult {
    partner_skate_test_summary: PartnerSkateTestSummary[];
    skate_test_history: UserSkateTestHistory;
}


/* ===========================================================================================================
*                                              Member-Related
* ===========================================================================================================*/
export interface AssignableMember {
    id: number;
    first_name: string;
    last_name: string;
    ineligible: boolean;
}

export interface MemberAssignmentCategory {
    id: number;
    name: string;
    member_limit: number;
    members: AssignableMember[];
}


/* ===========================================================================================================
*                                              Screen Param Contracts
* ===========================================================================================================*/
export interface CompetitionRegistrationOverviewScreenParams {
    competition: CompetitionRegistrationActiveCompetition;
    prices: CompetitionPrices;
}

export interface CompetitionRegistrationProfileScreenParams {
    competition: CompetitionRegistrationActiveCompetition;
    user_profile: UserProfile;
    representation_selection_required: boolean;
    selected_representation: RepresentationSelection | null;
}

export interface CompetitionRegistrationSkateTestsScreenParams {
    competition: CompetitionRegistrationActiveCompetition;
    skate_test_history: UserSkateTestHistory;
}

export interface CompetitionRegistrationPartnerEventsScreenParams {
    competition: CompetitionRegistrationActiveCompetition;
    selected_events: FormOptionValue[];
}

export interface CompetitionRegistrationPartnerIdentificationScreenParams {
    competition: CompetitionRegistrationActiveCompetition;
    partner_categories: PartnerIdentificationCategory[];
    state_form_options: FormOption[];
    user_profile: UserProfile;
}

export interface CompetitionRegistrationEventSelectionScreenParams extends EventSelectionResponse {
    competition: CompetitionRegistrationActiveCompetition;
    available_events: EventSelectionEvent[];
    partner_skate_test_summary: PartnerSkateTestSummary[];
    selected_partner_events: FormOptionValue[];

}

export interface CompetitionRegistrationCoachIdentificationScreenParams {
    competition: CompetitionRegistrationActiveCompetition;
    event_categories: SkaterCoachedEventCategory[];
    state_form_options: FormOption[];
}

export interface CompetitionRegistrationWaiversScreenParams {
    competition: CompetitionRegistrationActiveCompetition;
    relationships: FormOption[];
    user_waivers: UserWaiver[];
}


/* ===========================================================================================================
*                                             Misc
* ===========================================================================================================*/
export interface EventSelectionEvent {
    id: number;
    name: string;
    is_registered_for: boolean;
    is_selected: boolean;
    judging_system: string;
    category: string;
}

export type EventPartner = {
    name: string;
    id: number;
    meets_requirements: boolean;
};

export interface PartnerSkateTestSummary {
    event: {
        name: string;
        id: number;
        requirements: {
            minimum_skate_tests: string[] | null;
            maximum_skate_tests: string[] | null;
            minimum_age: number | null;
            maximum_age: number | null;
        };
    };
    partner: EventPartner;
}

export interface UserWaiver {
    id: number;
    name: string;
    file_url: string;
    status: {
        name: string | null;
        relationship: FormOptionValue | null;
    };
}

export interface CategorySkatingPartner extends AssignableMember {
}

export interface PartnerIdentificationCategory {
    id: number;
    name: string;
    partner: CategorySkatingPartner | null;
}

/**
 * Function to remove a member from member assignment screen
 */
export interface MemberRemoveFunction extends FunctionConstructor {
    (category_id: number, member: AssignableMember): Promise<void>;
}


/* ===========================================================================================================
*                                              Data Display
* ===========================================================================================================*/

/**
 * A path to a key on an object
 * ex: "club.name", "first_name", etc
 */
export type KeyPath = string;

/**
 * Config to retrieve a data point and associated label from an object
 */
export interface DataDisplayConfig {
    label: string;
    key: KeyPath;
}

/**
 * Labeled data point
 */
export interface LabeledData {
    label: string;
    value: string;
}