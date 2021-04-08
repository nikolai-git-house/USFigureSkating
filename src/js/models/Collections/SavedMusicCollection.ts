import {SavedMusic} from "../Music/SavedMusic";

export class SavedMusicCollection {
    private _items: SavedMusic[] = [];

    public add(item: SavedMusic) {
        this._items.push(item);
    }

    public remove(item: SavedMusic) {
        for (let i = 0; i < this._items.length; i++) {
            let library_item = this._items[i];
            if (library_item.id === item.id) {
                this._items.splice(i, 1);
                return;
            }
        }
    }

    public all(): SavedMusic[] {
        return this._items;
    }

    public update(item: SavedMusic): void {
        for (let i = 0; i < this._items.length; i++) {
            let existing_item = this._items[i];
            if (existing_item.id === item.id) {
                this._items.splice(i, 1, item);
                return;
            }
        }
        this._items.push(item);
    }

}