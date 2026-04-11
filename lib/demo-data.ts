// Demo data used when no real bank is connected.
// Includes 90 days of historical transactions + 90 days of AI-projected
// future cash flow so users see the full value of the forecasting engine.

export interface DemoTransaction {
  id: string
  amount: number
  description: string
  merchant_name: string
  category: string
  transaction_type: "credit" | "debit"
  transaction_date: string
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

export interface DemoSubscription {
  id: string
  name: string
  amount: number
  frequency: string
  category: string | null
  next_billing_date: string
  is_active: boolean
}

// ── Helpers ─────────────────────────────────────────────────────────────────
function daysAgo(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString().split("T")[0]
}
function daysAhead(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() + n)
  return d.toISOString().split("T")[0]
}

// ── Accounts ─────────────────────────────────────────────────────────────────
export const demoAccounts: DemoAccount[] = [
  {
    id: "demo-acc-1",
    institution_name: "Commonwealth Bank",
    account_name: "Everyday Account",
    account_type: "TRANS_AND_SAVINGS_ACCOUNTS",
    balance: 4820.55,
    available_balance: 4820.55,
  },
  {
    id: "demo-acc-2",
    institution_name: "Commonwealth Bank",
    account_name: "NetBank Saver",
    account_type: "SAVINGS",
    balance: 18340.0,
    available_balance: 18340.0,
  },
]

