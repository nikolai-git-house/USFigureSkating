import {SecondaryActionKey} from "../../contracts/AppContracts";


export class SecondaryActionState {
    active_index: number = -1;
    action_key: (SecondaryActionKey | '') = "";
    action_arguments: { [key: string]: any } = {};

    reset() {
        this.active_index = -1;
        this.action_key = "";
        this.action_arguments = {};
    }
}