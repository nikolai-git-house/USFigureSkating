/* eslint-disable */
import {CreditStateData} from "./data/DataContracts";
import {ScheduledSession} from "../models/Sessions/ScheduledSession";
import {Session} from "../models/Sessions/Session";
import {CreditRule, SkatingEvent} from "../models/SkatingEvent";
import {CreditCard} from "../models/CreditCard";
import {BillingAddress} from "../models/BillingAddress";
import {Cart} from "../models/Cart/Cart";
import {CartCreditPackage} from "../models/Cart/CartCreditPackage";
import {CartCredit} from "../models/Cart/CartCredit";
import {CompetitionSchedule} from "../models/Competition/CompetitionSchedule";
import {Competition} from "../models/Competition/Competition";
import {CategorizedSkateTestOptions, SkateTestEquivalencyDiscipline} from "./app/SkateTestContracts";
import {AssignableMember} from "./app/CompetitionRegistrationContracts";
import {MemberSearchParameters} from "./app/MemberSearchContracts";
import Vue from 'vue';

export interface CreditState extends CreditStateData {
    [key: string]: number;
}

export type SalesWindowKey = "pre_purchase" | "selection" | "open_sales" | "on_site";
export type NullableSalesWindowKey = SalesWindowKey | "none";

export type SessionType = ("opi" | "upi" | "wu");

export type NullableSessionType = ("opi" | "upi" | "wu" | "");

export interface CartSessionPayload {
    session: ScheduledSession;
    cost: number;
    competition_id: number;
    event_name: string;
}

export interface CartSessionPayloadComplete extends CartSessionPayload {
    competition_name: string;
}

export interface ScheduleSessionArguments {
    session: Session;
    scheduled_as: SessionType;
    scheduled_event_id: number;
}

export interface CartSessionArguments extends ScheduleSessionArguments {
    cost: number;
    type_description?: string;
    competition_id: number;
    competition_name: string;
    scheduled_event_name: string;
}

export type NullableSecondaryActionKey =
    'confirm_removal'
    | 'select_event'
    | 'select_type'
    | 'confirm_single_type'
    | '';

export interface SelectedSessionValidationResult {
    success: boolean;
    secondary_action_key: NullableSecondaryActionKey;
    secondary_action_args: {
        [key: string]: any;
    };
    secondary_action: boolean;
    rejection: boolean;
    rejection_message: string;
    exported_session: ScheduledSession | false;
}

export interface SelectedSessionValidationSuccess extends SelectedSessionValidationResult {
    success: true;
    exported_session: ScheduledSession;
    secondary_action: false;
}

export interface SelectedSessionValidationFailure extends SelectedSessionValidationResult {
    success: false;
    exported_session: false;
}

export type SecondaryActionKey = 'confirm_removal' | 'select_event' | 'select_type' | 'confirm_single_type';

export type SecondaryActionArgsOptions = {
    matched_events?: SkatingEvent[];
    matched_types?: SessionType[];
    available_type?: SessionType;
    alternate_types?: SessionType[];
};

export interface SelectedSessionSecondaryActionRequired extends SelectedSessionValidationFailure {
    secondary_action: true;
    secondary_action_key: SecondaryActionKey;
    secondary_action_args: SecondaryActionArgsOptions;
}

export interface SelectedSessionRejection extends SelectedSessionValidationFailure {
    rejection: true;
    secondary_action: false;
}

export interface SessionRemovalConfirmationNeeded {
    secondary_action: 'confirm_removal';
}

export interface SelectedSessionMessage {
    type: ('success' | 'error');
    message: string;
    secondary_action: false;
}

/**
 * Used to report completion of session selection to view model
 */
export interface SelectedSessionOutcome extends SelectedSessionMessage {
    resolution_function?: Function;
}

/**
 * Used to denote services that return resolution functions with their action report.
 */
export interface SelectedSessionMessageAction extends SelectedSessionMessage {
    resolution_function: Function;
}

export interface SessionSelectionActionRequired {
    secondary_action: SecondaryActionKey;
    secondary_action_args?: SecondaryActionArgsOptions;
}

export interface MultipleQualifyingTypesError extends SelectedSessionSecondaryActionRequired {
    secondary_action_key: 'select_type';
    secondary_action_args: {
        matched_types: SessionType[];
    };
}

export interface SingleMatchedQualifyingTypeError extends SelectedSessionSecondaryActionRequired {
    secondary_action_key: 'confirm_single_type';
    secondary_action_args: {
        available_type: SessionType;
        alternate_types: SessionType[];
    };
}

export interface MultipleQualifyingEventsError extends SelectedSessionSecondaryActionRequired {
    secondary_action_key: "select_event";
    secondary_action_args: {
        matched_events: SkatingEvent[];
    };
}

export type SessionSelectionSecondaryActionInputConfig = {
    label: string;
    action: Function;
}

export interface CreditList {
    [key: string]: number

    opi: number;
    upi: number;
    wu: number;
}

export interface NullableCreditList {
    [key: string]: number | undefined;

    opi?: number;
    upi?: number;
    wu?: number;
}

