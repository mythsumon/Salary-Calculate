import { PeriodData, MonthEntry, DayEntry } from '@/types'

const STORAGE_KEY = 'salary-calculator-periods'
const SETTINGS_KEY = 'salary-calculator-settings'
const BONUS_SETTINGS_KEY = 'salary-calculator-bonus-settings'
const DEDUCTION_SETTINGS_KEY = 'salary-calculator-deduction-settings'
const MONTHS_KEY = 'salary-calculator-months'
const CURRENT_DAYS_KEY = 'salary-calculator-current-days'

export function savePeriod(period: PeriodData): void {
  const periods = getPeriods()
  periods.push(period)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(periods))
}

export function getPeriods(): PeriodData[] {
  const data = localStorage.getItem(STORAGE_KEY)
  return data ? JSON.parse(data) : []
}

export function deletePeriod(id: string): void {
  const periods = getPeriods()
  const filtered = periods.filter(p => p.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
}

export function getPeriod(id: string): PeriodData | undefined {
  const periods = getPeriods()
  return periods.find(p => p.id === id)
}

export function saveSettings(settings: any): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
}

export function getSettings(): any {
  const data = localStorage.getItem(SETTINGS_KEY)
  return data ? JSON.parse(data) : null
}

export function saveBonusSettings(settings: any): void {
  localStorage.setItem(BONUS_SETTINGS_KEY, JSON.stringify(settings))
}

export function getBonusSettings(): any {
  const data = localStorage.getItem(BONUS_SETTINGS_KEY)
  return data ? JSON.parse(data) : null
}

export function saveDeductionSettings(settings: any): void {
  localStorage.setItem(DEDUCTION_SETTINGS_KEY, JSON.stringify(settings))
}

export function getDeductionSettings(): any {
  const data = localStorage.getItem(DEDUCTION_SETTINGS_KEY)
  return data ? JSON.parse(data) : null
}

export function saveMonths(months: MonthEntry[]): void {
  localStorage.setItem(MONTHS_KEY, JSON.stringify(months))
}

export function getMonths(): MonthEntry[] {
  const data = localStorage.getItem(MONTHS_KEY)
  return data ? JSON.parse(data) : []
}

export function saveCurrentDays(days: DayEntry[]): void {
  localStorage.setItem(CURRENT_DAYS_KEY, JSON.stringify(days))
}

export function getCurrentDays(): DayEntry[] | null {
  const data = localStorage.getItem(CURRENT_DAYS_KEY)
  return data ? JSON.parse(data) : null
}

// Export all data for backup
export function exportAllData(): string {
  const allData = {
    settings: getSettings(),
    bonusSettings: getBonusSettings(),
    deductionSettings: getDeductionSettings(),
    months: getMonths(),
    periods: getPeriods(),
    currentDays: getCurrentDays(),
    exportDate: new Date().toISOString(),
  }
  return JSON.stringify(allData, null, 2)
}

// Import all data from backup
export function importAllData(jsonData: string): boolean {
  try {
    const data = JSON.parse(jsonData)
    
    if (data.settings) {
      saveSettings(data.settings)
    }
    if (data.bonusSettings) {
      saveBonusSettings(data.bonusSettings)
    }
    if (data.deductionSettings) {
      saveDeductionSettings(data.deductionSettings)
    }
    if (data.months) {
      saveMonths(data.months)
    }
    if (data.periods) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data.periods))
    }
    if (data.currentDays) {
      saveCurrentDays(data.currentDays)
    }
    
    return true
  } catch (error) {
    console.error('Failed to import data:', error)
    return false
  }
}

// Clear all data
export function clearAllData(): void {
  localStorage.removeItem(STORAGE_KEY)
  localStorage.removeItem(SETTINGS_KEY)
  localStorage.removeItem(BONUS_SETTINGS_KEY)
  localStorage.removeItem(DEDUCTION_SETTINGS_KEY)
  localStorage.removeItem(MONTHS_KEY)
  localStorage.removeItem(CURRENT_DAYS_KEY)
}
