import { DayEntry, Settings, BonusSettings, DeductionSettings, CalculationResult } from '@/types'

export function calculateTotals(
  days: DayEntry[],
  settings: Settings,
  bonusSettings: BonusSettings,
  deductionSettings: DeductionSettings
): CalculationResult {
  const totalDays = days.length
  const attendedDays = days.filter(d => d.attended).length
  const absentDays = totalDays - attendedDays
  
  // Calculate base pay and OT pay, excluding Sundays
  let basePay = 0
  let otPay = 0
  let sundayPayTotal = 0
  
  days.forEach(day => {
    if (!day.attended) return
    
    if (day.isSunday && day.sundayPaymentType === "special") {
      // Special Sunday: flat rate $35 or $40, no daily pay, no OT
      sundayPayTotal += (day.sundaySpecialAmount || 35)
    } else if (day.isSunday && day.sundayPaymentType === "normal") {
      // Normal Sunday: $23 for work hours (default 8, can be less) + OT
      const workHours = day.sundayWorkHours || 8
      const dailyPayRatio = workHours / settings.normalWorkHours
      basePay += settings.normalDailyPay * dailyPayRatio
      otPay += day.otHours * settings.otRate
    } else {
      // Regular day: prorated daily pay based on work hours + OT
      const workHours = day.workHours || settings.normalWorkHours
      const dailyPayRatio = workHours / settings.normalWorkHours
      basePay += settings.normalDailyPay * dailyPayRatio
      otPay += day.otHours * settings.otRate
    }
  })
  
  const totalOTHours = days.reduce((sum, day) => {
    if (!day.attended) return sum
    if (day.isSunday && day.sundayPaymentType === "special") return sum
    return sum + day.otHours
  }, 0)
  
  const grossPay = basePay + otPay + sundayPayTotal
  
  // Perfect attendance bonus
  const perfectAttendanceBonus = 
    bonusSettings.perfectAttendanceEnabled && 
    attendedDays === totalDays && 
    totalDays > 0
      ? bonusSettings.perfectAttendanceAmount
      : 0
  
  // Custom bonuses
  const customBonusesTotal = bonusSettings.customBonuses.reduce(
    (sum, bonus) => sum + bonus.amount,
    0
  )
  
  const bonusesTotal = perfectAttendanceBonus + customBonusesTotal
  
  // Meal deduction
  const mealDeductionAmount = deductionSettings.mealDeductionEnabled
    ? settings.mealDeduction
    : 0
  
  // Custom deductions
  const customDeductionsTotal = deductionSettings.customDeductions.reduce(
    (sum, deduction) => sum + deduction.amount,
    0
  )
  
  const deductionsTotal = mealDeductionAmount + customDeductionsTotal
  
  const netPay = grossPay + bonusesTotal - deductionsTotal
  
  return {
    totalDays,
    attendedDays,
    absentDays,
    totalOTHours,
    basePay,
    otPay,
    sundayPayTotal,
    grossPay,
    perfectAttendanceBonus,
    bonusesTotal,
    deductionsTotal,
    netPay,
  }
}
