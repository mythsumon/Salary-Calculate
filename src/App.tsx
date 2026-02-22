import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { SummaryCards, ResultCards } from "@/components/SummaryCards"
import { BasePayBreakdown } from "@/components/BasePayBreakdown"
import { CurrencyConverter } from "@/components/CurrencyConverter"
import { DayTable } from "@/components/DayTable"
import { BonusDeductionPanel } from "@/components/BonusDeductionPanel"
import { SettingsForm } from "@/components/SettingsForm"
import { HistoryList } from "@/components/HistoryList"
import { ThemeToggle } from "@/components/ThemeToggle"
import { DayEntry, Settings, BonusSettings, DeductionSettings, PeriodData, MonthEntry } from "@/types"
import { calculateTotals } from "@/lib/calculations"
import { savePeriod, getPeriods, deletePeriod, getSettings, saveSettings, getBonusSettings, saveBonusSettings, getDeductionSettings, saveDeductionSettings, saveMonths, getMonths, saveCurrentDays, getCurrentDays, exportAllData, importAllData } from "@/lib/storage"
import { MonthByMonthTable } from "@/components/MonthByMonthTable"
import { PeriodCalendar } from "@/components/PeriodCalendar"
import { exportToPDF } from "@/lib/pdfExport"
import { Sparkles } from "lucide-react"

const DEFAULT_SETTINGS: Settings = {
  periodDays: 31, // Default: day 21 of one month to day 20 of next month
  normalDailyPay: 23,
  normalWorkHours: 8,
  otRate: 4.32,
  mealDeduction: 140,
  exchangeRate: 3000, // Default SGD to MMK rate
}

const DEFAULT_BONUS_SETTINGS: BonusSettings = {
  perfectAttendanceEnabled: true,
  perfectAttendanceAmount: 50,
  customBonuses: [],
}

const DEFAULT_DEDUCTION_SETTINGS: DeductionSettings = {
  mealDeductionEnabled: true,
  customDeductions: [],
}

function getDaysInMonth(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
}

function isSunday(calendarDay: number, startDate?: string, isSecondMonth?: boolean): boolean {
  if (!startDate) return false
  const start = new Date(startDate)
  if (isSecondMonth) {
    // Day 1-20 of next month
    const nextMonth = new Date(start.getFullYear(), start.getMonth() + 1, calendarDay)
    return nextMonth.getDay() === 0
  } else {
    // Day 21-31 of current month
    const currentDate = new Date(start.getFullYear(), start.getMonth(), calendarDay)
    return currentDate.getDay() === 0
  }
}

function initializeDays(count: number, startDate?: string): DayEntry[] {
  if (!startDate) {
    // Fallback to sequential numbering if no start date
    return Array.from({ length: count }, (_, i) => ({
      dayNumber: i + 1,
      calendarDay: i + 1,
      attended: true,
      workHours: 8,
      otHours: 0,
      notes: "",
    }))
  }

  const start = new Date(startDate)
  const startDay = start.getDate()
  const daysInStartMonth = getDaysInMonth(start)
  const daysLeftInMonth = daysInStartMonth - startDay + 1 // Days from start day to end of month
  
  return Array.from({ length: count }, (_, i) => {
    const dayNumber = i + 1
    let calendarDay: number
    let isSecondMonth = false
    
    if (i < daysLeftInMonth) {
      // Days 21-31 (or 21-30) of starting month
      calendarDay = startDay + i
    } else {
      // Days 1-20 of next month
      calendarDay = dayNumber - daysLeftInMonth
      isSecondMonth = true
    }
    
    const isSun = isSunday(calendarDay, startDate, isSecondMonth)
    return {
      dayNumber,
      calendarDay,
      attended: true,
      workHours: isSun ? undefined : 8, // Default 8 hours for regular days
      otHours: 0,
      isSunday: isSun,
      sundayPaymentType: isSun ? "special" : undefined, // Default to special $35
      sundaySpecialAmount: isSun ? 35 : undefined, // Default $35 for Sundays
      sundayWorkHours: isSun ? 8 : undefined,
      notes: "",
    }
  })
}

