import { createFileRoute, Link } from '@tanstack/react-router'

import { Button } from '@/components/ui/button'
import { Sparkles, Sun, Moon } from 'lucide-react'
import { useEffect, useState } from 'react'

export const Route = createFileRoute('/')({
  component: LandingPage,
})

function LandingPage() {
  const [darkMode, setDarkMode] = useState<boolean>(false)

  useEffect(() => {
    const root = window.document.documentElement
    if (darkMode) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [darkMode])
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="bg-primary text-primary-foreground border-b-4 border-border mb-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex items-center gap-2">
            <div className="bg-secondary size-15 rounded-full neo-border-thin neo-shadow-sm rotate-[-4deg] flex items-center justify-center">
              <span className="text-lg font-black text-foreground">J!</span>
            </div>
            <div className="flex flex-col">
              <h1 className="font-heading text-2xl font-black tracking-tight">
                JomSplitAI
              </h1>
              <div className="inline-flex items-center gap-1 text-sm font-semibold text-secondary">
                <Sparkles className="size-4 text-secondary" />
                Simplify shared expenses with one easy app
              </div>
            </div>
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
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <section className="grid gap-10 md:grid-cols-[1.05fr_0.95fr] md:items-center">
          <div className="space-y-7">
            <div className="space-y-6 text-center md:text-left">
              <h1 className="mx-auto max-w-3xl text-3xl font-heading font-black leading-tight tracking-tight sm:text-4xl md:text-5xl md:max-w-none md:mx-0">
                Split bills, settle debts, and run group spending like a pro.
              </h1>
              <p className="mx-auto max-w-2xl text-base leading-8 text-muted-foreground md:max-w-none md:mx-0">
                JomSplitAI helps friends, families, roommates, and travel squads
                manage shared costs without confusion. Create workspaces, share
                expenses, and settle balances faster.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center md:justify-start">
              <Link to="/home" className="w-full sm:w-auto">
                <Button className="neo-btn bg-primary text-primary-foreground font-bold w-full sm:w-auto">
                  Get Started
                </Button>
              </Link>
              <Button variant="outline" className="w-full sm:w-auto">
                View Workspaces
              </Button>
            </div>
          </div>

          <div className="rounded-[2.25rem] border-4 border-border bg-card p-5 shadow-2xl md:p-6">
            <div className="rounded-[2.5rem] border-4 border-border bg-muted p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">
                    Workspace preview
                  </p>
                  <h2 className="mt-2 text-xl font-black">
                    Group spending at a glance
                  </h2>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground font-black">
                  J
                </div>
              </div>

              <div className="space-y-4 rounded-[2rem] bg-background p-5 border-4 border-border">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Penang Food Trip</span>
                  <span>4 members</span>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Nasi Kandar</span>
                    <span className="font-black">RM 120</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Grab ride</span>
                    <span className="font-black">RM 45</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Shared utilities</span>
                    <span className="font-black">RM 210</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 rounded-[2rem] border-4 border-border bg-secondary/10 p-5">
                <p className="text-sm text-muted-foreground">Next settlement</p>
                <p className="mt-2 text-lg font-black">
                  Sarah pays Adam RM 53.25
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
