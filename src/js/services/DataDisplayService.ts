import {KeyPath} from "../contracts/app/CompetitionRegistrationContracts";


export class DataDisplayService {
    /**
     * Capitalize the first letter in a string
     */
    static capitalize(value: string): string {
        return value.toLowerCase().replace(/^[a-z]/, function (letter: string) {
            return letter.toUpperCase();
        });
    }
    /**
     * Get a display value on an object from a KeyPath.
     * If the key path results in a non-falsy string value on the object, return it.
     *
     * ex:
     * displayFieldFromObject("club.name", {club: {name: "Temp", id: 2}}) => "Temp"
     */
    static displayFieldFromObject(key_path: KeyPath, source_object: { [key: string]: any }): string | null {
        const field_path: string[] = key_path.split('.');
        let current_value = {...source_object};
        while (field_path.length) {
            let key = field_path.shift();
            if (!key || !current_value[key]) {
                return null;
            }
            current_value = current_value[key];
        }
        if (typeof current_value !== "string") {
            return null;
        }
        return current_value;
    }
}