// ── Transactions (90 days history) ───────────────────────────────────────────
export const demoTransactions: DemoTransaction[] = [
  // CREDITS
  { id:"t001", amount:4200,   description:"Salary - Acme Corp",       merchant_name:"Acme Corp",       category:"income",       transaction_type:"credit", transaction_date:daysAgo(1),  is_subscription:false },
  { id:"t002", amount:4200,   description:"Salary - Acme Corp",       merchant_name:"Acme Corp",       category:"income",       transaction_type:"credit", transaction_date:daysAgo(29), is_subscription:false },
  { id:"t003", amount:4200,   description:"Salary - Acme Corp",       merchant_name:"Acme Corp",       category:"income",       transaction_type:"credit", transaction_date:daysAgo(57), is_subscription:false },
  { id:"t004", amount:4200,   description:"Salary - Acme Corp",       merchant_name:"Acme Corp",       category:"income",       transaction_type:"credit", transaction_date:daysAgo(86), is_subscription:false },
  { id:"t005", amount:280,    description:"Freelance Invoice #14",    merchant_name:"Client Direct",   category:"income",       transaction_type:"credit", transaction_date:daysAgo(10), is_subscription:false },
  { id:"t006", amount:150,    description:"Interest - NetBank Saver", merchant_name:"CommBank",        category:"income",       transaction_type:"credit", transaction_date:daysAgo(30), is_subscription:false },
  // RENT / HOUSING
  { id:"t010", amount:-1800,  description:"Rent - 42 Main St",        merchant_name:"Real Estate Co",  category:"housing",      transaction_type:"debit",  transaction_date:daysAgo(2),  is_subscription:false },
  { id:"t011", amount:-1800,  description:"Rent - 42 Main St",        merchant_name:"Real Estate Co",  category:"housing",      transaction_type:"debit",  transaction_date:daysAgo(32), is_subscription:false },
  { id:"t012", amount:-1800,  description:"Rent - 42 Main St",        merchant_name:"Real Estate Co",  category:"housing",      transaction_type:"debit",  transaction_date:daysAgo(61), is_subscription:false },
  // GROCERIES
  { id:"t020", amount:-143.5, description:"Woolworths Online",        merchant_name:"Woolworths",      category:"groceries",    transaction_type:"debit",  transaction_date:daysAgo(3),  is_subscription:false },
  { id:"t021", amount:-98.2,  description:"Coles Supermarket",        merchant_name:"Coles",           category:"groceries",    transaction_type:"debit",  transaction_date:daysAgo(10), is_subscription:false },
  { id:"t022", amount:-121,   description:"Woolworths Supermarket",   merchant_name:"Woolworths",      category:"groceries",    transaction_type:"debit",  transaction_date:daysAgo(17), is_subscription:false },
  { id:"t023", amount:-88.4,  description:"Aldi Supermarket",         merchant_name:"Aldi",            category:"groceries",    transaction_type:"debit",  transaction_date:daysAgo(24), is_subscription:false },
  { id:"t024", amount:-134.9, description:"Coles Supermarket",        merchant_name:"Coles",           category:"groceries",    transaction_type:"debit",  transaction_date:daysAgo(38), is_subscription:false },
  { id:"t025", amount:-109.3, description:"Woolworths Supermarket",   merchant_name:"Woolworths",      category:"groceries",    transaction_type:"debit",  transaction_date:daysAgo(52), is_subscription:false },
  { id:"t026", amount:-91.7,  description:"Coles Online",             merchant_name:"Coles",           category:"groceries",    transaction_type:"debit",  transaction_date:daysAgo(66), is_subscription:false },
  // DINING
  { id:"t030", amount:-62,    description:"The Grain Store",          merchant_name:"The Grain Store", category:"dining",       transaction_type:"debit",  transaction_date:daysAgo(4),  is_subscription:false },
  { id:"t031", amount:-34.5,  description:"Nando's Melbourne",        merchant_name:"Nandos",          category:"dining",       transaction_type:"debit",  transaction_date:daysAgo(8),  is_subscription:false },
  { id:"t032", amount:-22,    description:"Subway Swanston St",       merchant_name:"Subway",          category:"dining",       transaction_type:"debit",  transaction_date:daysAgo(13), is_subscription:false },
  { id:"t033", amount:-89.5,  description:"Icebergs Dining Room",     merchant_name:"Icebergs",        category:"dining",       transaction_type:"debit",  transaction_date:daysAgo(19), is_subscription:false },
  { id:"t034", amount:-41,    description:"Guzman y Gomez",           merchant_name:"GYG",             category:"dining",       transaction_type:"debit",  transaction_date:daysAgo(27), is_subscription:false },
  // TRANSPORT
  { id:"t040", amount:-185,   description:"Myki Monthly Top-up",      merchant_name:"PTV",             category:"transport",    transaction_type:"debit",  transaction_date:daysAgo(5),  is_subscription:true  },
  { id:"t041", amount:-185,   description:"Myki Monthly Top-up",      merchant_name:"PTV",             category:"transport",    transaction_type:"debit",  transaction_date:daysAgo(35), is_subscription:true  },
  { id:"t042", amount:-28.4,  description:"Uber Melbourne",           merchant_name:"Uber",            category:"transport",    transaction_type:"debit",  transaction_date:daysAgo(7),  is_subscription:false },
  { id:"t043", amount:-19.2,  description:"Uber Trip",                merchant_name:"Uber",            category:"transport",    transaction_type:"debit",  transaction_date:daysAgo(21), is_subscription:false },
  // SUBSCRIPTIONS
  { id:"t050", amount:-15.99, description:"Netflix Premium",          merchant_name:"Netflix",         category:"entertainment",transaction_type:"debit",  transaction_date:daysAgo(6),  is_subscription:true  },
  { id:"t051", amount:-15.99, description:"Netflix Premium",          merchant_name:"Netflix",         category:"entertainment",transaction_type:"debit",  transaction_date:daysAgo(36), is_subscription:true  },
  { id:"t052", amount:-11.99, description:"Spotify Premium",          merchant_name:"Spotify",         category:"entertainment",transaction_type:"debit",  transaction_date:daysAgo(9),  is_subscription:true  },
  { id:"t053", amount:-11.99, description:"Spotify Premium",          merchant_name:"Spotify",         category:"entertainment",transaction_type:"debit",  transaction_date:daysAgo(39), is_subscription:true  },
  { id:"t054", amount:-22.99, description:"Disney+",                  merchant_name:"Disney Plus",     category:"entertainment",transaction_type:"debit",  transaction_date:daysAgo(14), is_subscription:true  },
  { id:"t055", amount:-14.99, description:"MyAiBank Premium",        merchant_name:"MyAiBank",        category:"software",     transaction_type:"debit",  transaction_date:daysAgo(6),  is_subscription:true  },
  { id:"t056", amount:-12.99, description:"Adobe CC",                 merchant_name:"Adobe",           category:"software",     transaction_type:"debit",  transaction_date:daysAgo(20), is_subscription:true  },
  // UTILITIES
  { id:"t060", amount:-134,   description:"AGL Gas & Electricity",    merchant_name:"AGL",             category:"utilities",    transaction_type:"debit",  transaction_date:daysAgo(11), is_subscription:false },
  { id:"t061", amount:-79,    description:"Telstra Mobile Plan",      merchant_name:"Telstra",         category:"utilities",    transaction_type:"debit",  transaction_date:daysAgo(12), is_subscription:true  },
  { id:"t062", amount:-79,    description:"Telstra Mobile Plan",      merchant_name:"Telstra",         category:"utilities",    transaction_type:"debit",  transaction_date:daysAgo(42), is_subscription:true  },
  { id:"t063", amount:-59,    description:"Aussie Broadband",         merchant_name:"Aussie BB",       category:"utilities",    transaction_type:"debit",  transaction_date:daysAgo(14), is_subscription:true  },
  // HEALTH & FITNESS
  { id:"t070", amount:-72,    description:"Virgin Active Gym",        merchant_name:"Virgin Active",   category:"health",       transaction_type:"debit",  transaction_date:daysAgo(1),  is_subscription:true  },
  { id:"t071", amount:-72,    description:"Virgin Active Gym",        merchant_name:"Virgin Active",   category:"health",       transaction_type:"debit",  transaction_date:daysAgo(31), is_subscription:true  },
  { id:"t072", amount:-45,    description:"Chemist Warehouse",        merchant_name:"Chemist WH",      category:"health",       transaction_type:"debit",  transaction_date:daysAgo(18), is_subscription:false },
  // SHOPPING
  { id:"t080", amount:-189,   description:"JB Hi-Fi",                 merchant_name:"JB Hi-Fi",        category:"shopping",     transaction_type:"debit",  transaction_date:daysAgo(22), is_subscription:false },
  { id:"t081", amount:-74.95, description:"Uniqlo Melbourne",         merchant_name:"Uniqlo",          category:"shopping",     transaction_type:"debit",  transaction_date:daysAgo(34), is_subscription:false },
  { id:"t082", amount:-56.4,  description:"Amazon AU",                merchant_name:"Amazon",          category:"shopping",     transaction_type:"debit",  transaction_date:daysAgo(16), is_subscription:false },
  // SAVINGS TRANSFER
  { id:"t090", amount:-500,   description:"Transfer to Savings",      merchant_name:"CommBank",        category:"savings",      transaction_type:"debit",  transaction_date:daysAgo(1),  is_subscription:false },
  { id:"t091", amount:-500,   description:"Transfer to Savings",      merchant_name:"CommBank",        category:"savings",      transaction_type:"debit",  transaction_date:daysAgo(30), is_subscription:false },
]

