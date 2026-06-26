import { ArrowRight, QrCode, Send, Smile } from 'lucide-react'
import type { Transfer } from './types'

interface SettlementsPanelProps {
  transfers: Array<Transfer>
  currentUser: string
  handleSettleTransfer: (transfer: Transfer) => void
}

export function SettlementsPanel({
  transfers,
  currentUser,
  handleSettleTransfer,
}: SettlementsPanelProps) {
  if (transfers.length === 0) {
    return (
      <div className="neo-card bg-emerald-50 dark:bg-emerald-950/20 p-8 text-center border-dashed border-4 flex flex-col items-center gap-2">
        <Smile className="size-12 text-emerald-500" />
        <h4 className="font-heading font-black text-lg text-emerald-600 dark:text-emerald-400">
          Semua Setel!
        </h4>
        <p className="text-xs text-muted-foreground font-semibold">
          Everyone is square. No debts to pay right now.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <h3 className="font-heading font-black text-sm uppercase tracking-wider mb-1 text-left">
        Optimized Payment Routing
      </h3>

      {transfers.map((transfer, idx) => {
        const isUserSender = transfer.from === currentUser
        const isUserReceiver = transfer.to === currentUser

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
            <div className="flex items-center justify-between mb-4">
              <div className="flex flex-col items-center gap-1">
                <div className="size-10 rounded-full border-2 border-border bg-secondary flex items-center justify-center font-extrabold text-foreground">
                  {transfer.from[0]}
                </div>
                <span className="text-xs font-bold">{transfer.from}</span>
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
                <span className="text-xs font-bold">{transfer.to}</span>
                <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                  To Receive
                </span>
              </div>
            </div>

            {isUserSender ? (
              <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t-2 border-border border-dashed">
                <button
                  onClick={() => handleSettleTransfer(transfer)}
                  className="neo-btn bg-secondary text-foreground font-bold h-8 text-xs flex items-center gap-1 cursor-pointer"
                >
                  <Send className="size-3.5" />
                  TnG eWallet
                </button>
                <button
                  onClick={() => handleSettleTransfer(transfer)}
                  className="neo-btn bg-emerald-500 text-foreground font-bold h-8 text-xs flex items-center gap-1 cursor-pointer"
                >
                  <QrCode className="size-3.5" />
                  DuitNow QR
                </button>
              </div>
            ) : (
              <div className="text-center text-[10px] font-bold text-muted-foreground mt-2 border-t border-border border-dashed pt-2">
                {transfer.from} is responsible for transferring this.
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
