import { DayEntry } from "@/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface PeriodCalendarProps {
  days: DayEntry[]
  startDate?: string
}

function getDaysInMonth(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
}

export function PeriodCalendar({ days, startDate }: PeriodCalendarProps) {
  if (!startDate) {
    return null
  }

  const start = new Date(startDate)
  const startDay = start.getDate()
  const daysInStartMonth = getDaysInMonth(start)
  const daysLeftInMonth = daysInStartMonth - startDay + 1

  // Get month names
  const startMonth = start.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  const nextMonth = new Date(start.getFullYear(), start.getMonth() + 1, 1)
  const nextMonthName = nextMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  // First month days (21-31 or 21-30)
  const firstMonthDays = days.slice(0, daysLeftInMonth)
  // Second month days (1-20)
  const secondMonthDays = days.slice(daysLeftInMonth)

  const getDayStatus = (day: DayEntry) => {
    if (!day.attended) return "absent"
    if (day.isSunday && day.sundayPaymentType === "special") return "sunday-special"
    if (day.isSunday) return "sunday-normal"
    return "attended"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Period Calendar</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* First Month (21-31) */}
          <div>
            <h3 className="text-lg font-semibold mb-3">{startMonth}</h3>
            <div className="grid grid-cols-7 gap-2">
              {/* Day labels */}
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                  {day}
                </div>
              ))}
              {/* Empty cells for days before start */}
              {Array.from({ length: (start.getDay() + startDay - 1) % 7 }, (_, i) => (
                <div key={`empty-${i}`} className="h-12"></div>
              ))}
              {/* Calendar days */}
              {firstMonthDays.map((day) => {
                const status = getDayStatus(day)
                const bgColor = 
                  status === "absent" ? "bg-red-100 dark:bg-red-900/20" :
                  status === "sunday-special" ? "bg-blue-100 dark:bg-blue-900/20" :
                  status === "sunday-normal" ? "bg-purple-100 dark:bg-purple-900/20" :
                  "bg-green-100 dark:bg-green-900/20"
                
                const borderColor = day.isSunday ? "border-2 border-blue-500" : ""
                
                return (
                  <div
                    key={day.dayNumber}
                    className={`${bgColor} ${borderColor} rounded-lg p-2 min-h-[60px] flex flex-col items-center justify-center text-sm`}
                  >
                    <div className="font-bold">{day.calendarDay}</div>
                    {day.attended && (
                      <div className="text-xs mt-1">
                        {day.workHours && day.workHours < 8 && (
                          <div>{day.workHours}h</div>
                        )}
                        {day.otHours > 0 && (
                          <div>OT: {day.otHours}h</div>
                        )}
                        {day.isSunday && day.sundayPaymentType === "special" && (
                          <div className="text-blue-600 dark:text-blue-400">${day.sundaySpecialAmount}</div>
                        )}
                      </div>
                    )}
                    {!day.attended && (
                      <div className="text-xs text-red-600 dark:text-red-400">Absent</div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Second Month (1-20) */}
          {secondMonthDays.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3">{nextMonthName}</h3>
              <div className="grid grid-cols-7 gap-2">
                {/* Day labels */}
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                    {day}
                  </div>
                ))}
                {/* Get first day of next month */}
                {(() => {
                  const firstDayOfNextMonth = new Date(start.getFullYear(), start.getMonth() + 1, 1)
                  const firstDayWeekday = firstDayOfNextMonth.getDay()
                  return Array.from({ length: firstDayWeekday }, (_, i) => (
                    <div key={`empty-next-${i}`} className="h-12"></div>
                  ))
                })()}
                {/* Calendar days */}
                {secondMonthDays.map((day) => {
                  const status = getDayStatus(day)
                  const bgColor = 
                    status === "absent" ? "bg-red-100 dark:bg-red-900/20" :
                    status === "sunday-special" ? "bg-blue-100 dark:bg-blue-900/20" :
                    status === "sunday-normal" ? "bg-purple-100 dark:bg-purple-900/20" :
                    "bg-green-100 dark:bg-green-900/20"
                  
                  const borderColor = day.isSunday ? "border-2 border-blue-500" : ""
                  
                  return (
                    <div
                      key={day.dayNumber}
                      className={`${bgColor} ${borderColor} rounded-lg p-2 min-h-[60px] flex flex-col items-center justify-center text-sm`}
                    >
                      <div className="font-bold">{day.calendarDay}</div>
                      {day.attended && (
                        <div className="text-xs mt-1">
                          {day.workHours && day.workHours < 8 && (
                            <div>{day.workHours}h</div>
                          )}
                          {day.otHours > 0 && (
                            <div>OT: {day.otHours}h</div>
                          )}
                          {day.isSunday && day.sundayPaymentType === "special" && (
                            <div className="text-blue-600 dark:text-blue-400">${day.sundaySpecialAmount}</div>
                          )}
                        </div>
                      )}
                      {!day.attended && (
                        <div className="text-xs text-red-600 dark:text-red-400">Absent</div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="mt-6 flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-green-100 dark:bg-green-900/20"></div>
            <span>Attended</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-red-100 dark:bg-red-900/20"></div>
            <span>Absent</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-blue-100 dark:bg-blue-900/20 border-2 border-blue-500"></div>
            <span>Sunday (Special)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-purple-100 dark:bg-purple-900/20 border-2 border-blue-500"></div>
            <span>Sunday (Normal)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