// ── Subscriptions ─────────────────────────────────────────────────────────────
export const demoSubscriptions: DemoSubscription[] = [
  { id:"s1", name:"Netflix",          amount:15.99, frequency:"monthly", category:"entertainment", next_billing_date:daysAhead(24), is_active:true },
  { id:"s2", name:"Spotify",          amount:11.99, frequency:"monthly", category:"entertainment", next_billing_date:daysAhead(21), is_active:true },
  { id:"s3", name:"Disney+",          amount:22.99, frequency:"monthly", category:"entertainment", next_billing_date:daysAhead(16), is_active:true },
  { id:"s4", name:"Adobe CC",         amount:12.99, frequency:"monthly", category:"software",      next_billing_date:daysAhead(10), is_active:true },
  { id:"s5", name:"MyAiBank Premium", amount:14.99, frequency:"monthly", category:"software",      next_billing_date:daysAhead(24), is_active:true },
  { id:"s6", name:"Telstra Mobile",   amount:79,    frequency:"monthly", category:"utilities",     next_billing_date:daysAhead(18), is_active:true },
  { id:"s7", name:"Aussie Broadband", amount:59,    frequency:"monthly", category:"utilities",     next_billing_date:daysAhead(16), is_active:true },
  { id:"s8", name:"Virgin Active",    amount:72,    frequency:"monthly", category:"health",        next_billing_date:daysAhead(29), is_active:true },
  { id:"s9", name:"Myki Travel",      amount:185,   frequency:"monthly", category:"transport",     next_billing_date:daysAhead(25), is_active:true },
]

