import {CompetitionScheduleData} from '../contracts/data/DataContracts';
import {CompetitionSchedule} from '../models/Competition/CompetitionSchedule';
import {FacililtyDataAdaptor} from './FacilityDataAdaptor';
import {RinkDataAdaptor} from './RinkDataAdaptor';
import {SessionDataAdaptor} from './SessionDataAdaptor';

export class CompetitionScheduleDataAdaptor {
    static adapt(raw_data: CompetitionScheduleData): CompetitionSchedule {
        const facilities_array = FacililtyDataAdaptor.adaptArray(raw_data.facilities);
        const rinks_array = RinkDataAdaptor.adaptFullArray(raw_data.rinks);
        const sessions_array = SessionDataAdaptor.adaptArray(raw_data.sessions);
        const competitionSchedule = new CompetitionSchedule(facilities_array, rinks_array, sessions_array);
        if (raw_data.legend) {
            competitionSchedule.legend = raw_data.legend;
        }
        if (raw_data.links) {
            competitionSchedule.links = raw_data.links;
        }

        return competitionSchedule;
    }
}