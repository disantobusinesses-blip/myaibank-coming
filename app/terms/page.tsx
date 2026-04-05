import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { SiteFooter } from "@/components/site-footer"
export const metadata: Metadata = { title: "Terms of Service | MyAiBank", description: "MyAiBank terms of service.", alternates: { canonical: "/terms" } }
export default function TermsPage() {
  return (
    <main className="min-h-screen flex flex-col" style={{ backgroundColor:"#050508", color:"#fff" }}>
      <header style={{ borderBottom:"1px solid rgba(255,255,255,0.07)", backgroundColor:"rgba(5,5,8,0.95)", position:"sticky", top:0, zIndex:50 }}>
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 py-3 sm:py-4 flex items-center justify-between">
          <Link href="/"><Image src="/MABtransparent.png" alt="MyAiBank" width={80} height={32} className="object-contain w-16 h-auto sm:w-20" /></Link>
          <Link href="/" className="text-xs sm:text-sm hover:text-white transition-colors" style={{color:"rgba(255,255,255,0.55)"}}>Back to Home</Link>
        </div>
      </header>
      <article className="flex-1 px-4 sm:px-6 lg:px-10 py-12 sm:py-20 max-w-4xl mx-auto w-full">
        <h1 className="font-bold text-white mb-2" style={{fontSize:"clamp(1.75rem,4vw,2.5rem)"}}>Terms of Service</h1>
        <p className="text-sm mb-10" style={{color:"rgba(255,255,255,0.45)"}}>Last updated: January 2026</p>
        {[
          {h:"1. Acceptance",p:"By accessing or using MyAiBank, you agree to be bound by these Terms. If you do not agree, do not use the service."},
          {h:"2. Use of Service",p:"MyAiBank is a financial insights platform for personal use by Australian residents. You must be 18 or older. Do not misuse the service or use it for unlawful purposes."},
          {h:"3. Not Financial Advice",p:"Nothing on the platform constitutes financial advice. Always consult a licensed financial adviser before making financial decisions."},
          {h:"4. Open Banking & CDR",p:"By connecting your bank accounts, you authorise MyAiBank to access your financial data as an accredited CDR data recipient. You may revoke consent at any time."},
          {h:"5. Limitation of Liability",p:"To the maximum extent permitted by law, MyAiBank is not liable for any indirect, incidental, or consequential damages arising from use of the service."},
          {h:"6. Contact",p:"For questions about these Terms, contact us at legal@myaibank.ai."},
        ].map(({h,p})=>(
          <section key={h} className="mb-8"><h2 className="font-bold text-white mb-3 text-base sm:text-lg">{h}</h2><p className="text-sm sm:text-base leading-relaxed" style={{color:"rgba(255,255,255,0.6)"}}>{p}</p></section>
        ))}
      </article>
      <SiteFooter variant="dark"/>
    </main>
  )
}