import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { SiteFooter } from "@/components/site-footer"
import { DemoStartButton } from "@/components/demo-start-button"
import { Brain, TrendingUp, PieChart, Bell, Shield, Star, CreditCard, ArrowRight, Home } from "lucide-react"

export const metadata: Metadata = {
  title: "Features | MyAiBank — AI-Powered Money Management",
  description: "Explore all MyAiBank features: AI budgeting, cashflow forecasting, subscription detection, spending analytics, transaction categorisation, and more.",
  alternates: { canonical: "/features" },
}

const FEATURES = [
  { icon:Brain,     color:"#8b5cf6", title:"AI-Powered Budgeting",        desc:"Automatically categorise every transaction, highlight spending patterns, and build monthly summaries. Identify where you overspend and set targets.", slug:"ai-budget-tracking" },
  { icon:TrendingUp,color:"#22c55e", title:"Cashflow Forecasting",         desc:"Predict your account balance weeks ahead using your transaction history, subscriptions, and spending patterns. Act before problems happen.", slug:"ai-future-balance-forecasting" },
  { icon:PieChart,  color:"#14b8a6", title:"Spending Analytics Dashboard", desc:"See your income, expenses, and net cash flow at a glance. Break down spending by category and track trends over time.", slug:"ai-spending-insights" },
  { icon:Bell,      color:"#f59e0b", title:"Subscription & Bill Detection", desc:"Automatically find recurring charges, subscriptions, and bills. See what each costs over time so you can cancel unused services.", slug:"subscription-detection" },
  { icon:Brain,     color:"#ec4899", title:"AI Financial Assistant",        desc:"Ask anything about your money — \"What did I spend on food?\" or \"Show my biggest merchants.\" Real answers from your actual transactions.", slug:"ai-transaction-categorisation" },
  { icon:Star,      color:"#6366f1", title:"Financial Health Score",        desc:"Understand your overall financial wellbeing with an AI-generated health score. Track income, spending, and savings rate over time.", slug:"financial-health-score" },
  { icon:Home,      color:"#0ea5e9", title:"Mortgage Rate Alerts",          desc:"Stay informed about interest rate changes that could affect your home loan. Get personalised alerts when refinancing opportunities arise.", slug:"mortgage-rate-alerts" },
  { icon:Shield,    color:"#a78bfa", title:"Bank-Grade Security",           desc:"Your financial data is protected with encryption at rest and in transit. We never store your banking credentials. Read-only access via CDR.", slug:null },
  { icon:CreditCard,color:"#22c55e", title:"Multi-Account Aggregation",    desc:"Link all your Australian bank accounts in one place. See your total net worth, across every institution, updated in real time.", slug:null },
]

export default function FeaturesPage() {
  return (
    <main className="min-h-screen flex flex-col" style={{ backgroundColor:"#050508", color:"#fff" }}>
      <header style={{ borderBottom:"1px solid rgba(255,255,255,0.07)", backgroundColor:"rgba(5,5,8,0.95)", backdropFilter:"blur(12px)", position:"sticky", top:0, zIndex:50 }}>
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 py-3 sm:py-4 flex items-center justify-between">
          <Link href="/"><Image src="/MABtransparent.png" alt="MyAiBank" width={80} height={32} className="object-contain w-16 h-auto sm:w-20" /></Link>
          <nav className="hidden sm:flex items-center gap-5 lg:gap-8">
            {[["Pricing","/pricing"],["Blog","/blog"],["Security","/security"]].map(([l,h])=>(
              <Link key={h} href={h} className="text-sm hover:text-white transition-colors" style={{color:"rgba(255,255,255,0.55)"}}>{l}</Link>
            ))}
          </nav>
          <Link href="/signup" className="h-9 px-4 rounded-full text-xs sm:text-sm font-semibold hover:scale-105 transition-all" style={{background:"linear-gradient(135deg,#8b5cf6,#6d28d9)",color:"#fff"}}>Get Started</Link>
        </div>
      </header>

      <section className="relative px-4 sm:px-6 lg:px-10 pt-16 sm:pt-24 pb-10 sm:pb-16 text-center overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full pointer-events-none"
          style={{background:"radial-gradient(ellipse,rgba(34,197,94,0.12),transparent 70%)"}} />
        <div className="relative max-w-3xl mx-auto">
          <p className="text-xs sm:text-sm font-semibold uppercase tracking-widest mb-3" style={{color:"#22c55e"}}>Platform Features</p>
          <h1 className="font-bold text-white mb-4" style={{fontSize:"clamp(2rem,5vw,3.5rem)"}}>Everything you need to understand your money</h1>
          <p className="text-sm sm:text-lg max-w-2xl mx-auto" style={{color:"rgba(255,255,255,0.55)"}}>
            Nine powerful features powered by AI, open banking, and real transaction data — all in one platform.
          </p>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-10 xl:px-16 pb-16 sm:pb-24">
        <div className="w-full max-w-[1600px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
          {FEATURES.map(({ icon:Icon, color, title, desc, slug }) => (
            <div key={title} className="group p-6 sm:p-8 rounded-3xl flex flex-col transition-all duration-300 hover:scale-[1.02]"
              style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)"}}>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5" style={{background:`${color}20`}}>
                <Icon className="w-6 h-6" style={{color}}/>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white mb-2">{title}</h3>
              <p className="text-xs sm:text-sm leading-relaxed flex-1" style={{color:"rgba(255,255,255,0.55)"}}>{desc}</p>
              {slug && (
                <Link href={`/blog/${slug}`} className="inline-flex items-center gap-1.5 text-xs font-semibold mt-5 hover:gap-2.5 transition-all" style={{color}}>
                  Learn more <ArrowRight className="w-3.5 h-3.5"/>
                </Link>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-10 py-14 sm:py-20" style={{borderTop:"1px solid rgba(255,255,255,0.07)"}}>
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-bold text-white mb-4" style={{fontSize:"clamp(1.5rem,4vw,2.5rem)"}}>Ready to get started?</h2>
          <p className="text-sm sm:text-base mb-8" style={{color:"rgba(255,255,255,0.5)"}}>Try the demo instantly — no signup required. Or create your free account and connect your real bank.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <DemoStartButton className="w-full sm:w-auto h-12 px-6 sm:px-8 rounded-2xl text-sm sm:text-base font-semibold flex items-center justify-center gap-2 hover:scale-105 transition-all"
              style={{background:"linear-gradient(135deg,#8b5cf6,#6d28d9)",color:"#fff",boxShadow:"0 4px 24px rgba(139,92,246,0.3)"}}>
              Try Demo <ArrowRight className="w-4 h-4"/>
            </DemoStartButton>
            <Link href="/signup" className="w-full sm:w-auto h-12 px-6 sm:px-8 rounded-2xl text-sm sm:text-base font-semibold flex items-center justify-center"
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
