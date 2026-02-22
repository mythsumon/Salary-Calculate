import { DayEntry } from "@/types"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface DayTableProps {
  days: DayEntry[]
  onUpdateDay: (dayNumber: number, updates: Partial<DayEntry>) => void
  startDate?: string
}

function getMonthLabel(calendarDay: number, startDate?: string, isSecondMonth?: boolean): string {
  if (!startDate) return ""
  const start = new Date(startDate)
  if (isSecondMonth) {
    const nextMonth = new Date(start.getFullYear(), start.getMonth() + 1, calendarDay)
    return nextMonth.toLocaleDateString('en-US', { month: 'short' })
  } else {
    const currentDate = new Date(start.getFullYear(), start.getMonth(), calendarDay)
    return currentDate.toLocaleDateString('en-US', { month: 'short' })
  }
}

export function DayTable({ days, onUpdateDay, startDate }: DayTableProps) {
  const getDaysInMonth = (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getIsSecondMonth = (index: number): boolean => {
    if (!startDate) return false
    const start = new Date(startDate)
    const startDay = start.getDate()
    const daysInStartMonth = getDaysInMonth(start)
    const daysLeftInMonth = daysInStartMonth - startDay + 1
    return index >= daysLeftInMonth
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Attendance & Overtime</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[120px]">Day #</TableHead>
                <TableHead className="w-[100px]">Attended</TableHead>
                <TableHead className="w-[120px]">Work Hours</TableHead>
                <TableHead className="w-[120px]">OT Hours</TableHead>
                <TableHead className="w-[150px]">Sunday Type</TableHead>
                <TableHead className="w-[120px]">Sun Amount/Work Hrs</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {days.map((day, index) => {
                const isSecondMonth = getIsSecondMonth(index)
                const monthLabel = getMonthLabel(day.calendarDay || day.dayNumber, startDate, isSecondMonth)
                return (
                  <TableRow key={day.dayNumber} className={day.isSunday ? "bg-muted/30" : ""}>
                    <TableCell className="font-medium">
                      <div className="flex flex-col">
                        <span>
                          {day.calendarDay || day.dayNumber}
                          {day.isSunday && <span className="ml-1 text-xs text-muted-foreground">(Sun)</span>}
                        </span>
                        {monthLabel && (
                          <span className="text-xs text-muted-foreground">{monthLabel}</span>
                        )}
                      </div>
                    </TableCell>
                  <TableCell>
                    <Switch
                      checked={day.attended}
                      onChange={(e) => {
                        const attended = e.target.checked
                        onUpdateDay(day.dayNumber, {
                          attended,
                          otHours: attended ? day.otHours : 0,
                        })
                      }}
                    />
                    </TableCell>
                  <TableCell>
                    {!day.isSunday ? (
                      <Input
                        type="number"
                        min="0"
                        max="12"
                        step="0.5"
                        value={day.workHours || 8}
                        disabled={!day.attended}
                        onChange={(e) => {
                          const workHours = Math.max(0, Math.min(12, parseFloat(e.target.value) || 8))
                          onUpdateDay(day.dayNumber, { workHours })
                        }}
                        className="w-20"
                        placeholder="8"
                      />
                    ) : (
                      <span className="text-xs text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min="0"
                      max="12"
                      step="0.5"
                      value={day.otHours}
                      disabled={!day.attended || (day.isSunday && day.sundayPaymentType === "special")}
                      onChange={(e) => {
                        const otHours = Math.max(0, Math.min(12, parseFloat(e.target.value) || 0))
                        onUpdateDay(day.dayNumber, { otHours })
                      }}
                      className="w-20"
                    />
                  </TableCell>
                  <TableCell>
                    {day.isSunday ? (
                      <select
                        value={day.sundayPaymentType || "special"}
                        onChange={(e) => {
                          const paymentType = e.target.value as "special" | "normal" | null
                          const updates: Partial<DayEntry> = {
                            sundayPaymentType: paymentType,
                            sundaySpecialAmount: paymentType === "special" ? (day.sundaySpecialAmount || 35) : null,
                            sundayWorkHours: paymentType === "normal" ? (day.sundayWorkHours || 8) : undefined,
                            otHours: paymentType === "special" ? 0 : day.otHours,
                          }
                          onUpdateDay(day.dayNumber, updates)
                        }}
                        className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm"
                        disabled={!day.attended}
                      >
                        <option value="normal">Normal ($23 + OT)</option>
                        <option value="special">Special ($35/$40)</option>
                      </select>
                    ) : (
                      <span className="text-xs text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {day.isSunday && day.attended ? (
                      day.sundayPaymentType === "special" ? (
                        <select
                          value={day.sundaySpecialAmount || 35}
                          onChange={(e) => {
                            onUpdateDay(day.dayNumber, {
                              sundaySpecialAmount: parseInt(e.target.value) as 35 | 40,
                              otHours: 0, // No OT for special Sundays
                            })
                          }}
                          className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm"
                        >
                          <option value="35">$35</option>
                          <option value="40">$40</option>
                        </select>
                      ) : (
                        <Input
                          type="number"
                          min="0"
                          max="12"
                          step="0.5"
                          value={day.sundayWorkHours || 8}
                          onChange={(e) => {
                            const workHours = Math.max(0, Math.min(12, parseFloat(e.target.value) || 8))
                            onUpdateDay(day.dayNumber, { sundayWorkHours: workHours })
                          }}
                          className="w-20"
                          placeholder="8"
                        />
                      )
                    ) : (
                      <span className="text-xs text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Input
                      type="text"
                      placeholder="Optional notes..."
                      value={day.notes || ""}
                      onChange={(e) => {
                        onUpdateDay(day.dayNumber, { notes: e.target.value })
                      }}
                      className="min-w-[200px]"
                    />
                  </TableCell>
                </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
