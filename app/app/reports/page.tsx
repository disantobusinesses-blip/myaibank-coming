"use client"

import { FileText, Download, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"

const reports = [
  {
    id: "1",
    name: "Monthly Summary",
    description: "Overview of income, expenses, and savings for the month",
    lastGenerated: "2026-01-28",
    status: "available",
  },
  {
    id: "2",
    name: "Spending by Category",
    description: "Detailed breakdown of spending across all categories",
    lastGenerated: "2026-01-28",
    status: "available",
  },
  {
    id: "3",
    name: "Subscription Report",
    description: "List of all detected recurring payments",
    lastGenerated: "2026-01-25",
    status: "available",
  },
  {
    id: "4",
    name: "Tax Summary",
    description: "Annual summary for tax purposes",
    lastGenerated: null,
    status: "coming_soon",
  },
]

export default function ReportsPage() {
  return (
    <div className="p-4 lg:p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Reports</h1>

      <div className="space-y-4">
        {reports.map((report) => (
          <div
            key={report.id}
            className="rounded-2xl bg-card border border-border p-4"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#1F0051]/20 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-[#8b5cf6]" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{report.name}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {report.description}
                  </p>
                  {report.lastGenerated && (
                    <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      <span>
                        Last generated:{" "}
                        {new Date(report.lastGenerated).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {report.status === "available" ? (
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 bg-transparent"
                >
                  <Download className="w-4 h-4" />
                  Download
                </Button>
              ) : (
                <span className="px-3 py-1 rounded-full bg-secondary text-xs font-medium text-muted-foreground">
                  Coming Soon
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
