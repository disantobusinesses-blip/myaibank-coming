/**
 * Transaction categorisation pipeline.
 *
 * Provides merchant name normalisation, rule-based category assignment,
 * and confidence scoring.  Designed to be the single source of truth for
 * spending analysis, forecasting, and AI insights.
 *
 * User overrides are stored in-memory (per session) but the interface is
 * ready for persistence via Supabase when the `user_category_overrides`
 * table is available.
 */

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface CategorisedResult {
  /** Cleaned / normalised merchant name */
  merchant: string
  /** Assigned category (lowercase) */
  category: string
  /** Confidence 0–1; 1 = exact match in rule set, <1 = heuristic */
  confidence: number
}

/* ------------------------------------------------------------------ */
/*  Merchant normalisation                                             */
/* ------------------------------------------------------------------ */

/**
 * Clean common merchant name artefacts that arrive from bank feeds:
 * - trailing transaction IDs
 * - location suffixes ("SYDNEY AU", "MELBOURNE VIC")
 * - "VISA DEBIT" / "EFTPOS" prefixes
 * - excessive whitespace
 */
export function normaliseMerchantName(raw: string | null | undefined): string {
  if (!raw) return "Unknown"

  let name = raw.trim()

  // Strip common payment method prefixes
  name = name.replace(/^(SQ \*|VISA DEBIT |EFTPOS |PAYPAL \*|STRIPE )/i, "")

  // Strip trailing reference numbers (8+ digit sequences)
  name = name.replace(/\s+\d{8,}$/g, "")

  // Strip trailing location codes like "SYDNEY AU", "MELBOURNE VIC 3000"
  name = name.replace(
    /\s+(AU|NZ|US|UK|GB)\s*$/i,
    ""
  )
  name = name.replace(
    /\s+[A-Z]{2,3}\s+\d{4}\s*$/,
    ""
  )

  // Collapse whitespace
  name = name.replace(/\s{2,}/g, " ").trim()

  return name || "Unknown"
}

/* ------------------------------------------------------------------ */
/*  Rule-based categorisation                                          */
/* ------------------------------------------------------------------ */

/**
 * Map of keyword patterns → category.
 * Patterns are matched case-insensitively against the normalised merchant
 * name *and* the transaction description.
 */
