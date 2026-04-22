"use client"

import { useEffect, useState } from "react"

interface CountdownTimerProps {
  targetDate: string
}

interface TimeRemaining {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function calculateTimeRemaining(target: number): TimeRemaining {
  const now = Date.now()
  const diff = Math.max(0, target - now)

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
  const minutes = Math.floor((diff / (1000 * 60)) % 60)
  const seconds = Math.floor((diff / 1000) % 60)

  return { days, hours, minutes, seconds }
}

const BOX_CLASSES =
  "bg-[#111827] border border-[#1e293b] rounded-2xl px-6 py-4 min-w-[80px] text-center"

export function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const target = new Date(targetDate).getTime()
  const [time, setTime] = useState<TimeRemaining>(() =>
    calculateTimeRemaining(target),
  )

  useEffect(() => {
    setTime(calculateTimeRemaining(target))
    const id = setInterval(() => {
      setTime(calculateTimeRemaining(target))
    }, 1000)
    return () => clearInterval(id)
  }, [target])

  const boxes: Array<{ value: number; label: string }> = [
    { value: time.days, label: "Days" },
    { value: time.hours, label: "Hours" },
    { value: time.minutes, label: "Minutes" },
    { value: time.seconds, label: "Seconds" },
  ]

  const pad = (n: number) => n.toString().padStart(2, "0")

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
      {boxes.map((box, i) => (
        <div key={box.label} className="flex items-center gap-2 sm:gap-3">
          <div className={BOX_CLASSES}>
            <div className="text-5xl font-black text-blue-400 tabular-nums leading-none">
              {pad(box.value)}
            </div>
            <div className="text-xs uppercase tracking-widest text-[#94a3b8] mt-2">
              {box.label}
            </div>
          </div>
          {i < boxes.length - 1 && (
            <span className="text-blue-400 text-3xl font-bold self-center">
              :
            </span>
          )}
        </div>
      ))}
    </div>
  )
}

export default CountdownTimer
