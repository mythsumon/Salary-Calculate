import { BonusSettings, DeductionSettings, CustomBonus, CustomDeduction } from "@/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Plus, Trash2 } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

interface BonusDeductionPanelProps {
  bonusSettings: BonusSettings
  deductionSettings: DeductionSettings
  mealDeductionAmount: number
  onBonusSettingsChange: (settings: BonusSettings) => void
  onDeductionSettingsChange: (settings: DeductionSettings) => void
}

export function BonusDeductionPanel({
  bonusSettings,
  deductionSettings,
  mealDeductionAmount,
  onBonusSettingsChange,
  onDeductionSettingsChange,
}: BonusDeductionPanelProps) {
  const addCustomBonus = () => {
    const newBonus: CustomBonus = {
      id: Date.now().toString(),
      name: "",
      amount: 0,
    }
    onBonusSettingsChange({
      ...bonusSettings,
      customBonuses: [...bonusSettings.customBonuses, newBonus],
    })
  }

  const removeCustomBonus = (id: string) => {
    onBonusSettingsChange({
      ...bonusSettings,
      customBonuses: bonusSettings.customBonuses.filter((b) => b.id !== id),
    })
  }

  const updateCustomBonus = (id: string, updates: Partial<CustomBonus>) => {
    onBonusSettingsChange({
      ...bonusSettings,
      customBonuses: bonusSettings.customBonuses.map((b) =>
        b.id === id ? { ...b, ...updates } : b
      ),
    })
  }

  const addCustomDeduction = () => {
    const newDeduction: CustomDeduction = {
      id: Date.now().toString(),
      name: "",
      amount: 0,
    }
    onDeductionSettingsChange({
      ...deductionSettings,
      customDeductions: [...deductionSettings.customDeductions, newDeduction],
    })
  }

  const removeCustomDeduction = (id: string) => {
    onDeductionSettingsChange({
      ...deductionSettings,
      customDeductions: deductionSettings.customDeductions.filter((d) => d.id !== id),
    })
  }

  const updateCustomDeduction = (id: string, updates: Partial<CustomDeduction>) => {
    onDeductionSettingsChange({
      ...deductionSettings,
      customDeductions: deductionSettings.customDeductions.map((d) =>
        d.id === id ? { ...d, ...updates } : d
      ),
    })
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Bonuses */}
      <Card>
        <CardHeader>
          <CardTitle>Bonuses</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Perfect Attendance Bonus */}
          <div className="flex items-center justify-between space-x-2">
            <div className="flex-1">
              <Label htmlFor="perfect-attendance">Perfect Attendance Bonus</Label>
              <p className="text-xs text-muted-foreground mt-1">
                Awarded if all days are attended
              </p>
            </div>
            <Switch
              id="perfect-attendance"
              checked={bonusSettings.perfectAttendanceEnabled}
              onChange={(e) => {
                onBonusSettingsChange({
                  ...bonusSettings,
                  perfectAttendanceEnabled: e.target.checked,
                })
              }}
            />
          </div>
          {bonusSettings.perfectAttendanceEnabled && (
            <div>
              <Label htmlFor="perfect-attendance-amount">Amount (SGD)</Label>
              <Input
                id="perfect-attendance-amount"
                type="number"
                min="0"
                step="0.01"
                value={bonusSettings.perfectAttendanceAmount}
                onChange={(e) => {
                  onBonusSettingsChange({
                    ...bonusSettings,
                    perfectAttendanceAmount: parseFloat(e.target.value) || 0,
                  })
                }}
                className="mt-1"
              />
            </div>
          )}

          {/* Custom Bonuses */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Custom Bonuses</Label>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={addCustomBonus}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>
            <div className="space-y-2">
              {bonusSettings.customBonuses.map((bonus) => (
                <div key={bonus.id} className="flex gap-2 items-end">
                  <Input
                    placeholder="Bonus name"
                    value={bonus.name}
                    onChange={(e) =>
                      updateCustomBonus(bonus.id, { name: e.target.value })
                    }
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Amount"
                    value={bonus.amount}
                    onChange={(e) =>
                      updateCustomBonus(bonus.id, {
                        amount: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-24"
                  />
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={() => removeCustomBonus(bonus.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {bonusSettings.customBonuses.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No custom bonuses added
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Deductions */}
      <Card>
        <CardHeader>
          <CardTitle>Deductions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Meal Deduction */}
          <div className="flex items-center justify-between space-x-2">
            <div className="flex-1">
              <Label htmlFor="meal-deduction">Meal Deduction</Label>
              <p className="text-xs text-muted-foreground mt-1">
                Default: {formatCurrency(mealDeductionAmount)} per period
              </p>
            </div>
            <Switch
              id="meal-deduction"
              checked={deductionSettings.mealDeductionEnabled}
              onChange={(e) => {
                onDeductionSettingsChange({
                  ...deductionSettings,
                  mealDeductionEnabled: e.target.checked,
                })
              }}
            />
          </div>

          {/* Custom Deductions */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Custom Deductions</Label>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={addCustomDeduction}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>
            <div className="space-y-2">
              {deductionSettings.customDeductions.map((deduction) => (
                <div key={deduction.id} className="flex gap-2 items-end">
                  <Input
                    placeholder="Deduction name"
                    value={deduction.name}
                    onChange={(e) =>
                      updateCustomDeduction(deduction.id, { name: e.target.value })
                    }
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Amount"
                    value={deduction.amount}
                    onChange={(e) =>
                      updateCustomDeduction(deduction.id, {
                        amount: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-24"
                  />
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={() => removeCustomDeduction(deduction.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {deductionSettings.customDeductions.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No custom deductions added
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
