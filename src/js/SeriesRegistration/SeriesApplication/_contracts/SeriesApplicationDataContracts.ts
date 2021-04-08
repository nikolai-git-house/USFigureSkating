import {
    GenderedMemberSearchResultData,
    MemberSearchResultData
} from '../../../contracts/release3/data/MemberSearchDataContracts';
import {MemberNumberData} from '../../../contracts/data/DataContracts';
import {UserClubInformationData} from '../../../contracts/release3/data/CompetitionRegistrationDataContracts';
import {SeriesRegistrationSeriesCoreData} from '../../_contracts/SeriesRegistrationDataContracts';
import {UserSkateTestHistoryData} from '../../../contracts/release3/data/SkateTestDataContracts';

export namespace SeriesApplicationData {
    /**
     * A saved series application, either for an individual or a team
     */
    export type SavedSeriesApplicationData = SavedUserApplicationData | SavedTeamApplicationData;

    /**
     * Represents Series data required by the "Series Application" page
     */
    export interface SeriesData extends SeriesRegistrationSeriesCoreData {
        application_deadline_formatted: {
            date: string;                                           // The formatted application deadline date
            time?: string;                                          // The formatted application deadline time
        };
        links: {                                                    // Links for the series
            overview: string;                                       // Link to series overview page (back link)
            select_team?: string;                                    // Link to select team page (back link)
        };
        application_configuration: ApplicationConfigurationData;    // The application configuration for the series
        refund_email_address: string;                               // Email address users should contact for refund inquiries
    }

    /**
     * Represents configuration information for an application associated with a series
     */
    export type ApplicationConfigurationData = {
        disciplines: ApplicationConfigurationDisciplineData[];      // List of discipline configurations for disciplines associated with the series
        levels_information: string;                                 // Information about level selection for the series.  Populates "Important Information" on "Levels" tab of application
        level_maximum: number;                                      // The maximum number of selectable levels
        eligibility_documents: SeriesEligibilityDocumentData[];     // Eligibility documents associated with the series
    };

    /**
     * Represents a discipline available for a series application
     */
    type ApplicationConfigurationDisciplineData = {
        id: number;                                                     // Unique identifier for the discipline
        coach_limit: number;                                            // Man number of coaches allowed for the discipline
        name: string;                                                   // Name of the discipline
        partner_configuration: {                                        // Partner configuration information for the discipline
            is_partnered: boolean;                                      // Whether the discipline requires a partner
            partner_rules: ApplicationDisciplinePartnerRuleKeyData[];   // Flags for validation rules to enforce when selecting a partner for the discipline
        };
    };

    /**
     * Key flag indicating a rule to enforce when selecting a partner for a particular discipline
     */
    type ApplicationDisciplinePartnerRuleKeyData =
        'opposite_gender'       // Selected partners must be of opposite genders from the user
        | 'compatible_levels'   // Selected partners must have level compatibility with the user within the discipline

    /**
     * Represents an eligibility document associated with a series
     */
    export interface SeriesEligibilityDocumentData {
        name: string;   // Name of the document
        link: string;   // URL for the document
    }

    /**
     * Represents a saved user series application
     */
    export interface SavedUserApplicationData {
        disciplines: SavedUserApplicationDisciplineData[];  // List of disciplines within the saved application
    }

    /**
     * Represents a saved team series application
     */
    export interface SavedTeamApplicationData {
        disciplines: SavedTeamApplicationDisciplineData[];  // List of disciplines within the saved application
    }

    /**
     * Represents a discipline within a saved application, whether for a team or individual
     */
    export interface SavedApplicationDisciplineData {
        discipline_id: number;                                          // Identifier of the associated discipline within the series application configuration
        coaches?: SavedUserApplicationDisciplineCoachData[];            // List of coaches selected for the discipline
        levels: SavedUserApplicationDisciplineLevelData[];              // List of levels selected for the  discipline
        partner?: SavedUserApplicationDisciplinePartnerData | null;     // Partner selected for the discipline.
    }

    /**
     * Represents a discipline within a saved user (individual) application
     */
    export interface SavedUserApplicationDisciplineData extends SavedApplicationDisciplineData {
        coaches: SavedUserApplicationDisciplineCoachData[];
        partner: SavedUserApplicationDisciplinePartnerData | null;
    }

    /**
     * Represents a discipline within a saved team series application
     */
    export interface SavedTeamApplicationDisciplineData extends SavedApplicationDisciplineData {
        // no overrides of base interface
    }

    /**
     * Represents a coach associated with a saved application discipline
     */
    export interface SavedUserApplicationDisciplineCoachData {
        first_name: string;     // Coach first name
        id: number;             // Unique identifier for the coach
        ineligible: boolean;    // Whether the coach is ineligible to participate in events
        last_name: string;      // Coach last name
    }

