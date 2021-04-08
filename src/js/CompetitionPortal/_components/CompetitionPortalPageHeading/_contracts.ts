import {PageEntityHeaderComponentEntity} from '../../../components/_contracts/PageEntityHeaderComponentContracts';
import {CompetitionHeadingSource} from '../../../contracts/AppContracts';

export interface CompetitionPortalPageHeadingBinding {
    entity?: PageEntityHeaderComponentEntity;
    competition: CompetitionHeadingSource;
}