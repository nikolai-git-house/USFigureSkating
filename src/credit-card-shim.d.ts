declare module "card-validator" {
    export function number(value: string): {
        card: {
            niceType: string;
            type: string;
            gaps: number[];
            lengths: number[];
            code: { name: string, size: number };
        };
        isPotentiallyValid: boolean;    // if false, indicates there is no way the card could be valid
        isValid: boolean;               // if true, number is valid for submission
    };
}