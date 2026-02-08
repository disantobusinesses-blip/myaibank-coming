import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LegalFooter } from "@/components/legal-footer"

export const metadata = {
  title: "Learn What MyAiBank Does | AI Budgeting and Money Management",
  description:
    "MyAiBank is an AI budgeting and money management app that helps you track spending, spot subscriptions, and build smarter budgets from your transactions.",
}

const faqItems = [
  {
    question: "What is an AI budgeting app?",
    answer:
      "An AI budgeting app uses transaction data to automatically categorise spending, highlight patterns, and surface insights that help you budget faster.",
  },
  {
    question: "How does MyAiBank read transactions?",
    answer:
      "MyAiBank connects to your accounts with secure providers to pull transaction data and turn it into summaries, trends, and insights.",
  },
  {
    question: "Can I use the demo?",
    answer:
      "Yes. The demo lets you explore MyAiBank with realistic sample data so you can see how insights and the assistant work.",
  },
  {
    question: "Does it work in Australia?",
    answer:
      "Yes. MyAiBank is built for Australians and supports local categories, merchants, and money management needs.",
  },
  {
    question: "Is MyAiBank a bank?",
    answer:
      "No. MyAiBank is a money management and spending tracker app. We do not hold funds or provide banking services.",
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
          <span aria-hidden="true">←</span>
          <span>Back</span>
        </Link>

        <div className="flex justify-center mb-8">
          <Image
            src="/logo.jpeg"
            alt="MyAiBank"
            width={72}
            height={72}
            className="rounded-2xl"
          />
        </div>

        <h1 className="text-3xl font-bold text-foreground text-center mb-3 text-balance">
          Learn what MyAiBank does
        </h1>
        <p className="text-muted-foreground text-center text-lg leading-relaxed mb-10 text-pretty">
          MyAiBank turns your transactions into clear insights. Track spending, find subscriptions, and ask our AI
          financial assistant questions about where your money goes.
        </p>

        <section className="space-y-8 mb-10">
          <div className="p-5 rounded-2xl bg-card border border-border">
            <h2 className="text-xl font-semibold text-foreground mb-2">
              AI budgeting that understands your spending
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              See categories, trends, and monthly summaries automatically. Identify overspending and set simple
              targets that fit your lifestyle.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-card border border-border">
            <h2 className="text-xl font-semibold text-foreground mb-2">Subscription and bill detection</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Find recurring charges fast and see what they cost over time so you can cancel or negotiate.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-card border border-border">
            <h2 className="text-xl font-semibold text-foreground mb-2">Ask questions with the AI financial assistant</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Ask “What did I spend on food last month?” or “Show my biggest merchants.” The assistant reads your
              transactions to answer with clear numbers.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-card border border-border">
            <h2 className="text-xl font-semibold text-foreground mb-2">Built for privacy</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your data is used to generate insights and answers. We minimise access and never share your
              information.
            </p>
          </div>
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
