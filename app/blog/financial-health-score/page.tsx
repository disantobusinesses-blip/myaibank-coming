import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Financial Health Score for Australians | MyAiBank",
  description:
    "Understand your financial health score and how AI analyses your income, spending, and savings habits to give you a clear picture of your financial wellbeing.",
}

export default function FinancialHealthScorePage() {
  return (
    <article>
      <h1 className="text-3xl font-bold mb-4" style={{ color: '#180D27' }}>
        Understanding Your Financial Health Score with AI
      </h1>
      <p className="text-sm mb-8" style={{ color: '#999' }}>Published by MyAiBank</p>

      <p className="mb-6 leading-relaxed" style={{ color: '#333' }}>
        Most people have a general sense of whether they are doing well financially, but few have a precise understanding of their overall financial health. A financial health score changes that by giving you a single, easy-to-understand metric that reflects the state of your finances. With MyAiBank, this score is generated using AI that analyses your income, expenses, savings rate, and spending patterns.
      </p>
      <p className="mb-6 leading-relaxed" style={{ color: '#333' }}>
        Think of it as a fitness tracker for your money. Just as a health app monitors your steps and heart rate, a financial health score monitors your cash flow, spending discipline, and progress towards your financial goals. It gives you a clear starting point and helps you measure improvement over time.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4" style={{ color: '#180D27' }}>
        What Is a Financial Health Score?
      </h2>
      <p className="mb-6 leading-relaxed" style={{ color: '#333' }}>
        A financial health score is a numerical indicator that summarises your overall financial wellbeing. It takes into account factors like how much you earn relative to what you spend, whether your expenses are stable or fluctuating, how much you save each month, and whether you have any recurring charges that could be reduced.
      </p>
      <p className="mb-6 leading-relaxed" style={{ color: '#333' }}>
        MyAiBank calculates this score automatically by analysing your transaction data. The AI considers your income patterns, identifies discretionary versus essential spending, measures your savings rate, and evaluates the consistency of your financial behaviour. The result is a score that gives you a snapshot of where you stand and what you could improve.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4" style={{ color: '#180D27' }}>
        Why Your Financial Health Score Matters
      </h2>
      <p className="mb-6 leading-relaxed" style={{ color: '#333' }}>
        Without a clear metric, it is easy to fall into the trap of feeling either overly confident or unnecessarily anxious about your finances. A financial health score provides objectivity. It shows you exactly where you stand based on real data, not assumptions or feelings.
      </p>
      <p className="mb-6 leading-relaxed" style={{ color: '#333' }}>
        For Australians navigating rising costs and complex financial decisions, this kind of clarity is invaluable. Whether you are considering a major purchase, evaluating whether you can increase your superannuation contributions, or simply trying to reduce stress about money, your financial health score gives you a factual foundation to work from.
      </p>

      <h3 className="text-xl font-semibold mt-6 mb-3" style={{ color: '#180D27' }}>
        How MyAiBank Calculates Your Score
      </h3>
      <p className="mb-6 leading-relaxed" style={{ color: '#333' }}>
        MyAiBank analyses several dimensions of your financial life to generate your score. These include your income stability, the ratio of your expenses to your income, your savings rate, the diversity and necessity of your spending categories, and the presence of any financial risks such as excessive subscription costs or irregular large expenses.
      </p>
      <p className="mb-6 leading-relaxed" style={{ color: '#333' }}>
        The AI updates your score as new transactions come in, so you always have a current view. If you cut a subscription or reduce dining expenses, you will see the impact reflected in your score within days.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4" style={{ color: '#180D27' }}>
        How to Improve Your Financial Health Score
      </h2>

      <h3 className="text-xl font-semibold mt-6 mb-3" style={{ color: '#180D27' }}>
        Reduce Unnecessary Spending
      </h3>
      <p className="mb-6 leading-relaxed" style={{ color: '#333' }}>
        Start by reviewing your spending categories in MyAiBank. Identify areas where you are spending more than you need to, and make small adjustments. Even cutting one unused subscription or reducing takeaway meals by a few per month can have a measurable impact on your score.
      </p>

      <h3 className="text-xl font-semibold mt-6 mb-3" style={{ color: '#180D27' }}>
        Increase Your Savings Rate
      </h3>
      <p className="mb-6 leading-relaxed" style={{ color: '#333' }}>
        Your savings rate is a key component of financial health. Aim to save a consistent percentage of your income each month. MyAiBank tracks your savings behaviour and shows you how it contributes to your overall score.
      </p>

      <h3 className="text-xl font-semibold mt-6 mb-3" style={{ color: '#180D27' }}>
        Maintain Consistent Spending Patterns
      </h3>
      <p className="mb-6 leading-relaxed" style={{ color: '#333' }}>
        Erratic spending can be a sign of poor financial planning. By keeping your monthly expenses relatively stable and predictable, you demonstrate financial discipline, which positively impacts your health score.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4" style={{ color: '#180D27' }}>
        Start Tracking Your Score Today
      </h2>
      <p className="mb-6 leading-relaxed" style={{ color: '#333' }}>
        Curious about your financial health? Try the{" "}
        <Link href="/" className="underline font-medium" style={{ color: '#180D27' }}>MyAiBank demo</Link>{" "}
        to see how the financial health score works with sample data. You will get a clear preview of the scoring system and how it can help you improve your financial habits.
      </p>
      <p className="mb-6 leading-relaxed" style={{ color: '#333' }}>
        You can also learn more about{" "}
        <Link href="/blog/ai-budget-tracking" className="underline" style={{ color: '#180D27' }}>AI budget tracking</Link>,{" "}
        <Link href="/blog/ai-spending-insights" className="underline" style={{ color: '#180D27' }}>spending insights</Link>,{" "}
        <Link href="/blog/subscription-detection" className="underline" style={{ color: '#180D27' }}>subscription detection</Link>, and{" "}
        <Link href="/blog/mortgage-rate-alerts" className="underline" style={{ color: '#180D27' }}>mortgage rate alerts</Link>.
        Visit the{" "}
        <Link href="/what-we-do" className="underline" style={{ color: '#180D27' }}>What We Do</Link> page for a full overview of MyAiBank features.
      </p>

      {/* Conversion CTA */}
      <div className="mt-12 p-8 rounded-2xl text-center" style={{ backgroundColor: '#f9f7fc', border: '1px solid #e8e0f0' }}>
        <h3 className="text-xl font-semibold mb-2" style={{ color: '#180D27' }}>
          Ready to see your finances analysed instantly?
        </h3>
        <p className="mb-4" style={{ color: '#555' }}>
          Try the MyAiBank demo and experience AI-powered money insights.
        </p>
        <Link
          href="/"
          className="inline-block px-8 py-3 rounded-xl text-white font-semibold text-sm"
          style={{ background: 'linear-gradient(135deg, #180D27 0%, #2d1b69 100%)' }}
        >
          Try the Demo
        </Link>
      </div>
    </article>
  )
}
