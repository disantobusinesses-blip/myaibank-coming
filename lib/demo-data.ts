// Demo transaction data for preview mode

export interface DemoTransaction {
  id: string
  amount: number
  description: string
  merchant_name: string
  category: string
  transaction_date: string
  transaction_type: "debit" | "credit"
  is_subscription: boolean
}

export interface DemoAccount {
  id: string
  institution_name: string
  account_name: string
  account_type: string
  balance: number
  available_balance: number
}

// Generate dates relative to today
function daysAgo(days: number): string {
  const date = new Date()
  date.setDate(date.getDate() - days)
  return date.toISOString().split("T")[0]
}

export const demoAccounts: DemoAccount[] = [
  {
    id: "demo-acc-1",
    institution_name: "Commonwealth Bank",
    account_name: "Smart Access",
    account_type: "transaction",
    balance: 4825.67,
    available_balance: 4825.67,
  },
  {
    id: "demo-acc-2",
    institution_name: "Commonwealth Bank",
    account_name: "GoalSaver",
    account_type: "savings",
    balance: 12450.00,
    available_balance: 12450.00,
  },
]

export const demoTransactions: DemoTransaction[] = [
  // Income
  {
    id: "demo-tx-1",
    amount: 4500.00,
    description: "Salary - TechCorp Pty Ltd",
    merchant_name: "TechCorp Pty Ltd",
    category: "Income",
    transaction_date: daysAgo(1),
    transaction_type: "credit",
    is_subscription: false,
  },
  // Rent
  {
    id: "demo-tx-2",
    amount: -1800.00,
    description: "Rent Payment - 42 Wallaby Way",
    merchant_name: "Ray White Property",
    category: "Housing",
    transaction_date: daysAgo(2),
    transaction_type: "debit",
    is_subscription: true,
  },
  // Utilities
  {
    id: "demo-tx-3",
    amount: -156.78,
    description: "Electricity Bill",
    merchant_name: "AGL Energy",
    category: "Utilities",
    transaction_date: daysAgo(3),
    transaction_type: "debit",
    is_subscription: true,
  },
  {
    id: "demo-tx-4",
    amount: -89.00,
    description: "Internet - NBN Plan",
    merchant_name: "Telstra",
    category: "Utilities",
    transaction_date: daysAgo(5),
    transaction_type: "debit",
    is_subscription: true,
  },
  // Subscriptions
  {
    id: "demo-tx-5",
    amount: -22.99,
    description: "Netflix Premium",
    merchant_name: "Netflix",
    category: "Entertainment",
    transaction_date: daysAgo(7),
    transaction_type: "debit",
    is_subscription: true,
  },
  {
    id: "demo-tx-6",
    amount: -12.99,
    description: "Spotify Premium",
    merchant_name: "Spotify",
    category: "Entertainment",
    transaction_date: daysAgo(8),
    transaction_type: "debit",
    is_subscription: true,
  },
  {
    id: "demo-tx-7",
    amount: -7.99,
    description: "iCloud Storage 200GB",
    merchant_name: "Apple",
    category: "Technology",
    transaction_date: daysAgo(10),
    transaction_type: "debit",
    is_subscription: true,
  },
  {
    id: "demo-tx-8",
    amount: -65.00,
    description: "Gym Membership",
    merchant_name: "Fitness First",
    category: "Health & Fitness",
    transaction_date: daysAgo(12),
    transaction_type: "debit",
    is_subscription: true,
  },
  // Transport
  {
    id: "demo-tx-9",
    amount: -24.56,
    description: "Uber - Home to CBD",
    merchant_name: "Uber",
    category: "Transport",
    transaction_date: daysAgo(1),
    transaction_type: "debit",
    is_subscription: false,
  },
  {
    id: "demo-tx-10",
    amount: -18.90,
    description: "Uber - CBD to Bondi",
    merchant_name: "Uber",
    category: "Transport",
    transaction_date: daysAgo(4),
    transaction_type: "debit",
    is_subscription: false,
  },
  {
    id: "demo-tx-11",
    amount: -55.00,
    description: "Opal Card Top Up",
    merchant_name: "Transport NSW",
    category: "Transport",
    transaction_date: daysAgo(14),
    transaction_type: "debit",
    is_subscription: false,
  },
  // Food & Dining
  {
    id: "demo-tx-12",
    amount: -78.50,
    description: "Dinner - The Italian Place",
    merchant_name: "The Italian Place",
    category: "Dining",
    transaction_date: daysAgo(2),
    transaction_type: "debit",
    is_subscription: false,
  },
  {
    id: "demo-tx-13",
    amount: -45.00,
    description: "Uber Eats - Thai Food",
    merchant_name: "Uber Eats",
    category: "Dining",
    transaction_date: daysAgo(5),
    transaction_type: "debit",
    is_subscription: false,
  },
  {
    id: "demo-tx-14",
    amount: -125.67,
    description: "Weekly Groceries",
    merchant_name: "Woolworths",
    category: "Groceries",
    transaction_date: daysAgo(3),
    transaction_type: "debit",
    is_subscription: false,
  },
  {
    id: "demo-tx-15",
    amount: -89.45,
    description: "Groceries",
    merchant_name: "Coles",
    category: "Groceries",
    transaction_date: daysAgo(10),
    transaction_type: "debit",
    is_subscription: false,
  },
  {
    id: "demo-tx-16",
    amount: -6.50,
    description: "Morning Coffee",
    merchant_name: "Campos Coffee",
    category: "Dining",
    transaction_date: daysAgo(1),
    transaction_type: "debit",
    is_subscription: false,
  },
  {
    id: "demo-tx-17",
    amount: -5.80,
    description: "Coffee",
    merchant_name: "Single O",
    category: "Dining",
    transaction_date: daysAgo(2),
    transaction_type: "debit",
    is_subscription: false,
  },
  // Shopping
  {
    id: "demo-tx-18",
    amount: -149.00,
    description: "New Headphones",
    merchant_name: "JB Hi-Fi",
    category: "Shopping",
    transaction_date: daysAgo(6),
    transaction_type: "debit",
    is_subscription: false,
  },
  {
    id: "demo-tx-19",
    amount: -85.00,
    description: "Running Shoes",
    merchant_name: "Rebel Sport",
    category: "Shopping",
    transaction_date: daysAgo(15),
    transaction_type: "debit",
    is_subscription: false,
  },
  // Insurance
  {
    id: "demo-tx-20",
    amount: -125.00,
    description: "Health Insurance Premium",
    merchant_name: "Medibank",
    category: "Insurance",
    transaction_date: daysAgo(9),
    transaction_type: "debit",
    is_subscription: true,
  },
  // Transfer
  {
    id: "demo-tx-21",
    amount: -500.00,
    description: "Transfer to Savings",
    merchant_name: "Internal Transfer",
    category: "Transfer",
    transaction_date: daysAgo(1),
    transaction_type: "debit",
    is_subscription: false,
  },
  // Entertainment
  {
    id: "demo-tx-22",
    amount: -32.00,
    description: "Movie Tickets x2",
    merchant_name: "Event Cinemas",
    category: "Entertainment",
    transaction_date: daysAgo(8),
    transaction_type: "debit",
    is_subscription: false,
  },
]

