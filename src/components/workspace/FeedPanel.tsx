import { Plus, TrendingDown, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Expense, ExpenseCategory } from '../../lib/types'

interface FeedPanelProps {
  expenses: Array<Expense>
  currentUser: string
  userBalance: number
  getCategoryIcon: (category: ExpenseCategory) => React.ReactNode
  onOpenAddBill?: () => void
}

export function FeedPanel({
  expenses,
  currentUser,
  userBalance,
  getCategoryIcon,
  onOpenAddBill,
}: FeedPanelProps) {
  return (
    <>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="neo-card bg-emerald-50 dark:bg-emerald-950/30 p-4 flex flex-col justify-between">
          <span className="text-xs font-bold text-muted-foreground uppercase">
            You are Owed
          </span>
          <div className="flex items-center justify-between mt-2">
            <span className="font-heading text-xl font-black text-emerald-600 dark:text-emerald-400">
              RM {userBalance > 0 ? userBalance.toFixed(2) : '0.00'}
            </span>
            <div className="p-1 rounded bg-emerald-100 dark:bg-emerald-900 neo-border-thin">
              <TrendingUp className="size-4 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
        </div>

        <div className="neo-card bg-orange-50 dark:bg-orange-950/30 p-4 flex flex-col justify-between">
          <span className="text-xs font-bold text-muted-foreground uppercase">
            You Owe
          </span>
          <div className="flex items-center justify-between mt-2">
            <span className="font-heading text-xl font-black text-destructive">
              RM {userBalance < 0 ? Math.abs(userBalance).toFixed(2) : '0.00'}
            </span>
            <div className="p-1 rounded bg-orange-100 dark:bg-orange-900 neo-border-thin">
              <TrendingDown className="size-4 text-destructive" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-3">
        <div>
          <h3 className="font-heading font-black text-base uppercase tracking-wider">
            Recent Expenses
          </h3>
          <span className="text-xs font-bold text-muted-foreground">
            Showing {expenses.length} logs
          </span>
        </div>
        <Button
          onClick={onOpenAddBill}
          variant="secondary"
          size="sm"
          className="neo-btn rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider"
        >
          <Plus className="size-4 mr-2" />
          Add Bill
        </Button>
      </div>

      <div className="flex flex-col gap-3 flex-1 overflow-y-auto pr-1">
        {expenses.map((expense) => {
          const isPayer = expense.payer === currentUser
          const userSplitShare = expense.splits[currentUser] || 0

          return (
            <div
              key={expense.id}
              className="neo-card bg-card p-3.5 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-muted border-2 border-border flex items-center justify-center neo-shadow-sm">
                  {getCategoryIcon(expense.category)}
                </div>
                <div className="text-left">
                  <h4 className="font-bold text-sm text-foreground line-clamp-1">
                    {expense.description}
                  </h4>
                  <span className="text-[10px] font-semibold text-muted-foreground block">
                    {expense.date} • Paid by{' '}
                    <span className="font-bold text-foreground">
                      {expense.payer}
                    </span>
                  </span>
                </div>
              </div>

              <div className="text-right">
                <div className="font-heading font-black text-sm">
                  RM {expense.amount.toFixed(2)}
                </div>
                <div className="text-[10px] font-bold text-muted-foreground">
                  {isPayer
                    ? `You get back RM ${(expense.amount - userSplitShare).toFixed(2)}`
                    : `You owe RM ${userSplitShare.toFixed(2)}`}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}
