export type CartRegistrationItemTypeKey = 'registration_fee' | 'fee' | 'series_registration_fee' | 'team_registration_fee';
export type CartItemTypeKey = "session" | "credit" | "credit_package" | CartRegistrationItemTypeKey;

export interface CartItemContract {
    cost: number;
    competition_id: number;
    event_id: number;
    cart_item_type_key: CartItemTypeKey;
    event_name: string;
    competition_name: string;
    cart_description: string;
}

export interface CartRegistrationItem {
    cart_item_type_key: CartRegistrationItemTypeKey;
    is_registration_item: true;
    id: number;
    name: string;
    cost: number;
    description_lines: string[];
    unremovable: boolean;
}

export interface CartFee {
    name: string;
    amount: number;
}

export interface CartCostProperties {
    subtotal: number | false;
    additional_fees: CartFee[] | false;
    total: number | false;
}