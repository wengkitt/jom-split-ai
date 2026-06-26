import { createFileRoute } from '@tanstack/react-router'
import * as React from 'react'
import {
  Mic,
  Sun,
  Moon,
  Utensils,
  Car,
  Coffee,
  Check,
  Sparkles,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
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
import { FeedPanel } from '../components/workspace/FeedPanel'
import { SettlementsPanel } from '../components/workspace/SettlementsPanel'
import { ManualEntryPanel } from '../components/workspace/ManualEntryPanel'
import type {
  Expense,
  Member,
  ParsedExpense,
  ExpenseCategory,
  Transfer,
} from '../lib/types'
import {
  defaultExpenses,
  defaultMembers,
  getCategoryFromDescription,
  parseAISpeechInput,
  calculateBalancesAndTransfers,
} from '../lib/utils'

export const Route = createFileRoute('/workspace/')({
  component: WorkSpacePage,
})

function WorkSpacePage() {
  const [darkMode, setDarkMode] = React.useState<boolean>(false)
  const [activeGroup, setActiveGroup] =
    React.useState<string>('Penang Food Trip')

  const [members] = React.useState<Array<Member>>(defaultMembers)
  const [expenses, setExpenses] =
    React.useState<Array<Expense>>(defaultExpenses)

  const [aiInput, setAiInput] = React.useState<string>('')
  const [isRecording, setIsRecording] = React.useState<boolean>(false)
  const [parsedExpense, setParsedExpense] =
    React.useState<ParsedExpense | null>(null)

  const [manualDesc, setManualDesc] = React.useState<string>('')
  const [manualAmount, setManualAmount] = React.useState<string>('')
  const [manualPayer, setManualPayer] = React.useState<string>('Sarah')
  const [manualCategory, setManualCategory] =
    React.useState<ExpenseCategory>('food')

  const [showSuccessToast, setShowSuccessToast] = React.useState<string | null>(
    null,
  )
  const [settlementSuccess, setSettlementSuccess] =
    React.useState<Transfer | null>(null)

  React.useEffect(() => {
    const root = window.document.documentElement
    if (darkMode) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [darkMode])

  const voiceSuggestions = [
    'Jom split RM120 for Nasi Kandar equally except Sarah who owes RM15',
    'Jom split RM80 for Kopitiam Breakfast equally',
    'Jom split RM45 for Grab ride equally among Sarah Chloe Dev',
  ]

  const handleAISpeechParse = (input: string) => {
    setParsedExpense(parseAISpeechInput(input, members))
  }

  const startVoiceRecording = () => {
    setIsRecording(true)
    setParsedExpense(null)
    setAiInput('')

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

  const confirmParsedExpense = () => {
    if (!parsedExpense) return

    const newExpense: Expense = {
      id: Date.now().toString(),
      description: parsedExpense.description,
      amount: parsedExpense.amount,
      payer: parsedExpense.payer,
      date: 'Just now',
      category: getCategoryFromDescription(parsedExpense.description),
      splits: parsedExpense.splits,
    }

    setExpenses([newExpense, ...expenses])
    setParsedExpense(null)
    setAiInput('')
    setShowSuccessToast(`Added: "${newExpense.description}"! ⚡`)
    setTimeout(() => setShowSuccessToast(null), 3000)
  }

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

  const { balances, transfers } = React.useMemo(
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
    <div className="min-h-screen bg-background text-foreground flex justify-center py-0 sm:py-8 transition-colors duration-300">
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

      <div className="w-full max-w-[420px] bg-background sm:rounded-[32px] neo-border-thick overflow-hidden flex flex-col min-h-screen sm:min-h-[850px] shadow-2xl relative">
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

              <div className="my-6 space-y-4">
                <div className="h-28 border-4 border-border bg-background rounded-2xl flex flex-col items-center justify-center p-4 relative overflow-hidden">
                  {isRecording ? (
                    <div className="flex items-center gap-1 justify-center w-full h-12">
                      <div className="w-1.5 h-8 bg-primary rounded-full animate-bounce delay-75" />
                      <div className="w-1.5 h-12 bg-emerald-500 rounded-full animate-bounce delay-150" />
                      <div className="w-1.5 h-14 bg-secondary rounded-full animate-bounce delay-300" />
                      <div className="w-1.5 h-8 bg-destructive rounded-full animate-bounce delay-150" />
                      <div className="w-1.5 h-10 bg-primary rounded-full animate-bounce delay-75" />
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
