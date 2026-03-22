import type { SupabaseClient } from "@supabase/supabase-js"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnySupabaseClient = SupabaseClient<any, any, any>

export const USAGE_LIMITS = {
  inactive: {
    dailyChat: 0,
    monthlyDeepAnalysis: 0,
  },
  active: {
    dailyChat: 50,
    monthlyDeepAnalysis: 1,
  },
}

export function getCurrentMonthYear(): string {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
}

export async function getOrCreateUsageRecord(
  supabase: AnySupabaseClient,
  userId: string
) {
  const monthYear = getCurrentMonthYear()

  const { data: existing } = await supabase
    .from("ai_usage")
    .select("*")
    .eq("user_id", userId)
    .eq("month_year", monthYear)
    .single()

  if (existing) return existing

  const { data: created } = await supabase
    .from("ai_usage")
    .insert({
      user_id: userId,
      month_year: monthYear,
      usage_date: new Date().toISOString().split("T")[0],
      daily_chat_count: 0,
      monthly_deep_analysis_count: 0,
    })
    .select()
    .single()

  return created
}

export async function checkAndIncrementChatUsage(
  supabase: AnySupabaseClient,
  userId: string,
  subscriptionStatus: string | null
): Promise<{ allowed: boolean; remaining: number; limit: number }> {
  const status = subscriptionStatus === "active" ? "active" : "inactive"
  const limits = USAGE_LIMITS[status]
  const monthYear = getCurrentMonthYear()
  const today = new Date().toISOString().split("T")[0]

  if (limits.dailyChat === 0) {
    return { allowed: false, remaining: 0, limit: 0 }
  }

  const usage = await getOrCreateUsageRecord(supabase, userId)
  if (!usage) return { allowed: false, remaining: 0, limit: limits.dailyChat }

  const currentCount = usage.usage_date === today ? usage.daily_chat_count : 0

  if (currentCount >= limits.dailyChat) {
    return { allowed: false, remaining: 0, limit: limits.dailyChat }
  }

  await supabase
    .from("ai_usage")
    .update({ daily_chat_count: currentCount + 1, usage_date: today })
    .eq("user_id", userId)
    .eq("month_year", monthYear)

  return {
    allowed: true,
    remaining: limits.dailyChat - (currentCount + 1),
    limit: limits.dailyChat,
  }
}

export async function checkAndIncrementDeepAnalysis(
  supabase: AnySupabaseClient,
  userId: string,
  subscriptionStatus: string | null
): Promise<{ allowed: boolean; remaining: number; limit: number }> {
  const status = subscriptionStatus === "active" ? "active" : "inactive"
  const limits = USAGE_LIMITS[status]
  const monthYear = getCurrentMonthYear()

  if (limits.monthlyDeepAnalysis === 0) {
    return { allowed: false, remaining: 0, limit: 0 }
  }

  const usage = await getOrCreateUsageRecord(supabase, userId)
  if (!usage) return { allowed: false, remaining: 0, limit: limits.monthlyDeepAnalysis }

  if (usage.monthly_deep_analysis_count >= limits.monthlyDeepAnalysis) {
    return { allowed: false, remaining: 0, limit: limits.monthlyDeepAnalysis }
  }

  await supabase
    .from("ai_usage")
    .update({
      monthly_deep_analysis_count: usage.monthly_deep_analysis_count + 1,
      last_deep_analysis_at: new Date().toISOString(),
    })
    .eq("user_id", userId)
    .eq("month_year", monthYear)

  return {
    allowed: true,
    remaining: limits.monthlyDeepAnalysis - (usage.monthly_deep_analysis_count + 1),
    limit: limits.monthlyDeepAnalysis,
  }
}
