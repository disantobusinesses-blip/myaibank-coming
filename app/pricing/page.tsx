import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { SiteFooter } from "@/components/site-footer"
import { CheckCircle, ArrowRight, Sparkles } from "lucide-react"

export const metadata: Metadata = {
  title: "Pricing | MyAiBank — MyAiWallet Card",
  description: "Join the MyAiWallet waitlist for free or upgrade to MyAiBank Premium for $14.99 AUD/month — Visa card, AI assistant, PayID transfers, and smart savings.",
  alternates: { canonical: "/pricing" },
}

const PREMIUM_FEATURES = [
  "Visa debit card (virtual + physical)",
  "AI financial assistant",
  "PayID transfers — send money instantly",
  "Smart savings — AI-powered auto-savings",
  "Cash flow forecasting",
  "Investment strategies",
  "Bank-grade encryption and security",
]

const FAQ = [
  { q: "Is the waitlist really free?",       a: "Yes. Joining the waitlist is completely free and reserves your early access to the MyAiWallet card when it launches in Australia." },
  { q: "What is MyAiBank Premium?",          a: "MyAiBank Premium gives you access to the MyAiWallet Visa card, AI financial assistant, PayID transfers, smart savings automation, and more — all for $14.99 AUD/month." },
  { q: "Do I need a credit card to join?",   a: "No. Join the waitlist with just your email. No payment details required until you activate your Premium account." },
  { q: "When does it launch?",               a: "We are targeting an Australian launch in 2026. Waitlist members will be the first to get access." },
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
          <Link href="/signup" className="h-9 px-4 rounded-full text-xs sm:text-sm font-semibold hover:scale-105 transition-all" style={{background:"linear-gradient(135deg,#3b82f6,#1d4ed8)",color:"#fff"}}>Get Started</Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative px-4 sm:px-6 lg:px-10 pt-16 sm:pt-24 pb-10 sm:pb-16 text-center overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full pointer-events-none"
          style={{background:"radial-gradient(ellipse,rgba(59,130,246,0.12),transparent 70%)"}} />
        <div className="relative max-w-3xl mx-auto">
          <p className="text-xs sm:text-sm font-semibold uppercase tracking-widest mb-3" style={{color:"#3b82f6"}}>Pricing</p>
          <h1 className="font-bold text-white mb-4" style={{fontSize:"clamp(2rem,5vw,3.5rem)"}}>Simple, honest pricing.</h1>
          <p className="text-sm sm:text-lg max-w-2xl mx-auto" style={{color:"rgba(255,255,255,0.55)"}}>
            Join the waitlist for free, or unlock everything with MyAiBank Premium at $14.99 AUD/month.
          </p>
        </div>
      </section>

      {/* Plans */}
      <section className="px-4 sm:px-6 lg:px-10 pb-16 sm:pb-24">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">

          {/* Waitlist plan */}
          <div className="p-6 sm:p-8 rounded-3xl flex flex-col" style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.1)"}}>
            <p className="text-xs uppercase tracking-widest mb-3 font-semibold" style={{color:"rgba(255,255,255,0.4)"}}>Waitlist</p>
            <div className="text-4xl sm:text-5xl font-bold text-white mb-2">Free</div>
            <p className="text-sm mb-6" style={{color:"rgba(255,255,255,0.5)"}}>Join now, get early access to the MyAiWallet card</p>
            {["Priority access to the MyAiWallet card","Early adopter benefits","Launch notifications"].map(f=>(
              <div key={f} className="flex items-center gap-3 mb-3">
                <CheckCircle className="w-4 h-4 flex-shrink-0" style={{color:"#22c55e"}}/>
                <span className="text-sm" style={{color:"rgba(255,255,255,0.7)"}}>{f}</span>
              </div>
            ))}
            <div className="mt-auto pt-6">
              <Link href="/#waitlist" className="block w-full text-center h-12 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 transition-all hover:scale-105"
                style={{background:"rgba(59,130,246,0.15)",border:"1px solid rgba(59,130,246,0.35)",color:"#93c5fd"}}>
                Join the Waitlist
              </Link>
            </div>
          </div>

          {/* Premium plan */}
          <div className="p-6 sm:p-8 rounded-3xl flex flex-col relative overflow-hidden"
            style={{background:"linear-gradient(135deg,rgba(59,130,246,0.18),rgba(29,78,216,0.08))",border:"1px solid rgba(59,130,246,0.4)"}}>
            <div className="absolute top-5 right-5 px-3 py-1 rounded-full text-xs font-bold" style={{background:"#3b82f6",color:"#fff"}}>
              <Sparkles className="w-3 h-3 inline mr-1"/>Early Adopter
            </div>
            <p className="text-xs uppercase tracking-widest mb-3 font-semibold" style={{color:"rgba(255,255,255,0.4)"}}>MyAiBank Premium</p>
            <div className="text-4xl sm:text-5xl font-bold text-white mb-1">$14.99</div>
            <p className="text-sm mb-6" style={{color:"rgba(255,255,255,0.5)"}}>per month · AUD · cancel anytime</p>
            {PREMIUM_FEATURES.map(f=>(
              <div key={f} className="flex items-center gap-3 mb-3">
                <CheckCircle className="w-4 h-4 flex-shrink-0" style={{color:"#22c55e"}}/>
                <span className="text-sm" style={{color:"rgba(255,255,255,0.8)"}}>{f}</span>
              </div>
            ))}
            <div className="mt-auto pt-6">
              <Link href="/signup" className="block w-full text-center h-12 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 transition-all hover:scale-105"
                style={{background:"linear-gradient(135deg,#3b82f6,#1d4ed8)",color:"#fff",boxShadow:"0 4px 24px rgba(59,130,246,0.3)"}}>
                Get Started <ArrowRight className="w-4 h-4"/>
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
