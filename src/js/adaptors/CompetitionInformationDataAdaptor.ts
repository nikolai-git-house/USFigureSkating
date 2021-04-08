/* eslint-disable jsdoc/require-jsdoc */
import {MusicPPCDeadline} from '../contracts/AppContracts';
import {CompetitionInformationData, MusicPPCDeadlineData} from '../contracts/data/DataContracts';
import {CompetitionInformation, CompetitionInformationParameters} from '../models/Competition/CompetitionInformation';
import {SalesWindowDataAdaptor} from './SalesWindowDataAdaptor';
import {SkatingEventDataAdaptor} from './SkatingEventDataAdaptor';

export class CompetitionInformationDataAdaptor {

    static adaptDeadline(deadline_date: MusicPPCDeadlineData | null): MusicPPCDeadline | null {
        if (deadline_date === null) {
            return null;
        }

        return {
            ...deadline_date,
            timestamp: deadline_date.timestamp * 1000,
            date: new Date(deadline_date.timestamp * 1000)
        };
    }

    static adapt(raw_data: CompetitionInformationData): CompetitionInformation {

        const competition_id = parseInt(String(raw_data.competition_id));
        const sales_windows = SalesWindowDataAdaptor.adaptArray(raw_data.sales_windows);
        const skating_events = SkatingEventDataAdaptor.adaptArray(raw_data.skating_events);
        const practice_ice_instructions = raw_data.practice_ice_instructions;
        const practice_ice_terminology = raw_data.practice_ice_terminology;
        const schedulable_session_types = raw_data.schedulable_session_types;
        const pricing_message = raw_data.pricing_message ? raw_data.pricing_message : false;
        const music_ppc_deadline_description = raw_data.music_ppc_deadline_description ? raw_data.music_ppc_deadline_description : '';
        const ppc_deadline = raw_data.ppc_deadline ? CompetitionInformationDataAdaptor.adaptDeadline(raw_data.ppc_deadline) : null;
        const music_deadline = raw_data.music_deadline ? CompetitionInformationDataAdaptor.adaptDeadline(raw_data.music_deadline) : null;
        /**
         * @deprecated - 2020-06-17
         */
        const competition_documents = {
            action_documents: raw_data.competition_documents ? raw_data.competition_documents.action_documents : [],
            reference_documents: raw_data.competition_documents ? raw_data.competition_documents.reference_documents : []
        };
        const args: CompetitionInformationParameters = {
            competition_id,
            sales_windows,
            skating_events,
            practice_ice_instructions,
            practice_ice_terminology,
            schedulable_session_types,
            pricing_message,
            music_ppc_deadline_description,
            ppc_deadline,
            music_deadline,
            competition_documents
        };

        return new CompetitionInformation(args);
    }
}