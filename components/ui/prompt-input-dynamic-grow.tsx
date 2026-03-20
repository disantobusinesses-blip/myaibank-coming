"use client"

import { useRef, useEffect, KeyboardEvent, useState } from "react"
import { Send } from "lucide-react"

interface ChatGPTInputProps {
  placeholder?: string
  onSubmit: (value: string) => void
  disabled?: boolean
  textColor?: string
  showEffects?: boolean
  menuOptions?: string[]
}

export default function ChatGPTInput({
  placeholder = "Message...",
  onSubmit,
  disabled = false,
  textColor = "#0A1217",
  showEffects = true,
  menuOptions = [],
}: ChatGPTInputProps) {
  const [value, setValue] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-grow the textarea
  useEffect(() => {
    const ta = textareaRef.current
    if (!ta) return
    ta.style.height = "auto"
    ta.style.height = `${Math.min(ta.scrollHeight, 200)}px`
  }, [value])

  const handleSubmit = () => {
    const trimmed = value.trim()
    if (!trimmed || disabled) return
    onSubmit(trimmed)
    setValue("")
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const handleMenuOption = (option: string) => {
    setValue((prev) => {
      const trimmed = prev.trim()
      return trimmed ? `${trimmed} ${option}: ` : `${option}: `
    })
    textareaRef.current?.focus()
  }

  return (
    <div className="w-full">
      {/* Menu option pills */}
      {menuOptions.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {menuOptions.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => handleMenuOption(opt)}
              disabled={disabled}
              className="px-3 py-1 text-xs rounded-full border border-border bg-secondary text-foreground hover:bg-secondary/80 transition-colors disabled:opacity-50"
            >
              {opt}
            </button>
          ))}
        </div>
      )}

      {/* Input row */}
      <div
        className={`flex items-end gap-2 rounded-2xl border border-border bg-secondary px-4 py-3 transition-all ${
          showEffects ? "focus-within:ring-2 focus-within:ring-[#1F0051]/30 focus-within:border-[#1F0051]/50" : ""
        }`}
      >
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
          style={{ color: textColor, resize: "none" }}
          className="flex-1 bg-transparent outline-none text-sm leading-relaxed placeholder:text-muted-foreground disabled:opacity-50 overflow-hidden"
        />
        <button
          type="button"
          onClick={handleSubmit}
          disabled={disabled || !value.trim()}
          className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-xl bg-[#1F0051] text-white hover:bg-[#1F0051]/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="Send message"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
