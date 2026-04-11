import Link from "next/link"
import { createClient } from "@supabase/supabase-js"
import { SiteFooter } from "@/components/site-footer"
import { DemoStartButton } from "@/components/demo-start-button"
import { ArrowRight, ChevronRight, Calendar } from "lucide-react"

export const revalidate = 60

// ── Supabase blog client ──────────────────────────────────────────────────────
const blogClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_BLOGS_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_BLOGS_ANON_KEY!
)

// ── Types ─────────────────────────────────────────────────────────────────────
interface SupabasePost {
  id: string
  slug: string
  title: string
  description: string | null
  published: boolean
  created_at: string
}

interface DisplayPost {
  slug: string
  title: string
  excerpt: string
  color: string
  category: string
  date: string
  featured: boolean
}

// ── Color / category palette for live posts ───────────────────────────────────
const COLORS = [
  "#8b5cf6","#22c55e","#14b8a6","#f59e0b",
  "#ec4899","#6366f1","#ef4444","#0ea5e9",
]
const CATEGORIES = [
  "AI Insights","Cash Flow","Detection","Budgeting",
  "Health Score","Goals","Debt","Alerts","Savings","Analytics",
]

// ── Static fallback (shown when Supabase is unavailable) ──────────────────────
const STATIC_POSTS: DisplayPost[] = [
  { slug:"ai-spending-insights",    category:"AI Insights",    color:"#8b5cf6", title:"How AI Analyses Your Spending Patterns",              excerpt:"Machine learning categorises every transaction and surfaces opportunities to save money automatically, without you lifting a finger.", date:"", featured:true  },
  { slug:"ai-future-balance-forecasting", category:"Cash Flow", color:"#22c55e", title:"Predicting Your Future Balance with AI",            excerpt:"See how MyAiBank uses 12 months of real transaction history to forecast your cash position 30, 60, and 90 days ahead, with confidence intervals.", date:"", featured:false },
  { slug:"subscription-detection",  category:"Detection",      color:"#14b8a6", title:"Never Miss a Subscription Charge Again",              excerpt:"Our AI automatically detects recurring payments and alerts you before they hit, so you stay in control of your financial commitments.", date:"", featured:false },
  { slug:"financial-health-score",  category:"Health Score",   color:"#f59e0b", title:"Understanding Your Financial Health Score",           excerpt:"A single number that summarises your income, expenses, savings rate, and debt position, updated every time your bank data syncs.", date:"", featured:false },
  { slug:"ai-budget-tracking",      category:"Budgeting",      color:"#ec4899", title:"AI Budget Tracking That Actually Works",              excerpt:"Forget spreadsheets. MyAiBank learns your spending patterns and builds a personalised budget that adapts to your life in real time.", date:"", featured:false },
  { slug:"ai-transaction-categorisation", category:"AI Insights", color:"#8b5cf6", title:"How Transaction Categorisation Works",            excerpt:"A deep dive into the AI engine that sorts your bank transactions into meaningful categories, and how to train it to suit your lifestyle.", date:"", featured:false },
  { slug:"save-for-house-deposit-faster-australia", category:"Goals", color:"#6366f1", title:"Save for a House Deposit Faster in Australia", excerpt:"Data-backed strategies for Australians looking to accelerate their path to homeownership, with real numbers from real bank data.", date:"", featured:false },
  { slug:"pay-off-home-loan-faster-australia", category:"Debt", color:"#ef4444", title:"Pay Off Your Home Loan Faster in Australia",         excerpt:"How offset accounts, redraw facilities, and extra repayments combine to save Australian homeowners tens of thousands in interest.", date:"", featured:false },
  { slug:"mortgage-rate-alerts",    category:"Alerts",         color:"#0ea5e9", title:"Set Up Mortgage Rate Alerts - Never Miss a Deal",     excerpt:"Automated alerts that tell you the moment your lender rate changes, so you can refinance at the right time without obsessively checking.", date:"", featured:false },
  { slug:"how-to-save-money-fast-australia", category:"Savings", color:"#22c55e", title:"How to Save Money Fast in Australia (2026 Guide)", excerpt:"Practical, no-fluff tactics for cutting spending and building savings quickly, from high-interest savings accounts to AI expense auditing.", date:"", featured:false },
]