function App() {
  const [activeTab, setActiveTab] = useState("calculator")
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS)
  const [bonusSettings, setBonusSettings] = useState<BonusSettings>(DEFAULT_BONUS_SETTINGS)
  const [deductionSettings, setDeductionSettings] = useState<DeductionSettings>(DEFAULT_DEDUCTION_SETTINGS)
  const [days, setDays] = useState<DayEntry[]>(initializeDays(DEFAULT_SETTINGS.periodDays))
  const [savedPeriods, setSavedPeriods] = useState<PeriodData[]>([])
  const [months, setMonths] = useState<MonthEntry[]>([])

  // Load saved data
  useEffect(() => {
    const savedSettings = getSettings()
    if (savedSettings) {
      // Always validate and correct dates to ensure they follow the pattern
      // End date should be day 20, start date should be day 21 of previous month
      if (savedSettings.periodEndDate) {
        const end = new Date(savedSettings.periodEndDate)
        // Force end date to be day 20 of the selected month
        end.setDate(20)
        savedSettings.periodEndDate = end.toISOString().split('T')[0]
        
        // Calculate start date: day 21 of previous month (always day 21)
        const start = new Date(end.getFullYear(), end.getMonth() - 1, 21)
        savedSettings.periodStartDate = start.toISOString().split('T')[0]
        
        // Recalculate period days
        const actualPeriodDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
        savedSettings.periodDays = actualPeriodDays
      } else {
        // If no end date, set default: Start date January 21, 2026, End date February 20, 2026
        const startDate = new Date(2026, 0, 21) // January 21, 2026
        const endDate = new Date(2026, 1, 20)   // February 20, 2026
        savedSettings.periodEndDate = endDate.toISOString().split('T')[0]
        savedSettings.periodStartDate = startDate.toISOString().split('T')[0]
        
        // Calculate actual period days
        const actualPeriodDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1
        savedSettings.periodDays = actualPeriodDays
      }
      setSettings(savedSettings)
      setDays(initializeDays(savedSettings.periodDays, savedSettings.periodStartDate))
    } else {
      // Initialize default: Start date January 21, 2026, End date February 20, 2026
      const startDate = new Date(2026, 0, 21) // January 21, 2026 (month 0 = January)
      const endDate = new Date(2026, 1, 20)   // February 20, 2026 (month 1 = February)
      
      // Calculate actual period days
      const actualPeriodDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1
      
      const initialSettings = {
        ...DEFAULT_SETTINGS,
        periodDays: actualPeriodDays,
        periodEndDate: endDate.toISOString().split('T')[0],
        periodStartDate: startDate.toISOString().split('T')[0],
      }
      setSettings(initialSettings)
      setDays(initializeDays(initialSettings.periodDays, initialSettings.periodStartDate))
    }

    const savedBonusSettings = getBonusSettings()
    if (savedBonusSettings) {
      setBonusSettings(savedBonusSettings)
    }

    const savedDeductionSettings = getDeductionSettings()
    if (savedDeductionSettings) {
      setDeductionSettings(savedDeductionSettings)
    }

    setSavedPeriods(getPeriods())
    setMonths(getMonths())
  }, [])

  // Save settings when they change
  useEffect(() => {
    saveSettings(settings)
  }, [settings])

  useEffect(() => {
    saveBonusSettings(bonusSettings)
  }, [bonusSettings])

  useEffect(() => {
    saveDeductionSettings(deductionSettings)
  }, [deductionSettings])

  useEffect(() => {
    saveMonths(months)
  }, [months])

  // Save current days when they change
  useEffect(() => {
    if (days.length > 0) {
      saveCurrentDays(days)
    }
  }, [days])

  // Auto-populate months from calculated days
  useEffect(() => {
    if (!settings.periodStartDate || days.length === 0) return

    const start = new Date(settings.periodStartDate)
    const startDay = start.getDate()
    const daysInStartMonth = getDaysInMonth(start)
    const daysLeftInMonth = daysInStartMonth - startDay + 1

    // Group days by month
    const monthData = new Map<string, { attendanceDays: number; otHours: number }>()

    days.forEach((day, index) => {
      if (!day.attended) return

      let monthKey: string
      let monthDate: Date

      if (index < daysLeftInMonth) {
        // First month (day 21 to end of month)
        monthDate = new Date(start.getFullYear(), start.getMonth(), day.calendarDay || startDay + index)
      } else {
        // Second month (day 1 to 20)
        monthDate = new Date(start.getFullYear(), start.getMonth() + 1, day.calendarDay || (day.dayNumber - daysLeftInMonth))
      }

      monthKey = `${monthDate.getFullYear()}-${String(monthDate.getMonth() + 1).padStart(2, '0')}`

      if (!monthData.has(monthKey)) {
        monthData.set(monthKey, { attendanceDays: 0, otHours: 0 })
      }

      const data = monthData.get(monthKey)!
      data.attendanceDays++
      
      // Only count OT hours for non-special Sundays
      if (!(day.isSunday && day.sundayPaymentType === "special")) {
        data.otHours += day.otHours || 0
      }
    })

    // Update months array with calculated data
    const newMonths: MonthEntry[] = []
    monthData.forEach((data, monthKey) => {
      // Check if month already exists in current months
      const existingMonth = months.find(m => m.month === monthKey)
      if (existingMonth) {
        // Update existing month with calculated data, but preserve notes if user edited them
        newMonths.push({
          ...existingMonth,
          attendanceDays: data.attendanceDays,
          otHours: data.otHours,
        })
      } else {
        // Create new month entry
        newMonths.push({
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          month: monthKey,
          attendanceDays: data.attendanceDays,
          otHours: data.otHours,
          notes: "",
        })
      }
    })

    // Sort by month (chronologically)
    newMonths.sort((a, b) => a.month.localeCompare(b.month))

    // Only update if data has actually changed
    if (newMonths.length > 0) {
      const currentMonthsStr = months.map(m => `${m.month}:${m.attendanceDays}:${m.otHours}`).join('|')
      const newMonthsStr = newMonths.map(m => `${m.month}:${m.attendanceDays}:${m.otHours}`).join('|')
      
      if (currentMonthsStr !== newMonthsStr) {
        setMonths(newMonths)
      }
    }
  }, [days, settings.periodStartDate])

  // Update days when period length or start date changes
  useEffect(() => {
    if (days.length !== settings.periodDays || !settings.periodStartDate) {
      // Reinitialize all days when period length changes or start date is missing
      setDays(initializeDays(settings.periodDays, settings.periodStartDate))
    } else if (settings.periodStartDate) {
      // Update Sunday flags and calendar days when start date changes
      const start = new Date(settings.periodStartDate)
      const startDay = start.getDate()
      const daysInStartMonth = getDaysInMonth(start)
      const daysLeftInMonth = daysInStartMonth - startDay + 1
      
      setDays(prevDays => prevDays.map((day, i) => {
        let calendarDay: number
        let isSecondMonth = false
        
        if (i < daysLeftInMonth) {
          calendarDay = startDay + i
        } else {
          calendarDay = day.dayNumber - daysLeftInMonth
          isSecondMonth = true
        }
        
        const isSun = isSunday(calendarDay, settings.periodStartDate, isSecondMonth)
        return {
          ...day,
          calendarDay,
          isSunday: isSun,
          workHours: isSun ? day.workHours : (day.workHours || 8), // Preserve work hours for regular days
          sundayPaymentType: isSun ? (day.sundayPaymentType || "special") : undefined,
          sundaySpecialAmount: isSun ? (day.sundaySpecialAmount || 35) : undefined,
          sundayWorkHours: isSun ? (day.sundayWorkHours || 8) : undefined,
        }
      }))
    }
  }, [settings.periodDays, settings.periodStartDate])

  const result = calculateTotals(days, settings, bonusSettings, deductionSettings)

  const handleUpdateDay = (dayNumber: number, updates: Partial<DayEntry>) => {
    setDays(
      days.map((day) =>
        day.dayNumber === dayNumber ? { ...day, ...updates } : day
      )
    )
  }

  const handleReset = () => {
    if (confirm("Reset all data? This cannot be undone.")) {
      setDays(initializeDays(settings.periodDays, settings.periodStartDate))
      setBonusSettings(DEFAULT_BONUS_SETTINGS)
      setDeductionSettings(DEFAULT_DEDUCTION_SETTINGS)
    }
  }

  // Calculate payment date: period ends on day 20, payment comes around day 7-8 of next month
  const calculatePaymentDate = (): string => {
    if (!settings.periodEndDate) {
      return new Date().toISOString()
    }
    
    const endDate = new Date(settings.periodEndDate)
    // Payment comes around day 7-8 of the month after the period ends
    // If period ends Feb 20, payment is March 7-8
    // So: start of next month + 7 days
    const paymentDate = new Date(endDate.getFullYear(), endDate.getMonth() + 1, 7)
    return paymentDate.toISOString()
  }

  const handleSavePeriod = () => {
    const periodData: PeriodData = {
      id: Date.now().toString(),
      date: calculatePaymentDate(),
      periodDays: settings.periodDays,
      attendedDays: result.attendedDays,
      netPay: result.netPay,
      grossPay: result.grossPay,
      bonusesTotal: result.bonusesTotal,
      deductionsTotal: result.deductionsTotal,
      days: [...days],
      settings: { ...settings },
      bonusSettings: { ...bonusSettings },
      deductionSettings: { ...deductionSettings },
    }
    savePeriod(periodData)
    setSavedPeriods(getPeriods())
    alert("Period saved successfully!")
  }

  const handleExportPDF = () => {
    const periodData: PeriodData = {
      id: Date.now().toString(),
      date: calculatePaymentDate(),
      periodDays: settings.periodDays,
      attendedDays: result.attendedDays,
      netPay: result.netPay,
      grossPay: result.grossPay,
      bonusesTotal: result.bonusesTotal,
      deductionsTotal: result.deductionsTotal,
      days: [...days],
      settings: { ...settings },
      bonusSettings: { ...bonusSettings },
      deductionSettings: { ...deductionSettings },
    }
    exportToPDF(periodData, result)
  }

  const handleDeletePeriod = (id: string) => {
    if (confirm("Delete this saved period?")) {
      deletePeriod(id)
      setSavedPeriods(getPeriods())
    }
  }

  const handleViewPeriod = (period: PeriodData) => {
    setSettings(period.settings)
    setBonusSettings(period.bonusSettings)
    setDeductionSettings(period.deductionSettings)
    setDays(period.days)
    setActiveTab("calculator")
  }

  const handleLoadSampleData = () => {
    if (confirm("Load sample data? This will replace your current data.")) {
      const sampleDays = days.map((day, index) => ({
        ...day,
        attended: index < 18, // 18 out of 20 days attended
        otHours: index < 18 ? (index % 3 === 0 ? 2 : index % 3 === 1 ? 1.5 : 0) : 0,
        notes: index === 5 ? "Late arrival" : index === 12 ? "Early leave" : "",
      }))
      setDays(sampleDays)
      setBonusSettings({
        ...bonusSettings,
        perfectAttendanceEnabled: true,
        customBonuses: [
          { id: "1", name: "Performance Bonus", amount: 100 },
        ],
      })
      setDeductionSettings({
        ...deductionSettings,
        mealDeductionEnabled: true,
        customDeductions: [],
      })
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">Salary Calculator</h1>
            <span className="text-sm text-muted-foreground">Singapore</span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 pb-24 md:pb-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="sticky top-[73px] z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b mb-6 -mx-4 px-2 sm:px-4 pb-2">
            <TabsList className="grid w-full grid-cols-4 gap-0.5 sm:gap-1">
            <TabsTrigger value="calculator" className="text-[10px] sm:text-xs md:text-sm px-1 sm:px-2 md:px-3 py-1.5 truncate">
              <span className="hidden md:inline">Calculator</span>
              <span className="md:hidden">Calc</span>
            </TabsTrigger>
            <TabsTrigger value="period" className="text-[10px] sm:text-xs md:text-sm px-1 sm:px-2 md:px-3 py-1.5 truncate">
              <span className="hidden md:inline">Period Editor</span>
              <span className="md:hidden">Period</span>
            </TabsTrigger>
            <TabsTrigger value="bonuses" className="text-[10px] sm:text-xs md:text-sm px-1 sm:px-2 md:px-3 py-1.5 truncate">
              <span className="hidden md:inline">Bonuses & Deductions</span>
              <span className="md:hidden">Bonuses</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="text-[10px] sm:text-xs md:text-sm px-1 sm:px-2 md:px-3 py-1.5 truncate">
              History
            </TabsTrigger>
          </TabsList>
          </div>

          {/* Calculator Tab */}
          <TabsContent value="calculator" className="space-y-6">
            <div className="flex gap-2 mb-4">
              <Button onClick={handleLoadSampleData} variant="outline">
                Load Sample Data
              </Button>
              <Button onClick={handleReset} variant="outline">
                Reset
              </Button>
              <Button onClick={handleSavePeriod} variant="outline">
                Save Period
              </Button>
              <Button onClick={handleExportPDF} variant="outline">
                Export PDF
              </Button>
              <Button 
                onClick={() => {
                  const data = exportAllData()
                  const blob = new Blob([data], { type: 'application/json' })
                  const url = URL.createObjectURL(blob)
                  const a = document.createElement('a')
                  a.href = url
                  a.download = `salary-calculator-backup-${new Date().toISOString().split('T')[0]}.json`
                  a.click()
                  URL.revokeObjectURL(url)
                  alert('Data exported successfully!')
                }} 
                variant="outline"
              >
                Export Data
              </Button>
              <Button 
                onClick={() => {
                  const input = document.createElement('input')
                  input.type = 'file'
                  input.accept = '.json'
                  input.onchange = (e) => {
                    const file = (e.target as HTMLInputElement).files?.[0]
                    if (file) {
                      const reader = new FileReader()
                      reader.onload = (event) => {
                        const content = event.target?.result as string
                        if (confirm('Import data? This will replace your current data.')) {
                          if (importAllData(content)) {
                            // Reload all data
                            const savedSettings = getSettings()
                            if (savedSettings) {
                              setSettings(savedSettings)
                              setDays(initializeDays(savedSettings.periodDays, savedSettings.periodStartDate))
                            }
                            const savedBonusSettings = getBonusSettings()
                            if (savedBonusSettings) {
                              setBonusSettings(savedBonusSettings)
                            }
                            const savedDeductionSettings = getDeductionSettings()
                            if (savedDeductionSettings) {
                              setDeductionSettings(savedDeductionSettings)
                            }
                            setSavedPeriods(getPeriods())
                            setMonths(getMonths())
                            const savedDays = getCurrentDays()
                            if (savedDays && savedDays.length > 0) {
                              setDays(savedDays)
                            }
                            alert('Data imported successfully!')
                          } else {
                            alert('Failed to import data. Please check the file format.')
                          }
                        }
                      }
                      reader.readAsText(file)
                    }
                  }
                  input.click()
                }} 
                variant="outline"
              >
                Import Data
              </Button>
            </div>

            <SummaryCards result={result} />
            <ResultCards result={result} />
            <BasePayBreakdown days={days} settings={settings} result={result} />
            <CurrencyConverter 
              settings={settings} 
              result={result} 
              onExchangeRateChange={(rate) => {
                setSettings({ ...settings, exchangeRate: rate })
              }}
            />
          </TabsContent>

          {/* Period Editor Tab */}
          <TabsContent value="period" className="space-y-6">
            <SettingsForm settings={settings} onSettingsChange={setSettings} />
            <PeriodCalendar days={days} startDate={settings.periodStartDate} />
            <DayTable days={days} onUpdateDay={handleUpdateDay} startDate={settings.periodStartDate} />
            <MonthByMonthTable
              months={months}
              onUpdateMonth={(monthId, updates) => {
                setMonths(months.map(month => 
                  month.id === monthId ? { ...month, ...updates } : month
                ))
              }}
              onAddMonth={() => {
                const now = new Date()
                const monthString = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
                const newMonth: MonthEntry = {
                  id: Date.now().toString(),
                  month: monthString,
                  attendanceDays: 0,
                  otHours: 0,
                  notes: "",
                }
                setMonths([...months, newMonth])
              }}
              onDeleteMonth={(monthId) => {
                if (confirm("Delete this month?")) {
                  setMonths(months.filter(month => month.id !== monthId))
                }
              }}
            />
          </TabsContent>

          {/* Bonuses & Deductions Tab */}
          <TabsContent value="bonuses" className="space-y-6">
            <BonusDeductionPanel
              bonusSettings={bonusSettings}
              deductionSettings={deductionSettings}
              mealDeductionAmount={settings.mealDeduction}
              onBonusSettingsChange={setBonusSettings}
              onDeductionSettingsChange={setDeductionSettings}
            />
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-6">
            <HistoryList
              periods={savedPeriods}
              onDelete={handleDeletePeriod}
              onView={handleViewPeriod}
            />
          </TabsContent>
        </Tabs>
      </main>

      {/* Mobile Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t md:hidden z-20 p-4 shadow-lg">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Net Pay</p>
            <p className="text-xl font-bold text-primary">
              {new Intl.NumberFormat('en-SG', {
                style: 'currency',
                currency: 'SGD',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }).format(result.netPay)}
            </p>
          </div>
          <Button onClick={() => setActiveTab("calculator")} className="flex-1">
            Calculate
          </Button>
        </div>
      </div>
    </div>
  )
}

export default App
