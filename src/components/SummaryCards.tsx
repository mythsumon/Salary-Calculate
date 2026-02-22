import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CalculationResult } from "@/types"
import { formatCurrency } from "@/lib/utils"

interface SummaryCardsProps {
  result: CalculationResult
}

export function SummaryCards({ result }: SummaryCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Days</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{result.totalDays}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Attended Days</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {result.attendedDays}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Absent Days</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600 dark:text-red-400">
            {result.absentDays}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total OT Hours</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{result.totalOTHours.toFixed(2)}</div>
        </CardContent>
      </Card>
    </div>
  )
}

interface ResultCardsProps {
  result: CalculationResult
}

export function ResultCards({ result }: ResultCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Gross Pay</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(result.grossPay)}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Base: {formatCurrency(result.basePay)} + OT: {formatCurrency(result.otPay)}
            {result.sundayPayTotal > 0 && ` + Sunday: ${formatCurrency(result.sundayPayTotal)}`}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Bonuses Total</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {formatCurrency(result.bonusesTotal)}
          </div>
          {result.perfectAttendanceBonus > 0 && (
            <p className="text-xs text-muted-foreground mt-1">
              Perfect Attendance: {formatCurrency(result.perfectAttendanceBonus)}
            </p>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Deductions Total</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600 dark:text-red-400">
            {formatCurrency(result.deductionsTotal)}
          </div>
        </CardContent>
      </Card>
      <Card className="border-2 border-primary">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Net Pay</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">
            {formatCurrency(result.netPay)}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
