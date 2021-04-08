import {FormOption, SubmissionResponse} from '../AppContracts';

/* ===========================================================================================================
*                                              General
* ===========================================================================================================*/

/**
 * Key for identifying a skate test discipline.  Unique and consistent for each discipline
 */
export type SkateTestDisciplineKey = string;

/**
 * Option for a test within the discipline test form
 */
export interface SkateTestFormOption extends FormOption {
    level_id: number;
}

/**
 * Full in-app object for testing test data for a discipline.  Exported from Discipline Form
 */
export type SkateTestFormData = {
    test: SkateTestFormOption;
    club: string;
    club_id: number | string | null;
    date: string;
}

/**
 * Generic intermediate object for tracking information for STH/E for a particular discipline
 */
export type SkateTestDiscipline = {
    label: string;
    key: SkateTestDisciplineKey;
};

export type SaveSkateTestActionPayload = {
    test_data:SkateTestFormData;
    active_discipline:SkateTestHistoryDiscipline;
}

/**
 * Action that saves a skate test
 */
export type SaveSkateTestsAction = (payload: SaveSkateTestActionPayload) => Promise<UserSkateTestHistory>;

/**
 * Action that removes a skate tests
 */
export type RemoveSkateTestsAction = (payload: SkateTestRemoveAppPayload) => Promise<UserSkateTestHistory>;

/* ===========================================================================================================
*                                              Equivalency Specific
* ===========================================================================================================*/
/**
 * Exported single discipline data for skate test equivalency for use outside of app.
 * Tests are flattened to only contain their values.
 * Used when transforming prior to sending an API payload
 */
export interface ExportedSkateTestEquivalencyDisciplineData {
    test: string;
    club: string;
    club_id: string | number | null;
    date: string;
}

/**
 * Active in-app state of skate test equivalency data
 * Tests remain as objects
 * Keyed by SkateTestDisciplineKey
 */
export interface SkateTestEquivalencyStateData {
    [key: string]: SkateTestFormData | null;
}

/**
 * Exported skate test equivalency for use outside of app.
 * Tests are flattened to only contain their values
 */
export interface SkateTestEquivalencyData {
    [key: string]: ExportedSkateTestEquivalencyDisciplineData | null;
}

/**
 * Skate Test form options, keyed by the category to which they belong.
 * Keyed by SkateTestDisciplineKey
 */
export type CategorizedSkateTestOptions = {
    [key: string]: SkateTestFormOption[];
}

/**
 * Equivalency-specific discipline data structure
 */
export interface SkateTestEquivalencyDiscipline extends SkateTestDiscipline {
}

interface SkateTestEquivalencyErrorSubmissionResponse extends SubmissionResponse {
    success: false;
}

interface SkateTestEquivalencySuccessSubmissionResponse extends SubmissionResponse {
    success: true;
}

export type SkateTestEquivalencySubmissionResponse =
    SkateTestEquivalencyErrorSubmissionResponse
    | SkateTestEquivalencySuccessSubmissionResponse;

/* ===========================================================================================================
*                                              History Specific
* ===========================================================================================================*/
/**
 * A skate test that has already been saved, whether official or self-reported
 */
export interface SavedSkateTest {
    id: number;
    name: string; // corresponds to the label of the selected SkateTestFormOption
    is_self_reported: boolean;
}

/**
 * History-specific discipline data structure
 */
export interface SkateTestHistoryDiscipline extends SkateTestDiscipline {
    key_test: SavedSkateTest[];
    available_tests: SkateTestFormOption[];
    self_reported_tests: SavedSkateTest[];
}

/**
 * Parent object for tracking STH
 */
export interface UserSkateTestHistory {
    disciplines: SkateTestHistoryDiscipline[];
}

export interface SkateTestRemoveAppPayload {
    discipline: SkateTestHistoryDiscipline;
    test: SavedSkateTest;
}

export interface PartnerSkateTestRemoveAppPayload extends SkateTestRemoveAppPayload {
    partner_id: number;
}

export interface PartnerSkateTestAddAppPayload {
    test_data: SkateTestFormData;
    discipline_key: SkateTestDisciplineKey;
    partner_id: number;
}