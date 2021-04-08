import {GenderedMemberSearchResult, MemberSearchResult} from '../../../contracts/app/MemberSearchContracts';
import {GenderKey, MemberNumber} from '../../../contracts/AppContracts';
import {UserClubInformation} from '../../../contracts/app/UserContracts';
import {SeriesRegistrationPageHeadingSeries} from '../../_contracts/SeriesRegistrationContracts';
import {UserSkateTestHistory} from '../../../contracts/app/SkateTestContracts';

export namespace SeriesApplication {

    export interface UserApplication {
        disciplines: ApplicationDiscipline[];
    }

    export type ApplicationPartnerRuleKey = 'opposite_gender' | 'compatible_levels';

    export interface ApplicationDiscipline {
        id: number;
        coach_limit: number;
        coaches: ApplicationDisciplineCoach[];
        partner_configuration: {
            is_partnered: boolean;
            partner_rules: ApplicationPartnerRuleKey[];
        };

        name: string;
        levels: ApplicationDisciplineLevelSelected[];
        partners: ApplicationDisciplinePartner[];
    }

    export interface ApplicationDisciplineCoach {
        first_name: string;
        id: number;
        ineligible: boolean;
        last_name: string;
    }

    export interface ApplicationDisciplineLevel {
        id: number;
        level_id: number; // Indicates the relative level of the skate test
        name: string;
        price: number;
    }

    /**
     * Represents a selected level in the application
     */
    export interface ApplicationDisciplineLevelSelected extends ApplicationDisciplineLevel {
        is_paid: boolean;
    }

    export interface ApplicationDisciplinePartner {
        first_name: string;
        id: number;
        ineligible: boolean;
        last_name: string;
        eligible_levels: ApplicationDisciplineLevel[];
    }

    /**
     * Object to track teams that have been applied to a series
     */
    export interface AppliedTeams {
        teams: AppliedTeam[];
    }

    /**
     * A team that has been applied to a series, along with the applied levels
     */
    export interface AppliedTeam {
        id: string;
        name: string;
        level: string;
        levels: ApplicationDisciplineLevelSelected[];
        handbook: null | {
            url: string;
            name: string;
        };
    }

    export interface RemoveCoachPayload {
        coach: ApplicationDisciplineCoach;
        discipline: ApplicationDiscipline;
    }

    export interface SelectCoachPayload {
        result: MemberSearchResult;
        discipline: ApplicationDiscipline;
    }

    export interface RemoveLevelPayload {
        level: ApplicationDisciplineLevel;
        discipline: ApplicationDiscipline;
    }

    export interface SelectLevelPayload {
        level: ApplicationDisciplineLevel;
        discipline: ApplicationDiscipline;
    }

    export interface SelectPartnerPayload {
        result: PartnerSearchResult;
        discipline: ApplicationDiscipline;
    }

    export interface RemovePartnerPayload {
        partner: ApplicationDisciplinePartner;
        discipline: ApplicationDiscipline;
    }

    export interface DisciplineNotice {
        type: 'warning' | 'danger';
        message: string;
    }

    export interface PartnerSearchResult extends GenderedMemberSearchResult {
        eligible_levels: ApplicationDisciplineLevel[]; // The levels the result is eligible for for the searched discipline
        is_citizenship_ineligible: boolean;
    }

    export interface CoachSearchResult extends MemberSearchResult {
    }

    export interface SeriesEligibilityDocument {
        name: string;
        link: string;
    }

    export interface DisciplineLevelEligibility {
        discipline_id: number;
        eligible_levels: ApplicationDisciplineLevel[];
    }

    /**
     * Represents a user's complete level eligibility for all disciplines available for a series application
     */
    export interface DisciplineLevelEligibilityComplete extends Array<DisciplineLevelEligibility> {
    }

    export interface UserApplicationProfile {
        full_name: string;
        email: string;
        member_number: MemberNumber;
        birth_date: {
            formatted: string;
            timestamp: number;
        };
        home_club: UserClubInformation | null;
        region_name: string;
        section_name: string;
        gender: GenderKey;
        series_level_eligibility: DisciplineLevelEligibilityComplete;
        skate_test_history: UserSkateTestHistory;
        is_series_citizenship_ineligible: boolean;
    }

    export interface TeamApplicationProfile {
        name: string;
        member_number: MemberNumber;
        level: string;
        home_club: UserClubInformation | null;
        region_name: string | null;
        section_name: string | null;
        series_level_eligibility: DisciplineLevelEligibilityComplete;
    }

    export interface UpdateProfilePayload {
        email: string;
    }

    export type ApplicationConfigurationDiscipline = {
        id: number;
        coach_limit: number;
        name: string;
        partner_configuration: {
            is_partnered: boolean;
            partner_rules: ApplicationPartnerRuleKey[];
        };
    };

    export type ApplicationConfiguration = {
        disciplines: ApplicationConfigurationDiscipline[];
        levels_information: string;
        level_maximum: number;
        eligibility_documents: SeriesEligibilityDocument[];
    };

    /**
     * Series compatible with Series Application Page
     */
    export interface Series extends SeriesRegistrationPageHeadingSeries, CitizenshipNoticeSeries {
        links: {                                         // Links for the series
            overview: string;                            // Link to series overview page
            select_team?: string;                       // Link to select team page
        };
        application_configuration: ApplicationConfiguration;
        refund_email_address: string;
    }

    export interface CitizenshipNoticeSeries {
        name: string;
    }
}