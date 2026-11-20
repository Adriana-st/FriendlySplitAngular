export interface Balance {
  participant: string;
  name: string;
  paid: number;
  owed: number;
  net: number; // positive = is owed money, negative = owes money
}

export interface Settlement {
  from: string;
  fromName: string;
  to: string;
  toName: string;
  amount: number;
}

export interface TripBalances {
  trip: string;
  currency: string;
  totalSpent: number;
  balances: Balance[];
  settlements: Settlement[];
}