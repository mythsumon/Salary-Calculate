import { Settings } from "@/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface SettingsFormProps {
  settings: Settings
  onSettingsChange: (settings: Settings) => void
}

export function SettingsForm({ settings, onSettingsChange }: SettingsFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pay Period Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="periodEndDate">Period End Date (Day 20)</Label>
          <Input
            id="periodEndDate"
            type="date"
            value={settings.periodEndDate || (() => {
              // Default: February 20, 2026
              const endDate = new Date(2026, 1, 20)
              return endDate.toISOString().split('T')[0]
            })()}
            onChange={(e) => {
              const endDate = e.target.value
              if (endDate) {
                const end = new Date(endDate)
                // Force end date to be day 20 of the selected month
                end.setDate(20)
                const correctedEndDate = end.toISOString().split('T')[0]
                
                // Calculate start date: day 21 of previous month (always day 21)
                const start = new Date(end.getFullYear(), end.getMonth() - 1, 21)
                // Ensure start date is exactly day 21
                if (start.getDate() !== 21) {
                  start.setDate(21)
                }
                const startDateStr = start.toISOString().split('T')[0]
                
                // Calculate actual period days: from day 21 of previous month to day 20 of current month
                const actualPeriodDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
                
                onSettingsChange({
                  ...settings,
                  periodEndDate: correctedEndDate,
                  periodStartDate: startDateStr,
                  periodDays: actualPeriodDays,
                })
              }
            }}
            className="mt-1"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Sign card date: Period from Day 21 of previous month to Day 20 of this month
          </p>
        </div>

        <div>
          <Label htmlFor="periodStartDate">Period Start Date (Day 21)</Label>
          <Input
            id="periodStartDate"
            type="date"
            value={settings.periodStartDate || (() => {
              // Default: January 21, 2026
              const startDate = new Date(2026, 0, 21)
              return startDate.toISOString().split('T')[0]
            })()}
            onChange={(e) => {
              const startDate = e.target.value
              if (startDate) {
                const start = new Date(startDate)
                // Ensure start date is day 21
                start.setDate(21)
                const correctedStartDate = start.toISOString().split('T')[0]
                
                // If end date exists, recalculate period days
                let actualPeriodDays = settings.periodDays
                if (settings.periodEndDate) {
                  const end = new Date(settings.periodEndDate)
                  actualPeriodDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
                }
                
                onSettingsChange({
                  ...settings,
                  periodStartDate: correctedStartDate,
                  periodDays: actualPeriodDays,
                })
              }
            }}
            className="mt-1"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Start date: Always Day 21 (automatically set to day 21 of selected month)
          </p>
        </div>

        <div>
          <Label htmlFor="periodDays">Pay Period Length (days)</Label>
          <Input
            id="periodDays"
            type="number"
            min="1"
            value={settings.periodDays}
            disabled
            className="mt-1 bg-muted"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Automatically calculated: Day 21 of previous month to Day 20 of current month
          </p>
        </div>

        <div>
          <Label htmlFor="normalDailyPay">Normal Daily Pay (SGD)</Label>
          <Input
            id="normalDailyPay"
            type="number"
            min="0"
            step="0.01"
            value={settings.normalDailyPay}
            onChange={(e) => {
              onSettingsChange({
                ...settings,
                normalDailyPay: Math.max(0, parseFloat(e.target.value) || 0),
              })
            }}
            className="mt-1"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Pay for a full normal day of work
          </p>
        </div>

        <div>
          <Label htmlFor="normalWorkHours">Normal Work Hours per Day</Label>
          <Input
            id="normalWorkHours"
            type="number"
            min="0"
            step="0.5"
            value={settings.normalWorkHours}
            onChange={(e) => {
              onSettingsChange({
                ...settings,
                normalWorkHours: Math.max(0, parseFloat(e.target.value) || 0),
              })
            }}
            className="mt-1"
            disabled
          />
          <p className="text-xs text-muted-foreground mt-1">
            Display only (for reference)
          </p>
        </div>

        <div>
          <Label htmlFor="otRate">OT Rate per Hour (SGD)</Label>
          <Input
            id="otRate"
            type="number"
            min="0"
            step="0.01"
            value={settings.otRate}
            onChange={(e) => {
              onSettingsChange({
                ...settings,
                otRate: Math.max(0, parseFloat(e.target.value) || 0),
              })
            }}
            className="mt-1"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Overtime rate per hour
          </p>
        </div>

        <div>
          <Label htmlFor="mealDeduction">Meal Deduction per Period (SGD)</Label>
          <Input
            id="mealDeduction"
            type="number"
            min="0"
            step="0.01"
            value={settings.mealDeduction}
            onChange={(e) => {
              onSettingsChange({
                ...settings,
                mealDeduction: Math.max(0, parseFloat(e.target.value) || 0),
              })
            }}
            className="mt-1"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Default meal deduction amount
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
