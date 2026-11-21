import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Expense, CreateExpenseDto } from '../models/expense.model';

@Injectable({
  providedIn: 'root',
})
export class ExpenseService {
  private http = inject(HttpClient);
  // Expenses are nested under a trip: /trips/:tripId/expenses
  private apiUrl = 'http://localhost:3000/api/v1/trips';

  getExpenses(tripId: string): Observable<Expense[]> {
    return this.http
      .get<{ data: Expense[] }>(`${this.apiUrl}/${tripId}/expenses`, { params: { limit: 100 } })
      .pipe(map((response) => response.data));
  }

  addExpense(tripId: string, expense: CreateExpenseDto): Observable<Expense> {
    return this.http.post<Expense>(`${this.apiUrl}/${tripId}/expenses`, expense);
  }

  deleteExpense(tripId: string, id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${tripId}/expenses/${id}`);
  }
}