import {ExportedPPCElement, PPCElementMove, PPCElementType} from "../../contracts/app/PPCContracts";


export interface PPCElementParams {
    moves: PPCElementMove[];
    type: PPCElementType;
    element: PPCElementMove
    transition_description?: string;
}


export class PPCElement {
    public id: number = -1;
    public is_new = true;
    private _moves: PPCElementMove[] = [];
    private _type?: PPCElementType;
    private _element?: PPCElementMove;
    private _transition_description?: string;

    constructor(parameters?: PPCElementParams, id?: number) {
        if (parameters) {
            let {moves, type, element} = parameters;
            this._moves = moves;
            this._type = type;
            this._element = element;
            this.is_new = false;
            this._transition_description = parameters.transition_description
        }
        if (id) {
            this.id = id;
        }
    }

    get moves(): PPCElementMove[] {
        return this._moves;
    }

    get element(): PPCElementMove | undefined {
        return this._element;
    }

    get type(): PPCElementType | undefined {
        return this._type;
    }

    get type_description(): string {
        return this._type ? this._type.name : ""
    }

    get element_description(): string {
        return this._element ? this._element.name : ""
    }

    get short_description(): string {
        if (this._moves.length) {
            return this._moves.map(function (move: PPCElementMove) {
                return move.code;
            }).join(" + ");
        }
        return this._element && this._element.code ? this._element.code : "";
    }

    get transition_description(): string | undefined {
        return this._transition_description;
    }


    public update(data: PPCElementParams) {
        this.is_new = false;
        this._type = data.type;
        this._element = data.element;
        this._moves = data.moves;
        this._transition_description = data.transition_description
    }

    public export(): ExportedPPCElement | null {
        if (this.type && this.element) {
            let export_value: ExportedPPCElement = {
                moves: this.moves,
                type: this.type,
                element: this.element
            };
            if (this._transition_description) {
                export_value.transition_description = this._transition_description;
            }
            return export_value
        }
        return null;
    }

    public clone(): PPCElement {
        let exported = this.export();
        if (exported) {
            let args: PPCElementParams = exported;
            return new PPCElement(args, this.id);
        }
        return new PPCElement();

    }
}