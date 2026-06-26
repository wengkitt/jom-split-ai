import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import {
  Mic,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  Sun,
  Moon,
  Utensils,
  Car,
  Coffee,
  Check,
  Sparkles,
  Smile,
  QrCode,
  Send,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

export const Route = createFileRoute('/')({ component: JomSplitHome })

// Types
interface Expense {
  id: string
  description: string
  amount: number
  payer: string
  date: string
  category: 'food' | 'transport' | 'entertainment' | 'other'
  splits: { [name: string]: number }
}

interface Member {
  name: string
  avatar: string
}

function JomSplitHome() {
  // State
  const [darkMode, setDarkMode] = React.useState<boolean>(false)
  const [activeGroup, setActiveGroup] =
    React.useState<string>('Penang Food Trip')

  const [members] = React.useState<Array<Member>>([
    { name: 'Sarah', avatar: 'S' },
    { name: 'Ben', avatar: 'B' },
    { name: 'Chloe', avatar: 'C' },
    { name: 'Dev', avatar: 'D' },
  ])

  const [expenses, setExpenses] = React.useState<Array<Expense>>([
    {
      id: '1',
      description: 'Gurney Drive Hawkers',
      amount: 145.2,
      payer: 'Sarah',
      date: 'Today, 19:30',
      category: 'food',
      splits: { Sarah: 36.3, Ben: 36.3, Chloe: 36.3, Dev: 36.3 },
    },
    {
      id: '2',
      description: 'Kopitiam Breakfast',
      amount: 68.8,
      payer: 'Ben',
      date: 'Today, 09:15',
      category: 'food',
      splits: { Sarah: 17.2, Ben: 17.2, Chloe: 17.2, Dev: 17.2 },
    },
    {
      id: '3',
      description: 'Char Kway Teow',
      amount: 112.5,
      payer: 'Chloe',
      date: 'Yesterday, 18:45',
      category: 'food',
      splits: { Sarah: 37.5, Ben: 37.5, Chloe: 37.5 },
    },
    {
      id: '4',
      description: 'Durian Feast',
      amount: 210.0,
      payer: 'Sarah',
      date: 'Yesterday, 16:10',
      category: 'food',
      splits: { Sarah: 52.5, Ben: 52.5, Chloe: 52.5, Dev: 52.5 },
    },
    {
      id: '5',
      description: 'Grab Rides',
      amount: 95.0,
      payer: 'Dev',
      date: 'Yesterday, 14:00',
      category: 'transport',
      splits: { Sarah: 23.75, Ben: 23.75, Chloe: 23.75, Dev: 23.75 },
    },
  ])

  // AI Voice State
  const [aiInput, setAiInput] = React.useState<string>('')
  const [isRecording, setIsRecording] = React.useState<boolean>(false)
  const [parsedExpense, setParsedExpense] = React.useState<{
    description: string
    amount: number
    payer: string
    splits: { [name: string]: number }
    exceptName: string
    exceptAmount: number
  } | null>(null)

  // Manual Entry State
  const [manualDesc, setManualDesc] = React.useState<string>('')
  const [manualAmount, setManualAmount] = React.useState<string>('')
  const [manualPayer, setManualPayer] = React.useState<string>('Sarah')
  const [manualCategory, setManualCategory] = React.useState<
    'food' | 'transport' | 'entertainment' | 'other'
  >('food')

  // Success states
  const [showSuccessToast, setShowSuccessToast] = React.useState<string | null>(
    null,
  )
  const [settlementSuccess, setSettlementSuccess] = React.useState<{
    from: string
    to: string
    amount: number
  } | null>(null)

  // Toggle Dark Mode Class
  React.useEffect(() => {
    const root = window.document.documentElement
    if (darkMode) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [darkMode])

  // AI speech parsing simulator
  const handleAISpeechParse = (input: string) => {
    // Parser pattern examples:
    // "Jom split RM120 for Nasi Kandar equally except Sarah who owes RM15"
    // "Jom split RM80 for Toast Box equally"

    // Extract amount
    const amountRegex = /(?:RM\s*)?(\d+(?:\.\d+)?)/i
    const amountMatch = input.match(amountRegex)
    const amount = amountMatch ? parseFloat(amountMatch[1]) : 0

    // Extract description
    let description = 'Group expense'
    if (input.toLowerCase().includes('for')) {
      const matchFor = input.match(/for\s+([^e.]+)(?:equally|except|$)/i)
      if (matchFor) {
        description = matchFor[1].trim()
      }
    } else if (input.toLowerCase().includes('split')) {
      const matchSplit = input.match(
        /split\s+(?:RM\s*\d+)?\s*(?:for\s+)?([^e.]+)(?:equally|except|$)/i,
      )
      if (matchSplit) {
        description = matchSplit[1].trim()
      }
    }

    // Default payer is current user (Sarah)
    const payer = 'Sarah'

    // Check exception rules (who owes what)
    const exceptRegex =
      /except\s+([A-Za-z]+)\s+(?:who\s+)?(?:only\s+)?owes\s+(?:RM\s*)?(\d+(?:\.\d+)?)/i
    const exceptMatch = input.match(exceptRegex)

    const splits: { [name: string]: number } = {}
    let exceptName = ''
    let exceptAmount = 0

    const memberNames = members.map((m) => m.name)

    if (exceptMatch) {
      exceptName =
        members.find(
          (m) => m.name.toLowerCase() === exceptMatch[1].toLowerCase(),
        )?.name || exceptMatch[1]
      exceptAmount = parseFloat(exceptMatch[2])

      splits[exceptName] = exceptAmount
      const remaining = amount - exceptAmount
      const restMembers = memberNames.filter((name) => name !== exceptName)
      const share = parseFloat((remaining / restMembers.length).toFixed(2))

      restMembers.forEach((name) => {
        splits[name] = share
      })
    } else {
      // Split equally among everyone
      const share = parseFloat((amount / members.length).toFixed(2))
      memberNames.forEach((name) => {
        splits[name] = share
      })
    }

    setParsedExpense({
      description,
      amount,
      payer,
      splits,
      exceptName,
      exceptAmount,
    })
  }

  // Predefined triggers for voice demo
  const voiceSuggestions = [
    'Jom split RM120 for Nasi Kandar equally except Sarah who owes RM15',
    'Jom split RM80 for Kopitiam Breakfast equally',
    'Jom split RM45 for Grab ride equally among Sarah Chloe Dev',
  ]

  // Start voice transcription simulator
  const startVoiceRecording = () => {
    setIsRecording(true)
    setParsedExpense(null)
    setAiInput('')

    // Pick random suggestion to type out
    const randomSuggestion =
      voiceSuggestions[Math.floor(Math.random() * voiceSuggestions.length)]

    let index = 0
    const interval = setInterval(() => {
      setAiInput((prev) => prev + randomSuggestion.charAt(index))
      index++
      if (index >= randomSuggestion.length) {
        clearInterval(interval)
        setIsRecording(false)
        handleAISpeechParse(randomSuggestion)
      }
    }, 40)
  }

  // Confirm and insert parsed expense
  const confirmParsedExpense = () => {
    if (!parsedExpense) return

    const newExpense: Expense = {
      id: Date.now().toString(),
      description: parsedExpense.description,
      amount: parsedExpense.amount,
      payer: parsedExpense.payer,
      date: 'Just now',
      category:
        parsedExpense.description.toLowerCase().includes('ride') ||
        parsedExpense.description.toLowerCase().includes('grab')
          ? 'transport'
          : 'food',
      splits: parsedExpense.splits,
    }

    setExpenses([newExpense, ...expenses])
    setParsedExpense(null)
    setAiInput('')
    setShowSuccessToast(`Added: "${newExpense.description}"! ⚡`)
    setTimeout(() => setShowSuccessToast(null), 3000)
  }

  // Save manual expense
  const saveManualExpense = () => {
    const amount = parseFloat(manualAmount)
    if (isNaN(amount) || amount <= 0 || !manualDesc.trim()) return

    const splits: { [name: string]: number } = {}
    const share = parseFloat((amount / members.length).toFixed(2))
    members.forEach((m) => {
      splits[m.name] = share
    })

    const newExpense: Expense = {
      id: Date.now().toString(),
      description: manualDesc,
      amount: amount,
      payer: manualPayer,
      date: 'Just now',
      category: manualCategory,
      splits: splits,
    }

    setExpenses([newExpense, ...expenses])
    setManualDesc('')
    setManualAmount('')
    setShowSuccessToast(`Added manually: "${newExpense.description}"! ⚡`)
    setTimeout(() => setShowSuccessToast(null), 3000)
  }

  // DEBT SIMPLIFICATION ENGINE
  const { balances, transfers } = React.useMemo(() => {
    // 1. Calculate net balances
    const netBalances: { [name: string]: number } = {}
    members.forEach((m) => {
      netBalances[m.name] = 0
    })

    expenses.forEach((exp) => {
      // Add paid amount
      if (exp.payer in netBalances) {
        netBalances[exp.payer] += exp.amount
      }
      // Subtract split amounts
      Object.keys(exp.splits).forEach((name) => {
        if (name in netBalances) {
          netBalances[name] -= exp.splits[name]
        }
      })
    })

    // 2. Simplify ledgers greedily
    const debtors = Object.keys(netBalances)
      .map((name) => ({ name, balance: netBalances[name] }))
      .filter((x) => x.balance < -0.01)
      .sort((a, b) => a.balance - b.balance) // most negative first

    const creditors = Object.keys(netBalances)
      .map((name) => ({ name, balance: netBalances[name] }))
      .filter((x) => x.balance > 0.01)
      .sort((a, b) => b.balance - a.balance) // most positive first

    const simplifiedTransfers: Array<{
      from: string
      to: string
      amount: number
    }> = []

    let i = 0 // debtor pointer
    let j = 0 // creditor pointer

    while (i < debtors.length && j < creditors.length) {
      const debtor = debtors[i]
      const creditor = creditors[j]

      const oweAmount = -debtor.balance
      const creditAmount = creditor.balance

      const transferAmount = Math.min(oweAmount, creditAmount)

      if (transferAmount > 0.01) {
        simplifiedTransfers.push({
          from: debtor.name,
          to: creditor.name,
          amount: parseFloat(transferAmount.toFixed(2)),
        })
      }

      debtor.balance += transferAmount
      creditor.balance -= transferAmount

      if (Math.abs(debtor.balance) < 0.01) i++
      if (Math.abs(creditor.balance) < 0.01) j++
    }

    return { balances: netBalances, transfers: simplifiedTransfers }
  }, [expenses, members])

  // Get user's active summary (Sarah is the current viewer)
  const sarahBalance = balances['Sarah'] || 0

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'food':
        return <Utensils className="size-5 text-foreground" />
      case 'transport':
        return <Car className="size-5 text-foreground" />
      default:
        return <Coffee className="size-5 text-foreground" />
    }
  }

  // Handle settling up a path
  const handleSettleTransfer = (transfer: {
    from: string
    to: string
    amount: number
  }) => {
    // Simulate paying off
    // We add a balancing virtual expense to reset the specific debt path
    const settleExpense: Expense = {
      id: Date.now().toString(),
      description: `Settled: ${transfer.from} paid ${transfer.to}`,
      amount: transfer.amount,
      payer: transfer.from,
      date: 'Just now',
      category: 'other',
      splits: { [transfer.to]: transfer.amount }, // Entirely split to the creditor
    }

    setExpenses([settleExpense, ...expenses])
    setSettlementSuccess(transfer)
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex justify-center py-0 sm:py-8 transition-colors duration-300">
      {/* Toast Notification */}
      {showSuccessToast && (
        <div className="fixed top-4 z-50 neo-card bg-secondary p-3 text-foreground font-bold animate-bounce flex items-center gap-2">
          <Sparkles className="size-5 text-primary" />
          {showSuccessToast}
        </div>
      )}

      {/* Settlement Success Dialog */}
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

      {/* Main Mobile frame */}
      <div className="w-full max-w-[420px] bg-background sm:rounded-[32px] neo-border-thick overflow-hidden flex flex-col min-h-screen sm:min-h-[850px] shadow-2xl relative">
        {/* App Header */}
        <header className="px-5 py-4 bg-primary text-primary-foreground border-b-4 border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-secondary p-1.5 rounded-xl neo-border-thin neo-shadow-sm rotate-[-4deg]">
              <span className="text-lg font-black text-foreground">J!</span>
            </div>
            <h1 className="font-heading text-2xl font-black tracking-tight">
              JomSplitAI
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-xl bg-background border-2 border-border text-foreground neo-shadow-sm active:translate-y-0.5 active:translate-x-0.5 active:shadow-none transition-all cursor-pointer"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <Sun className="size-4" />
              ) : (
                <Moon className="size-4" />
              )}
            </button>
            <div className="size-9 rounded-full neo-border-thin bg-secondary flex items-center justify-center font-bold text-foreground">
              S
            </div>
          </div>
        </header>

        {/* Group Selector Sub-header */}
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
                👥 4
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

        {/* Tabs for Feed, optimized settlement, and manual entry */}
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

          {/* TAB 1: MAIN DASHBOARD */}
          <TabsContent
            value="feed"
            className="flex-1 flex flex-col p-5 overflow-y-auto max-h-[580px]"
          >
            {/* Quick Balances Summary Cards */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {/* Owed Card (Green) */}
              <div className="neo-card bg-emerald-50 dark:bg-emerald-950/30 p-4 flex flex-col justify-between">
                <span className="text-xs font-bold text-muted-foreground uppercase">
                  You are Owed
                </span>
                <div className="flex items-center justify-between mt-2">
                  <span className="font-heading text-xl font-black text-emerald-600 dark:text-emerald-400">
                    RM {sarahBalance > 0 ? sarahBalance.toFixed(2) : '0.00'}
                  </span>
                  <div className="p-1 rounded bg-emerald-100 dark:bg-emerald-900 neo-border-thin">
                    <TrendingUp className="size-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                </div>
              </div>

              {/* Owe Card (Orange/Red) */}
              <div className="neo-card bg-orange-50 dark:bg-orange-950/30 p-4 flex flex-col justify-between">
                <span className="text-xs font-bold text-muted-foreground uppercase">
                  You Owe
                </span>
                <div className="flex items-center justify-between mt-2">
                  <span className="font-heading text-xl font-black text-destructive">
                    RM{' '}
                    {sarahBalance < 0
                      ? Math.abs(sarahBalance).toFixed(2)
                      : '0.00'}
                  </span>
                  <div className="p-1 rounded bg-orange-100 dark:bg-orange-900 neo-border-thin">
                    <TrendingDown className="size-4 text-destructive" />
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Expenses List Title */}
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-heading font-black text-base uppercase tracking-wider">
                Recent Expenses
              </h3>
              <span className="text-xs font-bold text-muted-foreground">
                Showing {expenses.length} logs
              </span>
            </div>

            {/* Expenses List */}
            <div className="flex flex-col gap-3 flex-1 overflow-y-auto pr-1">
              {expenses.map((expense) => {
                const isPayer = expense.payer === 'Sarah'
                const userSplitShare = expense.splits['Sarah'] || 0

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
          </TabsContent>

          {/* TAB 2: OPTIMIZED SETTLEMENT PATHS */}
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

            {transfers.length === 0 ? (
              <div className="neo-card bg-emerald-50 dark:bg-emerald-950/20 p-8 text-center border-dashed border-4 flex flex-col items-center gap-2">
                <Smile className="size-12 text-emerald-500" />
                <h4 className="font-heading font-black text-lg text-emerald-600 dark:text-emerald-400">
                  Semua Setel!
                </h4>
                <p className="text-xs text-muted-foreground font-semibold">
                  Everyone is square. No debts to pay right now.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <h3 className="font-heading font-black text-sm uppercase tracking-wider mb-1 text-left">
                  Optimized Payment Routing
                </h3>

                {transfers.map((transfer, idx) => {
                  const isUserSender = transfer.from === 'Sarah'
                  const isUserReceiver = transfer.to === 'Sarah'

                  return (
                    <div
                      key={idx}
                      className={`neo-card p-4 relative ${
                        isUserSender
                          ? 'bg-orange-50 dark:bg-orange-950/20'
                          : isUserReceiver
                            ? 'bg-emerald-50 dark:bg-emerald-950/20'
                            : 'bg-card'
                      }`}
                    >
                      {/* Flow Route visuals */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex flex-col items-center gap-1">
                          <div className="size-10 rounded-full border-2 border-border bg-secondary flex items-center justify-center font-extrabold text-foreground">
                            {transfer.from[0]}
                          </div>
                          <span className="text-xs font-bold">
                            {transfer.from}
                          </span>
                          <span className="text-[9px] font-bold text-destructive uppercase">
                            To Pay
                          </span>
                        </div>

                        <div className="flex-1 flex flex-col items-center justify-center px-2">
                          <span className="font-heading font-black text-base text-primary">
                            RM {transfer.amount.toFixed(2)}
                          </span>
                          <div className="w-full flex items-center justify-center relative mt-1">
                            <div className="h-1 bg-border w-full rounded-full"></div>
                            <ArrowRight className="size-4 absolute right-0 text-foreground bg-background rounded-full border border-border" />
                          </div>
                        </div>

                        <div className="flex flex-col items-center gap-1">
                          <div className="size-10 rounded-full border-2 border-border bg-primary text-primary-foreground flex items-center justify-center font-extrabold">
                            {transfer.to[0]}
                          </div>
                          <span className="text-xs font-bold">
                            {transfer.to}
                          </span>
                          <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                            To Receive
                          </span>
                        </div>
                      </div>

                      {/* Payment Actions */}
                      {isUserSender && (
                        <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t-2 border-border border-dashed">
                          <Button
                            className="neo-btn bg-secondary text-foreground font-bold h-8 text-xs flex items-center gap-1 cursor-pointer"
                            onClick={() => handleSettleTransfer(transfer)}
                          >
                            <Send className="size-3.5" />
                            TnG eWallet
                          </Button>
                          <Button
                            className="neo-btn bg-emerald-500 text-foreground font-bold h-8 text-xs flex items-center gap-1 cursor-pointer"
                            onClick={() => handleSettleTransfer(transfer)}
                          >
                            <QrCode className="size-3.5" />
                            DuitNow QR
                          </Button>
                        </div>
                      )}

                      {!isUserSender && (
                        <div className="text-center text-[10px] font-bold text-muted-foreground mt-2 border-t border-border border-dashed pt-2">
                          {transfer.from} is responsible for transferring this.
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </TabsContent>

          {/* TAB 3: MANUAL EXPENSE FORM */}
          <TabsContent
            value="add"
            className="flex-1 p-5 overflow-y-auto max-h-[580px]"
          >
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
                <Label className="font-bold text-xs uppercase tracking-wider block">
                  Category
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  {(
                    ['food', 'transport', 'entertainment', 'other'] as const
                  ).map((cat) => {
                    const labels = {
                      food: '🍔 Food',
                      transport: '🚗 Ride',
                      entertainment: '🎉 Fun',
                      other: '☕ Other',
                    }
                    return (
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
                        {labels[cat]}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="bg-muted/40 p-3 border-2 border-border rounded-xl text-xs font-bold text-muted-foreground text-center">
                This bill will be split equally among all {members.length}{' '}
                members.
              </div>

              <Button
                onClick={saveManualExpense}
                className="neo-btn bg-secondary text-foreground font-bold w-full h-11 text-sm mt-4 uppercase tracking-wider cursor-pointer"
              >
                Log Expense ⚡
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        {/* Dynamic Sticky Voice CTA (Drawer Trigger) */}
        <div className="absolute bottom-4 left-0 right-0 px-6 flex justify-center z-40">
          <Drawer>
            <DrawerTrigger asChild>
              <button className="neo-btn bg-secondary hover:bg-secondary/95 text-foreground font-black text-sm px-6 h-12 rounded-full flex items-center justify-center gap-2 shadow-lg w-full max-w-[280px] cursor-pointer">
                <Mic className="size-5 fill-foreground text-foreground animate-pulse" />
                Jom, Speak to Split
              </button>
            </DrawerTrigger>
            <DrawerContent className="neo-card bg-card border-t-4 border-x-4 border-border rounded-t-3xl max-h-[85vh] p-6 focus-visible:outline-none">
              <DrawerHeader className="p-0 text-center">
                <DrawerTitle className="font-heading text-2xl font-black text-center flex items-center justify-center gap-2">
                  AI Conversational Split ⚡
                </DrawerTitle>
                <DrawerDescription className="text-center font-medium mt-1">
                  Hold or tap the microphone to dictate your bill
                  conversationally.
                </DrawerDescription>
              </DrawerHeader>

              {/* Conversational input workspace */}
              <div className="my-6 space-y-4">
                {/* Voice waveform or text status */}
                <div className="h-28 border-4 border-border bg-background rounded-2xl flex flex-col items-center justify-center p-4 relative overflow-hidden">
                  {isRecording ? (
                    <div className="flex items-center gap-1 justify-center w-full h-12">
                      <div className="w-1.5 h-8 bg-primary rounded-full animate-bounce delay-75"></div>
                      <div className="w-1.5 h-12 bg-emerald-500 rounded-full animate-bounce delay-150"></div>
                      <div className="w-1.5 h-14 bg-secondary rounded-full animate-bounce delay-300"></div>
                      <div className="w-1.5 h-8 bg-destructive rounded-full animate-bounce delay-150"></div>
                      <div className="w-1.5 h-10 bg-primary rounded-full animate-bounce delay-75"></div>
                    </div>
                  ) : (
                    <div className="text-center font-mono text-xs font-bold text-muted-foreground select-none">
                      {aiInput
                        ? 'Transcribing...'
                        : 'Tap Mic to Simulate Voice Input'}
                    </div>
                  )}

                  {aiInput && (
                    <div className="mt-2 text-center text-sm font-extrabold text-foreground px-2 line-clamp-2">
                      "{aiInput}"
                    </div>
                  )}
                </div>

                {/* Suggestions Carousel */}
                <div className="space-y-1.5 text-left">
                  <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest block">
                    Quick Demo Suggestion Prompts
                  </span>
                  <div className="flex flex-col gap-2">
                    {voiceSuggestions.map((s, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setAiInput(s)
                          handleAISpeechParse(s)
                        }}
                        className="text-left text-xs font-bold p-2.5 rounded-xl border-2 border-border bg-muted/20 hover:bg-muted/40 transition-colors line-clamp-1 cursor-pointer text-foreground"
                      >
                        ⚡ "{s}"
                      </button>
                    ))}
                  </div>
                </div>

                {/* AI Parsed split preview visual */}
                {parsedExpense && (
                  <div className="neo-card bg-primary/5 p-4 space-y-3 text-left">
                    <div className="flex items-center justify-between border-b-2 border-border border-dashed pb-2">
                      <div>
                        <h5 className="font-extrabold text-xs text-muted-foreground uppercase">
                          Parsed Expense
                        </h5>
                        <p className="font-bold text-sm text-primary">
                          {parsedExpense.description}
                        </p>
                      </div>
                      <div className="text-right">
                        <h5 className="font-extrabold text-xs text-muted-foreground uppercase">
                          Total Amount
                        </h5>
                        <p className="font-black text-sm">
                          RM {parsedExpense.amount.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h5 className="font-extrabold text-[10px] text-muted-foreground uppercase mb-1.5">
                        Calculated Split Shares
                      </h5>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(parsedExpense.splits).map(
                          ([name, val]) => (
                            <div
                              key={name}
                              className="flex items-center justify-between bg-background p-1.5 px-2.5 border-2 border-border rounded-lg text-xs font-bold"
                            >
                              <span>{name}</span>
                              <span className="font-mono text-primary">
                                RM {val.toFixed(2)}
                              </span>
                            </div>
                          ),
                        )}
                      </div>
                    </div>

                    {parsedExpense.exceptName && (
                      <div className="text-[10px] font-bold text-destructive bg-orange-50 dark:bg-orange-950/20 p-2 border-2 border-dashed border-destructive rounded-lg">
                        * Special split applied: {parsedExpense.exceptName} only
                        owes RM {parsedExpense.exceptAmount.toFixed(2)}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <DrawerFooter className="p-0 grid grid-cols-2 gap-3">
                <Button
                  onClick={startVoiceRecording}
                  disabled={isRecording}
                  className="neo-btn bg-background text-foreground font-bold h-11 text-xs cursor-pointer"
                >
                  <Mic className="size-4 text-foreground mr-1 fill-foreground" />
                  Simulate Speech
                </Button>

                <Button
                  onClick={confirmParsedExpense}
                  disabled={!parsedExpense || isRecording}
                  className="neo-btn bg-secondary text-foreground font-bold h-11 text-xs cursor-pointer"
                >
                  Confirm Split ⚡
                </Button>
              </DrawerFooter>

              <div className="mt-4 text-center">
                <DrawerClose asChild>
                  <button className="text-[11px] font-bold text-muted-foreground hover:underline cursor-pointer">
                    Cancel
                  </button>
                </DrawerClose>
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </div>
  )
}
