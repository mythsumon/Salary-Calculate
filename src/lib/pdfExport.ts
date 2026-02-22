import jsPDF from 'jspdf'
import { PeriodData, CalculationResult } from '@/types'
import { formatCurrency } from './utils'
import { format } from 'date-fns'

export function exportToPDF(period: PeriodData, result: CalculationResult) {
  const doc = new jsPDF()
  
  // Title
  doc.setFontSize(18)
  doc.text('Salary Calculation Report', 14, 20)
  
  // Payment Month and Period Range
  doc.setFontSize(10)
  const periodDateStr = period.date || new Date().toISOString()
  const periodDate = new Date(periodDateStr)
  const paymentMonth = format(periodDate, 'MMMM yyyy')
  doc.text(`${paymentMonth} Payment`, 14, 30)
  
  // Show period range if available
  if (period.settings?.periodStartDate && period.settings?.periodEndDate) {
    const startDate = new Date(period.settings.periodStartDate)
    const endDate = new Date(period.settings.periodEndDate)
    doc.text(`Period: ${format(startDate, 'MMM d')} - ${format(endDate, 'MMM d, yyyy')}`, 14, 37)
  } else {
    doc.text(`Period: ${format(periodDate, 'PPP')}`, 14, 37)
  }
  
  let y = 45
  
  // Summary
  doc.setFontSize(14)
  doc.text('Summary', 14, y)
  y += 10
  
  doc.setFontSize(10)
  doc.text(`Total Days: ${result.totalDays}`, 14, y)
  y += 7
  doc.text(`Attended Days: ${result.attendedDays}`, 14, y)
  y += 7
  doc.text(`Absent Days: ${result.absentDays}`, 14, y)
  y += 7
  doc.text(`Total OT Hours: ${result.totalOTHours.toFixed(2)}`, 14, y)
  y += 10
  
  // Calculations
  doc.setFontSize(14)
  doc.text('Calculations', 14, y)
  y += 10
  
  doc.setFontSize(10)
  doc.text(`Base Pay: ${formatCurrency(result.basePay)}`, 14, y)
  y += 7
  doc.text(`OT Pay: ${formatCurrency(result.otPay)}`, 14, y)
  y += 7
  doc.text(`Gross Pay: ${formatCurrency(result.grossPay)}`, 14, y)
  y += 10
  
  if (result.bonusesTotal > 0) {
    doc.text(`Bonuses: ${formatCurrency(result.bonusesTotal)}`, 14, y)
    y += 7
  }
  
  if (result.deductionsTotal > 0) {
    doc.text(`Deductions: ${formatCurrency(result.deductionsTotal)}`, 14, y)
    y += 7
  }
  
  y += 5
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text(`Net Pay: ${formatCurrency(result.netPay)}`, 14, y)
  
  // Save
  const reportDate = format(periodDate, 'yyyy-MM-dd')
  doc.save(`salary-report-${reportDate}.pdf`)
}
