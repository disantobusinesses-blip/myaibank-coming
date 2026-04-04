export const demoAccounts = [
  { id: 1, institution_name: "Commonwealth Bank", account_name: "Everyday Account", account_type: "Checking", balance: 4850.20, available_balance: 4850.20 },
  { id: 2, institution_name: "Westpac", account_name: "Savings Account", account_type: "Savings", balance: 9400.00, available_balance: 9400.00 },
]

export const demoTransactions = [
  /* ─── JANUARY Week 1 (Jan 1–7) ─────────────────────────────────── */
  { id: 1,   amount:  3200.0,  description: "Salary",              merchant_name: "ACME Payroll",       category: "income",        transaction_type: "credit", transaction_date: "2026-01-02", is_subscription: false },
  { id: 2,   amount: -1450.0,  description: "Rent",                merchant_name: "Ray White",          category: "housing",       transaction_type: "debit",  transaction_date: "2026-01-02", is_subscription: true  },
  { id: 3,   amount:  -68.5,   description: "Weekly groceries",    merchant_name: "Woolworths",         category: "groceries",     transaction_type: "debit",  transaction_date: "2026-01-03", is_subscription: false },
  { id: 4,   amount:  -12.5,   description: "Morning coffee",      merchant_name: "Pablo & Rusty",      category: "dining",        transaction_type: "debit",  transaction_date: "2026-01-04", is_subscription: false },
  { id: 5,   amount:   -7.5,   description: "Train fare",          merchant_name: "Opal Travel",        category: "transport",     transaction_type: "debit",  transaction_date: "2026-01-05", is_subscription: false },
  { id: 6,   amount:  -29.99,  description: "Streaming",           merchant_name: "Netflix",            category: "subscriptions", transaction_type: "debit",  transaction_date: "2026-01-06", is_subscription: true  },
  { id: 7,   amount:  -16.0,   description: "Ride share",          merchant_name: "Uber",               category: "transport",     transaction_type: "debit",  transaction_date: "2026-01-06", is_subscription: false },

  /* ─── JANUARY Week 2 (Jan 8–14) ────────────────────────────────── */
  { id: 8,   amount:  -78.0,   description: "Groceries",           merchant_name: "Coles",              category: "groceries",     transaction_type: "debit",  transaction_date: "2026-01-08", is_subscription: false },
  { id: 9,   amount:  -18.5,   description: "Lunch",               merchant_name: "Roll'd",             category: "dining",        transaction_type: "debit",  transaction_date: "2026-01-09", is_subscription: false },
  { id: 10,  amount:  -85.0,   description: "Gym membership",      merchant_name: "Anytime Fitness",    category: "health",        transaction_type: "debit",  transaction_date: "2026-01-10", is_subscription: true  },
  { id: 11,  amount:  -48.0,   description: "Fuel",                merchant_name: "Caltex",             category: "transport",     transaction_type: "debit",  transaction_date: "2026-01-11", is_subscription: false },
  { id: 12,  amount:  -11.99,  description: "Music",               merchant_name: "Spotify",            category: "subscriptions", transaction_type: "debit",  transaction_date: "2026-01-12", is_subscription: true  },
  { id: 13,  amount:  -55.0,   description: "Dinner",              merchant_name: "Lentil as Anything", category: "dining",        transaction_type: "debit",  transaction_date: "2026-01-13", is_subscription: false },
  { id: 14,  amount:  -24.0,   description: "Lunch",               merchant_name: "Mad Mex",            category: "dining",        transaction_type: "debit",  transaction_date: "2026-01-14", is_subscription: false },

  /* ─── JANUARY Week 3 (Jan 15–21) ───────────────────────────────── */
  { id: 15,  amount: -100.0,   description: "Monthly Subscription",merchant_name: "Adobe CC",           category: "subscriptions", transaction_type: "debit",  transaction_date: "2026-01-15", is_subscription: true  },
  { id: 16,  amount:  -62.5,   description: "Groceries",           merchant_name: "Coles",              category: "groceries",     transaction_type: "debit",  transaction_date: "2026-01-16", is_subscription: false },
  { id: 17,  amount:  -16.8,   description: "Coffee",              merchant_name: "Industry Beans",     category: "dining",        transaction_type: "debit",  transaction_date: "2026-01-17", is_subscription: false },
  { id: 18,  amount:  -18.0,   description: "Ride share",          merchant_name: "Uber",               category: "transport",     transaction_type: "debit",  transaction_date: "2026-01-18", is_subscription: false },
  { id: 19,  amount:  -35.0,   description: "Pharmacy",            merchant_name: "Chemist Warehouse",  category: "health",        transaction_type: "debit",  transaction_date: "2026-01-19", is_subscription: false },
  { id: 20,  amount:  -59.0,   description: "Dinner",              merchant_name: "Chin Chin",          category: "dining",        transaction_type: "debit",  transaction_date: "2026-01-19", is_subscription: false },
  { id: 21,  amount:  -12.5,   description: "Mobile games",        merchant_name: "App Store",          category: "entertainment", transaction_type: "debit",  transaction_date: "2026-01-20", is_subscription: false },
  { id: 22,  amount: -120.0,   description: "Health insurance",    merchant_name: "Medibank",           category: "insurance",     transaction_type: "debit",  transaction_date: "2026-01-21", is_subscription: true  },

  /* ─── JANUARY Week 4 (Jan 22–28) ───────────────────────────────── */
  { id: 23,  amount:  3200.0,  description: "Salary",              merchant_name: "ACME Payroll",       category: "income",        transaction_type: "credit", transaction_date: "2026-01-23", is_subscription: false },
  { id: 24,  amount: -1450.0,  description: "Rent",                merchant_name: "Ray White",          category: "housing",       transaction_type: "debit",  transaction_date: "2026-01-24", is_subscription: true  },
  { id: 25,  amount:  -97.6,   description: "Groceries",           merchant_name: "Woolworths",         category: "groceries",     transaction_type: "debit",  transaction_date: "2026-01-24", is_subscription: false },
  { id: 26,  amount:  -24.9,   description: "Lunch",               merchant_name: "Salad Express",      category: "dining",        transaction_type: "debit",  transaction_date: "2026-01-25", is_subscription: false },
  { id: 27,  amount:  -45.0,   description: "Fuel",                merchant_name: "BP",                 category: "transport",     transaction_type: "debit",  transaction_date: "2026-01-26", is_subscription: false },
  { id: 28,  amount: -350.0,   description: "Flight deposit",      merchant_name: "Jetstar",            category: "travel",        transaction_type: "debit",  transaction_date: "2026-01-27", is_subscription: false },
  { id: 29,  amount:  -13.99,  description: "Cloud storage",       merchant_name: "Dropbox",            category: "subscriptions", transaction_type: "debit",  transaction_date: "2026-01-27", is_subscription: true  },
  { id: 30,  amount:  -75.0,   description: "Dinner at restaurant",merchant_name: "Hunky Dory",         category: "dining",        transaction_type: "debit",  transaction_date: "2026-01-28", is_subscription: false },
  { id: 31,  amount:  -95.0,   description: "Clothing",            merchant_name: "Cotton On",          category: "shopping",      transaction_type: "debit",  transaction_date: "2026-01-29", is_subscription: false },
  { id: 32,  amount:  -29.0,   description: "Books",               merchant_name: "Dymocks",            category: "shopping",      transaction_type: "debit",  transaction_date: "2026-01-30", is_subscription: false },

  /* ─── JANUARY Week 5 / FEB Week 1 (Jan 31–Feb 7) ───────────────── */
  { id: 33,  amount: -145.0,   description: "Hotel booking",       merchant_name: "Booking.com",        category: "travel",        transaction_type: "debit",  transaction_date: "2026-01-31", is_subscription: false },
  { id: 34,  amount:  -50.0,   description: "Grocery shopping",    merchant_name: "Woolworths",         category: "groceries",     transaction_type: "debit",  transaction_date: "2026-02-01", is_subscription: false },
  { id: 35,  amount:  250.0,   description: "Freelance payout",    merchant_name: "Upwork",             category: "income",        transaction_type: "credit", transaction_date: "2026-02-02", is_subscription: false },
  { id: 36,  amount:  -27.5,   description: "Lunch",               merchant_name: "Subway",             category: "dining",        transaction_type: "debit",  transaction_date: "2026-02-02", is_subscription: false },
  { id: 37,  amount:  -12.8,   description: "Morning coffee",      merchant_name: "Pablo & Rusty",      category: "dining",        transaction_type: "debit",  transaction_date: "2026-02-03", is_subscription: false },
  { id: 38,  amount:  -65.4,   description: "Weekly groceries",    merchant_name: "Coles",              category: "groceries",     transaction_type: "debit",  transaction_date: "2026-02-04", is_subscription: false },
  { id: 39,  amount:  -11.0,   description: "Streaming",           merchant_name: "Disney+",            category: "subscriptions", transaction_type: "debit",  transaction_date: "2026-02-04", is_subscription: true  },
  { id: 40,  amount:  -18.2,   description: "Taxi to airport",     merchant_name: "Uber",               category: "transport",     transaction_type: "debit",  transaction_date: "2026-02-05", is_subscription: false },
  { id: 41,  amount: -210.0,   description: "Electricity bill",    merchant_name: "AGL Energy",         category: "utilities",     transaction_type: "debit",  transaction_date: "2026-02-05", is_subscription: true  },
  { id: 42,  amount:  -52.0,   description: "Medical appointment", merchant_name: "MyHealth Clinic",    category: "health",        transaction_type: "debit",  transaction_date: "2026-02-05", is_subscription: false },

  /* ─── FEB Week 2 (Feb 8–14) ─────────────────────────────────────── */
  { id: 43,  amount:  3200.0,  description: "Salary",              merchant_name: "ACME Payroll",       category: "income",        transaction_type: "credit", transaction_date: "2026-02-06", is_subscription: false },
  { id: 44,  amount: -120.0,   description: "Mobile plan",         merchant_name: "Telstra",            category: "utilities",     transaction_type: "debit",  transaction_date: "2026-02-07", is_subscription: true  },
  { id: 45,  amount:  -29.99,  description: "Streaming",           merchant_name: "Netflix",            category: "subscriptions", transaction_type: "debit",  transaction_date: "2026-02-08", is_subscription: true  },
  { id: 46,  amount:   -7.5,   description: "Train fare",          merchant_name: "Opal Travel",        category: "transport",     transaction_type: "debit",  transaction_date: "2026-02-09", is_subscription: false },
  { id: 47,  amount:  -96.45,  description: "Household supplies",  merchant_name: "Bunnings",           category: "home",          transaction_type: "debit",  transaction_date: "2026-02-09", is_subscription: false },
  { id: 48,  amount:  -56.9,   description: "Weekend groceries",   merchant_name: "Aldi",               category: "groceries",     transaction_type: "debit",  transaction_date: "2026-02-10", is_subscription: false },
  { id: 49,  amount:  -15.0,   description: "Lunch",               merchant_name: "Roll'd",             category: "dining",        transaction_type: "debit",  transaction_date: "2026-02-10", is_subscription: false },
  { id: 50,  amount:  -85.0,   description: "Gym membership",      merchant_name: "Anytime Fitness",    category: "health",        transaction_type: "debit",  transaction_date: "2026-02-11", is_subscription: true  },
  { id: 51,  amount:  -22.0,   description: "Coffee with friends", merchant_name: "The Grounds",        category: "dining",        transaction_type: "debit",  transaction_date: "2026-02-12", is_subscription: false },
  { id: 52,  amount:  -17.5,   description: "Ride share",          merchant_name: "Uber",               category: "transport",     transaction_type: "debit",  transaction_date: "2026-02-12", is_subscription: false },
  { id: 53,  amount: -1400.0,  description: "Rent",                merchant_name: "Ray White",          category: "housing",       transaction_type: "debit",  transaction_date: "2026-02-13", is_subscription: true  },
  { id: 54,  amount:  -58.3,   description: "Grocery top-up",      merchant_name: "Woolworths",         category: "groceries",     transaction_type: "debit",  transaction_date: "2026-02-13", is_subscription: false },
  { id: 55,  amount:  -42.6,   description: "Fuel",                merchant_name: "Caltex",             category: "transport",     transaction_type: "debit",  transaction_date: "2026-02-14", is_subscription: false },
  { id: 56,  amount:  -12.99,  description: "Cloud storage",       merchant_name: "Google One",         category: "subscriptions", transaction_type: "debit",  transaction_date: "2026-02-14", is_subscription: true  },

  /* ─── FEB Week 3 (Feb 15–21) ─────────────────────────────────────── */
  { id: 57,  amount:  -24.95,  description: "Movie night",         merchant_name: "Event Cinemas",      category: "entertainment", transaction_type: "debit",  transaction_date: "2026-02-15", is_subscription: false },
  { id: 58,  amount:  -68.0,   description: "Dinner",              merchant_name: "Chin Chin",          category: "dining",        transaction_type: "debit",  transaction_date: "2026-02-15", is_subscription: false },
  { id: 59,  amount:   -9.6,   description: "Bus fare",            merchant_name: "Opal Travel",        category: "transport",     transaction_type: "debit",  transaction_date: "2026-02-16", is_subscription: false },
  { id: 60,  amount: -110.0,   description: "Internet",            merchant_name: "TPG",                category: "utilities",     transaction_type: "debit",  transaction_date: "2026-02-16", is_subscription: true  },
  { id: 61,  amount:  -22.0,   description: "Lunch",               merchant_name: "Sushi Hub",          category: "dining",        transaction_type: "debit",  transaction_date: "2026-02-17", is_subscription: false },
  { id: 62,  amount:  -86.7,   description: "Groceries",           merchant_name: "Coles",              category: "groceries",     transaction_type: "debit",  transaction_date: "2026-02-17", is_subscription: false },
  { id: 63,  amount:  -45.0,   description: "Pharmacy",            merchant_name: "Priceline",          category: "health",        transaction_type: "debit",  transaction_date: "2026-02-18", is_subscription: false },
  { id: 64,  amount:  -19.0,   description: "Streaming",           merchant_name: "Stan",               category: "subscriptions", transaction_type: "debit",  transaction_date: "2026-02-18", is_subscription: true  },
  { id: 65,  amount:  -33.2,   description: "Lunch",               merchant_name: "Guzman y Gomez",     category: "dining",        transaction_type: "debit",  transaction_date: "2026-02-19", is_subscription: false },
  { id: 66,  amount:  -60.0,   description: "Clothing",            merchant_name: "Uniqlo",             category: "shopping",      transaction_type: "debit",  transaction_date: "2026-02-19", is_subscription: false },
  { id: 67,  amount:  -14.5,   description: "Coffee",              merchant_name: "Campos Coffee",      category: "dining",        transaction_type: "debit",  transaction_date: "2026-02-20", is_subscription: false },
  { id: 68,  amount: -230.0,   description: "Car insurance",       merchant_name: "NRMA",               category: "insurance",     transaction_type: "debit",  transaction_date: "2026-02-20", is_subscription: true  },
  { id: 69,  amount:  -54.0,   description: "Groceries",           merchant_name: "IGA",                category: "groceries",     transaction_type: "debit",  transaction_date: "2026-02-21", is_subscription: false },
  { id: 70,  amount:  -15.2,   description: "Ride share",          merchant_name: "DiDi",               category: "transport",     transaction_type: "debit",  transaction_date: "2026-02-21", is_subscription: false },

  /* ─── FEB Week 4 (Feb 22–28) ─────────────────────────────────────── */
  { id: 71,  amount:  -80.0,   description: "Restaurant",          merchant_name: "Grill'd",            category: "dining",        transaction_type: "debit",  transaction_date: "2026-02-22", is_subscription: false },
  { id: 72,  amount:  -14.99,  description: "Music subscription",  merchant_name: "Apple Music",        category: "subscriptions", transaction_type: "debit",  transaction_date: "2026-02-22", is_subscription: true  },
  { id: 73,  amount:  -72.0,   description: "Groceries",           merchant_name: "Woolworths",         category: "groceries",     transaction_type: "debit",  transaction_date: "2026-02-23", is_subscription: false },
  { id: 74,  amount:   -8.0,   description: "Train fare",          merchant_name: "Opal Travel",        category: "transport",     transaction_type: "debit",  transaction_date: "2026-02-24", is_subscription: false },
  { id: 75,  amount:  -11.0,   description: "Coffee",              merchant_name: "Seven Seeds",        category: "dining",        transaction_type: "debit",  transaction_date: "2026-02-25", is_subscription: false },
  { id: 76,  amount:  -19.5,   description: "Lunch",               merchant_name: "Poke Bros",          category: "dining",        transaction_type: "debit",  transaction_date: "2026-02-26", is_subscription: false },
  { id: 77,  amount:  3200.0,  description: "Salary",              merchant_name: "ACME Payroll",       category: "income",        transaction_type: "credit", transaction_date: "2026-02-27", is_subscription: false },
  { id: 78,  amount: -1450.0,  description: "Rent",                merchant_name: "Ray White",          category: "housing",       transaction_type: "debit",  transaction_date: "2026-02-28", is_subscription: true  },

  /* ─── MAR Week 1 (Mar 1–7) ──────────────────────────────────────── */
  { id: 79,  amount:  -85.0,   description: "Groceries",           merchant_name: "Coles",              category: "groceries",     transaction_type: "debit",  transaction_date: "2026-03-01", is_subscription: false },
  { id: 80,  amount:  -12.0,   description: "Coffee",              merchant_name: "Pablo & Rusty",      category: "dining",        transaction_type: "debit",  transaction_date: "2026-03-02", is_subscription: false },
  { id: 81,  amount:  -52.0,   description: "Fuel",                merchant_name: "Shell",              category: "transport",     transaction_type: "debit",  transaction_date: "2026-03-03", is_subscription: false },
  { id: 82,  amount:  -85.0,   description: "Gym membership",      merchant_name: "Anytime Fitness",    category: "health",        transaction_type: "debit",  transaction_date: "2026-03-04", is_subscription: true  },
  { id: 83,  amount:  -29.99,  description: "Streaming",           merchant_name: "Netflix",            category: "subscriptions", transaction_type: "debit",  transaction_date: "2026-03-05", is_subscription: true  },
  { id: 84,  amount:  -42.0,   description: "Pharmacy",            merchant_name: "Chemist Warehouse",  category: "health",        transaction_type: "debit",  transaction_date: "2026-03-06", is_subscription: false },
  { id: 85,  amount: -120.0,   description: "Mobile plan",         merchant_name: "Telstra",            category: "utilities",     transaction_type: "debit",  transaction_date: "2026-03-07", is_subscription: true  },

  /* ─── MAR Week 2 (Mar 8–14) ─────────────────────────────────────── */
  { id: 86,  amount:  -22.0,   description: "Lunch",               merchant_name: "Roll'd",             category: "dining",        transaction_type: "debit",  transaction_date: "2026-03-08", is_subscription: false },
  { id: 87,  amount:  -67.0,   description: "Groceries",           merchant_name: "Woolworths",         category: "groceries",     transaction_type: "debit",  transaction_date: "2026-03-09", is_subscription: false },
  { id: 88,  amount:  -15.0,   description: "Ride share",          merchant_name: "Uber",               category: "transport",     transaction_type: "debit",  transaction_date: "2026-03-10", is_subscription: false },
  { id: 89,  amount:  -88.0,   description: "Restaurant",          merchant_name: "Nobu",               category: "dining",        transaction_type: "debit",  transaction_date: "2026-03-11", is_subscription: false },
  { id: 90,  amount: -110.0,   description: "Internet",            merchant_name: "TPG",                category: "utilities",     transaction_type: "debit",  transaction_date: "2026-03-12", is_subscription: true  },
  { id: 91,  amount:  3200.0,  description: "Salary",              merchant_name: "ACME Payroll",       category: "income",        transaction_type: "credit", transaction_date: "2026-03-13", is_subscription: false },
  { id: 92,  amount: -1450.0,  description: "Rent",                merchant_name: "Ray White",          category: "housing",       transaction_type: "debit",  transaction_date: "2026-03-14", is_subscription: true  },

  /* ─── MAR Week 3 (Mar 15–21) ─────────────────────────────────────── */
  { id: 93,  amount:  -73.0,   description: "Groceries",           merchant_name: "Coles",              category: "groceries",     transaction_type: "debit",  transaction_date: "2026-03-15", is_subscription: false },
  { id: 94,  amount:  -12.5,   description: "Coffee",              merchant_name: "Industry Beans",     category: "dining",        transaction_type: "debit",  transaction_date: "2026-03-16", is_subscription: false },
  { id: 95,  amount:  -24.0,   description: "Lunch",               merchant_name: "Guzman y Gomez",     category: "dining",        transaction_type: "debit",  transaction_date: "2026-03-17", is_subscription: false },
  { id: 96,  amount:   -9.0,   description: "Bus fare",            merchant_name: "Opal Travel",        category: "transport",     transaction_type: "debit",  transaction_date: "2026-03-18", is_subscription: false },
  { id: 97,  amount:  -11.99,  description: "Music",               merchant_name: "Spotify",            category: "subscriptions", transaction_type: "debit",  transaction_date: "2026-03-18", is_subscription: true  },
  { id: 98,  amount:  -95.0,   description: "Shopping",            merchant_name: "Zara",               category: "shopping",      transaction_type: "debit",  transaction_date: "2026-03-19", is_subscription: false },
  { id: 99,  amount:  -65.0,   description: "Dinner",              merchant_name: "Lentil as Anything", category: "dining",        transaction_type: "debit",  transaction_date: "2026-03-20", is_subscription: false },
  { id: 100, amount:  450.0,   description: "Freelance payout",    merchant_name: "Upwork",             category: "income",        transaction_type: "credit", transaction_date: "2026-03-21", is_subscription: false },
  { id: 101, amount:  -32.5,   description: "Pharmacy",            merchant_name: "Priceline",          category: "health",        transaction_type: "debit",  transaction_date: "2026-03-21", is_subscription: false },
]

