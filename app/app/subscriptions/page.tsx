"use client"

import { useAppData } from "@/contexts/app-data-context"
import { RefreshCcw, Calendar, DollarSign } from "lucide-react"
import { CountUp } from "@/components/count-up"
import { AnimatedContent } from "@/components/animated-content"
import { SplitText } from "@/components/split-text"

const categoryColors: Record<string, string> = {
  Entertainment: "bg-[#8b5cf6]/20 text-[#8b5cf6]",
  Technology: "bg-[#6366f1]/20 text-[#6366f1]",
  Health: "bg-[#22c55e]/20 text-[#22c55e]",
  default: "bg-secondary text-muted-foreground",
}

export default function SubscriptionsPage() {
  const { subscriptions, connected } = useAppData()

  const totalMonthly = subscriptions.reduce((sum, sub) => {
    if (sub.frequency === "yearly") return sum + sub.amount / 12
    if (sub.frequency === "weekly") return sum + sub.amount * 4.33
    return sum + sub.amount
  }, 0)

  if (!connected) {
    return (
      <div className="p-4 lg:p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-foreground mb-4">Subscriptions</h1>
        <div className="p-8 rounded-2xl bg-card border border-border text-center">
          <p className="text-muted-foreground">Connect your bank to track subscriptions</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 lg:p-6 max-w-4xl mx-auto space-y-6">
      <AnimatedContent animation="fade-up" delay={0}>
        <h1 className="text-2xl font-bold text-foreground">
          <SplitText text="Subscriptions" charDelay={40} />
        </h1>
      </AnimatedContent>

      {/* Summary Card */}
      <AnimatedContent animation="fade-up" delay={80}>
        <div className="rounded-2xl gradient-teal border border-[#14b8a6]/30 p-6">
          <div className="flex items-center gap-3 mb-2">
            <RefreshCcw className="w-5 h-5 text-[#14b8a6]" />
            <p className="text-sm text-white/70">Monthly Subscription Cost</p>
          </div>
          <p className="text-3xl font-bold font-number text-white">
            <CountUp
              to={totalMonthly}
              decimals={2}
              prefix="$"
              duration={2800}
            />
            <span className="text-base font-normal text-white/70">/month</span>
          </p>
          <p className="text-sm text-white/70 mt-1">
            {subscriptions.length} active subscriptions detected
          </p>
        </div>
      </AnimatedContent>

      {/* Subscriptions List */}
      <div className="space-y-3">
        {subscriptions.map((subscription, index) => (
          <AnimatedContent key={subscription.id} animation="fade-up" delay={120 + index * 60}>
            <div className="rounded-2xl bg-card border border-border p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                    <span className="text-lg font-bold text-foreground">
                      {subscription.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{subscription.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-medium ${
                          categoryColors[subscription.category] || categoryColors.default
                        }`}
                      >
                        {subscription.category}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold font-number text-foreground">
                    <CountUp
                      to={subscription.amount}
                      decimals={2}
                      prefix="$"
                      duration={2800}
                    />
                  </p>
                  <p className="text-xs text-muted-foreground">/{subscription.frequency}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>Next: {new Date(subscription.nextBillingDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <DollarSign className="w-4 h-4" />
                  <span>
                    ${subscription.frequency === "yearly" 
                      ? (subscription.amount / 12).toFixed(2) 
                      : subscription.amount.toFixed(2)}/mo
                  </span>
                </div>
              </div>
            </div>
          </AnimatedContent>
        ))}
      </div>
    </div>
  )
}
