import {
    PPCData, PPCElementData, PPCIndexedMoveData, PPCIndexedTypesData, PPCMoveData, PPCOptionsData,
    PPCTypeData
} from "../contracts/data/PPCDataContracts";
import {PPCElementMove, PPCElementType, PPCFormOptions} from "../contracts/app/PPCContracts";
import {PPC, PPCParams} from "../models/PPC/PPC";
import {PPCElement, PPCElementParams} from "../models/PPC/PPCElement";

export class PPCDataAdaptor {

    public static adapt_PPCData_To_PPC(data: PPCData): PPC {
        let args: PPCParams = {
            elements: data.elements.map(function (element_data: PPCElementData) {
                return PPCDataAdaptor.adapt_PPCElementData_To_PPCElement(element_data);
            }),
            event_segment_id: parseInt(data.event_segment_id),
            competition_id: parseInt(data.competition_id),
            event_id: parseInt(data.event_id),
            competition_skated_event_id: parseInt(data.competition_skated_event_id)
        };
        return new PPC(args);
    }

    public static adapt_PPCOptionsData_To_PPCFormOptions(data: PPCOptionsData): PPCFormOptions {
        if (!data.hasOwnProperty('type') || !data.hasOwnProperty('elements')) {
            throw("Invalid data");
        }
        return {
            types: PPCDataAdaptor.adapt_PPCIndexedTypesData_To_PPCElementTypeArray(data.type),
            moves: PPCDataAdaptor.adapt_IndexedPPCMoveData_To_PPCElementMoveArray(data.elements)
        }
    }

    private static adapt_PPCElementData_To_PPCElement(data: PPCElementData): PPCElement {
        let args: PPCElementParams = {
            moves: data.moves.map(function (move_data: PPCMoveData) {
                return PPCDataAdaptor.adapt_PPCMoveData_To_PPCElementMove(move_data);
            }),
            type: PPCDataAdaptor.adapt_PPCTypeData_TO_PPCElementType(data.type),
            element: PPCDataAdaptor.adapt_PPCMoveData_To_PPCElementMove(data.element)
        };
        if (data.transition_description) {
            args.transition_description = data.transition_description;
        }
        return new PPCElement(args);
    }


    private static adapt_PPCTypeData_TO_PPCElementType(data: PPCTypeData): PPCElementType {
        return {
            id: data.id,
            name: data.description
        }
    }

    private static adapt_PPCMoveData_To_PPCElementMove(data: PPCMoveData): PPCElementMove {
        return {
            id: data.id,
            category_id: data.category_id,
            type_id: data.type_id,
            name: data.description,
            code: data.code,
            is_combo: data.is_combo,
            is_transition: data.is_transition,
            move_count: data.number_of_combos,
            exclude_from_combos: data.exclude_from_combos,
        }
    }

    private static adapt_IndexedPPCMoveData_To_PPCElementMoveArray(data: PPCIndexedMoveData): PPCElementMove[] {
        let result: PPCElementMove[] = [];
        for (let i in data) {
            let move_data: PPCMoveData = data[i];
            result.push(PPCDataAdaptor.adapt_PPCMoveData_To_PPCElementMove(move_data));
        }
        return result;
    }

    private static adapt_PPCIndexedTypesData_To_PPCElementTypeArray(data: PPCIndexedTypesData): PPCElementType[] {
        let result: PPCElementType[] = [];
        for (let i in data) {
            let name = data[i];
            result.push({
                id: parseInt(i),
                name: name
            })
        }

        return result;
    }
}