// Calculate demo statistics
export function getDemoStats() {
  const income = demoTransactions
    .filter(t => t.transaction_type === "credit")
    .reduce((sum, t) => sum + t.amount, 0)
  
  const expenses = demoTransactions
    .filter(t => t.transaction_type === "debit")
    .reduce((sum, t) => sum + Math.abs(t.amount), 0)
  
  const subscriptions = demoTransactions.filter(t => t.is_subscription)
  const subscriptionTotal = subscriptions.reduce((sum, t) => sum + Math.abs(t.amount), 0)
  
  const totalBalance = demoAccounts.reduce((sum, a) => sum + a.balance, 0)
  
  // Group by category
  const byCategory = demoTransactions
    .filter(t => t.transaction_type === "debit")
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + Math.abs(t.amount)
      return acc
    }, {} as Record<string, number>)
  
  return {
    totalBalance,
    income,
    expenses,
    netCashflow: income - expenses,
    subscriptionCount: subscriptions.length,
    subscriptionTotal,
    byCategory,
  }
}

// Demo subscriptions for the subscriptions page
export const demoSubscriptions = demoTransactions
  .filter(t => t.is_subscription)
  .map(t => ({
    id: t.id,
    name: t.merchant_name,
    amount: Math.abs(t.amount),
    frequency: "monthly",
    category: t.category,
    next_billing_date: daysAgo(-30), // 30 days from now
    is_active: true,
  }))
