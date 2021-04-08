import {PPCElement} from "./PPCElement";
import {ReorderDirection} from "../../contracts/AppContracts";
import {ExportedPPC, ExportedPPCElement} from "../../contracts/app/PPCContracts";

export type PPCParams = {
    elements: PPCElement[];
    event_segment_id: number;
    competition_id: number;
    event_id: number;
    current_element_id?: number;
    competition_skated_event_id: number;
};

export class PPC {
    private _elements: PPCElement[] = [];
    private current_element_id = 1;
    private _event_segment_id: number = -1;
    private _competition_id: number = -1;
    private _event_id: number = -1;
    private _competition_skated_event_id: number = -1;

    constructor(parameters?: PPCParams) {
        if (parameters) {
            this._elements = parameters.elements;
            this._competition_id = parameters.competition_id;
            this._event_id = parameters.event_id;
            this._event_segment_id = parameters.event_segment_id;
            this._competition_skated_event_id = parameters.competition_skated_event_id;
            if (parameters.current_element_id) {
                this.current_element_id = parameters.current_element_id;
            }
        }
        for (let i = 0; i < this._elements.length; i++) {
            let element: PPCElement = this._elements[i];
            element.id = this.current_element_id++;
        }
    }

    get competition_skated_event_id(): number {
        return this._competition_skated_event_id;
    }

    get event_segment_id(): number {
        return this._event_segment_id;
    }

    get competition_id(): number {
        return this._competition_id;
    }

    get event_id(): number {
        return this._event_id;
    }

    get length(): number {
        return this._elements.length;
    }

    get elements(): PPCElement[] {
        return this._elements;
    }


    /**
     * Compare to a another PPC to see if they're equivalent
     * They're equivalent if they have all the same type, element type and moves
     */
    equals(compare: PPC): boolean {
        let source_elements = this.export().elements;
        let compare_elements = compare.export().elements;
        if (this.length !== compare.length) {
            return false;
        }
        for (let i = 0; i < source_elements.length; i++) {
            let source_element = source_elements[i];
            let compare_element = compare_elements[i];
            if (source_element.type.id !== compare_element.type.id) {
                return false;
            }
            if (source_element.element.id !== compare_element.element.id) {
                return false;
            }
            if (source_element.moves.length !== compare_element.moves.length) {
                return false;
            }
            for (let j = 0; j < source_element.moves.length; j++) {
                let move = compare_element.moves[j];
                if (move.id !== source_element.moves[j].id) {
                    return false;
                }
            }
        }
        return true;
    }

    export(): ExportedPPC {
        let elements = this.elements;
        return {
            elements: elements.reduce(function (accumulator: ExportedPPCElement[], element: PPCElement) {
                let exported_element = element.export();
                if (exported_element) {
                    accumulator.push(exported_element);
                }
                return accumulator;
            }, [])
        }
    }

    addElement(): number {
        let element = new PPCElement(undefined, this.current_element_id++);
        this._elements.push(element);
        return element.id;
    }

    removeElement(element_index: number): void {
        this._elements.splice(element_index, 1);
    }

    reorderElement(direction: ReorderDirection, element_index: number): void {
        let to_index = direction === "up" ? element_index - 1 : element_index + 1;
        if (to_index > -1 && to_index < this._elements.length) {
            this._elements.splice(to_index, 0, this._elements.splice(element_index, 1)[0]);
        }
    }

    /**
     * Reorder elements according the position of their IDs in an array
     */
    orderElements(order_map: number[]) {
        this.elements.sort(function (element: PPCElement, element_b: PPCElement) {
            return order_map.indexOf(element.id) > order_map.indexOf(element_b.id) ? 1 : -1;
        })
    }

    /**
     * Make a clone of a PPC
     */
    clone(): PPC {
        let elements = this.elements.map(function (element: PPCElement) {
            return element.clone();
        });
        let args: PPCParams = {
            elements,
            event_segment_id: this.event_segment_id,
            competition_id: this.competition_id,
            event_id: this.event_id,
            competition_skated_event_id: this.competition_skated_event_id
        };
        return new PPC(args);
    }

}