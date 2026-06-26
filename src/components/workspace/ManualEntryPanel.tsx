import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { Member, ExpenseCategory } from '../../lib/types'

interface ManualEntryPanelProps {
  manualDesc: string
  manualAmount: string
  manualPayer: string
  manualCategory: ExpenseCategory
  members: Array<Member>
  setManualDesc: (value: string) => void
  setManualAmount: (value: string) => void
  setManualPayer: (value: string) => void
  setManualCategory: (value: ExpenseCategory) => void
  saveManualExpense: () => void
}

const categoryLabels: Record<ExpenseCategory, string> = {
  food: '🍔 Food',
  transport: '🚗 Ride',
  entertainment: '🎉 Fun',
  other: '☕ Other',
}

export function ManualEntryPanel({
  manualDesc,
  manualAmount,
  manualPayer,
  manualCategory,
  members,
  setManualDesc,
  setManualAmount,
  setManualPayer,
  setManualCategory,
  saveManualExpense,
}: ManualEntryPanelProps) {
  return (
    <div className="neo-card bg-card p-4 space-y-4">
      <h3 className="font-heading font-black text-base uppercase tracking-wider mb-2 text-left">
        Log Bill Manually
      </h3>

      <div className="space-y-1.5 text-left">
        <Label
          htmlFor="desc"
          className="font-bold text-xs uppercase tracking-wider"
        >
          Item Description
        </Label>
        <Input
          id="desc"
          placeholder="e.g. Char Kway Teow, Grab Ride"
          value={manualDesc}
          onChange={(e) => setManualDesc(e.target.value)}
          className="border-2 border-border h-10 text-sm focus-visible:ring-0 rounded-xl bg-background"
        />
      </div>

      <div className="grid grid-cols-2 gap-3 text-left">
        <div className="space-y-1.5">
          <Label
            htmlFor="amount"
            className="font-bold text-xs uppercase tracking-wider"
          >
            Amount (RM)
          </Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={manualAmount}
            onChange={(e) => setManualAmount(e.target.value)}
            className="border-2 border-border h-10 text-sm focus-visible:ring-0 rounded-xl bg-background font-mono"
          />
        </div>

        <div className="space-y-1.5 font-bold">
          <Label
            htmlFor="payer"
            className="font-bold text-xs uppercase tracking-wider"
          >
            Who Paid?
          </Label>
          <select
            id="payer"
            value={manualPayer}
            onChange={(e) => setManualPayer(e.target.value)}
            className="flex w-full rounded-xl border-2 border-border bg-background px-3 h-10 text-sm shadow-sm transition-colors focus:outline-none text-foreground font-bold"
          >
            {members.map((m) => (
              <option key={m.name} value={m.name}>
                {m.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-1.5 text-left">
        <div className="font-bold text-xs uppercase tracking-wider block">
          Category
        </div>
        <div className="grid grid-cols-2 gap-2">
          {(['food', 'transport', 'entertainment', 'other'] as const).map(
            (cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setManualCategory(cat)}
                className={`py-2 px-1 rounded-xl text-xs font-bold border-2 border-border uppercase cursor-pointer ${
                  manualCategory === cat
                    ? 'bg-primary text-primary-foreground neo-shadow-sm'
                    : 'bg-background text-foreground'
                }`}
              >
                {categoryLabels[cat]}
              </button>
            ),
          )}
        </div>
      </div>

      <div className="bg-muted/40 p-3 border-2 border-border rounded-xl text-xs font-bold text-muted-foreground text-center">
        This bill will be split equally among all {members.length} members.
      </div>

      <Button
        onClick={saveManualExpense}
        className="neo-btn bg-secondary text-foreground font-bold w-full h-11 text-sm mt-4 uppercase tracking-wider cursor-pointer"
      >
        Log Expense ⚡
      </Button>
    </div>
  )
}
