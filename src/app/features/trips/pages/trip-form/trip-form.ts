import { Component, OnInit, inject, input, signal } from '@angular/core';
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
export class TripForm implements OnInit {
  private formBuilder = inject(FormBuilder);
  private tripService = inject(TripService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  saving = signal(false);
  saveError = signal<string | null>(null);

  // Empty for /trips/new, filled from the URL for /trips/:id/edit
  readonly id = input<string>();

  tripForm = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(60), notBlank]],
    destination: ['', [Validators.maxLength(80)]],
    currency: ['EUR', [Validators.required, Validators.pattern('^[A-Za-z]{3}$')]],
    startDate: ['', Validators.required],
    endDate: ['', Validators.required],
  });

  ngOnInit(): void {
    const id = this.id();
    if (!id) return; // adding a new trip, nothing to load

    this.tripService.getTripById(id).subscribe({
      next: (trip) =>
        this.tripForm.patchValue({
          name: trip.name,
          destination: trip.destination ?? '',
          currency: trip.currency,
          // The API returns "2026-07-01T00:00:00.000Z"; the date input needs "2026-07-01"
          startDate: trip.startDate.slice(0, 10),
          endDate: trip.endDate.slice(0, 10),
        }),
      error: (err: Error) => this.saveError.set(err.message),
    });
  }

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

    const id = this.id();
    const request = id ? this.tripService.updateTrip(id, trip) : this.tripService.addTrip(trip);
    
    request.subscribe({
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