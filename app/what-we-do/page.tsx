"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LegalFooter } from "@/components/legal-footer"
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  PieChart,
  TrendingUp,
  Bell,
  Target,
  BarChart3,
} from "lucide-react"

const features = [
  {
    icon: <Sparkles className="w-6 h-6" />,
    title: "AI-Powered Insights",
    description:
      "Our AI analyzes your spending patterns and provides personalized recommendations to help you save money and reach your goals faster.",
    color: "text-[#8b5cf6]",
    bg: "bg-[#8b5cf6]/20",
  },
  {
    icon: <PieChart className="w-6 h-6" />,
    title: "Smart Budgeting",
    description:
      "Automatic 50/30/20 budget allocation with real-time tracking. Know exactly where your money goes each month.",
    color: "text-[#22c55e]",
    bg: "bg-[#22c55e]/20",
  },
  {
    icon: <TrendingUp className="w-6 h-6" />,
    title: "Cashflow Forecasting",
    description:
      "See your financial future with accurate cashflow predictions based on your income and spending habits.",
    color: "text-[#14b8a6]",
    bg: "bg-[#14b8a6]/20",
  },
  {
    icon: <Bell className="w-6 h-6" />,
    title: "Subscription Tracking",
    description:
      "Never forget about a subscription again. We detect and track all your recurring payments automatically.",
    color: "text-[#f59e0b]",
    bg: "bg-[#f59e0b]/20",
  },
  {
    icon: <Target className="w-6 h-6" />,
    title: "Goal Setting",
    description:
      "Set savings goals and track your progress. We'll help you stay on track with smart notifications.",
    color: "text-[#ec4899]",
    bg: "bg-[#ec4899]/20",
  },
  {
    icon: <BarChart3 className="w-6 h-6" />,
    title: "Portfolio Tracking",
    description:
      "Track your investments and properties in one place. Get a complete view of your net worth.",
    color: "text-[#6366f1]",
    bg: "bg-[#6366f1]/20",
  },
]

export default function WhatWeDoPage() {
  const router = useRouter()

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back()
    } else {
      router.push("/")
    }
  }

  return (
    <main className="min-h-screen flex flex-col bg-background safe-area-inset">
      <div className="flex-1 px-6 py-8 max-w-2xl mx-auto w-full">
        {/* Back Button */}
        <button
          type="button"
          onClick={handleBack}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Image
            src="/logo.jpeg"
            alt="MyAiBank"
            width={72}
            height={72}
            className="rounded-2xl"
          />
        </div>

        {/* Header */}
        <h1 className="text-3xl font-bold text-foreground text-center mb-3 text-balance">
          What is MyAiBank?
        </h1>
        <p className="text-muted-foreground text-center text-lg leading-relaxed mb-10 text-pretty">
          MyAiBank is your AI-powered financial companion. We help you understand your money, track your spending, and make smarter financial decisions.
        </p>

        {/* Important Notice */}
        <div className="p-4 rounded-2xl bg-card border border-border mb-8">
          <h2 className="font-semibold text-foreground mb-2">Important Notice</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            MyAiBank provides AI-assisted budgeting and transaction insights for information purposes only. We do NOT provide financial advice, hold customer funds, or act as a bank. Always seek independent professional advice for financial decisions.
          </p>
        </div>

        {/* Features */}
        <h2 className="text-xl font-semibold text-foreground mb-6">Features</h2>
        <div className="grid gap-4 mb-10">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="flex items-start gap-4 p-4 rounded-2xl bg-card border border-border"
            >
              <div
                className={`w-12 h-12 rounded-xl ${feature.bg} flex items-center justify-center flex-shrink-0 ${feature.color}`}
              >
                {feature.icon}
              </div>
              <div>
                <h3 className="font-medium text-foreground mb-1">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <Button
          asChild
          className="w-full h-14 rounded-2xl bg-[#1F0051] hover:bg-[#2d0075] text-white font-semibold text-base"
        >
          <Link href="/signup">
            Get Started
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </Button>
      </div>

      <LegalFooter />
    </main>
  )
}
