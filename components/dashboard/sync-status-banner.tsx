"use client"

import { Loader2, CheckCircle, AlertCircle, Info } from "lucide-react"

interface SyncStatus {
  stage: "idle" | "connecting" | "syncing" | "complete" | "error"
  progress: number
  message: string
}

interface SyncStatusBannerProps {
  status: SyncStatus
}

export function SyncStatusBanner({ status }: SyncStatusBannerProps) {
  if (status.stage === "idle" || status.stage === "complete") {
    return null
  }

  const variants = {
    connecting: {
      bg: "bg-[#1F0051]/20 border-[#1F0051]/30",
      icon: <Loader2 className="w-4 h-4 text-[#8b5cf6] animate-spin" />,
      text: "text-[#8b5cf6]",
    },
    syncing: {
      bg: "bg-[#14b8a6]/20 border-[#14b8a6]/30",
      icon: <Loader2 className="w-4 h-4 text-[#14b8a6] animate-spin" />,
      text: "text-[#14b8a6]",
    },
    error: {
      bg: "bg-destructive/20 border-destructive/30",
      icon: <AlertCircle className="w-4 h-4 text-destructive" />,
      text: "text-destructive",
    },
    complete: {
      bg: "bg-[#22c55e]/20 border-[#22c55e]/30",
      icon: <CheckCircle className="w-4 h-4 text-[#22c55e]" />,
      text: "text-[#22c55e]",
    },
    idle: {
      bg: "bg-secondary border-border",
      icon: <Info className="w-4 h-4 text-muted-foreground" />,
      text: "text-muted-foreground",
    },
  }

  const variant = variants[status.stage]

  return (
    <div className={`rounded-xl border p-3 flex items-center gap-3 ${variant.bg}`}>
      {variant.icon}
      <div className="flex-1">
        <p className={`text-sm font-medium ${variant.text}`}>
          {status.message}
        </p>
        {status.stage === "syncing" && (
          <div className="mt-2 h-1.5 bg-background/50 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#14b8a6] rounded-full transition-all duration-300"
              style={{ width: `${status.progress}%` }}
            />
          </div>
        )}
      </div>
    </div>
  )
}
