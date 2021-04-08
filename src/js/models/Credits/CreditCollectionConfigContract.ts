export interface CreditCollectionConfigContract {
    upi?: number;
    opi?: number;
    wu?: number;

    [key: string]: (number | undefined)
}