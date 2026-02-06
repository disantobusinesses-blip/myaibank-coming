export const demoAccounts = [
    { id: 1, institution_name: 'Commonwealth Bank', account_name: 'Everyday Account', account_type: 'Checking', balance: 1500.75, available_balance: 1500.75 },
    { id: 2, institution_name: 'Westpac', account_name: 'Savings Account', account_type: 'Savings', balance: 3200.50, available_balance: 3200.50 },
    // ... other realistic accounts
];

export const demoTransactions = [
    { id: 1, amount: -50.00, description: 'Grocery shopping', merchant_name: 'Woolworths', category: 'groceries', transaction_type: 'debit', transaction_date: '2026-02-01', is_subscription: false },
    { id: 2, amount: -75.00, description: 'Dinner at restaurant', merchant_name: 'Hunky Dory', category: 'dining', transaction_type: 'debit', transaction_date: '2026-01-28', is_subscription: false },
    { id: 3, amount: -100.00, description: 'Monthly Subscription', merchant_name: 'Spotify', category: 'subscriptions', transaction_type: 'debit', transaction_date: '2026-01-15', is_subscription: true },
    // ... include 40+ realistic transactions covering various categories
];

export const demoSubscriptions = [
    { id: 1, name: 'Netflix', amount: 15.99, frequency: 'monthly', category: 'entertainment', next_billing_date: '2026-03-01', is_active: true },
    { id: 2, name: 'Adobe Creative Cloud', amount: 52.99, frequency: 'monthly', category: 'utilities', next_billing_date: '2026-03-05', is_active: true },
    // ... include 8 subscriptions
];