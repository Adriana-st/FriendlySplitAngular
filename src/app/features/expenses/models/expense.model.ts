// The same list as EXPENSE_CATEGORIES in the API
export const EXPENSE_CATEGORIES = ['food', 'transport', 'accommodation', 'activities', 'other'];

// One person's share of an expense, in cents
export interface Split {
  participant: string;
  share: number;
}

export interface Expense {
  _id: string;
  trip: string;
  paidBy: string; // a participant id
  description: string;
  amount: number; // in cents: 2550 = 25.50
  category: string;
  date: string;
  splits: Split[];
}

// No splits: the API then splits the amount equally between everyone on the trip
export interface CreateExpenseDto {
  paidBy: string;
  description: string;
  amount: number;
  category: string;
  date: string;
}