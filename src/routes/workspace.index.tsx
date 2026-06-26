// oxlint-disable no-unused-vars
import { createFileRoute } from '@tanstack/react-router'

import { Utensils, Car, Coffee, Check, Sparkles } from 'lucide-react'
import { useState, useMemo } from 'react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FeedPanel } from '../components/workspace/FeedPanel'
import { SettlementsPanel } from '../components/workspace/SettlementsPanel'
import { ManualEntryPanel } from '../components/workspace/ManualEntryPanel'
import type { Expense, Member, ExpenseCategory, Transfer } from '../lib/types'
import {
  defaultExpenses,
  defaultMembers,
  calculateBalancesAndTransfers,
} from '../lib/utils'

export const Route = createFileRoute('/workspace/')({
  component: WorkSpacePage,
})

function WorkSpacePage() {
  const [activeGroup, setActiveGroup] = useState<string>('Penang Food Trip')

  const [members] = useState<Array<Member>>(defaultMembers)
  const [expenses, setExpenses] = useState<Array<Expense>>(defaultExpenses)

  //   const [aiInput, setAiInput] = useState<string>('')
  //   const [isRecording, setIsRecording] = useState<boolean>(false)
  //   const [parsedExpense, setParsedExpense] = useState<ParsedExpense | null>(null)

  const [manualDesc, setManualDesc] = useState<string>('')
  const [manualAmount, setManualAmount] = useState<string>('')
  const [manualPayer, setManualPayer] = useState<string>('Sarah')
  const [manualCategory, setManualCategory] = useState<ExpenseCategory>('food')

  const [showSuccessToast, setShowSuccessToast] = useState<string | null>(null)
  const [settlementSuccess, setSettlementSuccess] = useState<Transfer | null>(
    null,
  )

  //   const voiceSuggestions = [
  //     'Jom split RM120 for Nasi Kandar equally except Sarah who owes RM15',
  //     'Jom split RM80 for Kopitiam Breakfast equally',
  //     'Jom split RM45 for Grab ride equally among Sarah Chloe Dev',
  //   ]

  //   const handleAISpeechParse = (input: string) => {
  //     setParsedExpense(parseAISpeechInput(input, members))
  //   }

  //   const startVoiceRecording = () => {
  //     setIsRecording(true)
  //     setParsedExpense(null)
  //     setAiInput('')

  //     const randomSuggestion =
  //       voiceSuggestions[Math.floor(Math.random() * voiceSuggestions.length)]

  //     let index = 0
  //     const interval = setInterval(() => {
  //       setAiInput((prev) => prev + randomSuggestion.charAt(index))
  //       index++
  //       if (index >= randomSuggestion.length) {
  //         clearInterval(interval)
  //         setIsRecording(false)
  //         handleAISpeechParse(randomSuggestion)
  //       }
  //     }, 40)
  //   }

  //   const confirmParsedExpense = () => {
  //     if (!parsedExpense) return

  //     const newExpense: Expense = {
  //       id: Date.now().toString(),
  //       description: parsedExpense.description,
  //       amount: parsedExpense.amount,
  //       payer: parsedExpense.payer,
  //       date: 'Just now',
  //       category: getCategoryFromDescription(parsedExpense.description),
  //       splits: parsedExpense.splits,
  //     }

  //     setExpenses([newExpense, ...expenses])
  //     setParsedExpense(null)
  //     setAiInput('')
  //     setShowSuccessToast(`Added: "${newExpense.description}"! ⚡`)
  //     setTimeout(() => setShowSuccessToast(null), 3000)
  //   }

  const saveManualExpense = () => {
    const amount = parseFloat(manualAmount)
    if (isNaN(amount) || amount <= 0 || !manualDesc.trim()) return

    const splits: Record<string, number> = {}
    const share = parseFloat((amount / members.length).toFixed(2))
    members.forEach((m) => {
      splits[m.name] = share
    })

    const newExpense: Expense = {
      id: Date.now().toString(),
      description: manualDesc,
      amount,
      payer: manualPayer,
      date: 'Just now',
      category: manualCategory,
      splits,
    }

    setExpenses([newExpense, ...expenses])
    setManualDesc('')
    setManualAmount('')
    setShowSuccessToast(`Added manually: "${newExpense.description}"! ⚡`)
    setTimeout(() => setShowSuccessToast(null), 3000)
  }

  const { balances, transfers } = useMemo(
    () => calculateBalancesAndTransfers(expenses, members),
    [expenses, members],
  )

  const sarahBalance = balances['Sarah'] || 0

  const getCategoryIcon = (category: ExpenseCategory) => {
    switch (category) {
      case 'food':
        return <Utensils className="size-5 text-foreground" />
      case 'transport':
        return <Car className="size-5 text-foreground" />
      default:
        return <Coffee className="size-5 text-foreground" />
    }
  }

  const handleSettleTransfer = (transfer: Transfer) => {
    const settleExpense: Expense = {
      id: Date.now().toString(),
      description: `Settled: ${transfer.from} paid ${transfer.to}`,
      amount: transfer.amount,
      payer: transfer.from,
      date: 'Just now',
      category: 'other',
      splits: { [transfer.to]: transfer.amount },
    }

    setExpenses([settleExpense, ...expenses])
    setSettlementSuccess(transfer)
  }

  return (
    <div>
      {showSuccessToast && (
        <div className="fixed top-4 z-50 neo-card bg-secondary p-3 text-foreground font-bold animate-bounce flex items-center gap-2">
          <Sparkles className="size-5 text-primary" />
          {showSuccessToast}
        </div>
      )}

      <Dialog
        open={!!settlementSuccess}
        onOpenChange={() => setSettlementSuccess(null)}
      >
        <DialogContent className="neo-card bg-card border-4 border-border max-w-[350px] mx-auto text-center p-6">
          <DialogHeader>
            <div className="mx-auto size-16 rounded-full bg-emerald-100 dark:bg-emerald-900 border-4 border-border flex items-center justify-center mb-2 animate-bounce">
              <Check className="size-8 text-emerald-600 dark:text-emerald-300" />
            </div>
            <DialogTitle className="font-heading text-2xl font-black text-center">
              Transfer Sent! ⚡
            </DialogTitle>
            <DialogDescription className="text-foreground font-medium mt-2 text-center">
              <span className="font-bold text-primary">
                {settlementSuccess?.from}
              </span>{' '}
              paid{' '}
              <span className="font-bold text-emerald-600">
                {settlementSuccess?.to}
              </span>{' '}
              <span className="font-extrabold text-lg block mt-1">
                RM {settlementSuccess?.amount.toFixed(2)}
              </span>
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 flex flex-col gap-2">
            <div className="text-xs text-muted-foreground p-2 border-2 border-dashed border-border rounded-lg bg-background">
              The ledger has been simplified and balanced dynamically.
            </div>
            <Button
              className="neo-btn bg-secondary text-foreground font-bold w-full mt-2 h-10"
              onClick={() => setSettlementSuccess(null)}
            >
              Mantap! (Awesome)
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div>
        <div className="px-5 py-3 border-b-4 border-border bg-card flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
              Active Workspace
            </span>
            <div className="flex items-center gap-1.5 cursor-pointer">
              <h2 className="font-heading font-black text-lg text-foreground">
                {activeGroup}
              </h2>
              <div className="bg-primary/10 text-primary px-1.5 py-0.5 rounded text-xs font-bold uppercase tracking-wider">
                👥 {members.length}
              </div>
            </div>
          </div>
          <Button
            variant="outline"
            size="xs"
            className="neo-btn bg-background text-foreground font-bold hover:bg-muted"
            onClick={() =>
              setActiveGroup(
                activeGroup === 'Penang Food Trip'
                  ? 'Roommates Shared'
                  : 'Penang Food Trip',
              )
            }
          >
            Switch
          </Button>
        </div>

        <Tabs defaultValue="feed" className="flex-1 flex flex-col">
          <div className="px-4 py-2 bg-muted/30 border-b-2 border-border">
            <TabsList className="grid grid-cols-3 bg-background border-2 border-border p-1 rounded-xl">
              <TabsTrigger
                value="feed"
                className="rounded-lg py-1.5 font-bold text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-2 data-[state=active]:border-border"
              >
                Feed
              </TabsTrigger>
              <TabsTrigger
                value="settlements"
                className="rounded-lg py-1.5 font-bold text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-2 data-[state=active]:border-border"
              >
                Settle
              </TabsTrigger>
              <TabsTrigger
                value="add"
                className="rounded-lg py-1.5 font-bold text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-2 data-[state=active]:border-border"
              >
                + Bill
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent
            value="feed"
            className="flex-1 flex flex-col p-5 overflow-y-auto max-h-[580px]"
          >
            <FeedPanel
              expenses={expenses}
              currentUser="Sarah"
              userBalance={sarahBalance}
              getCategoryIcon={getCategoryIcon}
            />
          </TabsContent>

          <TabsContent
            value="settlements"
            className="flex-1 p-5 overflow-y-auto max-h-[580px]"
          >
            <div className="flex items-center gap-2 mb-4 bg-primary/10 border-2 border-border p-3 rounded-2xl">
              <Sparkles className="size-5 text-primary fill-primary animate-pulse shrink-0" />
              <div className="text-xs font-bold text-foreground text-left">
                <span className="font-black text-primary">
                  AI Optimization Engine:
                </span>{' '}
                Ledgers have been recalculated to minimize transfer overhead.
              </div>
            </div>
            <SettlementsPanel
              transfers={transfers}
              currentUser="Sarah"
              handleSettleTransfer={handleSettleTransfer}
            />
          </TabsContent>

          <TabsContent
            value="add"
            className="flex-1 p-5 overflow-y-auto max-h-[580px]"
          >
            <ManualEntryPanel
              manualDesc={manualDesc}
              manualAmount={manualAmount}
              manualPayer={manualPayer}
              manualCategory={manualCategory}
              members={members}
              setManualDesc={setManualDesc}
              setManualAmount={setManualAmount}
              setManualPayer={setManualPayer}
              setManualCategory={setManualCategory}
              saveManualExpense={saveManualExpense}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
