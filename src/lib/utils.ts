import type {
  Expense,
  ExpenseCategory,
  Member,
  ParsedExpense,
  Transfer,
} from '../lib/types'

export { cn, type ClassValue } from 'cnfast'

export const defaultMembers: Array<Member> = [
  { name: 'Sarah', avatar: 'S' },
  { name: 'Ben', avatar: 'B' },
  { name: 'Chloe', avatar: 'C' },
  { name: 'Dev', avatar: 'D' },
]

export const defaultExpenses: Array<Expense> = [
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
]

export function getCategoryFromDescription(
  description: string,
): ExpenseCategory {
  const normalized = description.toLowerCase()
  if (normalized.includes('ride') || normalized.includes('grab')) {
    return 'transport'
  }
  return 'food'
}

export function parseAISpeechInput(
  input: string,
  members: Array<Member>,
): ParsedExpense {
  const amountRegex = /(?:RM\s*)?(\d+(?:\.\d+)?)/i
  const amountMatch = input.match(amountRegex)
  const amount = amountMatch ? parseFloat(amountMatch[1]) : 0

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

  const payer = 'Sarah'
  const exceptRegex =
    /except\s+([A-Za-z]+)\s+(?:who\s+)?(?:only\s+)?owes\s+(?:RM\s*)?(\d+(?:\.\d+)?)/i
  const exceptMatch = input.match(exceptRegex)

  const splits: Record<string, number> = {}
  let exceptName = ''
  let exceptAmount = 0
  const memberNames = members.map((m) => m.name)

  if (exceptMatch) {
    exceptName =
      members.find((m) => m.name.toLowerCase() === exceptMatch[1].toLowerCase())
        ?.name || exceptMatch[1]
    exceptAmount = parseFloat(exceptMatch[2])

    splits[exceptName] = exceptAmount
    const remaining = amount - exceptAmount
    const restMembers = memberNames.filter((name) => name !== exceptName)
    const share = parseFloat((remaining / restMembers.length).toFixed(2))

    restMembers.forEach((name) => {
      splits[name] = share
    })
  } else {
    const share = parseFloat((amount / members.length).toFixed(2))
    memberNames.forEach((name) => {
      splits[name] = share
    })
  }

  return {
    description,
    amount,
    payer,
    splits,
    exceptName,
    exceptAmount,
  }
}

export function calculateBalancesAndTransfers(
  expenses: Array<Expense>,
  members: Array<Member>,
) {
  const netBalances: Record<string, number> = {}
  members.forEach((m) => {
    netBalances[m.name] = 0
  })

  expenses.forEach((exp) => {
    if (exp.payer in netBalances) {
      netBalances[exp.payer] += exp.amount
    }
    Object.keys(exp.splits).forEach((name) => {
      if (name in netBalances) {
        netBalances[name] -= exp.splits[name]
      }
    })
  })

  const debtors = Object.keys(netBalances)
    .map((name) => ({ name, balance: netBalances[name] }))
    .filter((x) => x.balance < -0.01)
    .sort((a, b) => a.balance - b.balance)

  const creditors = Object.keys(netBalances)
    .map((name) => ({ name, balance: netBalances[name] }))
    .filter((x) => x.balance > 0.01)
    .sort((a, b) => b.balance - a.balance)

  const simplifiedTransfers: Array<Transfer> = []

  let i = 0
  let j = 0

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
}
