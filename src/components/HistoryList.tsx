import { PeriodData } from "@/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"
import { format } from "date-fns"
import { Trash2, Eye } from "lucide-react"

interface HistoryListProps {
  periods: PeriodData[]
  onDelete: (id: string) => void
  onView: (period: PeriodData) => void
}

export function HistoryList({ periods, onDelete, onView }: HistoryListProps) {
  if (periods.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">No saved periods yet</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {periods.map((period) => (
        <Card key={period.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">
                  {format(new Date(period.date), "PPP")}
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {period.periodDays} days • {period.attendedDays} attended
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onView(period)}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDelete(period.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Gross Pay</p>
                <p className="font-semibold">{formatCurrency(period.grossPay)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Bonuses</p>
                <p className="font-semibold text-green-600 dark:text-green-400">
                  {formatCurrency(period.bonusesTotal)}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Deductions</p>
                <p className="font-semibold text-red-600 dark:text-red-400">
                  {formatCurrency(period.deductionsTotal)}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Net Pay</p>
                <p className="font-semibold text-primary text-lg">
                  {formatCurrency(period.netPay)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
