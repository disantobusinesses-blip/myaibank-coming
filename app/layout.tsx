import React from "react"
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import Script from "next/script"
import { Analytics } from '@vercel/analytics/next'
import { AuthProvider } from '@/contexts/auth-context'
import { Toaster } from '@/components/ui/toaster'
import { CookieConsentBanner } from '@/components/cookie-consent-banner'
import './globals.css'

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  metadataBase: new URL('https://myaibank.ai'),
  title: 'MyAiBank - AI-Powered Financial Management',
  description: 'AI-assisted budgeting, transaction insights, subscription tracking, and money-management tools.',
  generator: 'MyAiBank',
  icons: {
    icon: '/logo.jpeg',
    apple: '/logo.jpeg',
  },
  openGraph: {
    type: "website",
    siteName: "MyAiBank",
    locale: "en_AU",
  },
  twitter: {
    card: "summary",
  },
}

export const viewport: Viewport = {
  themeColor: '#050508',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased bg-background text-foreground min-h-screen`}>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
        <CookieConsentBanner />
        <Analytics />
        <Script
          id="json-ld-software-application"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "MyAiBank",
              "url": "https://myaibank.ai",
              "description": "AI-powered personal finance platform for Australians. Connects to your bank accounts via Open Banking to automatically track spending, detect subscriptions, forecast cash flow, and score your financial health.",
              "applicationCategory": "FinanceApplication",
              "operatingSystem": "Web, iOS, Android",
              "offers": {
                "@type": "Offer",
                "price": "14.99",
                "priceCurrency": "AUD",
                "priceSpecification": {
                  "@type": "RecurringChargeSpecification",
                  "price": "14.99",
                  "priceCurrency": "AUD",
                  "billingDuration": "P1M"
                }
              },
              "featureList": [
                "Bank account aggregation",
                "AI transaction categorisation",
                "Cash flow forecasting",
                "Subscription detection",
                "Financial health scoring",
                "Budget tracking"
              ],
              "audience": {
                "@type": "Audience",
                "geographicArea": {
                  "@type": "Country",
                  "name": "Australia"
                }
              }
            })
          }}
        />
        {/* ── Google consent mode defaults (must run before GA loads) ── */}
        <Script id="consent-defaults" strategy="beforeInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('consent', 'default', {
              analytics_storage: 'denied',
              ad_storage: 'denied',
              ad_user_data: 'denied',
              ad_personalization: 'denied',
              wait_for_update: 500
            });
          `}
        </Script>
        {/* ── Google Analytics ──────────────────────────────────────── */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', { send_page_view: true });
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  )
}
