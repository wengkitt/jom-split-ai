export type ExpenseCategory =
  | 'shopping'
  | 'food'
  | 'transport'
  | 'entertainment'
  | 'utilities'
  | 'other'

export interface Expense {
  id: string
  description: string
  amount: number
  payer: string
  date: string
  category: ExpenseCategory
  splits: Record<string, number>
}

export interface Member {
  name: string
  avatar: string
}

export interface ParsedExpense {
  description: string
  amount: number
  payer: string
  splits: Record<string, number>
  exceptName: string
  exceptAmount: number
}

export interface Transfer {
  from: string
  to: string
  amount: number
}