// ── Data fetching ─────────────────────────────────────────────────────────────
async function getAllPosts(): Promise<DisplayPost[]> {
  try {
    const { data, error } = await blogClient
      .from("myaibank_posts")
      .select("id, slug, title, description, published, created_at")
      .eq("published", true)
      .order("created_at", { ascending: false })

    if (error || !data || data.length === 0) return STATIC_POSTS

    return (data as SupabasePost[]).map((post, i) => ({
      slug:     post.slug,
      title:    post.title,
      excerpt:  post.description ?? "",
      color:    COLORS[i % COLORS.length],
      category: CATEGORIES[i % CATEGORIES.length],
      date:     post.created_at
        ? new Date(post.created_at).toLocaleDateString("en-AU", {
            day: "numeric", month: "short", year: "numeric",
            timeZone: "Australia/Sydney",
          })
        : "",
      featured: i === 0,
    }))
  } catch {
    return STATIC_POSTS
  }
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default async function BlogPage() {
  const posts   = await getAllPosts()
  const featured = posts.find(p => p.featured)!
  const rest     = posts.filter(p => !p.featured)

  return (
    <main className="min-h-screen flex flex-col" >

            <section className="relative px-4 sm:px-6 lg:px-10 pt-12 sm:pt-20 pb-8 sm:pb-14 text-center overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] rounded-full pointer-events-none"
          style={{background:"radial-gradient(ellipse,rgba(139,92,246,0.13),transparent 70%)"}} />
        <div className="relative max-w-3xl mx-auto">
          <p className="text-xs sm:text-sm font-semibold uppercase tracking-widest mb-2 sm:mb-3" style={{color:"#8b5cf6"}}>MyAiBank Blog</p>
          <h1 className="font-bold text-white mb-3 sm:mb-4" style={{fontSize:"clamp(1.8rem,5vw,3rem)"}}>
            Financial insights, powered by AI
          </h1>
          <p className="text-sm sm:text-base max-w-xl mx-auto" style={{color:"rgba(255,255,255,0.55)"}}>
            Practical guides, smart strategies, and deep dives into how AI is reshaping personal finance in Australia.
          </p>
        </div>
      </section>

      <section className="flex-1 px-4 sm:px-6 lg:px-10 xl:px-16 pb-16 sm:pb-24">
        <div className="w-full max-w-[1600px] mx-auto">
          <Link href={`/blog/${featured.slug}`} className="block mb-5 sm:mb-6 group">
            <div className="relative overflow-hidden rounded-3xl p-6 sm:p-10 lg:p-14 transition-all duration-300 hover:scale-[1.005]"
              style={{background:"rgba(139,92,246,0.1)",border:"1px solid rgba(139,92,246,0.25)"}}>
              <div className="absolute top-0 right-0 w-64 h-64 sm:w-[500px] sm:h-[500px] rounded-full pointer-events-none"
                style={{background:"radial-gradient(circle,rgba(139,92,246,0.18),transparent 65%)",transform:"translate(35%,-35%)"}} />
              <div className="relative">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4 sm:mb-5">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold"
                    style={{background:`${featured.color}22`,color:featured.color,border:`1px solid ${featured.color}44`}}>{featured.category}</span>
                  {featured.date && (
                    <span className="inline-flex items-center gap-1.5 text-xs" style={{color:"rgba(255,255,255,0.4)"}}><Calendar className="w-3 h-3"/>{featured.date}</span>
                  )}
                  <span className="ml-auto px-2.5 py-0.5 rounded-full text-xs font-semibold" style={{background:"rgba(139,92,246,0.3)",color:"#c4b5fd"}}>Latest</span>
                </div>
                <h2 className="font-bold text-white mb-3 sm:mb-4" style={{fontSize:"clamp(1.3rem,3.5vw,2.25rem)"}}>{featured.title}</h2>
                <p className="text-sm sm:text-base leading-relaxed mb-5 sm:mb-7 max-w-3xl" style={{color:"rgba(255,255,255,0.6)"}}>{featured.excerpt}</p>
                <span className="inline-flex items-center gap-2 text-sm font-semibold group-hover:gap-3 transition-all" style={{color:featured.color}}>
                  Read article <ArrowRight className="w-4 h-4"/>
                </span>
              </div>
            </div>
          </Link>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-5">
            {rest.map(post => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="group block">
                <article className="h-full flex flex-col p-5 sm:p-6 rounded-3xl transition-all duration-300 hover:scale-[1.02]"
                  style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)"}}>
                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold"
                      style={{background:`${post.color}18`,color:post.color}}>{post.category}</span>
                    {post.date && (
                      <span className="inline-flex items-center gap-1 text-xs" style={{color:"rgba(255,255,255,0.35)"}}><Calendar className="w-3 h-3"/>{post.date}</span>
                    )}
                  </div>
                  <h2 className="font-bold text-white mb-2 leading-snug flex-1 text-sm sm:text-base">{post.title}</h2>
                  <p className="text-xs sm:text-sm leading-relaxed mb-4 sm:mb-5" style={{color:"rgba(255,255,255,0.5)"}}>{post.excerpt}</p>
                  <div className="flex items-center justify-between mt-auto pt-4" style={{borderTop:"1px solid rgba(255,255,255,0.07)"}}>
                    <span className="text-xs" style={{color:"rgba(255,255,255,0.4)"}}>Read more</span>
                    <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" style={{color:post.color}}/>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-10 py-14 sm:py-20" style={{borderTop:"1px solid rgba(255,255,255,0.07)"}}>
        <div className="max-w-3xl mx-auto text-center">
          <h3 className="font-bold text-white mb-4" style={{fontSize:"clamp(1.4rem,4vw,2.25rem)"}}>Ready to understand your finances?</h3>
          <p className="text-sm sm:text-base mb-7" style={{color:"rgba(255,255,255,0.5)"}}>
            Connect your bank accounts and let AI do the heavy lifting, free to try, no credit card needed.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <DemoStartButton className="w-full sm:w-auto h-12 px-6 sm:px-8 rounded-2xl text-sm sm:text-base font-semibold flex items-center justify-center gap-2 transition-all hover:scale-105 cursor-pointer"
              style={{background:"linear-gradient(135deg,#8b5cf6,#6d28d9)",color:"#fff",boxShadow:"0 4px 24px rgba(139,92,246,0.3)"}}>
              Try the Demo <ArrowRight className="w-4 h-4"/>
            </DemoStartButton>
            <Link href="/signup" className="w-full sm:w-auto h-12 px-6 sm:px-8 rounded-2xl text-sm sm:text-base font-semibold flex items-center justify-center gap-2"
              style={{background:"rgba(139,92,246,0.15)",border:"1px solid rgba(139,92,246,0.35)",color:"#fff"}}>
              Create Free Account
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter variant="dark"/>
    </main>
  )
}
