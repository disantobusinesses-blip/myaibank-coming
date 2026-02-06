// demo-data.ts

// Array of demo bank accounts
export const demoAccounts = [
    {
        accountType: 'checking',
        balance: 1500.00,
        accountName: 'Everyday Account',
        institution: 'Commonwealth Bank',
        accountNumber: '123456789',
        bsb: '062-000'
    },
    {
        accountType: 'savings',
        balance: 5000.00,
        accountName: 'High-Interest Savings Account',
        institution: 'Westpac',
        accountNumber: '987654321',
        bsb: '032-000'
    },
    {
        accountType: 'credit card',
        balance: 2000.00,
        accountName: 'Visa Credit Card',
        institution: 'ANZ',
        accountNumber: '5555555555554444',
        bsb: '000-000'
    }
];

// Array of demo transactions
export const demoTransactions = [
    { date: '2026-01-02', amount: -50.00, category: 'groceries', merchant: 'Woolworths' },
    { date: '2026-01-03', amount: -30.00, category: 'dining', merchant: 'McDonald’s' },
    { date: '2026-01-05', amount: -12.99, category: 'subscriptions', merchant: 'Netflix' },
    { date: '2026-01-08', amount: -20.00, category: 'transport', merchant: 'Uber' },
    { date: '2026-01-12', amount: -100.00, category: 'utilities', merchant: 'AGL' },
    { date: '2026-01-14', amount: -15.00, category: 'entertainment', merchant: 'iTunes' },
    { date: '2026-01-15', amount: -50.00, category: 'health', merchant: 'Chemist Warehouse' },
    { date: '2026-01-20', amount: -200.00, category: 'shopping', merchant: 'David Jones' },
    { date: '2026-01-22', amount: -35.00, category: 'bills', merchant: 'Telstra' },
    { date: '2026-01-25', amount: 2500.00, category: 'income', merchant: 'Employer' },
    // ... additional transactions to reach approx. 40
];

// Array of demo subscriptions
export const demoSubscriptions = [
    { name: 'Netflix', cost: 12.99, interval: 'monthly' },
    { name: 'Spotify', cost: 11.99, interval: 'monthly' },
    { name: 'Gym', cost: 50.00, interval: 'monthly' },
    { name: 'Adobe', cost: 29.99, interval: 'monthly' },
    { name: 'iCloud', cost: 2.99, interval: 'monthly' },
    { name: 'YouTube Premium', cost: 14.99, interval: 'monthly' },
    { name: 'Amazon Prime', cost: 6.99, interval: 'monthly' },
    { name: 'Disney+', cost: 13.99, interval: 'monthly' }
];

