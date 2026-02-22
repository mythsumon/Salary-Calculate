import { DayEntry, Settings, CalculationResult } from "@/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"

interface BasePayBreakdownProps {
  days: DayEntry[]
  settings: Settings
  result: CalculationResult
}

export function BasePayBreakdown({ days, settings, result }: BasePayBreakdownProps) {
  // Calculate detailed breakdown
  const breakdown = {
    regularDaysFull: { count: 0, total: 0, examples: [] as string[] },
    regularDaysPartial: { count: 0, total: 0, examples: [] as string[] },
    normalSundaysFull: { count: 0, total: 0, examples: [] as string[] },
    normalSundaysPartial: { count: 0, total: 0, examples: [] as string[] },
  }

  days.forEach(day => {
    if (!day.attended) return

    if (day.isSunday && day.sundayPaymentType === "special") {
      // Special Sundays don't contribute to base pay
      return
    }

    if (day.isSunday && day.sundayPaymentType === "normal") {
      // Normal Sunday
      const workHours = day.sundayWorkHours || settings.normalWorkHours
      const ratio = workHours / settings.normalWorkHours
      const dayPay = settings.normalDailyPay * ratio

      if (workHours === settings.normalWorkHours) {
        breakdown.normalSundaysFull.count++
        breakdown.normalSundaysFull.total += dayPay
        breakdown.normalSundaysFull.examples.push(`Day ${day.calendarDay || day.dayNumber}: ${workHours}h = ${formatCurrency(dayPay)}`)
      } else {
        breakdown.normalSundaysPartial.count++
        breakdown.normalSundaysPartial.total += dayPay
        breakdown.normalSundaysPartial.examples.push(`Day ${day.calendarDay || day.dayNumber}: ${workHours}h = ${formatCurrency(dayPay)}`)
      }
    } else {
      // Regular day
      const workHours = day.workHours || settings.normalWorkHours
      const ratio = workHours / settings.normalWorkHours
      const dayPay = settings.normalDailyPay * ratio

      if (workHours === settings.normalWorkHours) {
        breakdown.regularDaysFull.count++
        breakdown.regularDaysFull.total += dayPay
        breakdown.regularDaysFull.examples.push(`Day ${day.calendarDay || day.dayNumber}: ${workHours}h = ${formatCurrency(dayPay)}`)
      } else {
        breakdown.regularDaysPartial.count++
        breakdown.regularDaysPartial.total += dayPay
        breakdown.regularDaysPartial.examples.push(`Day ${day.calendarDay || day.dayNumber}: ${workHours}h = ${formatCurrency(dayPay)}`)
      }
    }
  })

  const hasBreakdown = breakdown.regularDaysFull.count > 0 || 
                      breakdown.regularDaysPartial.count > 0 || 
                      breakdown.normalSundaysFull.count > 0 || 
                      breakdown.normalSundaysPartial.count > 0

  if (!hasBreakdown) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Base Pay Calculation Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm">
          <div className="font-semibold mb-2">Formula: Base Pay = (Work Hours ÷ 8) × $23 per day</div>
          <div className="text-muted-foreground mb-4">
            Each attended day's pay is calculated based on actual work hours. Full 8 hours = full $23, partial hours = prorated amount.
          </div>
        </div>

        {/* Regular Days - Full Hours */}
        {breakdown.regularDaysFull.count > 0 && (
          <div className="border-l-4 border-green-500 pl-4 py-2">
            <div className="font-semibold">
              Regular Days (Full 8 Hours): {breakdown.regularDaysFull.count} days
            </div>
            <div className="text-sm text-muted-foreground mb-1">
              Calculation: {breakdown.regularDaysFull.count} days × $23.00 = {formatCurrency(breakdown.regularDaysFull.total)}
            </div>
            {breakdown.regularDaysFull.examples.length <= 5 && (
              <div className="text-xs text-muted-foreground mt-1">
                {breakdown.regularDaysFull.examples.join(", ")}
              </div>
            )}
          </div>
        )}

        {/* Regular Days - Partial Hours */}
        {breakdown.regularDaysPartial.count > 0 && (
          <div className="border-l-4 border-blue-500 pl-4 py-2">
            <div className="font-semibold">
              Regular Days (Partial Hours): {breakdown.regularDaysPartial.count} days
            </div>
            <div className="text-sm text-muted-foreground mb-1">
              Total: {formatCurrency(breakdown.regularDaysPartial.total)}
            </div>
            <div className="text-xs space-y-1 mt-2">
              {breakdown.regularDaysPartial.examples.map((example, idx) => (
                <div key={idx} className="text-muted-foreground">
                  {example}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Normal Sundays - Full Hours */}
        {breakdown.normalSundaysFull.count > 0 && (
          <div className="border-l-4 border-purple-500 pl-4 py-2">
            <div className="font-semibold">
              Normal Sundays (Full 8 Hours): {breakdown.normalSundaysFull.count} days
            </div>
            <div className="text-sm text-muted-foreground mb-1">
              Calculation: {breakdown.normalSundaysFull.count} days × $23.00 = {formatCurrency(breakdown.normalSundaysFull.total)}
            </div>
            {breakdown.normalSundaysFull.examples.length <= 5 && (
              <div className="text-xs text-muted-foreground mt-1">
                {breakdown.normalSundaysFull.examples.join(", ")}
              </div>
            )}
          </div>
        )}

        {/* Normal Sundays - Partial Hours */}
        {breakdown.normalSundaysPartial.count > 0 && (
          <div className="border-l-4 border-orange-500 pl-4 py-2">
            <div className="font-semibold">
              Normal Sundays (Partial Hours): {breakdown.normalSundaysPartial.count} days
            </div>
            <div className="text-sm text-muted-foreground mb-1">
              Total: {formatCurrency(breakdown.normalSundaysPartial.total)}
            </div>
            <div className="text-xs space-y-1 mt-2">
              {breakdown.normalSundaysPartial.examples.map((example, idx) => (
                <div key={idx} className="text-muted-foreground">
                  {example}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Total Summary */}
        <div className="border-t pt-4 mt-4">
          <div className="flex justify-between items-center">
            <div className="font-bold text-lg">Total Base Pay:</div>
            <div className="font-bold text-lg text-primary">{formatCurrency(result.basePay)}</div>
          </div>
          <div className="text-xs text-muted-foreground mt-2">
            Breakdown: 
            {breakdown.regularDaysFull.total > 0 && ` Regular Full: ${formatCurrency(breakdown.regularDaysFull.total)}`}
            {breakdown.regularDaysPartial.total > 0 && ` Regular Partial: ${formatCurrency(breakdown.regularDaysPartial.total)}`}
            {breakdown.normalSundaysFull.total > 0 && ` Sunday Full: ${formatCurrency(breakdown.normalSundaysFull.total)}`}
            {breakdown.normalSundaysPartial.total > 0 && ` Sunday Partial: ${formatCurrency(breakdown.normalSundaysPartial.total)}`}
          </div>
        </div>

        {/* Note about Special Sundays */}
        {days.some(d => d.attended && d.isSunday && d.sundayPaymentType === "special") && (
          <div className="text-xs text-muted-foreground mt-4 p-2 bg-muted rounded">
            <strong>Note:</strong> Special Sundays ($35/$40) are not included in base pay calculation. They are shown separately as "Sunday" pay.
          </div>
        )}
      </CardContent>
    </Card>
  )
}
