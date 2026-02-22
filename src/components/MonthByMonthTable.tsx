import { MonthEntry } from "@/types"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Trash2 } from "lucide-react"

interface MonthByMonthTableProps {
  months: MonthEntry[]
  onUpdateMonth: (monthId: string, updates: Partial<MonthEntry>) => void
  onAddMonth: () => void
  onDeleteMonth: (monthId: string) => void
}

export function MonthByMonthTable({ months, onUpdateMonth, onAddMonth, onDeleteMonth }: MonthByMonthTableProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Month by Month Calculator</CardTitle>
          <Button onClick={onAddMonth} size="sm" variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add Month
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[150px]">Month</TableHead>
                <TableHead className="w-[120px]">Attendance Days</TableHead>
                <TableHead className="w-[120px]">OT Hours</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead className="w-[80px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {months.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                    No months added. Click "Add Month" to get started.
                  </TableCell>
                </TableRow>
              ) : (
                months.map((month) => (
                  <TableRow key={month.id}>
                    <TableCell>
                      <Input
                        type="month"
                        value={month.month}
                        onChange={(e) => {
                          onUpdateMonth(month.id, { month: e.target.value })
                        }}
                        className="w-full"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min="0"
                        max="31"
                        step="1"
                        value={month.attendanceDays}
                        onChange={(e) => {
                          const attendanceDays = Math.max(0, Math.min(31, parseInt(e.target.value) || 0))
                          onUpdateMonth(month.id, { attendanceDays })
                        }}
                        className="w-20"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min="0"
                        max="744"
                        step="0.5"
                        value={month.otHours}
                        onChange={(e) => {
                          const otHours = Math.max(0, Math.min(744, parseFloat(e.target.value) || 0))
                          onUpdateMonth(month.id, { otHours })
                        }}
                        className="w-20"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="text"
                        placeholder="Optional notes..."
                        value={month.notes || ""}
                        onChange={(e) => {
                          onUpdateMonth(month.id, { notes: e.target.value })
                        }}
                        className="min-w-[200px]"
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        onClick={() => onDeleteMonth(month.id)}
                        size="sm"
                        variant="ghost"
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
