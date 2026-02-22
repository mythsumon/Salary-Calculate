import { z } from "zod"

export const settingsSchema = z.object({
  periodDays: z.number().min(1).max(365),
  normalDailyPay: z.number().min(0),
  normalWorkHours: z.number().min(0).max(24),
  otRate: z.number().min(0),
  mealDeduction: z.number().min(0),
})

export const dayEntrySchema = z.object({
  dayNumber: z.number().min(1),
  attended: z.boolean(),
  otHours: z.number().min(0).max(12),
  notes: z.string().optional(),
})

export const customBonusSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required"),
  amount: z.number().min(0),
})

export const customDeductionSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required"),
  amount: z.number().min(0),
})

export const bonusSettingsSchema = z.object({
  perfectAttendanceEnabled: z.boolean(),
  perfectAttendanceAmount: z.number().min(0),
  customBonuses: z.array(customBonusSchema),
})

export const deductionSettingsSchema = z.object({
  mealDeductionEnabled: z.boolean(),
  customDeductions: z.array(customDeductionSchema),
})

export type SettingsInput = z.infer<typeof settingsSchema>
export type DayEntryInput = z.infer<typeof dayEntrySchema>
export type CustomBonusInput = z.infer<typeof customBonusSchema>
export type CustomDeductionInput = z.infer<typeof customDeductionSchema>
export type BonusSettingsInput = z.infer<typeof bonusSettingsSchema>
export type DeductionSettingsInput = z.infer<typeof deductionSettingsSchema>
