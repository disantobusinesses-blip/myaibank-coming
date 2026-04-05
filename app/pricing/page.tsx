import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { SiteFooter } from "@/components/site-footer"
import { CheckCircle, ArrowRight, Sparkles } from "lucide-react"

export const metadata: Metadata = {
  title: "Pricing | MyAiBank — Free AI Money Management",
  description: "MyAiBank is free for early adopters. Sign up today and get full access to AI budgeting, cashflow forecasting, subscription detection, and more.",
  alternates: { canonical: "/pricing" },
}

const FREE_FEATURES = [
  "AI-powered transaction categorisation",
  "Cash flow dashboard and spending analytics",
  "Subscription and bill detection",
  "AI financial assistant — ask anything",
  "Cashflow forecasting (30/60/90 day)",
  "Financial health score",
  "Mortgage rate alerts",
  "Bank-grade encryption and security",
  "Connect your Australian bank accounts",
]

const FAQ = [
  { q:"Is MyAiBank really free?",         a:"Yes. MyAiBank is free for the first 500 early adopters in Australia. We are growing our user base before introducing paid plans." },
  { q:"Will pricing change in future?",   a:"We plan to introduce a paid plan for new users once we scale. Early adopters will receive preferential pricing and grandfathered rates." },
  { q:"Do I need a credit card to sign up?", a:"No. Sign up with your email or Google account — no payment details required during the early adopter period." },
  { q:"What features are included?",      a:"All features listed above are included in the free plan. Our premium tier ($14.99/mo) unlocks real bank connections and live AI insights." },
]

export default function PricingPage() {
  return (
    <main className="min-h-screen flex flex-col" style={{ backgroundColor:"#050508", color:"#fff" }}>
      <header style={{ borderBottom:"1px solid rgba(255,255,255,0.07)", backgroundColor:"rgba(5,5,8,0.95)", backdropFilter:"blur(12px)", position:"sticky", top:0, zIndex:50 }}>
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 py-3 sm:py-4 flex items-center justify-between">
          <Link href="/"><Image src="/MABtransparent.png" alt="MyAiBank" width={80} height={32} className="object-contain w-16 h-auto sm:w-20" /></Link>
          <nav className="hidden sm:flex items-center gap-5 lg:gap-8">
            {[["Features","/features"],["Blog","/blog"],["Security","/security"]].map(([l,h])=>(
              <Link key={h} href={h} className="text-sm hover:text-white transition-colors" style={{color:"rgba(255,255,255,0.55)"}}>{l}</Link>
            ))}
          </nav>
          <Link href="/signup" className="h-9 px-4 rounded-full text-xs sm:text-sm font-semibold hover:scale-105 transition-all" style={{background:"linear-gradient(135deg,#8b5cf6,#6d28d9)",color:"#fff"}}>Get Started</Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative px-4 sm:px-6 lg:px-10 pt-16 sm:pt-24 pb-10 sm:pb-16 text-center overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full pointer-events-none"
          style={{background:"radial-gradient(ellipse,rgba(139,92,246,0.15),transparent 70%)"}} />
        <div className="relative max-w-3xl mx-auto">
          <p className="text-xs sm:text-sm font-semibold uppercase tracking-widest mb-3" style={{color:"#8b5cf6"}}>Pricing</p>
          <h1 className="font-bold text-white mb-4" style={{fontSize:"clamp(2rem,5vw,3.5rem)"}}>Simple, honest pricing.</h1>
          <p className="text-sm sm:text-lg max-w-2xl mx-auto" style={{color:"rgba(255,255,255,0.55)"}}>
            Free for early adopters. Premium at $14.99/month when you&#39;re ready to connect real accounts.
          </p>
        </div>
      </section>

      {/* Plans */}
      <section className="px-4 sm:px-6 lg:px-10 pb-16 sm:pb-24">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">

          {/* Free / Demo plan */}
          <div className="p-6 sm:p-8 rounded-3xl flex flex-col" style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.1)"}}>
            <p className="text-xs uppercase tracking-widest mb-3 font-semibold" style={{color:"rgba(255,255,255,0.4)"}}>Demo</p>
            <div className="text-4xl sm:text-5xl font-bold text-white mb-2">Free</div>
            <p className="text-sm mb-6" style={{color:"rgba(255,255,255,0.5)"}}>No signup required</p>
            {["Full AI dashboard preview","Sample transaction data","All features unlocked","No time limit"].map(f=>(
              <div key={f} className="flex items-center gap-3 mb-3">
                <CheckCircle className="w-4 h-4 flex-shrink-0" style={{color:"#22c55e"}}/>
                <span className="text-sm" style={{color:"rgba(255,255,255,0.7)"}}>{f}</span>
              </div>
            ))}
            <div className="mt-auto pt-6">
              <Link href="/app/dashboard" className="block w-full text-center h-12 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 transition-all hover:scale-105"
                style={{background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.15)",color:"#fff"}}>
                Try Demo Now
              </Link>
            </div>
          </div>

          {/* Premium plan */}
          <div className="p-6 sm:p-8 rounded-3xl flex flex-col relative overflow-hidden"
            style={{background:"linear-gradient(135deg,rgba(139,92,246,0.18),rgba(109,40,217,0.08))",border:"1px solid rgba(139,92,246,0.4)"}}>
            <div className="absolute top-5 right-5 px-3 py-1 rounded-full text-xs font-bold" style={{background:"#8b5cf6",color:"#fff"}}>
              <Sparkles className="w-3 h-3 inline mr-1"/>Early Adopter
            </div>
            <p className="text-xs uppercase tracking-widest mb-3 font-semibold" style={{color:"rgba(255,255,255,0.4)"}}>Premium</p>
            <div className="text-4xl sm:text-5xl font-bold text-white mb-1">$14.99</div>
            <p className="text-sm mb-6" style={{color:"rgba(255,255,255,0.5)"}}>per month · AUD · cancel anytime</p>
            {FREE_FEATURES.map(f=>(
              <div key={f} className="flex items-center gap-3 mb-3">
                <CheckCircle className="w-4 h-4 flex-shrink-0" style={{color:"#22c55e"}}/>
                <span className="text-sm" style={{color:"rgba(255,255,255,0.8)"}}>{f}</span>
              </div>
            ))}
            <div className="mt-auto pt-6">
              <Link href="/signup" className="block w-full text-center h-12 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 transition-all hover:scale-105"
                style={{background:"linear-gradient(135deg,#8b5cf6,#6d28d9)",color:"#fff",boxShadow:"0 4px 24px rgba(139,92,246,0.3)"}}>
                Get Started Free <ArrowRight className="w-4 h-4"/>
              </Link>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto mt-16 sm:mt-20">
          <h2 className="font-bold text-white mb-8 text-center" style={{fontSize:"clamp(1.5rem,4vw,2rem)"}}>Pricing FAQ</h2>
          <div className="space-y-4">
            {FAQ.map(({q,a})=>(
              <div key={q} className="p-5 sm:p-6 rounded-2xl" style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)"}}>
                <h3 className="font-semibold text-white mb-2 text-sm sm:text-base">{q}</h3>
                <p className="text-sm leading-relaxed" style={{color:"rgba(255,255,255,0.55)"}}>{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter variant="dark"/>
    </main>
  )
}