const CATEGORY_RULES: Array<{ pattern: RegExp; category: string }> = [
  // Housing
  { pattern: /rent|lease|real estate|property|ray white|harcourts|lj hooker|domain/i, category: "housing" },
  { pattern: /mortgage|home loan/i, category: "housing" },

  // Utilities
  { pattern: /electric|energy|agl|origin energy|ergon|power/i, category: "utilities" },
  { pattern: /water\s*(corp|supply|util)/i, category: "utilities" },
  { pattern: /gas\s*(bill|account)/i, category: "utilities" },
  { pattern: /telstra|optus|vodafone|tpg|internode|iinet|nbn|mobile plan|internet/i, category: "utilities" },

  // Groceries
  { pattern: /woolworths|coles|aldi|iga|costco|harris farm|foodworks|drakes/i, category: "groceries" },
  { pattern: /hellofresh|marley spoon|dinnerly/i, category: "groceries" },

  // Dining
  { pattern: /uber\s*eats|doordash|deliveroo|menulog/i, category: "dining" },
  { pattern: /mcdonald|hungry jack|kfc|subway|grill.?d|nando|oporto|domino|pizza/i, category: "dining" },
  { pattern: /cafe|coffee|restaurant|bistro|sushi|ramen|thai|chinese|indian|mexican/i, category: "dining" },

  // Transport
  { pattern: /uber(?!\s*eats)|lyft|didi|ola|taxi|cab charge/i, category: "transport" },
  { pattern: /opal|myki|go\s*card|translink|metro|train|bus|ferry/i, category: "transport" },
  { pattern: /fuel|petrol|shell|caltex|bp\s|ampol|7.?eleven/i, category: "transport" },
  { pattern: /parking|secure parking|wilson parking/i, category: "transport" },

  // Subscriptions / Entertainment
  { pattern: /netflix|stan|disney|binge|paramount|prime video|youtube premium/i, category: "subscriptions" },
  { pattern: /spotify|apple\s*music|tidal|audible/i, category: "subscriptions" },
  { pattern: /adobe|canva|microsoft 365|dropbox|google one|icloud/i, category: "subscriptions" },

  // Health
  { pattern: /medibank|bupa|nib|hbf|ahm|health insurance/i, category: "insurance" },
  { pattern: /pharmacy|chemist|priceline|terry white/i, category: "health" },
  { pattern: /gym|fitness|anytime fitness|f45|virgin active|yoga|pilates/i, category: "health" },
  { pattern: /doctor|dentist|optometrist|medical|clinic|hospital|pathology/i, category: "health" },

  // Insurance
  { pattern: /nrma|racv|racq|insurance|allianz|qbe|suncorp/i, category: "insurance" },

  // Shopping
  { pattern: /kmart|target|big\s*w|myer|david jones|jb\s*hi.?fi|officeworks|ikea|bunnings/i, category: "shopping" },
  { pattern: /amazon|ebay|catch\.com|the iconic/i, category: "shopping" },
  { pattern: /cotton on|uniqlo|zara|h&m|country road/i, category: "shopping" },

  // Travel
  { pattern: /qantas|virgin australia|jetstar|rex airlines|flight|airline/i, category: "travel" },
  { pattern: /booking\.com|airbnb|expedia|hotels?\.com|trivago/i, category: "travel" },

  // Income
  { pattern: /salary|payroll|wages|pay\s*run|employer/i, category: "income" },
  { pattern: /interest\s*(payment|earned|credited)/i, category: "income" },
  { pattern: /dividend|refund|rebate|cashback|tax\s*return/i, category: "income" },
  { pattern: /upwork|fiverr|freelance|contractor/i, category: "income" },

  // Transfer
  { pattern: /transfer|internal|savings|between accounts/i, category: "transfer" },

  // Charity
  { pattern: /charity|donation|red cross|unicef|salvation army/i, category: "charity" },

  // Pets
  { pattern: /petbarn|pet\s*stock|vet|veterinar/i, category: "pets" },

  // Education
  { pattern: /university|tafe|school|tuition|textbook|udemy|coursera/i, category: "education" },
]

/**
 * Categorise a transaction based on its merchant name and description.
 *
 * The function first checks if the user has an override for this merchant,
 * then falls back to rule-based matching, and finally returns "uncategorized".
 */
export function categoriseTransaction(
  merchantName: string | null | undefined,
  description: string | null | undefined,
  existingCategory: string | null | undefined,
  userOverrides?: Map<string, string>
): CategorisedResult {
  const merchant = normaliseMerchantName(merchantName)

  // 1. User override — highest confidence
  if (userOverrides) {
    const override = userOverrides.get(merchant.toLowerCase())
    if (override) {
      return { merchant, category: override, confidence: 1.0 }
    }
  }

  // 2. If an existing category was already assigned and looks valid, trust it
  if (existingCategory && existingCategory !== "uncategorized" && existingCategory.length > 1) {
    return { merchant, category: existingCategory.toLowerCase(), confidence: 0.9 }
  }

  // 3. Rule-based matching against merchant + description
  const searchText = `${merchant} ${description ?? ""}`
  for (const rule of CATEGORY_RULES) {
    if (rule.pattern.test(searchText)) {
      return { merchant, category: rule.category, confidence: 0.85 }
    }
  }

  // 4. Fallback
  return { merchant, category: "uncategorized", confidence: 0.1 }
}

/**
 * Batch-categorise an array of transactions and return an enriched copy.
 * Does NOT mutate the input array.
 */
export function categoriseTransactions(
  transactions: Array<{
    merchant_name: string | null
    description: string | null
    category: string | null
    [key: string]: unknown
  }>,
  userOverrides?: Map<string, string>
): Array<typeof transactions[number] & { _categorised: CategorisedResult }> {
  return transactions.map((t) => {
    const result = categoriseTransaction(
      t.merchant_name,
      t.description,
      t.category,
      userOverrides
    )
    return { ...t, _categorised: result }
  })
}
