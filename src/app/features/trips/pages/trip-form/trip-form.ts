import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CreateTripDto } from '../../models/trip.model';
import { TripService } from '../../services/trip.service';
import { notBlank } from '../../../../shared/not-blank.validator';

@Component({
  selector: 'app-trip-form',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressBarModule,
  ],
  templateUrl: './trip-form.html',
  styleUrl: './trip-form.scss',
})
export class TripForm {
  private formBuilder = inject(FormBuilder);
  private tripService = inject(TripService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  saving = signal(false);
  saveError = signal<string | null>(null);

  tripForm = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(60), notBlank]],
    destination: ['', [Validators.maxLength(80)]],
    currency: ['EUR', [Validators.required, Validators.pattern('^[A-Za-z]{3}$')]],
    startDate: ['', Validators.required],
    endDate: ['', Validators.required],
  });

  onSubmit(): void {
    if (this.tripForm.invalid) {
      this.tripForm.markAllAsTouched();
      return;
    }

    const { name, destination, currency, startDate, endDate } = this.tripForm.getRawValue();
    const trip: CreateTripDto = {
      name,
      currency,
      startDate,
      endDate,
      destination: destination.trim() === '' ? undefined : destination,
    };

    this.saving.set(true);
    this.saveError.set(null);
    this.tripForm.disable();

    this.tripService.addTrip(trip).subscribe({
      next: (saved) => {
        this.snackBar.open(`${saved.name} saved`, 'Close', { duration: 5000 });
        this.router.navigate(['/trips', saved._id]);
      },
      error: (err: Error) => {
        this.saveError.set(err.message);
        this.saving.set(false);
        this.tripForm.enable();
      },
    });
  }
}