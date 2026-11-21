import { Component, OnInit, inject, input, signal } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { Expense } from '../../models/expense.model';
import { ExpenseService } from '../../services/expense.service';
import { Participant } from '../../../participants/models/participant.model';
import { ParticipantService } from '../../../participants/services/participant.service';
import { LoadState, withLoadState } from '../../../../shared/load-state';

@Component({
  selector: 'app-expense-list',
  imports: [CurrencyPipe, DatePipe, MatButtonModule],
  templateUrl: './expense-list.html',
  styleUrl: './expense-list.scss',
})

export class ExpenseList implements OnInit {
  private expenseService = inject(ExpenseService);
  private participantService = inject(ParticipantService);

  readonly tripId = input.required<string>();
  readonly currency = input.required<string>();

  readonly state = signal<LoadState<Expense[]>>({ status: 'loading' });
  readonly people = signal<Participant[]>([]);
  readonly deleteError = signal<string | null>(null);

  ngOnInit(): void {
    // paidBy is only an id, so we also load the people to show the payer's name
    this.participantService.getParticipants(this.tripId()).subscribe({
      next: (people) => this.people.set(people),
      error: () => this.people.set([]),
    });
    this.load();
  }

  load(): void {
    withLoadState(this.expenseService.getExpenses(this.tripId())).subscribe((result) =>
      this.state.set(result),
    );
  }

  payerName(participantId: string): string {
    const person = this.people().find((p) => p._id === participantId);
    return person ? person.name : 'Unknown';
  }

  deleteExpense(expense: Expense): void {
    if (!confirm(`Delete ${expense.description}?`)) return;

    this.deleteError.set(null);
    this.expenseService.deleteExpense(this.tripId(), expense._id).subscribe({
      next: () => this.load(),
      error: (err: Error) => this.deleteError.set(err.message),
    });
  }
}