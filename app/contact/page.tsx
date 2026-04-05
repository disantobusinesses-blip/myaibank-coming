import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { SiteFooter } from "@/components/site-footer"
import { Mail, MessageSquare, ArrowRight } from "lucide-react"

export const metadata: Metadata = {
  title: "Contact | MyAiBank",
  description: "Get in touch with the MyAiBank team. We are happy to help with questions about features, pricing, or your account.",
  alternates: { canonical: "/contact" },
}

export default function ContactPage() {
  return (
    <main className="min-h-screen flex flex-col" style={{ backgroundColor:"#050508", color:"#fff" }}>
      <header style={{ borderBottom:"1px solid rgba(255,255,255,0.07)", backgroundColor:"rgba(5,5,8,0.95)", backdropFilter:"blur(12px)", position:"sticky", top:0, zIndex:50 }}>
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 py-3 sm:py-4 flex items-center justify-between">
          <Link href="/"><Image src="/MABtransparent.png" alt="MyAiBank" width={80} height={32} className="object-contain w-16 h-auto sm:w-20" /></Link>
          <Link href="/signup" className="h-9 px-4 rounded-full text-xs sm:text-sm font-semibold hover:scale-105 transition-all" style={{background:"linear-gradient(135deg,#8b5cf6,#6d28d9)",color:"#fff"}}>Get Started</Link>
        </div>
      </header>

      <section className="relative flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-20 text-center overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{background:"radial-gradient(circle,rgba(139,92,246,0.1),transparent 65%)"}} />
        <div className="relative max-w-2xl mx-auto">
          <p className="text-xs sm:text-sm font-semibold uppercase tracking-widest mb-3" style={{color:"#8b5cf6"}}>Get In Touch</p>
          <h1 className="font-bold text-white mb-4" style={{fontSize:"clamp(2rem,5vw,3.5rem)"}}>We&#39;d love to hear from you</h1>
          <p className="text-sm sm:text-base mb-10 max-w-lg mx-auto" style={{color:"rgba(255,255,255,0.55)"}}>
            Have a question about features, pricing, or your account? Our team is here to help.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 mb-10">
            <a href="mailto:hello@myaibank.ai" className="group p-6 sm:p-8 rounded-3xl text-left transition-all hover:scale-[1.02]"
              style={{background:"rgba(139,92,246,0.1)",border:"1px solid rgba(139,92,246,0.25)"}}>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4" style={{background:"rgba(139,92,246,0.2)"}}>
                <Mail className="w-6 h-6" style={{color:"#a78bfa"}}/>
              </div>
              <h3 className="font-bold text-white mb-2">Email Us</h3>
              <p className="text-sm mb-4" style={{color:"rgba(255,255,255,0.55)"}}>For general enquiries and support.</p>
              <span className="text-sm font-semibold group-hover:underline" style={{color:"#a78bfa"}}>hello@myaibank.ai</span>
            </a>
            <a href="mailto:security@myaibank.ai" className="group p-6 sm:p-8 rounded-3xl text-left transition-all hover:scale-[1.02]"
              style={{background:"rgba(34,197,94,0.08)",border:"1px solid rgba(34,197,94,0.2)"}}>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4" style={{background:"rgba(34,197,94,0.15)"}}>
                <MessageSquare className="w-6 h-6" style={{color:"#22c55e"}}/>
              </div>
              <h3 className="font-bold text-white mb-2">Security Reports</h3>
              <p className="text-sm mb-4" style={{color:"rgba(255,255,255,0.55)"}}>Responsible disclosure and security issues.</p>
              <span className="text-sm font-semibold group-hover:underline" style={{color:"#22c55e"}}>security@myaibank.ai</span>
            </a>
          </div>
          <Link href="/signup" className="inline-flex items-center gap-2 h-12 px-8 rounded-2xl text-sm sm:text-base font-semibold hover:scale-105 transition-all"
            style={{background:"linear-gradient(135deg,#8b5cf6,#6d28d9)",color:"#fff",boxShadow:"0 4px 24px rgba(139,92,246,0.3)"}}>
            Get Started Free <ArrowRight className="w-4 h-4"/>
          </Link>
        </div>
      </section>
      <SiteFooter variant="dark"/>
    </main>
  )
}
