export interface DayEntry {
  dayNumber: number // Sequential number (1, 2, 3... 20)
  calendarDay: number // Actual calendar day (21-31, then 1-20)
  attended: boolean
  workHours?: number // Work hours for regular days (default 8, can be less like 4)
  otHours: number
  isSunday?: boolean
  sundayPaymentType?: "special" | "normal" | null // "special" for $35/$40 flat, "normal" for regular $23 + OT
  sundaySpecialAmount?: 35 | 40 | null // Only for special Sundays
  sundayWorkHours?: number // For normal Sundays, default 8, can be less
  notes?: string
}

export interface MonthEntry {
  id: string
  month: string // Format: YYYY-MM
  attendanceDays: number
  otHours: number
  notes?: string
}

export interface CustomBonus {
  id: string
  name: string
  amount: number
}

export interface CustomDeduction {
  id: string
  name: string
  amount: number
}

export interface Settings {
  periodDays: number
  normalDailyPay: number
  normalWorkHours: number
  otRate: number
  mealDeduction: number
  exchangeRate?: number // SGD to MMK exchange rate
  periodStartDate?: string // Format: YYYY-MM-DD, to determine which days are Sundays
  periodEndDate?: string // Format: YYYY-MM-DD, period always ends on day 20
}

export interface BonusSettings {
  perfectAttendanceEnabled: boolean
  perfectAttendanceAmount: number
  customBonuses: CustomBonus[]
}

export interface DeductionSettings {
  mealDeductionEnabled: boolean
  customDeductions: CustomDeduction[]
}

export interface PeriodData {
  id: string
  date: string
  periodDays: number
  attendedDays: number
  netPay: number
  grossPay: number
  bonusesTotal: number
  deductionsTotal: number
  days: DayEntry[]
  settings: Settings
  bonusSettings: BonusSettings
  deductionSettings: DeductionSettings
}

export interface CalculationResult {
  totalDays: number
  attendedDays: number
  absentDays: number
  totalOTHours: number
  basePay: number
  otPay: number
  sundayPayTotal: number
  grossPay: number
  perfectAttendanceBonus: number
  bonusesTotal: number
  deductionsTotal: number
  netPay: number
}
