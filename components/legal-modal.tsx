"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { TERMS_OF_USE, PRIVACY_POLICY } from "@/lib/legal-content"

interface LegalModalProps {
  type: "terms" | "privacy"
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function LegalModal({ type, open, onOpenChange }: LegalModalProps) {
  const content = type === "terms" ? TERMS_OF_USE : PRIVACY_POLICY
  const title = type === "terms" ? "Terms of Use" : "Privacy Policy"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-foreground">
            {title}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-4">
          <div className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
            {content}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
