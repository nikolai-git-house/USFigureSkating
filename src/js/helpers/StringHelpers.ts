/* eslint-disable no-inner-declarations */
export namespace StringHelpers {

    /**
     * Convert a string to title case
     */
    export function titleCase(str: string) {
        const mod = str.toLowerCase()
            .split(' ');
        for (var i = 0; i < mod.length; i++) {
            mod[i] = mod[i].charAt(0)
                .toUpperCase() + mod[i].slice(1);
        }

        return mod.join(' ');
    }

    /**
     * Convert a string in snake_case to kebab-case
     */
    export function kebabCaseFromSnakeCase(str: string) {
        return str.replace(/_/g, '-');
    }

    /**
     * Insert a new string at a position within the string
     */
    export function splice(string: string, position: number, add: string) {
        return string.slice(0, position) + add + string.slice(position);
    }

    /**
     * Escape a string that may contain regex characters
     */
    export function escapeRegex(string: string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
    }

    /**
     * Format a key into a display string
     *
     * Replace underscores with spaces
     */
    export function displayFromKey(string: string): string {
        return string.replace(/_/g, ' ');
    }
}