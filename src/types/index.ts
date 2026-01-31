export type Category = 'Food' | 'Grocery' | 'Bills' | 'Entertainment' | 'Health' | 'Other';

export type PaymentMethod =
    | 'Zomato'
    | 'Swiggy'
    | 'Zepto'
    | 'Paytm'
    | 'PhonePe'
    | 'Google Pay'
    | 'Cash'
    | 'Card'
    | 'Other';

export interface Expense {
    id: string;
    amount: number;
    description: string;
    category: Category;
    paymentMethod: PaymentMethod;
    date: string; // ISO string
}

export const CATEGORIES: Category[] = ['Food', 'Grocery', 'Bills', 'Entertainment', 'Health', 'Other'];

export const PAYMENT_METHODS: PaymentMethod[] = [
    'Zomato', 'Swiggy', 'Zepto', 'Paytm', 'PhonePe', 'Google Pay', 'Cash', 'Card', 'Other'
];
