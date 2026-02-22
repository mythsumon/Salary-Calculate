import { Settings, CalculationResult } from "@/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { formatCurrency } from "@/lib/utils"

interface CurrencyConverterProps {
  settings: Settings
  result: CalculationResult
  onExchangeRateChange: (rate: number) => void
}

export function CurrencyConverter({ settings, result, onExchangeRateChange }: CurrencyConverterProps) {
  const exchangeRate = settings.exchangeRate || 3000
  const netPayMMK = result.netPay * exchangeRate
  const grossPayMMK = result.grossPay * exchangeRate
  const basePayMMK = result.basePay * exchangeRate
  const otPayMMK = result.otPay * exchangeRate
  const sundayPayMMK = result.sundayPayTotal * exchangeRate
  const bonusesMMK = result.bonusesTotal * exchangeRate
  const deductionsMMK = result.deductionsTotal * exchangeRate

  return (
    <Card>
      <CardHeader>
        <CardTitle>Currency Exchange (SGD to MMK)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="exchangeRate">Exchange Rate (1 SGD = MMK)</Label>
          <Input
            id="exchangeRate"
            type="number"
            min="0"
            step="0.01"
            value={exchangeRate}
            onChange={(e) => {
              const rate = Math.max(0, parseFloat(e.target.value) || 0)
              onExchangeRateChange(rate)
            }}
            className="mt-1"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Current rate: 1 SGD = {exchangeRate.toLocaleString()} MMK
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Base Pay:</span>
              <span className="font-semibold">
                {formatCurrency(result.basePay)} SGD = {basePayMMK.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} MMK
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">OT Pay:</span>
              <span className="font-semibold">
                {formatCurrency(result.otPay)} SGD = {otPayMMK.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} MMK
              </span>
            </div>
            {result.sundayPayTotal > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Sunday Pay:</span>
                <span className="font-semibold">
                  {formatCurrency(result.sundayPayTotal)} SGD = {sundayPayMMK.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} MMK
                </span>
              </div>
            )}
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Gross Pay:</span>
              <span className="font-semibold text-lg">
                {formatCurrency(result.grossPay)} SGD = {grossPayMMK.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} MMK
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Bonuses:</span>
              <span className="font-semibold text-green-600 dark:text-green-400">
                {formatCurrency(result.bonusesTotal)} SGD = {bonusesMMK.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} MMK
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Deductions:</span>
              <span className="font-semibold text-red-600 dark:text-red-400">
                {formatCurrency(result.deductionsTotal)} SGD = {deductionsMMK.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} MMK
              </span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t">
              <span className="text-base font-semibold">Net Pay:</span>
              <span className="font-bold text-lg text-primary">
                {formatCurrency(result.netPay)} SGD = {netPayMMK.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} MMK
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