    /**
     * Represents level associated with a saved application discipline
     */
    export interface SavedUserApplicationDisciplineLevelData extends ApplicationDisciplineLevelData {
        is_paid: boolean;   // Whether the level has been paid for
    }

    /**
     * Represents a partner associated with a saved application discipline
     */
    export interface SavedUserApplicationDisciplinePartnerData {
        first_name: string;                                     // Partner first name
        id: number;                                             // Unique identifier for the partner
        ineligible: boolean;                                    // Whether the partner is ineligible to participate in events
        last_name: string;                                      // Partner last name
        eligible_levels: ApplicationDisciplineLevelData[];      // List of levels within the discipline for which the partner is eligible
    }

    /**
     * Represents general information about a level within a discipline within a series application
     */
    export interface ApplicationDisciplineLevelData {
        id: number;              // Unique identifier for the level
        level_id: number;        // Indicates the relative level value of the level
        name: string;            // Name of the level
        price: number;           // Cost of the level within the series application context
    }

    /**
     * Represents a search result when searching for a partner for a discipline within a series application
     */
    export interface PartnerSearchResultData extends GenderedMemberSearchResultData {
        eligible_levels: ApplicationDisciplineLevelData[];      // The levels for which the result is eligible for within the searched discipline
        is_citizenship_ineligible: boolean;                     // Whether the partner is ineligible to participate in the given series due to their citizenship status
                                                                // Should be false if the series does not have a citizenship requirement
    }

    /**
     * Represents a search result when searching for a coach for a discipline within a series application
     */
    export interface CoachSearchResultData extends MemberSearchResultData {
    }

    /**
     * Represents information about a discipline within a series application save submission
     */
    export interface SaveApplicationDisciplineData {
        discipline_id: number;                   // The ID of the discipline
        partner_id: number | null;    // The ID of the selected partner
        level_ids: number[];          // The IDs of the selected levels
        coach_ids: number[];          // The IDs of the selected coaches
    }

    /**
     * Represents information about a discipline within a series application save submission
     */
    export interface SaveApplicationDisciplineDataTeam {
        discipline_id: number;        // The ID of the discipline
        level_ids: number[];          // The IDs of the selected levels
    }

    /**
     * Represents a user's complete level eligibility for all disciplines available within a series application
     *
     * Should contain entries for all disciplines listed in the series application configuration
     */
    interface DisciplineLevelEligibilityDataComplete extends Array<DisciplineLevelEligibilityData> {
    }

    /**
     * Represents a user's level eligibility for a series application discipline
     */
    export interface DisciplineLevelEligibilityData {
        discipline_id: number;                                  // The id for the discipline to which the level eligibility applies
        eligible_levels: ApplicationDisciplineLevelData[];      // The levels for which the entity is eligible within the discipline
    }

    /**
     * User profile information for a series application.
     *
     * Subset of UserProfileData (src/js/contracts/release3/data/CompetitionRegistrationDataContracts.ts:64)
     */
    export interface UserApplicationProfileData {
        full_name: string;                                                      // The user's full name
        email: string;                                                          // The user's email address associated with the series application
        member_number: MemberNumberData;                                        // The user's member number
        birth_date: {                                                           // The user's birthdate...
            formatted: string;                                                  //      ...as a formatted string ("6/28/1979")
            timestamp: number;                                                  //      ...as a unix timestamp
        };
        home_club: UserClubInformationData | null;                              // Information about the user's home club, if applicable
        region_name: string;                                                    // The name of the user's region
        section_name: string;                                                   // The name of the user's section
        gender: 'male' | 'female';                                              // The user's gender
        series_level_eligibility: DisciplineLevelEligibilityDataComplete;       // The user's level eligibility for all disciplines available on the series application
        skate_test_history: UserSkateTestHistoryData;                           // The user's skate test history
        is_series_citizenship_ineligible: boolean;                              // Whether the user is ineligible to register for the series due to their citizenship status.  Should be false for series that do not require citizenship eligibility
    }

    /**
     * User profile information for a series application.
     */
    export interface TeamApplicationProfileData {
        name: string;                                                           // The team name
        level: string;                                                          // The team's level
        member_number: MemberNumberData;                                        // The teams's member number
        home_club?: UserClubInformationData | null;                             // Information about the team's home club, if applicable
        region_name?: string;                                                   // The name of the team's region, if applicable
        section_name?: string;                                                  // The name of the team's section, if applicable
        series_level_eligibility: DisciplineLevelEligibilityDataComplete;       // The team's level eligibility for all disciplines available on the series application
    }
}