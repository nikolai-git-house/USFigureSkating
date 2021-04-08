import {PPCElementFormData} from "./PPCElementFormData";
import {PPCElementMove, PPCElementType} from "../../contracts/app/PPCContracts";

export class PPCFormOptionsManager {
    private moves: PPCElementMove[] = [];
    private types: PPCElementType[] = [];

    /**
     * Import set of move and type data
     * Only include types for which there are moves available
     */
    constructor(moves: PPCElementMove[], types: PPCElementType[]) {
        this.moves = moves;

        let available_type_ids = this.moves.reduce(function (accumulator: number[], move: PPCElementMove) {
            if (accumulator.indexOf(move.type_id) === -1) {
                accumulator.push(move.type_id);
            }
            return accumulator;
        }, []);


        this.types = types.filter(function (type: PPCElementType) {
            return available_type_ids.indexOf(type.id) !== -1;
        });
    }

    /**
     * Get the available type options for the form. By this point, all imported types are available as options
     */
    getTypeOptions(): PPCElementType[] {
        return this.types;
    }

    /**
     *  Get the options for the element input
     *
     *  All the available moves (combo or not) that belong to the selected type
     */
    getElementOptions(form_data: PPCElementFormData): PPCElementMove[] {
        return this.filterMovesByActiveId(form_data);
    }


    /**
     * Get all the options for the move form input(s)
     *
     * All the moves belonging to the selected type that are not combo moves
     */
    getMoveOptions(form_data: PPCElementFormData): PPCElementMove[] {
        return this.filterMovesByActiveId(form_data).filter(function (move: PPCElementMove) {
            return move.exclude_from_combos === false;
        });
    }

    /**
     * Based on currently selected type, return only the moves belonging to that type
     */
    filterMovesByActiveId(form_data: PPCElementFormData) {
        let selected_type_id = form_data.type ? form_data.type.id : false;
        if (!selected_type_id) {
            return this.moves;
        }
        return this.moves.filter(function (move: PPCElementMove) {
            return move.type_id === selected_type_id;
        });
    }
}