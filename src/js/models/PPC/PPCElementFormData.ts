import {PPCElement, PPCElementParams} from "./PPCElement";
import {PPCElementMove, PPCElementType} from "../../contracts/app/PPCContracts";

export class PPCElementFormData {
    private _type: null | PPCElementType = null;
    private _element: null | PPCElementMove = null;
    private _moves: PPCElementMove[] | null[] = [];
    private _transition_description: string = '';

    constructor(ppc_element: PPCElement) {
        if (ppc_element.is_new) {
            return;
        }
        this._type = ppc_element.type ? {...ppc_element.type} : null;
        this._element = ppc_element.element ? {...ppc_element.element} : null;
        this._moves = ppc_element.moves ? [...ppc_element.moves] : [];
        if (ppc_element.transition_description) {
            this._transition_description = ppc_element.transition_description;
        }
    }

    get moves(): PPCElementMove[] | null[] {
        return this._moves;
    }

    set moves(value: PPCElementMove[] | null[]) {
        this._moves = value;
    }

    get type(): PPCElementType | null {
        return this._type;
    }

    /**
     * When setting type, automatically set element to null
     */
    set type(type: PPCElementType | null) {
        this.element = null;
        this._type = type;
    }

    get element(): PPCElementMove | null {
        return this._element;
    }

    /**
     * When setting element, create moves array from element move count
     */
    set element(element: PPCElementMove | null) {
        let move_count = element && element.move_count ? element.move_count : 0;
        this.configureMoves(move_count);
        this.transition_description = '';
        this._element = element;
    }

    get is_complete(): boolean {
        if (this._type === null) {
            return false;
        }
        if (this._element === null) {
            return false;
        }
        for (let i in this._moves) {
            if (this._moves[i] === null) {
                return false;
            }
        }
        if (this._element.is_transition && !this._transition_description) {
            return false;
        }

        return true;
    }

    get transition_description(): string {
        return this._transition_description;
    }

    set transition_description(value: string) {
        this._transition_description = value;
    }

    public export(): PPCElementParams | undefined {
        if (!this.is_complete) {
            return;
        }
        let export_value: PPCElementParams = {
            moves: (this._moves as PPCElementMove[]),
            type: this._type as PPCElementType,
            element: this._element as PPCElementMove
        };
        if (this.transition_description) {
            export_value.transition_description = this.transition_description;
        }
        return export_value
    }

    public reset() {
        this._type = null;
        this._element = null;
        this._moves = [];
    }

    private configureMoves(move_count: number) {
        let moves: null[] = [];
        for (let i = 0; i < move_count; i++) {
            moves.push(null);
        }
        this._moves = moves;
    }

}