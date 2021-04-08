import {ManagedTeam} from '../../Teams/_models';
import {
    BackLinkConfiguration,
    CoachSkater,
    CompetitionContact,
    NullableSalesWindowKey,
    PracticeIceSchedulesStateArgs,
    SkaterScheduleStateArgs
} from '../../contracts/AppContracts';
import {
    ActiveCompetitionSummary,
    ActiveEntitySummary,
    CompetitionPortalCompetitionInformation,
    CompetitionSelectableEntity
} from '../_models';
import {ViewCompetitionCompetition} from '../../pages/ViewCompetition/ViewCompetitionCompetition';
import {CompetitionDocuments} from '../../contracts/app/CompetitionDocumentsContracts';
import {SkaterSkatingEventSegment} from '../../models/SkaterSkatingEventSegment';
import {Cart} from '../../models/Cart/Cart';
import {SkaterCredits} from '../../models/Credits/SkaterCredits';
import {CompetitionInformation} from '../../models/Competition/CompetitionInformation';
import {CompetitionSchedule} from '../../models/Competition/CompetitionSchedule';
import {FetchCompetitionScheduleServiceResponse} from '../../CompetitionSchedule/_contracts/CompetitionScheduleContracts';
import {SkaterCoachedEventCategoryCollection} from '../../models/Collections/SkaterCoachedEventCollection';
import {CoachSkatersSchedule} from '../../models/Schedule/CoachSkatersSchedule';

export namespace CompetitionPortalService {

    export interface FetchCompetitionPortalCoreServiceResponse {
        competition_summary: ActiveCompetitionSummary;
        back_link: BackLinkConfiguration | null;
        entity_summary: ActiveEntitySummary | null;
    }

    export interface FetchMyTeamsServiceResponse extends FetchCompetitionPortalCoreServiceResponse {
        teams: ManagedTeam[];
    }

    export interface FetchCompetitionMainServiceResponse extends FetchCompetitionPortalCoreServiceResponse {
        view_competition: ViewCompetitionCompetition;
        user_manages_competition_eligible_teams: boolean;
    }

    export interface FetchCompetitionDocumentsServiceResponse extends FetchCompetitionPortalCoreServiceResponse {
        competition_documents: CompetitionDocuments;
    }

    export interface FetchCompetitionContactsServiceResponse extends FetchCompetitionPortalCoreServiceResponse {
        contacts: CompetitionContact[];
    }

    export interface FetchCompetitionInformationServiceResponse extends FetchCompetitionPortalCoreServiceResponse {
        competition_information: CompetitionPortalCompetitionInformation;
    }

    export interface FetchEntitySelectServiceResponse extends FetchCompetitionPortalCoreServiceResponse {
        entities: CompetitionSelectableEntity[];
    }

    export interface FetchMusicAndPpcServiceResponse extends FetchCompetitionPortalCoreServiceResponse {
        competition_information: CompetitionInformation;
        entity_event_segments: SkaterSkatingEventSegment[];
    }

    export interface FetchPracticeIceScheduleServiceResponse extends FetchCompetitionPortalCoreServiceResponse, PracticeIceSchedulesStateArgs {
        cart: Cart;
        entity_credits: SkaterCredits;
        competition_information: CompetitionInformation;
        active_sales_window: NullableSalesWindowKey;
    }

    export interface FetchPracticeIcePrePurchaseServiceResponse extends FetchCompetitionPortalCoreServiceResponse {
        cart: Cart;
        competition_information: CompetitionInformation;
        entity_credits: SkaterCredits;
        competition_schedule: CompetitionSchedule;
        entity_schedule: SkaterScheduleStateArgs;
        active_sales_window: NullableSalesWindowKey;
    }

    export interface FetchCompetitionPortalCompetitionScheduleServiceResponse extends FetchCompetitionPortalCoreServiceResponse {
        competition_schedule: FetchCompetitionScheduleServiceResponse;
    }

    export interface FetchMySkatersServiceResponse extends FetchCompetitionPortalCoreServiceResponse {
        coach_skaters: CoachSkater[];
    }

    export interface FetchMyCoachesServiceResponse extends FetchCompetitionPortalCoreServiceResponse {
        event_categories: SkaterCoachedEventCategoryCollection;
    }

    export interface FetchMyScheduleSkaterServiceResponse extends FetchCompetitionPortalCoreServiceResponse {
        skater_schedule?: SkaterScheduleStateArgs;
        schedule_available: boolean;
    }

    export interface FetchMyScheduleCoachServiceResponse extends FetchCompetitionPortalCoreServiceResponse {
        coach_schedule?: CoachSkatersSchedule;
        schedule_available: boolean;
    }

    export interface FetchCoachCompetitionScheduleServiceResponse extends FetchCompetitionPortalCoreServiceResponse {
        competition_schedule: FetchCompetitionScheduleServiceResponse;
        competition_information: CompetitionInformation;
        coached_skater_schedule: CoachSkatersSchedule;
    }
}