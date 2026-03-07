import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LegalFooter } from "@/components/legal-footer"

export const metadata = {
  title: "AI Money Manager Australia | AI Budgeting App & Finance Tracker — MyAiBank",
  description:
    "MyAiBank is Australia's AI money manager and budgeting app. Track spending, manage cash flow, detect subscriptions, and get AI-powered financial insights. Launching soon in the USA and UK.",
  keywords:
    "AI money manager Australia, AI money tracker, AI budgeting app Australia, AI finance app, money management app, AI spending tracker, budgeting tool Australia",
}

const featureTiles = [
  {
    title: "AI budgeting that understands your spending",
    description:
      "Our AI budgeting app automatically categorises every transaction, highlights spending patterns, and builds monthly summaries. Identify where you overspend and set simple targets that fit your lifestyle.",
    href: "/blog/ai-budget-tracking",
  },
  {
    title: "Cash flow dashboard and spending analytics",
    description:
      "See your income, expenses, and net cash flow at a glance. Break down spending by category, track trends over time, and understand exactly where your money goes each month with our AI money tracker.",
    href: "/blog/ai-spending-insights",
  },
  {
    title: "Subscription and bill detection",
    description:
      "Automatically find recurring charges, subscriptions, and bills. See what each costs over time so you can cancel unused services, negotiate better rates, or plan ahead for upcoming payments.",
    href: "/blog/subscription-detection",
  },
  {
    title: "AI financial assistant — ask anything about your money",
    description:
      "Ask \u201cWhat did I spend on food last month?\u201d or \u201cShow my biggest merchants.\u201d Our AI financial assistant reads your transactions and answers with real numbers, category breakdowns, and actionable insights.",
    href: "/blog/ai-transaction-categorisation",
  },
  {
    title: "Transaction search and smart categorisation",
    description:
      "Search, filter, and review every transaction. Our AI automatically assigns categories to merchants so you always know what you spent and where. No manual tagging needed.",
    href: "/blog/ai-transaction-categorisation",
  },
  {
    title: "Financial health score",
    description:
      "Understand your overall financial wellbeing with an AI-generated health score. Track your income, spending, and savings rate to measure improvement over time.",
    href: "/blog/financial-health-score",
  },
  {
    title: "Mortgage rate alerts",
    description:
      "Stay informed about interest rate changes that could affect your home loan. Get personalised alerts when refinancing opportunities arise or when rates are about to increase.",
    href: "/blog/mortgage-rate-alerts",
  },
  {
    title: "Built for privacy and security",
    description:
      "Your financial data is used only to generate insights and answers for you. We minimise data access, use bank-grade encryption, and never sell or share your information with third parties.",
    href: "/what-we-do",
  },
  {
    title: "Available in Australia — expanding to the USA and UK",
    description:
      "MyAiBank is designed for Australian users with support for local banks, merchants, and AUD formatting. We are planning to launch in the USA and UK soon, bringing AI-powered money management to more users worldwide.",
    href: "/what-we-do",
  },
]

const faqItems = [
  {
    question: "What is an AI money manager?",
    answer:
      "An AI money manager uses your transaction data to automatically categorise spending, highlight patterns, track cash flow, and surface actionable insights — helping you budget smarter and faster than manual spreadsheets.",
  },
  {
    question: "How does MyAiBank work as an AI money tracker?",
    answer:
      "MyAiBank connects securely to your bank accounts via trusted providers to pull transaction data. Our AI then categorises every transaction, detects subscriptions, builds spending summaries, and lets you ask questions about your finances through an AI financial assistant.",
  },
  {
    question: "Is MyAiBank available in Australia?",
    answer:
      "Yes. MyAiBank is built for Australians and supports local banks, categories, merchants, and AUD formatting. We are also planning to launch in the USA and UK to bring AI-powered money management to more users worldwide.",
  },
  {
    question: "What tools does MyAiBank include?",
    answer:
      "MyAiBank includes AI-powered budgeting, a cash flow dashboard, spending analytics with category breakdowns, automatic subscription and bill detection, an AI financial assistant you can ask questions, transaction search and filtering, and privacy-first data handling.",
  },
  {
    question: "Can I try MyAiBank before signing up?",
    answer:
      "Yes. Our demo mode lets you explore the full experience with realistic sample data — including the AI assistant, spending insights, and subscription detection — so you can see the value before connecting your accounts.",
  },
  {
    question: "Is MyAiBank a bank?",
    answer:
      "No. MyAiBank is an AI finance app for money management and spending tracking. We do not hold funds, issue cards, or provide banking services. We help you understand and manage the money you already have.",
  },
  {
    question: "Will MyAiBank be available in the USA and UK?",
    answer:
      "Yes. We are planning to expand MyAiBank to the USA and UK, bringing our AI budgeting and money management tools to users in those markets. Stay tuned for launch announcements.",
  },
]

export default function WhatWeDoPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  }

  return (
    <main className="min-h-screen flex flex-col bg-background safe-area-inset">
      <div className="flex-1 px-6 py-8 max-w-2xl mx-auto w-full">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />

        <Link
          href="/"
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <span aria-hidden="true">&larr;</span>
          <span>Back</span>
        </Link>

        <div className="flex justify-center mb-8">
          <Image
            src="/mab-logo-white.svg"
            alt="MyAiBank — AI money manager and budgeting app"
            width={120}
            height={52}
          />
        </div>

        <h1 className="text-3xl font-bold text-foreground text-center mb-3 text-balance">
          Your AI money manager for smarter budgeting
        </h1>
        <p className="text-muted-foreground text-center text-lg leading-relaxed mb-10 text-pretty">
          MyAiBank is an AI finance app that turns your transactions into clear insights.
          Track spending, manage cash flow, detect subscriptions, and ask our AI financial
          assistant anything about your money. Built for Australia — launching soon in the USA and UK.
        </p>

        <section className="space-y-8 mb-10">
          {featureTiles.map((tile) => (
            <Link
              key={tile.title}
              href={tile.href}
              className="block p-5 rounded-2xl bg-card border border-border hover:border-[#180D27]/30 transition-colors"
            >
              <h2 className="text-xl font-semibold text-foreground mb-2">
                {tile.title}
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {tile.description}
              </p>
              <span className="text-xs mt-2 inline-block" style={{ color: '#180D27' }}>
                Read more →
              </span>
            </Link>
          ))}
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold text-foreground mb-4">Frequently asked questions</h2>
          <div className="space-y-4">
            {faqItems.map((item) => (
              <div key={item.question} className="p-4 rounded-2xl bg-card border border-border">
                <h3 className="font-medium text-foreground mb-2">{item.question}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <Button
          asChild
          className="w-full h-14 rounded-2xl bg-[#1F0051] hover:bg-[#2d0075] text-white font-semibold text-base"
        >
          <Link href="/signup">Get Started</Link>
        </Button>
      </div>

      <LegalFooter />
    </main>
  )
}
