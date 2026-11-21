import { Component, OnInit, inject, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CreateExpenseDto, EXPENSE_CATEGORIES } from '../../models/expense.model';
import { ExpenseService } from '../../services/expense.service';
import { Participant } from '../../../participants/models/participant.model';
import { ParticipantService } from '../../../participants/services/participant.service';
import { notBlank } from '../../../../shared/not-blank.validator';

@Component({
  selector: 'app-expense-form',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressBarModule,
  ],
  templateUrl: './expense-form.html',
  styleUrl: './expense-form.scss',
})

export class ExpenseForm implements OnInit {
  private formBuilder = inject(FormBuilder);
  private expenseService = inject(ExpenseService);
  private participantService = inject(ParticipantService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  readonly tripId = input.required<string>();

  readonly categories = EXPENSE_CATEGORIES;
  readonly people = signal<Participant[]>([]);
  saving = signal(false);
  saveError = signal<string | null>(null);

  expenseForm = this.formBuilder.nonNullable.group({
    description: ['', [Validators.required, Validators.maxLength(120), notBlank]],
    amount: this.formBuilder.control<number | null>(null, [Validators.required, Validators.min(0.01)]),
    category: ['food', Validators.required],
    paidBy: ['', Validators.required],
    date: ['', Validators.required],
  });

  ngOnInit(): void {
    // The people on this trip, for the "Paid by" drop-down
    this.participantService.getParticipants(this.tripId()).subscribe({
      next: (people) => this.people.set(people),
      error: (err: Error) => this.saveError.set(err.message),
    });
  }

  onSubmit(): void {
    if (this.expenseForm.invalid) {
      this.expenseForm.markAllAsTouched();
      return;
    }

    const { description, amount, category, paidBy, date } = this.expenseForm.getRawValue();
    const expense: CreateExpenseDto = {
      description,
      category,
      paidBy,
      date,
      // The user types euro (25.50); the API wants cents (2550).
      // Math.round fixes numbers like 19.99 * 100 = 1998.9999999
      amount: Math.round((amount ?? 0) * 100),
    };

    this.saving.set(true);
    this.saveError.set(null);
    this.expenseForm.disable();

    this.expenseService.addExpense(this.tripId(), expense).subscribe({
      next: (saved) => {
        this.snackBar.open(`${saved.description} saved`, 'Close', { duration: 5000 });
        this.router.navigate(['/trips', this.tripId()]);
      },
      error: (err: Error) => {
        this.saveError.set(err.message);
        this.saving.set(false);
        this.expenseForm.enable();
      },
    });
  }
}