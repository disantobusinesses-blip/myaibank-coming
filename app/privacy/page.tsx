import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { SiteFooter } from "@/components/site-footer"
export const metadata: Metadata = { title: "Privacy Policy | MyAiBank", description: "MyAiBank privacy policy.", alternates: { canonical: "/privacy" } }
export default function PrivacyPage() {
  return (
    <main className="min-h-screen flex flex-col" style={{ backgroundColor:"#050508", color:"#fff" }}>
      <header style={{ borderBottom:"1px solid rgba(255,255,255,0.07)", backgroundColor:"rgba(5,5,8,0.95)", position:"sticky", top:0, zIndex:50 }}>
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 py-3 sm:py-4 flex items-center justify-between">
          <Link href="/"><Image src="/MABtransparent.png" alt="MyAiBank" width={80} height={32} className="object-contain w-16 h-auto sm:w-20" /></Link>
          <Link href="/" className="text-xs sm:text-sm hover:text-white transition-colors" style={{color:"rgba(255,255,255,0.55)"}}>Back to Home</Link>
        </div>
      </header>
      <article className="flex-1 px-4 sm:px-6 lg:px-10 py-12 sm:py-20 max-w-4xl mx-auto w-full">
        <h1 className="font-bold text-white mb-2" style={{fontSize:"clamp(1.75rem,4vw,2.5rem)"}}>Privacy Policy</h1>
        <p className="text-sm mb-10" style={{color:"rgba(255,255,255,0.45)"}}>Last updated: January 2026</p>
        {[
          {h:"1. Information We Collect",p:"We collect information you provide when creating an account (name, email), financial data accessed via CDR open banking with your explicit consent, and usage data to improve our service."},
          {h:"2. How We Use Your Information",p:"We use your data to provide AI-powered financial insights, send service-related communications, and comply with legal obligations. We do not sell your personal data to third parties."},
          {h:"3. Open Banking & CDR",p:"MyAiBank is an accredited CDR data recipient. You control what data we access and can revoke consent at any time through your bank or within MyAiBank settings."},
          {h:"4. Data Security",p:"Your data is encrypted in transit (TLS 1.3) and at rest (AES-256). We never store your banking credentials. Access to your financial data is read-only."},
          {h:"5. Your Rights",p:"You have the right to access, correct, or delete your personal data. To exercise these rights, contact us at privacy@myaibank.ai."},
        ].map(({h,p})=>(
          <section key={h} className="mb-8"><h2 className="font-bold text-white mb-3 text-base sm:text-lg">{h}</h2><p className="text-sm sm:text-base leading-relaxed" style={{color:"rgba(255,255,255,0.6)"}}>{p}</p></section>
        ))}
      </article>
      <SiteFooter variant="dark"/>
    </main>
  )
}