export interface EventCreditList {
    [key: number]: number

    event_id: number;
    opi: number;
    upi: number;
    wu: number;
}

export type EventCreditConfig = {
    event: {
        name: string;
        id: number;
    };
    purchasable_credits: CreditRule[];
}

export interface NamedEventCreditList extends EventCreditList {
    event_name: string;
}

export interface CartCreditInterface {
    event_id: number;
    credit_type: SessionType;
    amount: number;
    cost: number;
    competition_id?: number;
    competition_name?: string;
    event_name?: string;
}

export interface IndexedEventCreditList {
    [key: number]: EventCreditList;
}

/**
 * The global type key for a session.  Identifies the global session type
 */
export type SessionTypeKey = 'practice_ice' | 'warm_up' | 'event' | 'resurface';

export interface SessionLike {
    type_key: SessionTypeKey;
    is_full: boolean;
    id: number;
    event_ids: number[];
    credit_types: SessionType[];
}

export type IndexedSessionMessages = {
    [key: number]: string;
}

export type StagingCartAddPayload = {
    event_id: number;
    credit_config: CreditRule;
    amount: number;
    competition_name: string;
    event_name: string;
    competition_id: number;
}

/**
 * @deprecated 5/27/19 - this returned basic name and address info and has been superseded by User Profile info
 */
export interface SkaterInfo {
    first_name: string;
    last_name: string;
    address: {
        street: string;
        street_2: string | null;
        city: string;
        state: string;
        zip_code: number;
    };
}

export type CheckoutData = {
    payment_info: {
        card: CreditCard;
        address: BillingAddress;
    };
    cart: Cart;
}

export type CheckoutDataError = {
    error: string;
}

export interface OrderAttemptResponse {
    success: boolean;
    message: string;
    invoice_id?: string;
}

export interface SelectedSessionArgs {
    session: Session;
    action_confirmed: boolean;
    selected_event_id?: number;
    selected_session_type?: SessionType;
}

/**
 * Type when exporting selected credits from the purchase credits screen
 */
export type CreditExportPayload = {
    credits: CartCredit[];
    packages: CartCreditPackage[];
};

export type CompetitionContact = {
    name: string;
    role: string;
    email: string;
}

/**
 * Service response when fetching competition contacts for a competition
 *
 * @deprecated 2020-07-01; see: CompetitionPortalService.FetchCompetitionContactsServiceResponse
 */
export interface FetchCompetitionContactsServiceResponse {
    contacts: CompetitionContact[];
}

export type CoachSkaterEvent = {
    name: string;
    coaching_role: string;
    music_complete: boolean;
    ppc_complete: boolean;
    ppc_required: boolean;
    music_required: boolean;
}

export type CoachSkater = {
    id: number;
    first_name: string;
    last_name: string;
    federation_letter_status: string | false;
    events: CoachSkaterEvent[];
}

export interface SkaterEventCategoryCoach extends AssignableMember {
    id: number;
    first_name: string;
    last_name: string;
    ineligible: boolean;
}

export interface MyCoachesSearchParameters extends MemberSearchParameters {

}

export interface CoachResult {
    club_name: string;
    first_name: string;
    id: number;
    ineligible: boolean;
    last_name: string;
    member_number: number;
    state_abbreviation: string;
}

export interface CoachRemovePayload {
    coach: SkaterEventCategoryCoach;
    event_category_id: number;
    competition_id: number;
}

export interface CoachAddPayload {
    coach: SkaterEventCategoryCoach;
    event_category_id: number;
    competition_id: number;
}

export interface CoachReplacePayload {
    coach: SkaterEventCategoryCoach;
    event_category_id: number;
    competition_id: number;
    previous_coach_id: number;
}

export type FormOptionValue = string | number | null;

export type MemberSearchFormOptionValue = string | null;

export interface FormOption {
    label: string;
    value: any;
}

export interface StateFormOption extends FormOption {
}

export interface FederationFormOption extends FormOption {
}

export interface ProvinceFormOption extends FormOption {
}

export interface CountryFormOption extends FormOption {
    is_usa: boolean;
    is_canada: boolean;
}

export interface FormOptionTyped<T> {
    label: string;
    value: T;
}

export interface PerPageFormOption extends FormOptionTyped<PerPageOption> {
}

export type SearchActionKey = "add" | "edit" | "";

export type SearchActivationPayload = {
    search_type: 'add' | 'edit';
    category_id: number;
    coach_id?: number;
}

export type PaginationOption = {
    page_number: string | number;
    page_index: number | false;
}

export type PerPageOption = number | "all";

export type UserRole = 'skater' | 'coach' | 'team_manager';

export type ReorderDirection = "up" | "down";

export interface MusicPPCDeadline {
    formatted: string;
    timestamp: number;
    late_fee: string;
    date: Date;
}

export interface MusicPPCInformation {
    description: string;
    ppc: MusicPPCDeadline | null;
    music: MusicPPCDeadline | null;
}

export type AvailableEventCredits = {
    event_name: string;
    credits: {
        [key: string]: number | undefined;

        opi?: number;
        upi?: number;
        wu?: number;
    };
}

