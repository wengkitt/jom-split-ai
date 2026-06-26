// oxlint-disable no-unused-vars
import { createFileRoute, Outlet } from '@tanstack/react-router'
import { Moon, Sun } from 'lucide-react'
import { useState, useEffect } from 'react'
// import {
//   Drawer,
//   DrawerClose,
//   DrawerContent,
//   DrawerDescription,
//   DrawerFooter,
//   DrawerHeader,
//   DrawerTitle,
//   DrawerTrigger,
// } from '@/components/ui/drawer'
// import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/_rootLayout')({
  component: RouteComponent,
})

function RouteComponent() {
  const [darkMode, setDarkMode] = useState<boolean>(false)
  //   const [aiInput, setAiInput] = useState<string>('')
  //   const [isRecording, setIsRecording] = useState<boolean>(false)
  //   const voiceSuggestions = [
  //     'Jom split RM120 for Nasi Kandar equally except Sarah who owes RM15',
  //     'Jom split RM80 for Kopitiam Breakfast equally',
  //     'Jom split RM45 for Grab ride equally among Sarah Chloe Dev',
  //   ]

  useEffect(() => {
    const root = window.document.documentElement
    if (darkMode) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [darkMode])

  //   const startVoiceRecording = () => {
  //     setIsRecording(true)
  //     // setParsedExpense(null)
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

  //   const handleAISpeechParse = (input: string) => {
  //      setParsedExpense(parseAISpeechInput(input, members))
  //   }

  return (
    <div className="min-h-screen bg-background text-foreground flex justify-center py-0 sm:py-8 transition-colors duration-300">
      <div className="w-full max-w-[420px] bg-background sm:rounded-[32px] neo-border-thick overflow-hidden flex flex-col min-h-screen sm:min-h-[850px] shadow-2xl relative">
        <header className="px-5 py-4 bg-primary text-primary-foreground border-b-4 border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-secondary size-9 rounded-full neo-border-thin neo-shadow-sm rotate-[-4deg] flex items-center justify-center">
              <span className="text-lg font-black text-foreground">J!</span>
            </div>
            <h1 className="font-heading text-2xl font-black tracking-tight ml-1">
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
            {/* <div className="size-9 rounded-full neo-border-thin bg-secondary flex items-center justify-center font-bold text-foreground">
              S
            </div> */}
          </div>
        </header>
        <Outlet />
        {/*<div className="absolute bottom-4 left-0 right-0 px-6 flex justify-center z-40">
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

                {/* {parsedExpense && (
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
                  //   onClick={confirmParsedExpense}
                  //   disabled={!parsedExpense || isRecording}
                  className="neo-btn bg-secondary text-foreground font-bold h-11 text-xs cursor-pointer"
                >
                  Confirm Split ⚡
                </Button>
                <DrawerClose asChild>
                  <Button className="neo-btn bg-secondary text-foreground font-bold h-11 text-xs cursor-pointer">
                    Cancel
                  </Button>
                </DrawerClose>
              </DrawerFooter>
              =
            </DrawerContent>
          </Drawer>
        </div>*/}
      </div>
    </div>
  )
}