// ── AI Forecast data (used by cashflow chart in demo mode) ────────────────────
// Historical weekly buckets (past 12 weeks) + AI-projected future (26 weeks)
// income/expenses are weekly AUD totals.
export interface ForecastPoint {
  date: string        // display label e.g. "Apr 6"
  rawDate: string     // YYYY-MM-DD of the Monday that week
  income: number
  expenses: number
  isToday: boolean
  isFuture: boolean
  isAiForecast?: boolean  // true for AI-projected points
}

function weekLabel(d: Date): string {
  return d.toLocaleDateString("en-AU", { month: "short", day: "numeric" })
}
function mondayOf(d: Date): Date {
  const day = d.getDay()
  const diff = day === 0 ? -6 : 1 - day
  const m = new Date(d)
  m.setDate(m.getDate() + diff)
  return m
}
function toKey(d: Date): string {
  return d.toISOString().split("T")[0]
}

function buildDemoForecast(): ForecastPoint[] {
  const today   = new Date()
  const todayKey = toKey(today)
  const pts: ForecastPoint[] = []

  // Historical base: avg weekly income ~$1100, expenses ~$790
  const baseIncome   = 1100
  const baseExpenses = 790

  // Past 12 weeks (historical)
  for (let w = -12; w < 0; w++) {
    const d = new Date(today)
    d.setDate(d.getDate() + w * 7)
    const monday = mondayOf(d)
    // Add natural-looking variation
    const jitterI = Math.round((Math.sin(w * 1.3 + 1) * 180) + (Math.cos(w * 2.1) * 90))
    const jitterE = Math.round((Math.cos(w * 1.7) * 120) + (Math.sin(w * 0.9 + 2) * 80))
    pts.push({
      date: weekLabel(monday),
      rawDate: toKey(monday),
      income: Math.max(700, baseIncome + jitterI),
      expenses: Math.max(400, baseExpenses + jitterE),
      isToday: false,
      isFuture: false,
      isAiForecast: false,
    })
  }

  // Today
  const todayMonday = mondayOf(today)
  pts.push({
    date: weekLabel(todayMonday),
    rawDate: toKey(todayMonday),
    income: baseIncome,
    expenses: baseExpenses,
    isToday: true,
    isFuture: false,
    isAiForecast: false,
  })

  // AI forecast: next 26 weeks — income slowly rises (career growth),
  // expenses slightly up, then stabilise showing net positive trend.
  for (let w = 1; w <= 26; w++) {
    const d = new Date(today)
    d.setDate(d.getDate() + w * 7)
    const monday = mondayOf(d)

    // Gentle upward income trend + slight seasonal dip around week 6-10
    const trendIncome   = baseIncome   + w * 18
    const seasonalDip   = w >= 6 && w <= 10 ? -120 : 0
    const trendExpenses = baseExpenses + w * 6

    pts.push({
      date: weekLabel(monday),
      rawDate: toKey(monday),
      income: Math.round(trendIncome + seasonalDip),
      expenses: Math.round(trendExpenses),
      isToday: false,
      isFuture: true,
      isAiForecast: true,
    })
  }

  return pts
}

export const demoForecastData: ForecastPoint[] = buildDemoForecast()