export const demoSubscriptions = [
  { id: 1, name: "Netflix", amount: 15.99, frequency: "monthly", category: "entertainment", next_billing_date: "2026-03-01", is_active: true },
  { id: 2, name: "Adobe Creative Cloud", amount: 52.99, frequency: "monthly", category: "utilities", next_billing_date: "2026-03-05", is_active: true },
  { id: 3, name: "Spotify", amount: 11.99, frequency: "monthly", category: "entertainment", next_billing_date: "2026-03-10", is_active: true },
  { id: 4, name: "Google One", amount: 12.99, frequency: "monthly", category: "utilities", next_billing_date: "2026-03-14", is_active: true },
  { id: 5, name: "Telstra", amount: 120.0, frequency: "monthly", category: "utilities", next_billing_date: "2026-03-07", is_active: true },
  { id: 6, name: "Anytime Fitness", amount: 85.0, frequency: "monthly", category: "health", next_billing_date: "2026-03-11", is_active: true },
  { id: 7, name: "TPG Internet", amount: 110.0, frequency: "monthly", category: "utilities", next_billing_date: "2026-03-16", is_active: true },
  { id: 8, name: "Apple Music", amount: 14.99, frequency: "monthly", category: "entertainment", next_billing_date: "2026-03-18", is_active: true },
]