export type EventIndexedCreditLimits = {
    [key: number]: {
        [key: string]: number;

        opi: number;
        upi: number;
        wu: number;
    };
};

export interface EMSSupportIssueTypeOption {
    label: string;
    subtypes: string[];
}

export type ExportedEMSSupportFormData = {
    member_number: number;
    email: string;
    phone: string;
    issue_type: string;
    issue_subtype: string;
    description: string;
}

export type EMSSupportSubmitResult = {
    success: boolean;
    error: string;
}

export type SkaterScheduleStateArgs = {
    sessions: ScheduledSession[];
    events: SkatingEvent[];
}

export type CompetitionScheduleStateArgs = {
    result: CompetitionSchedule;
    competition: Competition | {};
}

export type PracticeIceSchedulesStateArgs = {
    competition_schedule: CompetitionSchedule;
    skater_schedule_args: SkaterScheduleStateArgs;
}

export type IndexedSessions = {
    [key: number]: Session;
};

export type AccountTypeKey = "volunteer" | "foreign";

export type GenderKey = "male" | "female";

export type ForeignUserTypeKey = "coach" | "skater" | "official";

export interface SubmissionResponse {
    success: boolean;
    error: string;
}

export type CreateAccountFormOptions = {
    states: StateFormOption[];
    countries: CountryFormOption[];
    provinces: ProvinceFormOption[];
    federations: FederationFormOption[];
    skate_tests: CategorizedSkateTestOptions;
    skate_test_disciplines: SkateTestEquivalencyDiscipline[];
}

export type BillingAddressFormOptions = {
    states: StateFormOption[];
    countries: CountryFormOption[];
    provinces: ProvinceFormOption[];
}

export type EditProfileFormOptions = {
    user_prefixes: FormOption[];
    user_suffixes: FormOption[];
    mobile_carriers: FormOption[];
}

export type SupportDocumentCategory = {
    name: string;
    subcategories: SupportDocumentSubcategory[];
};

export type SupportDocument = {
    name: string;
    link: string;
};

export type SupportDocumentSubcategory = {
    name: string | null;
    documents: SupportDocument[];
};

export interface EmergencyContact {
    name: string | null;
    relationship: string | null;
    phone: string | null;
}

export interface UpdateEmergencyContactArgs {
    [key: string]: string | null;

    name: string | null;
    relationship: string | null;
    phone: string | null;
}

export interface SearchResult {}

export interface CompetitionHeadingSource {
    id: number;
    name: string;
    icon: string;
    start_date_pretty: string;
    end_date_pretty: string;
    directions: { location_name: string; link: string }[];
    announcement_url: string | null;
    website_url: string | null;
}

export interface AppRootInterface extends Vue {
    getCurrentScroll: (() => number)
    resetScroll: (() => void)
    scrollTo: ((position: number) => void)
}

export type InformationStatusKey = 'default' | 'success' | 'warning' | 'error';
export interface AccordionStatusTriggerDataInterface{
    label?: string;
    status_key: InformationStatusKey;
    value: string | number;
}

export type MemberNumber = string | number;

/**
 * Structure for tracking submission status of a list of items with an ID.
 *
 * Object is keyed by ID converted to a string, and tracks whether each item is submitting, or has an associated
 * submission error
 */
export interface IdIndexedSubmissionStatus {
    [key: string]: {
        submitting?: boolean;
        error?: string;
    };
}

export interface AccordionComponentInterface extends Vue {
    open: () => void;
    close: () => void;
}

export interface CompetitionFilterComponentInterface extends Vue {
    reset: () => void;
}

export type BackLinkConfiguration = {
    url: string;
    label?: string;
}

export interface PageComponentHeaderBackLinkConfiguration {
    back_link?: string;
    back_link_label?: string;
}

export interface PageComponentHeaderConfiguration extends PageComponentHeaderBackLinkConfiguration {
    back_link_handler?: () => void;
    title?: string;
    lead?: string;
    subtitle?: string;

    [key: string]: string | undefined | Function;
}

export type confirmActionConfiguration = {
    message: string;
    action: Function;
    is_promise?: boolean;
}

export type StatusMessageTypeKey = 'default' |   // Normal text
    'info' |            // Blue status text
    'success' |         // Green status text
    'warning' |         // Orange status text
    'alert';            // Red status text

/**
 * A base level status message
 */
export type StatusMessage = {
    text: string;
    type_key: StatusMessageTypeKey;
}

/**
 * Configuration for an app notice in state
 */
export type AppNoticeStateConfiguration = {
    notice: string;
    dismiss_override?: () => void;
    is_danger?: boolean;
}
/**
 * Payload for setting an app notice
 */
export type AppNoticeStatePayload = {
    notice: string | Vue;
    dismiss_override?: () => void;
    is_danger?: boolean;
}

export type LinkConfiguration = {
    url: string;
    is_new_tab: boolean;
}

export interface StatusSummaryItem {
    complete: boolean;
    name: string;
}

export interface ComponentLoaderStatusSource {
    load_error: boolean;
    loaded: boolean;
    loading_timeout: boolean;
    error_message?: string;
}